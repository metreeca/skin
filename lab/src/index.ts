/*
 * Copyright © 2026 Metreeca srl
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

/**
 * Specimen.
 *
 * Shows every design system token and the base rules applying them to plain document markup, on a single page built
 * from the stylesheet alone, so what an app gets from the design system is seen without any component library. The
 * page switches between the bare entry and each preset, showing the design system as an app including either sees it.
 *
 * @module
 */

import platform from "../../src/index.css?inline";
import { type Token, skin } from "../../src/index.js";
import inter from "../../src/presets/inter.css?inline";
import roboto from "../../src/presets/roboto.css?inline";
import { borders } from "../../src/tokens/borders.js";
import { colors } from "../../src/tokens/colors.js";
import { elevations } from "../../src/tokens/elevations.js";
import { layers } from "../../src/tokens/layers.js";
import { motions } from "../../src/tokens/motions.js";
import { opacities } from "../../src/tokens/opacities.js";
import { palettes } from "../../src/tokens/palettes.js";
import { scalings } from "../../src/tokens/scalings.js";
import { spacings } from "../../src/tokens/spacings.js";
import { typography } from "../../src/tokens/typography.js";
import { viewports } from "../../src/tokens/viewports.js";
import { visuals } from "../../src/tokens/visuals.js";
import "./index.css";


type Rgba = readonly [number, number, number, number]

type Budget = "text" | "mark" | "none"

type Role = Readonly<{ token: Token, budget: Budget, use: string, ground?: Token }>

type Step = Readonly<{
	name: string
	says: string
	mark: Token
	stroke: Token
	fill: Token
	level: string
	mode: string
	status: string
}>


const families = [
	typography, spacings, scalings, colors, borders, elevations, palettes, layers, motions, opacities, viewports, visuals
];

const tokens: readonly Token[] = Object.keys(skin).filter(isToken);

const budgets: Readonly<Record<Budget, number>> = { text: 4.5, mark: 3, none: 0 };

const anchors: readonly Token[] = [
	"color", "backgroundColor", "colorSubtle", "colorStrong", "colorFocus"
];

const fills: readonly Token[] = [
	"backgroundColorEdit", "backgroundColorStripe",
	"backgroundColorHover", "backgroundColorPressed", "backgroundColorSelected"
];

const steps: readonly Step[] = [{
	name: "Note", says: "Stated or provisional.",
	mark: "colorNote", stroke: "colorNoteStroke", fill: "backgroundColorNote",
	level: "neutral", mode: "safe", status: "pending"
}, {
	name: "Pass", says: "Completed as intended.",
	mark: "colorPass", stroke: "colorPassStroke", fill: "backgroundColorPass",
	level: "positive", mode: "commit", status: "success"
}, {
	name: "Flag", says: "Singled out for attention.",
	mark: "colorFlag", stroke: "colorFlagStroke", fill: "backgroundColorFlag",
	level: "notable", mode: "publish", status: "paused"
}, {
	name: "Warn", says: "Completed with caveats.",
	mark: "colorWarn", stroke: "colorWarnStroke", fill: "backgroundColorWarn",
	level: "negative", mode: "alert", status: "warning"
}, {
	name: "Fail", says: "Failed to complete.",
	mark: "colorFail", stroke: "colorFailStroke", fill: "backgroundColorFail",
	level: "critical", mode: "danger", status: "failure, defect"
}];

