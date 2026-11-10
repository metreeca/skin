/*
 * Copyright © 2023-2026 Metreeca srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { OKLCH_to_OKLab, OKLab_to_XYZ, XYZ_D65_to_sRGB } from "@csstools/color-helpers";
import { color, ColorNotation } from "@csstools/css-color-parser";
import { parseComponentValue } from "@csstools/css-parser-algorithms";
import { tokenize } from "@csstools/css-tokenizer";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { borders } from "./borders.js";
import { colors } from "./colors.js";
import { elevations } from "./elevations.js";
import { palettes } from "./palettes.js";


/**
 * A colour as the page paints it: sRGB channels in the unit range, or outside it where the stylesheet asked for a
 * colour the page cannot paint, which the gamut test is there to catch before a browser has to decide what to show.
 */
type Paint = readonly [red: number, green: number, blue: number];

type Scheme = "light" | "dark";


/**
 * The budgets the roles are held to, as WCAG 2.2 states them: text at AA, a mark or a ring at the graphics minimum.
 */
const TEXT = 4.5;
const MARK = 3;

/**
 * How far a channel may leave the unit range and still paint the same in every browser: a bit of eight.
 */
const TOLERANCE = 1 / 255;

const schemes: ReadonlyArray<Scheme> = [ "light", "dark" ];


const stylesheets = [ "colors", "borders", "elevations", "palettes" ]
	.map(family => readFileSync(new URL(`./${ family }.css`, import.meta.url), "utf-8"));

/**
 * The value stated for each token, in the one place the contract allows: the registration for a literal, `:root`
 * for a derivation, read from the token modules as they stand rather than from a build.
 */
const declared: ReadonlyMap<string, string> = new Map(stylesheets.flatMap<readonly [string, string]>(text => [

	...Array.from(text.matchAll(/@property\s+(--skin--[\w-]+)\s*\{[^}]*initial-value:\s*([^;]+);/g),
		([ , token = "", value = "" ]): readonly [string, string] => [ token, value.trim() ]
	),

	...Array.from(text.matchAll(/:root\s*\{([^}]*)}/g), ([ , rule = "" ]) => rule)
		.flatMap(rule => Array.from(rule.matchAll(/(--skin--[\w-]+)\s*:([^;]*);/g),
			([ , token = "", value = "" ]): readonly [string, string] => [ token, value.trim() ]
		))

]));


/**
 * Splits a function argument list at its top-level commas, leaving nested calls whole.
 */
function args(text: string): ReadonlyArray<string> {

	const { parts, last } = [ ...text ].reduce<{ parts: ReadonlyArray<string>, last: string, depth: number }>(
		({ parts, last, depth }, char) =>
			char === "(" ? { parts, last: last + char, depth: depth + 1 }
				: char === ")" ? { parts, last: last + char, depth: depth - 1 }
					: char === "," && depth === 0 ? { parts: [ ...parts, last ], last: "", depth }
						: { parts, last: last + char, depth },
		{ parts: [], last: "", depth: 0 }
	);

	return [ ...parts, last ].map(part => part.trim());

}

/**
 * Evaluates a token value in a colour scheme: every `var()` is replaced by the value of the token it names, and every
 * `light-dark()` by the side the scheme picks, leaving an expression the page could paint.
 */
function evaluate(expression: string, scheme: Scheme): string {

	const substituted = expression.replace(/var\((--skin--[\w-]+)\)/g, (_, token: string) =>
		evaluate(declared.get(token) ?? `missing(${ token })`, scheme)
	);

	const start = substituted.indexOf("light-dark(");

	if ( start < 0 ) {

		return substituted;

	} else {

		const inner = start + "light-dark(".length;
		const end = inner + closing(substituted.slice(inner));

		const [ light = "", dark = "" ] = args(substituted.slice(inner, end));

		return evaluate(`${ substituted.slice(0, start) }${ scheme === "light" ? light : dark }${ substituted.slice(end + 1) }`,
			scheme
		);

	}

}

/**
 * The index of the parenthesis closing a call whose opening parenthesis sits just before the text.
 */
function closing(text: string): number {

	const { index } = [ ...text ].reduce(({ index, depth }, char, at) =>
			index >= 0 ? { index, depth }
				: char === "(" ? { index, depth: depth + 1 }
					: char === ")" && depth === 0 ? { index: at, depth }
						: char === ")" ? { index, depth: depth - 1 }
							: { index, depth },
		{ index: -1, depth: 0 }
	);

	return index;

}

/**
 * Paints a colour expression as sRGB, with the maths the browsers share for OKLab mixing and relative colours.
 */
