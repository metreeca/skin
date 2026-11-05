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

/**
 * Typography tokens.
 *
 * Names the faces, sizes, weights and line height text is set in, which an app overrides to retype a whole interface.
 *
 * @remarks
 *
 * **Faces** — `fontFamily` carries the body face, `fontFamilyHeading` the one a title is set in and `fontFamilyMono`
 * the one a code span or a figure aligns on. Each ships as a Roboto face bundled with the app, ahead of a generic stack
 * covering it until it loads, so an app supplying a face of its own loads it and restates the fallbacks after it.
 *
 * **Sizes** — `fontSize` follows the reader's setting and grows slightly on a desktop-sized window, while
 * `fontSizeSmall` and `fontSizeLarge` follow whatever they sit in, keeping their ratio inside a subtree sized apart.
 *
 * **Headings** — `fontSizeHeading` sizes every heading level, so an app resizing it resizes all headings together. The
 * first level scales up from it, while the levels below take it as it stands, since their hierarchy is carried by the
 * face, the weight and the space around a heading rather than by a ladder of sizes, which keeps a deep outline
 * readable in a column.
 * `letterSpacingHeading` ships neutral and lets the brand face decide, so an app supplying a condensed or a wide face
 * corrects the tracking without restating the rule.
 *
 * **Weights** — `fontWeight` is text at rest and `fontWeightStrong` anything marked out from it, from a link or a term
 * to a heading, a label, a tab or a table header, so emphasis reads the same wherever it occurs in the interface.
 *
 * @module typography
 */


/**
 * The custom property behind every typography token.
 *
 * Narrowed to literals, so the design system contract can name the tokens and the custom properties they resolve to.
 */
export const typography = {

	fontFamily: "--skin--font-family",
	fontFamilyHeading: "--skin--font-family-heading",
	fontFamilyMono: "--skin--font-family-mono",

	fontSize: "--skin--font-size",
	fontSizeSmall: "--skin--font-size-small",
	fontSizeLarge: "--skin--font-size-large",
	fontSizeHeading: "--skin--font-size-heading",

	lineHeight: "--skin--line-height",
	letterSpacingHeading: "--skin--letter-spacing-heading",

	fontWeight: "--skin--font-weight",
	fontWeightStrong: "--skin--font-weight-strong"

} as const;