const roles: readonly Role[] = [
	{ token: "color", budget: "text", use: "Body text" },
	{ token: "colorLabel", budget: "text", use: "Labels and captions" },
	{ token: "colorLink", budget: "text", use: "Links" },
	{ token: "colorLinkHover", budget: "text", use: "Links under the pointer" },
	{ token: "colorEnabled", budget: "text", use: "Enabled controls" },
	{ token: "colorHover", budget: "text", use: "Controls under the pointer" },
	{ token: "colorPressed", budget: "text", use: "Pressed controls" },
	{ token: "colorSelected", budget: "text", use: "Selected items" },
	{ token: "colorNoteStroke", budget: "text", use: "Note text" },
	{ token: "colorPassStroke", budget: "text", use: "Pass text" },
	{ token: "colorFlagStroke", budget: "text", use: "Flag text" },
	{ token: "colorWarnStroke", budget: "text", use: "Warn text" },
	{ token: "colorFailStroke", budget: "text", use: "Fail text" },
	{ token: "colorNote", budget: "text", use: "Notes, as text or mark" },
	{ token: "colorPass", budget: "text", use: "Passes, as text or mark" },
	{ token: "colorFlag", budget: "text", use: "Flags, as text or mark" },
	{ token: "colorFail", budget: "text", use: "Failures, as text or mark" },
	{ token: "colorFocus", budget: "mark", use: "The focus ring" },
	{ token: "colorSelected", budget: "text", use: "Selected items on a pressed fill", ground: "backgroundColorPressed" },
	{ token: "colorOver", budget: "text", use: "Text over the caution fill", ground: "colorWarn" },
	{ token: "colorDisabled", budget: "none", use: "Disabled controls" },
	{ token: "colorPlaceholder", budget: "none", use: "Placeholders" }
];

const ramps: readonly (readonly [string, RegExp])[] = [
	["gray", /^colorGray\d{3}$/],
	["subtle", /^colorSubtle\d{3}$/],
	["strong", /^colorStrong\d{3}$/],
	["heat", /^colorHeat\d{3}$/]
];

const editor: readonly (readonly Token[])[] = [
	["colorBlack", "colorRedStrong", "colorYellowStrong", "colorGreenStrong", "colorBlueStrong", "colorPurpleStrong"],
	["colorGray", "colorRed", "colorYellow", "colorGreen", "colorBlue", "colorPurple"],
	["colorWhite", "colorRedSubtle", "colorYellowSubtle", "colorGreenSubtle", "colorBlueSubtle", "colorPurpleSubtle"]
];

const bars: readonly number[] =[72, 58, 90, 44, 66, 81, 37, 53, 62];

const map: readonly number[] = [
	1, 1, 2, 2, 2, 3, 3, 3,
	1, 1, 2, 2, 4, 4, 3, 3,
	1, 2, 2, 4, 4, 4, 3, 1,
	3, 3, 4, 4, 2, 2, 1, 1,
	3, 3, 3, 4, 2, 1, 1, 1
];

const faces: readonly (readonly [Token, string])[] = [
	["fontFamily", "Text"],
	["fontFamilyHeading", "Headings"],
	["fontFamilyMono", "Code"]
];

const pangram = "The quick brown fox jumps over the lazy dog";

const switches: readonly (readonly [Token, string])[] = [
	["viewportSmall", "A phone held upright: the one-column floor."],
	["viewportMedium", "A tablet or a split window, where a second column fits."],
	["viewportLarge", "A laptop, where navigation becomes a rail."],
	["viewportXlarge", "A desktop, where the measure is capped rather than stretched."]
];

const accents: readonly Token[] = ["colorSubtle", "colorStrong"];

const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true });


render(".facts", [
	[tokens.length, "tokens"],
	[families.length, "families"],
	[2, "colour schemes"],
	[1, "cascade layer"]
].map(([value, label]) => `<li><strong>${value}</strong><span>${label}</span></li>`).join(""));


render("[data-chips='anchors']", anchors.map(token => chip(token, swatch(token))).join(""));

render(".steps", steps.map(step).join(""));

render(".roles", roles.map(role).join(""));

render("[data-chips='fills']", fills.map(token => chip(token, swatch(token))).join(""));


