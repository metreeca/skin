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
 * Names the faces, sizes, weights and casing text is set in, the leading and tracking it is spaced on and the measure
 * prose keeps to. An app overrides them to retype a whole interface, from running text to titles, labels and leads.
 *
 * @remarks
 *
 * **Faces** — `fontFamily` carries the body face, `fontFamilyHeading` the one a title is set in and `fontFamilyMono`
 * the one a code span or a figure aligns on. Each defaults to a platform face, which costs no download, and a preset
 * sets all three in faces it bundles, as `presets/roboto.css` does with the Roboto faces of the Metreeca brand. An app
 * supplying a face of its own loads it and restates a generic stack after it, which covers the text until it loads.
 *
 * A mono face runs wider than the text face it is paired with. Every preset shipped here scales its mono face to match
 * its text face, so anything set in `fontFamilyMono` matches the text around it with no size of its own. An app
 * supplying a mono face scales it the same way, through the `size-adjust` descriptor of its `@font-face` rules, so it
 * stays matched wherever a component sets it. The platform faces vary by system and are left unscaled.
 *
 * **Sizes** — `fontSize` follows the reader's setting and grows slightly on a desktop-sized window, while
 * `fontSizeSmall` and `fontSizeLarge` follow whatever they sit in, keeping their ratio inside a subtree sized apart.
 *
 * The page sets the base size on `body` and leaves the root at the reader's setting, so `fontSize` resolves to the same
 * length at every depth and a `rem` always means the reader's setting. A measure meant to follow the base text size is
 * therefore stated in `em` or through a token, never in `rem`, which ignores the window and any app override.
 *
 * **Headings** — `fontSizeHeading` sizes every heading level, so an app resizing it resizes all headings together. The
 * first two levels stand above it, the next two take it as it stands and the last two drop to the small size. Weight,
 * colour and spacing carry the rest of the hierarchy, which keeps a deep outline readable in a column.
 *
 * `letterSpacingHeading` ships neutral and lets the brand face decide, so an app supplying a condensed or a wide face
 * corrects the heading tracking through this token alone, without restating the rule for every heading level.
 *
 * **Display and labels** — `lineHeightDisplay` is the tight leading of display type, such as the heading of an
 * `hgroup` or a figure set large. `letterSpacingCaps` spaces out a label set in small capitals, which would otherwise
 * look crowded, as the eyebrow of a heading group and the top-level entries of a `nav` outline are.
 *
 * **Casing** — `textTransformHeading` sets the casing of every heading, as written by default, and `textTransformCaps`
 * that of every label in capitals, so a call site restating either on a subtree recases every title or label inside.
 * Neither token is derived from the other, and a label leaving capitals usually drops its extra tracking as well, so
 * an app turning `textTransformCaps` to `none` restates `letterSpacingCaps` as `normal` in the same rule.
 *
 * **Measure** — `inlineSizeProse` caps a run of prose at a comfortable reading measure. It is stated in characters of
 * the element it caps, so a heading group capped as a whole holds fewer characters per line in its larger lead.
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
	lineHeightDisplay: "--skin--line-height-display",
	letterSpacingHeading: "--skin--letter-spacing-heading",
	letterSpacingCaps: "--skin--letter-spacing-caps",
	textTransformHeading: "--skin--text-transform-heading",
	textTransformCaps: "--skin--text-transform-caps",

	inlineSizeProse: "--skin--inline-size-prose",

	fontWeight: "--skin--font-weight",
	fontWeightStrong: "--skin--font-weight-strong"

} as const;
