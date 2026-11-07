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

import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { css, skin } from "./index.js";


describe("skin", () => {

	const declared: ReadonlyArray<string> = Object.values(skin);

	/*
	 * A preset overrides tokens on top of the design system as an app would, rather than defining them, so the
	 * presets stay outside the contract the token modules are held to and answer to the checks under "presets" instead.
	 */

	const stylesheets = readdirSync(new URL(".", import.meta.url), { recursive: true, encoding: "utf-8" })
		.filter(name => name.endsWith(".css"))
		.filter(name => !name.startsWith("presets/"))
		.map(name => readFileSync(new URL(`./${ name }`, import.meta.url), "utf-8"));

	/*
	 * A media query with its nested rules, or a rule forcing a scheme: each form a scheme variant can take.
	 */

	const query = /@media[^{]*\{(?:[^{}]*\{[^{}]*})*[^{}]*}/g;
	const forced = /\[data-scheme[^{}]*\{[^{}]*}/g;

	const unconditional = stylesheets.map(text => text.replace(query, "").replace(forced, ""));
	const conditional = stylesheets.flatMap(text => [ ...text.match(query) ?? [], ...text.match(forced) ?? [] ]);

	/*
	 * A rule settled by the colour scheme, whether the platform or a pinned attribute decides it. A token stated there
	 * is one an app would have to restate per scheme, and again per pinning, to override.
	 */

	const schemed = conditional.filter(rule => /prefers-color-scheme|\[data-scheme/.test(rule));

	const assignments = (texts: ReadonlyArray<string>): ReadonlyArray<readonly [string, string]> => texts
		.flatMap(text => Array.from(text.matchAll(/(?::root|\[data-scheme)[^{}]*\{([^}]*)}/g), ([ , rule ]) => rule))
		.flatMap(rule => Array.from(rule.matchAll(/(--skin--[\w-]+)\s*:([^;]*);/g),
			([ , token, value ]) => [ token, value ] as const
		));

	const referenced = stylesheets
		.flatMap(text => Array.from(text.matchAll(/var\((--skin--[\w-]+)/g), ([ , token ]) => token));

	const registrations: ReadonlyArray<readonly [string, string]> = stylesheets
		.flatMap(text => Array.from(text.matchAll(/@property\s+(--skin--[\w-]+)\s*\{([^}]*)}/g),
			([ , token, body ]) => [ token, body ] as const
		));

	const registered = registrations.map(([ token ]) => token);

	const anchored = registrations.filter(([ , body ]) => /initial-value/.test(body)).map(([ token ]) => token);

	const defaults = assignments(unconditional).map(([ token ]) => token);
	const variants = assignments(conditional).map(([ token ]) => token);

	const assigned = [ ...defaults, ...variants ];

	const derived = assignments(stylesheets)
		.filter(([ , value ]) => /var\(|color-mix\(|oklch\(/.test(value))
		.map(([ token ]) => token);

	const defined = (token: string): number => (anchored.includes(token) ? 1 : 0)
		+ defaults.filter(assignment => assignment === token).length;


	it("names every token the stylesheets read", () => {

		expect(referenced.filter(token => !declared.includes(token))).toEqual([]);

	});

	it("names every token the stylesheet defines", () => {

		expect(assigned.filter(token => !declared.includes(token))).toEqual([]);

	});

	it("defines every token in exactly one place", () => {

		expect(declared.filter(token => defined(token) !== 1)).toEqual([]);

	});

	it("states no token per colour scheme, so a single override reaches every scheme", () => {

		expect(assignments(schemed).map(([ token ]) => token)).toEqual([]);

	});

	it("names every token the stylesheet registers", () => {

		expect(registered.filter(token => !declared.includes(token))).toEqual([]);

	});

	it("names no token the stylesheet leaves unregistered", () => {

		expect(declared.filter(token => !registered.includes(token))).toEqual([]);

	});

	it("registers every token once", () => {

		expect(registered.filter((token, index) => registered.indexOf(token) !== index)).toEqual([]);

	});

	it("registers every token as inherited", () => {

		expect(registrations.filter(([ , body ]) => !/inherits:\s*true/.test(body)).map(([ token ]) => token)).toEqual([]);

	});

	it("registers a derived token without a default it cannot resolve", () => {

		expect(registrations
			.filter(([ token, body ]) => derived.includes(token) && /initial-value/.test(body))
			.map(([ token ]) => token)
		).toEqual([]);

	});

});

describe("stylesheets", () => {

	const remote = /@import\s+url\(\s*["']?https?:/;

	const sources = readdirSync(new URL(".", import.meta.url), { recursive: true, encoding: "utf-8" })
		.filter(name => name.endsWith(".css"));

	it("loads no remote resource", () => {

		expect(sources.filter(name => remote.test(readFileSync(new URL(`./${ name }`, import.meta.url), "utf-8"))))
			.toEqual([]);

	});

	it("imports every module into the design system layer", () => {

		const entry = readFileSync(new URL("./index.css", import.meta.url), "utf-8");

		expect(sources
			.filter(name => name !== "index.css" && !name.startsWith("presets/"))
			.filter(name => !entry.includes(`@import "./${ name }" layer(skin);`))
		).toEqual([]);

	});

	it("loads no face from the design system entry", () => {

		const entry = readFileSync(new URL("./index.css", import.meta.url), "utf-8");

		expect(entry).not.toMatch(/@import\s+"@fontsource/);

	});

});

describe("presets", () => {

	const declared: ReadonlyArray<string> = Object.values(skin);

	const manifest: { readonly exports: Readonly<Record<string, unknown>> } = JSON.parse(
		readFileSync(new URL("../package.json", import.meta.url), "utf-8")
	);

	const names = readdirSync(new URL("./presets/", import.meta.url)).filter(name => name.endsWith(".css"));

	const layered = /@layer\s+skin\s*\{(?:[^{}]*\{[^{}]*})*[^{}]*}/g;

	describe.each(names)("%s", name => {

		const text = readFileSync(new URL(`./presets/${ name }`, import.meta.url), "utf-8").replace(/\/\*[\s\S]*?\*\//g, "");

		const blocks = Array.from(text.match(layered) ?? [], block => block.replace(/^@layer\s+skin\s*\{/, ""));

		const assignments = blocks.flatMap(block => Array.from(block.matchAll(/(--skin--[\w-]+)\s*:([^;]*);/g),
			([ , token, value ]) => [ token, value ] as const
		));

		it("builds on the design system entry", () => {

			expect(text).toContain(`@import "../index.css";`);

		});

		it("is exported by the package", () => {

			expect(manifest.exports[`./presets/${ name }`]).toEqual({
				"@metreeca/source": `./src/presets/${ name }`,
				"default": `./dist/presets/${ name }`
			});

		});

		it("states tokens on the root inside the design system layer alone", () => {

			expect(text.replace(layered, "")).not.toMatch(/--skin--[\w-]+\s*:/);
			expect(blocks.flatMap(block => Array.from(block.matchAll(/([^{}]+)\{/g), ([ , selector ]) => selector.trim()))
				.filter(selector => selector !== ":root")
			).toEqual([]);

		});

		it("overrides only tokens the design system declares", () => {

			expect(assignments.map(([ token ]) => token).filter(token => !declared.includes(token))).toEqual([]);

		});

		it("sizes the mono face it sets", () => {

			const tokens = assignments.map(([ token ]) => token);

			expect(!tokens.includes("--skin--font-family-mono") || tokens.includes("--skin--font-size-mono")).toBe(true);

		});

		it("registers no token", () => {

			expect(text).not.toMatch(/@property/);

		});

		it("loads every face its font stacks lead with", () => {

			const packages = assignments
				.filter(([ token ]) => token.startsWith("--skin--font-family"))
				.flatMap(([ , value ]) => Array.from(value.matchAll(/^\s*"([^"]+) Variable"/g),
					([ , face ]) => `@fontsource-variable/${ face.toLowerCase().replaceAll(" ", "-") }`
				));

			expect(packages.filter(pkg => !text.includes(`@import "${ pkg }";`))).toEqual([]);

		});

	});

});

describe("css", () => {

	it("assigns the custom property of each token the value given for it", () => {

		expect(css({

			colorStrong: "#06C",
			fontFamily: "Inter, sans-serif"

		})).toEqual({

			"--skin--color-strong": "#06C",

			"--skin--font-family": "Inter, sans-serif",
			"font-family": "Inter, sans-serif"

		});

	});

	it("writes an area in the typography it is given, the page reading it only for itself", () => {

		expect(css({

			fontFamily: "Inter, sans-serif",
			fontSize: "1.5rem",
			fontWeight: 500,
			lineHeight: 1.4

		})).toEqual({

			"--skin--font-family": "Inter, sans-serif", "font-family": "Inter, sans-serif",
			"--skin--font-size": "1.5rem", "font-size": "1.5rem",
			"--skin--font-weight": "500", "font-weight": "500",
			"--skin--line-height": "1.4", "line-height": "1.4"

		});

	});

	it("paints an area in the colours it is given, the page reading them only for itself", () => {

		expect(css({

			color: "colorStrong",
			backgroundColor: "backgroundColorRaised"

		})).toEqual({

			"--skin--color": "var(--skin--color-strong)", "color": "var(--skin--color-strong)",
			"--skin--background-color": "var(--skin--background-color-raised)",
			"background-color": "var(--skin--background-color-raised)"

		});

	});

	it("shapes the box of the element it is given, no rule reading the box tokens", () => {

		expect(css({

			padding: "spacing100",
			borderRadius: "borderRadius050",
			boxShadow: "boxShadowRaised"

		})).toEqual({

			"--skin--padding": "var(--skin--spacing-100)", "padding": "var(--skin--spacing-100)",
			"--skin--border-radius": "var(--skin--border-radius-050)",
			"border-radius": "var(--skin--border-radius-050)",
			"--skin--box-shadow": "var(--skin--box-shadow-raised)", "box-shadow": "var(--skin--box-shadow-raised)"

		});

	});

	it("sets a token from another named as the value", () => {

		expect(css({ fontSize: "fontSizeLarge" })).toEqual({

			"--skin--font-size": "var(--skin--font-size-large)",
			"font-size": "var(--skin--font-size-large)"

		});

	});

	it("writes a value naming no token as it stands", () => {

		expect(css({ colorStrong: "#D60", borderStyle: "solid" })).toStrictEqual({

			"--skin--color-strong": "#D60",
			"--skin--border-style": "solid"

		});

	});

	it("leaves a token nothing below the page reads again to the assignment alone", () => {

		expect(css({ colorStrong: "#06C" })).toStrictEqual({ "--skin--color-strong": "#06C" });

	});

	it("converts a numeric value to its text form", () => {

		expect(css({

			lineHeight: 1.2,
			zIndexModal: 400

		})).toEqual({

			"--skin--line-height": "1.2",
			"line-height": "1.2",

			"--skin--z-index-modal": "400"

		});

	});

	it("leaves out tokens with no value", () => {

		expect(css({

			colorStrong: "#06C",
			colorSubtle: undefined

		})).toStrictEqual({

			"--skin--color-strong": "#06C"

		});

	});

	it("assigns every declared token", () => {

		expect(css(Object.fromEntries(Object.keys(skin).map(token => [ token, "value" ]))))
			.toEqual(Object.fromEntries([

				...Object.values(skin).map(property => [ property, "value" ]),

				// the tokens the page alone reads, and the box tokens no rule reads, are applied as well as assigned

				[ "font-family", "value" ],
				[ "font-size", "value" ],
				[ "font-weight", "value" ],
				[ "line-height", "value" ],

				[ "color", "value" ],
				[ "background-color", "value" ],

				[ "padding", "value" ],
				[ "border-radius", "value" ],
				[ "box-shadow", "value" ]

			]));

	});

	it("assigns nothing when given no tokens", () => {

		expect(css({})).toEqual({});

	});

});

describe("css.var", () => {

	it("reads a token through the custom property carrying its value", () => {

		expect(css.var(skin.colorStrong)).toBe("var(--skin--color-strong)");

	});

	it("reads every declared token", () => {

		expect(Object.values(skin).filter(property => css.var(property) !== `var(${ property })`)).toEqual([]);

	});

	it("reads a token as css assigns one named as a value", () => {

		expect(css({ fontSize: "fontSizeLarge" })[skin.fontSize]).toBe(css.var(skin.fontSizeLarge));

	});

});

describe("css.tint", () => {

	it("mixes a colour token into the sunken surface by the share given", () => {

		expect(css.tint(skin.colorHeat030, 20)).toBe(
			"color-mix(in oklab, var(--skin--color-heat-030) 20%, var(--skin--background-color-sunken))"
		);

	});

	it("keeps the token as given at full share and the surface alone at none", () => {

		expect(css.tint(skin.colorArea1, 100)).toBe(
			"color-mix(in oklab, var(--skin--color-area-1) 100%, var(--skin--background-color-sunken))"
		);

		expect(css.tint(skin.colorArea1, 0)).toBe(
			"color-mix(in oklab, var(--skin--color-area-1) 0%, var(--skin--background-color-sunken))"
		);

	});

	it("is taken as a fill", () => {

		expect(css({ backgroundColor: css.tint(skin.colorHeat090, 15) })[skin.backgroundColor])
			.toBe(css.tint(skin.colorHeat090, 15));

	});

});