render(".ramps", ramps.map(([name, pattern]) => `<div class="ramp">
	<span class="ramp-name">${name}</span>
	<div class="cells">${tokens.filter(token => pattern.test(token)).map(token =>
		`<button type="button" class="cell" data-ink ${handle(token)} style="background-color: ${reference(token)}">
			${token.slice(-3)}
		</button>`
	).join("")}</div>
</div>`).join(""));

render(".series", `<div class="bars">${tokens.filter(token => /^colorSeries\d$/.test(token)).map((token, index) =>
	`<button type="button" class="column" data-ink ${handle(token)}
		style="block-size: ${bars[index] ?? 50}%; background-color: ${reference(token)}">${token.slice(-1)}</button>`
).join("")}</div>`);

render(".picker", editor.flat().map(pick).join(""));

render(".areas", `
	<div class="map">${map.map(slot => `<span style="background-color: var(--skin--color-area-${slot})"></span>`).join("")}</div>
	<div class="chips">${tokens.filter(token => /^colorArea\d$/.test(token)).map(token => chip(token, swatch(token))).join("")}</div>
`);


render(".faces", faces.map(([token, label]) => `<button type="button" class="face" ${handle(token)}
	style="font-family: ${reference(token)}">
	<span class="glyphs">Ag</span>
	<span class="alphabet">ABCDEFGHIJKLM NOPQRSTUVWXYZ<br>abcdefghijklm nopqrstuvwxyz<br>0123456789 &amp;@#?!</span>
	<span class="label"><span class="name">${label}</span><span class="value">${short(token)}</span></span>
</button>`).join(""));

render("[data-rows='type']", [
	row("fontSizeSmall", specimen(`font-size: ${reference("fontSizeSmall")}`, pangram, "font-size")),
	row("fontSize", specimen(`font-size: ${reference("fontSize")}`, pangram, "font-size")),
	row("fontSizeLarge", specimen(`font-size: ${reference("fontSizeLarge")}`, pangram, "font-size")),
	row("fontSizeHeading", specimen(
		`font-size: ${reference("fontSizeHeading")}; font-family: ${reference("fontFamilyHeading")}; font-weight: ${reference("fontWeightStrong")}`,
		"Headings keep the size of the text", "font-size"
	)),
	row("fontWeight", specimen(`font-weight: ${reference("fontWeight")}`, pangram)),
	row("fontWeightStrong", specimen(`font-weight: ${reference("fontWeightStrong")}`, pangram)),
	row("letterSpacingHeading", specimen(
		`letter-spacing: ${reference("letterSpacingHeading")}; font-family: ${reference("fontFamilyHeading")}; font-weight: ${reference("fontWeightStrong")}`,
		"Heading tracking"
	)),
	row("lineHeight", specimen(`line-height: ${reference("lineHeight")}`,
		"Running text is set on the base line height, which holds a paragraph together at the measure a page allows "
		+ "while leaving room enough between lines for the eye to find the start of the next one."
	))
].join(""));


render("[data-rows='spacings']", tokens.filter(token => /^spacing\d+$|^padding$/.test(token)).map(token =>
	row(token, `<span class="viz"><span class="bar" data-measure="width" style="inline-size: ${reference(token)}"></span></span>`)
).join(""));

render("[data-rows='scalings']", tokens.filter(token => /^scaling\d+$/.test(token)).map(token =>
	row(token, `<span class="viz"><span class="square" data-measure="width"
		style="inline-size: ${reference(token)}; block-size: ${reference(token)}"></span></span>`)
).join(""));