function paint(expression: string): Paint {

	const component = parseComponentValue(tokenize({ css: expression }));
	const parsed = component && color(component);

	if ( !parsed ) {

		throw new Error(`unpaintable colour <${ expression }>`);

	} else {

		const [ x = 0, y = 0, z = 0 ] = parsed.channels.map(channel => Number.isNaN(channel) ? 0 : channel);

		// the helpers take and return a mutable triple, which nothing here mutates

		const channels: [number, number, number] = [ x, y, z ];

		const xyz: [number, number, number] | undefined = parsed.colorNotation === ColorNotation.OKLab ? OKLab_to_XYZ(channels)
			: parsed.colorNotation === ColorNotation.OKLCH ? OKLab_to_XYZ(OKLCH_to_OKLab(channels))
				: parsed.colorNotation === ColorNotation.XYZ_D65 ? channels
					: undefined;

		const sRGB: Paint | undefined = parsed.colorNotation === ColorNotation.HEX || parsed.colorNotation === ColorNotation.RGB
		|| parsed.colorNotation === ColorNotation.sRGB ? channels
			: xyz ? XYZ_D65_to_sRGB(xyz)
				: undefined;

		if ( !sRGB ) {

			throw new Error(`unexpected colour notation <${ parsed.colorNotation }> in <${ expression }>`);

		} else {

			return sRGB;

		}

	}

}

/**
 * The WCAG 2.2 contrast ratio between two paints, each clipped to what the page shows.
 */
function contrast(foreground: Paint, background: Paint): number {

	const luminance = ([ red, green, blue ]: Paint): number => [ red, green, blue ]
		.map(channel => Math.min(1, Math.max(0, channel)))
		.map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
		.reduce((sum, channel, index) => sum + channel * [ 0.2126, 0.7152, 0.0722 ][index], 0);

	const lighter = Math.max(luminance(foreground), luminance(background));
	const darker = Math.min(luminance(foreground), luminance(background));

	return (lighter + 0.05) / (darker + 0.05);

}

/**
 * Lays a translucent colour over an opaque paint, as the page composites them: channel by channel in sRGB.
 */
function composite(expression: string, ground: Paint): Paint {

	const component = parseComponentValue(tokenize({ css: expression }));
	const parsed = component && color(component);
	const alpha = parsed && parsed.alpha;
	const opacity = typeof alpha === "number" && !Number.isNaN(alpha) ? alpha : 1;

	const over = (top: number, bottom: number): number => opacity * top + (1 - opacity) * bottom;

	const [ red, green, blue ] = paint(expression);
	const [ groundRed, groundGreen, groundBlue ] = ground;

	return [ over(red, groundRed), over(green, groundGreen), over(blue, groundBlue) ];

}