render("[data-chips='shape']", [
	chip("borderColor", swatch("borderColor")),
	chip("borderWidth", shape(`border: ${reference("borderWidth")} solid ${reference("color")}`)),
	chip("borderStyle", shape(`border: calc(2 * ${reference("borderWidth")}) ${reference("borderStyle")} ${reference("color")}`)),
	...tokens.filter(token => /^borderRadius(\d+)?$/.test(token)).map(token =>
		chip(token, shape(`border-radius: ${reference(token)}; background-color: ${reference("colorSubtle020")}; border: ${reference("borderWidth")} solid ${reference("colorSubtle060")}`))
	),
	chip("outlineFocus", shape(`outline: ${reference("outlineFocus")}; outline-offset: ${reference("borderWidth")}`)),
	chip("outlineInvalid", shape(`outline: ${reference("outlineInvalid")}`)),
	chip("strokeWidth", `<span class="sample"><svg viewBox="0 0 24 24" aria-hidden="true"
		style="stroke-width: ${reference("strokeWidth")}"><path d="M20 6 9 17l-5-5"/></svg></span>`)
].join(""));


render(".stage", `
	<div class="panel ground" style="background-color: ${reference("backgroundColorSunken")}">
		${tag("backgroundColorSunken")}
		<button type="button" class="card" ${handle("backgroundColorRaised")}
			style="background-color: ${reference("backgroundColorRaised")}; box-shadow: ${reference("boxShadowRaised")}">
			<span class="name">${short("backgroundColorRaised")}</span><span class="value">with box-shadow-raised</span>
		</button>
		<button type="button" class="card" ${handle("backgroundColorOverlay")}
			style="background-color: ${reference("backgroundColorOverlay")}; box-shadow: ${reference("boxShadowOverlay")}">
			<span class="name">${short("backgroundColorOverlay")}</span><span class="value">with box-shadow-overlay</span>
		</button>
	</div>
	<div class="panel backdrop">
		<button type="button" class="card float" ${handle("backgroundColorGlass")}
			style="background-color: ${reference("backgroundColorGlass")}">
			<span class="name">${short("backgroundColorGlass")}</span><span class="value">gathers floating controls</span>
		</button>
	</div>
	<div class="panel page">
		<span class="lines"><span></span><span></span><span></span><span></span><span></span></span>
		<span class="blanket" style="background-color: ${reference("backgroundColorBlanket")}"></span>
		<button type="button" class="card float" ${handle("backgroundColorBlanket")}
			style="background-color: ${reference("backgroundColorOverlay")}; box-shadow: ${reference("boxShadowOverlay")}">
			<span class="name">${short("backgroundColorBlanket")}</span><span class="value">dims what a modal covers</span>
		</button>
	</div>
`);


render("[data-chips='shadows']", tokens.filter(token => /^boxShadow/.test(token)).map(token =>
	chip(token, shape(`box-shadow: ${reference(token)}; border-radius: ${reference("borderRadius050")}`))
).join(""));


render("[data-rows='motions']", [
	...tokens.filter(token => /^duration/.test(token)).map(token => row(token, track(token, "easingStandard"))),
	...tokens.filter(token => /^easing/.test(token)).map(token => row(token, track("durationSlow", token)))
].join(""));


render(".stack", tokens.filter(token => /^zIndex/.test(token)).map((token, index) =>
	`<button type="button" class="card" ${handle(token)} style="--lab-index: ${index}; z-index: ${reference(token)}">
		<span class="name">${short(token)}</span><span class="value" data-value="${token}"></span>
	</button>`
).reverse().join(""));

render("[data-rows='opacities']", tokens.filter(token => /^opacity/.test(token)).map(token =>
	row(token, `<span class="viz"><span class="pill" style="opacity: ${reference(token)}">Unavailable</span></span>`)
).join(""));


render(".switches", [
	...switches.map(([token, hint]) => `<button type="button" class="switch" ${handle(token)}>
		<span class="led" aria-hidden="true"></span>
		<span class="name">${short(token)}</span>
		<span class="hint">${hint}</span>
	</button>`),
	`<button type="button" class="switch look" ${handle("look")}>
		<span class="name">${short("look")}</span>
		<span class="hint">How loud the widgets of an area appear: <b data-value="look"></b>.</span>
	</button>`
].join(""));


all(".play").forEach(play => play.addEventListener("click", () => {
	play.textContent = play.closest("section")?.toggleAttribute("data-run") ? "Rewind" : "Play";
}));

document.addEventListener("click", event => {

	const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-copy]") : null;

	if ( target?.dataset.copy ) {
		copy(target.dataset.copy);
	}

});

preset();
scheme();
tuner();
spy();
refresh();

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", refresh);
window.addEventListener("resize", () => requestAnimationFrame(refresh));
document.fonts.ready.then(refresh);


//// Markup ////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Renders the attributes letting an element copy a token reference on click.
 *
 * @param token The token the element stands for
 *
 * @returns The attribute markup
 */
function handle(token: Token): string {
	return `data-token="${token}" data-copy="${reference(token)}" title="skin.${token}&#10;${reference(token)}"`;
}

/**
 * Renders a token card.
 *
 * @param token The token shown by the card
 * @param sample The markup of the sample painted with the token
 *
 * @returns The markup of a button showing the sample above the token name and its resolved value
 */
function chip(token: Token, sample: string): string {
	return `<button type="button" class="chip" ${handle(token)}>${sample}<span class="label">
		<span class="name">${short(token)}</span><span class="value" data-value="${token}"></span>
	</span></button>`;
}

/**
 * Renders a swatch of the editor colour picker.
 *
 * @param token The editor colour the swatch stands for
 *
 * @returns The markup of a button filled with the colour, copying its token reference on click
 */
function pick(token: Token): string {
	return `<button type="button" class="pick" aria-label="${short(token)}" ${handle(token)}
		style="background-color: ${reference(token)}"></button>`;
}

/**
 * Renders a colour sample in the scheme on show.
 *
 * @param token The colour token painting the sample
 *
 * @returns The markup of a sample painted with the token
 */
function swatch(token: Token): string {
	return `<span class="sample swatch" style="--lab-sample: ${reference(token)}"></span>`;
}

/**
 * Renders a shape sample.
 *
 * @param style The inline style painting the shape
 *
 * @returns The markup of a sample holding a single shape
 */
function shape(style: string): string {
	return `<span class="sample"><span class="shape" style="${style}"></span></span>`;
}

/**
 * Renders a token label standing apart from a sample.
 *
 * @param token The token named by the label
 *
 * @returns The markup of a small copy button naming the token
 */
function tag(token: Token): string {
	return `<button type="button" class="tag" ${handle(token)}>${short(token)}</button>`;
}

/**
 * Renders a token row.
 *
 * @param token The token shown by the row
 * @param visual The markup of the visual painted with the token
 *
 * @returns The markup of a row naming the token, its resolved value and the visual
 */
function row(token: Token, visual: string): string {
	return `<div class="row">
		<button type="button" class="token" ${handle(token)}>${short(token)}</button>
		<span class="value" data-value="${token}"></span>
		${visual}
	</div>`;
}

/**
 * Renders a text specimen.
 *
 * @param style The inline style applying the token
 * @param text The specimen text
 * @param measure The computed property quoted beside the token value, if any
 *
 * @returns The markup of the specimen
 */
function specimen(style: string, text: string, measure?: string): string {
	return `<span class="viz specimen" style="${style}"${measure ? ` data-measure="${measure}"` : ""}>${text}</span>`;
}

/**
 * Renders a motion track.
 *
 * @param duration The duration token timing the motion
 * @param easing The easing token shaping the motion
 *
 * @returns The markup of a track whose dot travels when the section runs
 */
function track(duration: Token, easing: Token): string {
	return `<span class="viz track"><span class="dot"
		style="transition-duration: ${reference(duration)}; transition-timing-function: ${reference(easing)}"></span></span>`;
}

/**
 * Renders a step of the meaning scale.
 *
 * @param step The step to render
 *
 * @returns The markup of a notice painted on the step, its attribute values and its tokens
 */