describe.each(schemes)("colours in the %s scheme", scheme => {

	const swatch = (token: string): Paint => paint(evaluate(`var(${ token })`, scheme));

	const over = (foreground: string, background: string): number => contrast(swatch(foreground), swatch(background));

	const page = colors.backgroundColor;
	const stripe = colors.backgroundColorStripe;
	const edit = colors.backgroundColorEdit;
	const overlay = elevations.backgroundColorOverlay;

	const surfaces = [ page, stripe, edit, overlay ];

	const fills = [
		colors.backgroundColorHover,
		colors.backgroundColorSelected,
		colors.backgroundColorPressed
	];

	const covers = [
		colors.backgroundColorHoverNeutral,
		colors.backgroundColorPressedNeutral
	];

	const grounds = [ page, stripe, edit, elevations.backgroundColorSunken ];

	const tints = [
		colors.backgroundColorNote,
		colors.backgroundColorPass,
		colors.backgroundColorFlag,
		colors.backgroundColorWarn,
		colors.backgroundColorFail
	];

	const texts = [
		colors.color,
		colors.colorLabel,
		colors.colorEnabled,
		colors.colorLink,
		colors.colorLinkHover,
		colors.colorHover,
		colors.colorPressed,
		colors.colorSelected,
		colors.colorNote,
		colors.colorPass,
		colors.colorFlag,
		colors.colorFail,
		colors.colorNoteStroke,
		colors.colorPassStroke,
		colors.colorFlagStroke,
		colors.colorFailStroke
	];

	const editor = [
		palettes.colorBlack, palettes.colorGray, palettes.colorWhite,
		palettes.colorRedStrong, palettes.colorRed, palettes.colorRedSubtle,
		palettes.colorYellowStrong, palettes.colorYellow, palettes.colorYellowSubtle,
		palettes.colorGreenStrong, palettes.colorGreen, palettes.colorGreenSubtle,
		palettes.colorBlueStrong, palettes.colorBlue, palettes.colorBlueSubtle,
		palettes.colorPurpleStrong, palettes.colorPurple, palettes.colorPurpleSubtle
	];

	const strokes: ReadonlyArray<{ stroke: string, tint: string }> = [
		{ stroke: colors.colorNoteStroke, tint: colors.backgroundColorNote },
		{ stroke: colors.colorPassStroke, tint: colors.backgroundColorPass },
		{ stroke: colors.colorFlagStroke, tint: colors.backgroundColorFlag },
		{ stroke: colors.colorFailStroke, tint: colors.backgroundColorFail }
	];

	/**
	 * The pairings falling short of a budget, named for the failure list a test prints.
	 */
	const shortfalls = (
		pairings: ReadonlyArray<{ foreground: string, background: string, ratio: number }>, budget: number
	): ReadonlyArray<string> => pairings
		.filter(({ ratio }) => ratio < budget)
		.map(({ foreground, background, ratio }) => `${ foreground } on ${ background } at ${ ratio.toFixed(2) }:1`);

	const pairs = (foregrounds: ReadonlyArray<string>, backgrounds: ReadonlyArray<string>, budget: number) =>
		shortfalls(foregrounds.flatMap(foreground => backgrounds.map(background =>
			({ foreground, background, ratio: over(foreground, background) })
		)), budget);

	/**
	 * The pairings of each foreground with each neutral state laid over each ground falling short of a budget.
	 */
	const laid = (foregrounds: ReadonlyArray<string>, budget: number) =>
		shortfalls(foregrounds.flatMap(foreground => covers.flatMap(cover => grounds.map(ground => ({
			foreground,
			background: `${ cover } over ${ ground }`,
			ratio: contrast(swatch(foreground), composite(evaluate(`var(${ cover })`, scheme), swatch(ground)))
		})))), budget);


	it("paints every colour inside the sRGB gamut", async () => {

		const tokens = [
			...[ ...Object.values(colors), borders.borderColor, ...Object.values(elevations) ]
				.filter(token => /^--skin--(color|background-color|border-color)/.test(token)),
			...editor
		];

		expect(tokens
			.map(token => ({ token, channels: swatch(token) }))
			.filter(({ channels }) => channels.some(channel => channel < -TOLERANCE || channel > 1 + TOLERANCE))
			.map(({ token, channels }) => `${ token } at ${ channels.map(channel => channel.toFixed(3)).join(" ") }`)
		).toEqual([]);

	});

	it("holds every text role to AA on the page, the stripe, the edit field and the overlay", async () => {

		expect(pairs(texts, surfaces, TEXT)).toEqual([]);

	});

	it("holds the caution stroke to AA on the page, the stripe, the edit field and the overlay", async () => {

		expect(pairs([ colors.colorWarnStroke ], surfaces, TEXT)).toEqual([]);

	});

	it("holds the placeholder to AA on the page, the stripe and the edit field", async () => {

		expect(pairs([ colors.colorPlaceholder ], [ page, stripe, edit ], TEXT)).toEqual([]);

	});

	it("holds the field boundary to 3:1 on the page, the stripe and the edit field", async () => {

		expect(pairs([ borders.borderColorField ], [ page, stripe, edit ], MARK)).toEqual([]);

	});

	it("holds the plain editor colours to 3:1 on the page", async () => {

		expect(pairs([
			palettes.colorGray, palettes.colorRed, palettes.colorYellow,
			palettes.colorGreen, palettes.colorBlue, palettes.colorPurple
		], [ page ], MARK)).toEqual([]);

	});

	it("holds the text and the label to AA on every fill and tint", async () => {

		expect(pairs([ colors.color, colors.colorLabel ], [ ...fills, ...tints ], TEXT)).toEqual([]);

	});

	it("holds each stroke to AA on its tint", async () => {

		expect(shortfalls(strokes.map(({ stroke, tint }) =>
			({ foreground: stroke, background: tint, ratio: over(stroke, tint) })
		), TEXT)).toEqual([]);

	});

	it("holds the strong accent and its states to AA on the fills a control paints", async () => {

		expect([
			...pairs([ colors.colorStrong ], fills, TEXT),
			...pairs([ colors.colorHover ], [ colors.backgroundColorHover ], TEXT),
			...pairs([ colors.colorPressed ], [ colors.backgroundColorPressed ], TEXT)
		]).toEqual([]);

	});

	it("holds the text, the label and the enabled controls to AA on the neutral states over the surfaces they reach", async () => {

		expect(laid([ colors.color, colors.colorLabel, colors.colorEnabled ], TEXT)).toEqual([]);

	});

	it("holds the over colours to AA on the fills they are named for", async () => {

		expect([
			...pairs([ colors.colorStrongOver ], [ colors.colorStrong ], TEXT),
			...pairs([ colors.colorOver ], [ colors.colorWarn ], TEXT)
		]).toEqual([]);

	});

	it("holds the note, pass, flag and failure anchors to AA on the page, the stripe and their tints", async () => {

		expect([
			...pairs([ colors.colorNote ], [ page, stripe, colors.backgroundColorNote ], TEXT),
			...pairs([ colors.colorPass ], [ page, stripe, colors.backgroundColorPass ], TEXT),
			...pairs([ colors.colorFlag ], [ page, stripe, colors.backgroundColorFlag ], TEXT),
			...pairs([ colors.colorFail ], [ page, stripe, colors.backgroundColorFail ], TEXT)
		]).toEqual([]);

	});

	it("holds the focus ring to 3:1 on every surface, fill and neutral state it is drawn against", async () => {

		expect([
			...pairs([ colors.colorFocus ], [ ...surfaces, ...fills ], MARK),
			...laid([ colors.colorFocus ], MARK)
		]).toEqual([]);

	});

});