function step({ name, says, mark, stroke, fill, level, mode, status }: Step): string {
	return `<article class="step"
		style="--lab-mark: ${reference(mark)}; --lab-stroke: ${reference(stroke)}; --lab-fill: ${reference(fill)}">
		<div class="notice"><strong>${name}</strong><span>${says}</span></div>
		<dl>
			<div><dt>level</dt><dd>${level}</dd></div>
			<div><dt>mode</dt><dd>${mode}</dd></div>
			<div><dt>status</dt><dd>${status}</dd></div>
		</dl>
		<div class="chips mini">${[mark, stroke, fill].map(token => chip(token, swatch(token))).join("")}</div>
	</article>`;
}

/**
 * Renders a text role probe.
 *
 * @param role The role to render
 *
 * @returns The markup of a row painting the role on the page and on the stripe, with live contrast badges
 */
function role({ token, budget, use, ground }: Role): string {

	const probe = (background: Token): string => `<span class="probe"
		style="color: ${reference(token)}; background-color: ${reference(background)}">
		<span class="ink">Aa</span><b data-ratio data-budget="${budget}"></b>
	</span>`;

	return `<div class="role">
		<button type="button" class="token" ${handle(token)}>${short(token)}</button>
		<span class="use">${use}</span>
		${probe(ground ?? "backgroundColor")}
		${ground ? `<span class="probe void">n/a</span>` : probe("backgroundColorStripe")}
	</div>`;

}


//// Behaviour /////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Brings every live readout in line with the preset, the scheme, the brand and the viewport on show.
 */
function refresh(): void {

	all("[data-value]").forEach(node => node.textContent = value(node));

	all("[data-ratio]").forEach(badge => {

		const probe = badge.parentElement;

		if ( probe ) {

			const style = getComputedStyle(probe);
			const ratio = contrast(rgba(style.color), rgba(style.backgroundColor));
			const budget = budgets[badge.dataset.budget === "text" || badge.dataset.budget === "mark" ? badge.dataset.budget : "none"];

			badge.textContent = `${ratio.toFixed(2)}:1`;
			badge.dataset.verdict = budget === 0 ? "none" : ratio >= budget ? "pass" : "fail";

		}

	});

	all("[data-ink]").forEach(node => {

		const fill = rgba(getComputedStyle(node).backgroundColor);
		const root = getComputedStyle(document.documentElement);

		node.style.color = contrast(fill, rgba(root.color)) >= contrast(fill, rgba(root.backgroundColor))
			? reference("color")
			: reference("backgroundColor");

	});

	render(".override", `:root {\n${accents.map(token =>
		`    ${skin[token]}: light-dark(${sides(token).join(", ")});`
	).join("\n")}\n}`);

}

/**
 * Resolves the readout of a token.
 *
 * @param node The element holding the readout
 *
 * @returns The hex values of a colour sample, or the token value with the measure it computes to
 */
function value(node: HTMLElement): string {

	const name = node.dataset.value ?? "";
	const scope = node.closest(".chip, .row") ?? node;
	const samples = Array.from(scope.querySelectorAll(".swatch"));
	const measured = scope.querySelector<HTMLElement>("[data-measure]");
	const raw = isToken(name) ? getComputedStyle(document.documentElement).getPropertyValue(skin[name]).trim() : "";

	return samples.length > 0 ? [...new Set(samples.map(sample => hex(rgba(getComputedStyle(sample).backgroundColor))))].join(" / ")
		: measured?.dataset.measure ? `${raw} · ${Math.round(parseFloat(getComputedStyle(measured).getPropertyValue(measured.dataset.measure)))}px`
			: raw;

}

/**
 * Resolves the two sides of an accent anchor as the page currently paints them.
 *
 * @param token The accent anchor
 *
 * @returns The light and the dark hex values
 */
function sides(token: Token): readonly [string, string] {

	const paint = (theme: string): string => {

		const probe = document.createElement("span");

		probe.dataset.theme = theme;
		probe.style.backgroundColor = reference(token);

		document.body.append(probe);

		const painted = hex(rgba(getComputedStyle(probe).backgroundColor)).slice(0, 7).toLowerCase();

		probe.remove();

		return painted;

	};

	return [paint("light"), paint("dark")];

}

/**
 * Wires the preset menu to the page, remembering the choice where the browser allows and starting on Roboto otherwise.
 *
 * The page carries one design system entry at a time, either the bare entry on platform faces or a single preset, as
 * an app includes a preset in place of the entry and never beside it. The readouts follow each change of faces.
 */
function preset(): void {

	const presets: Readonly<Record<string, string>> = { platform, inter, roboto };

	const style = document.head.appendChild(document.createElement("style"));
	const menu = document.querySelector<HTMLSelectElement>("select.preset");

	const stored = (() => {
		try { return localStorage.getItem("lab-preset") ?? "roboto"; } catch { return "roboto"; }
	})();

	const initial = Object.hasOwn(presets, stored) ? stored : "roboto";

	const apply = (value: string): void => {

		style.textContent = presets[value] ?? roboto;

		try { localStorage.setItem("lab-preset", value); } catch { /* storage unavailable: the choice lasts the visit */ }

		requestAnimationFrame(() => document.fonts.ready.then(refresh));

	};

	menu?.addEventListener("change", () => apply(menu.value));

	if ( menu ) {
		menu.value = initial;
	}

	apply(initial);

}

/**
 * Wires the scheme switch to the page, remembering the choice where the browser allows.
 */
function scheme(): void {

	const stored = (() => {
		try { return localStorage.getItem("lab-scheme") ?? "auto"; } catch { return "auto"; }
	})();

	const apply = (value: string): void => {

		if ( value === "light" || value === "dark" ) {
			document.documentElement.setAttribute("data-theme", value);
		} else {
			document.documentElement.removeAttribute("data-theme");
		}

		try { localStorage.setItem("lab-scheme", value); } catch { /* storage unavailable: the choice lasts the visit */ }

		requestAnimationFrame(refresh);

	};

	all<HTMLInputElement>("input[name='scheme']").forEach(input => {

		input.checked = input.value === stored;
		input.addEventListener("change", () => apply(input.value));

	});

	apply(stored);

}

/**
 * Wires the brand tuner to the accent anchors of the page.
 */
function tuner(): void {

	const inputs = all<HTMLInputElement>("input[data-anchor]");
	const form = document.querySelector(".tuner form");

	const sync = (): void => inputs.forEach(input => {

		const anchor = input.dataset.anchor ?? "";

		if ( isToken(anchor) ) {
			input.value = sides(anchor)[input.dataset.side === "dark" ? 1 : 0];
		}

	});

	inputs.forEach(input => input.addEventListener("input", () => {

		const anchor = input.dataset.anchor ?? "";
		const pair = inputs.filter(peer => peer.dataset.anchor === anchor);
		const [light, dark] = ["light", "dark"].map(side => pair.find(peer => peer.dataset.side === side)?.value);

		if ( isToken(anchor) && light && dark ) {
			document.documentElement.style.setProperty(skin[anchor], `light-dark(${light}, ${dark})`);
			requestAnimationFrame(refresh);
		}

	}));

	form?.addEventListener("reset", event => {

		event.preventDefault();

		accents.forEach(token => document.documentElement.style.removeProperty(skin[token]));

		requestAnimationFrame(() => {
			refresh();
			sync();
		});

	});

	sync();

}

/**
 * Marks the navigation link of the section in view.
 */
function spy(): void {

	const links = all<HTMLAnchorElement>(".toc a");

	const observer = new IntersectionObserver(entries => entries
		.filter(entry => entry.isIntersecting)
		.forEach(entry => links.forEach(link =>
			link.toggleAttribute("aria-current", link.hash === `#${entry.target.id}`)
		)), { rootMargin: "-30% 0px -65% 0px" }
	);

	all("main > section[id]").forEach(section => observer.observe(section));

}

/**
 * Copies a token reference to the clipboard and confirms it.
 *
 * @param text The reference to copy
 */
function copy(text: string): void {

	const toast = document.querySelector<HTMLElement>(".toast");

	navigator.clipboard?.writeText(text).then(
		() => toast && notify(toast, `Copied ${text}`),
		() => toast && notify(toast, `Unable to copy ${text}`)
	);

}

/**
 * Shows a short-lived message.
 *
 * @param toast The live region showing the message
 * @param message The message to show
 */
function notify(toast: HTMLElement, message: string): void {

	toast.textContent = message;
	toast.setAttribute("data-shown", "");

	clearTimeout(Number(toast.dataset.timer));

	toast.dataset.timer = String(setTimeout(() => toast.removeAttribute("data-shown"), 1600));

}


//// Colour ////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Resolves a CSS colour to sRGB channels.
 *
 * @param color Any colour the canvas accepts, as computed styles return it
 *
 * @returns The red, green, blue and alpha channels, 0 to 255
 */
function rgba(color: string): Rgba {

	if ( !context ) {
		return [0, 0, 0, 0];
	}

	context.clearRect(0, 0, 1, 1);
	context.fillStyle = color;
	context.fillRect(0, 0, 1, 1);

	const [r = 0, g = 0, b = 0, a = 0] = context.getImageData(0, 0, 1, 1).data;

	return [r, g, b, a];

}

/**
 * Formats sRGB channels as a hex colour.
 *
 * @param color The channels to format
 *
 * @returns The `#RRGGBB` form, extended to `#RRGGBBAA` for a translucent colour
 */
function hex([r, g, b, a]: Rgba): string {
	return `#${(a < 255 ? [r, g, b, a] : [r, g, b]).map(channel => channel.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

/**
 * Computes the WCAG contrast ratio of two colours.
 *
 * @param x The first colour
 * @param y The second colour
 *
 * @returns The ratio, from 1 to 21
 */
function contrast(x: Rgba, y: Rgba): number {

	const [lx, ly] = [luminance(x), luminance(y)];

	return (Math.max(lx, ly) + 0.05) / (Math.min(lx, ly) + 0.05);

}

/**
 * Computes the relative luminance of a colour.
 *
 * @param color The colour
 *
 * @returns The WCAG relative luminance, from 0 to 1
 */
function luminance([r, g, b]: Rgba): number {

	const linear = (channel: number): number => channel / 255 <= 0.04045
		? channel / 255 / 12.92
		: ((channel / 255 + 0.055) / 1.055) ** 2.4;

	return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);

}


//// Plumbing //////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Checks whether a name is a token of the design system.
 *
 * @param name The name to check
 *
 * @returns `true` if `name` is a key of the token contract
 */
function isToken(name: string): name is Token {
	return name in skin;
}

/**
 * Renders the `var()` reference of a token.
 *
 * @param token The token to reference
 *
 * @returns The reference a stylesheet reads the token with
 */
function reference(token: Token): string {
	return `var(${skin[token]})`;
}

/**
 * Renders the short name of a token.
 *
 * @param token The token to name
 *
 * @returns The custom property name without the `--skin--` prefix
 */
function short(token: Token): string {
	return skin[token].replace(/^--skin--/, "");
}

/**
 * Selects elements.
 *
 * @param selector The selector to match
 *
 * @returns The matching elements, in document order
 */
function all<T extends HTMLElement = HTMLElement>(selector: string): readonly T[] {
	return Array.from(document.querySelectorAll<T>(selector));
}

/**
 * Fills a placeholder with generated markup.
 *
 * @param selector The selector of the placeholder element
 * @param html The markup replacing the content of the placeholder
 */
function render(selector: string, html: string): void {
	document.querySelector(selector)?.replaceChildren(document.createRange().createContextualFragment(html));
}
