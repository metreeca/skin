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
 * Colour tokens.
 *
 * Names the anchors an app supplies its brand through and the roles derived from them, so a rule says which role it
 * paints rather than which colour it uses, and an app retuning the anchors alone carries the whole interface along in
 * either platform colour scheme.
 *
 * @remarks
 *
 * **Contrast** — every role is held to [WCAG 2.2](https://www.w3.org/TR/WCAG22/) AA on the surfaces it is set on:
 * 4.5:1 for [text](https://www.w3.org/TR/WCAG22/#contrast-minimum), and 3:1 for marks, control boundaries and focus
 * rings, as [non-text contrast](https://www.w3.org/TR/WCAG22/#non-text-contrast) requires. A meaning is never told
 * in colour alone, as [use of colour](https://www.w3.org/TR/WCAG22/#use-of-color) requires: a glyph or a word carries
 * it too, for a reader who cannot tell the colours apart or who reads the page through a screen reader.
 *
 * **Colour schemes** — the stylesheet ships each anchor as a `light-dark()` pair, so an interface follows the platform
 * with no work from the app. An app pinning a scheme sets `data-theme` to `light` or `dark` on any element, and the
 * subtree below it takes that scheme whatever the platform says, which is what lets a dark panel sit on a light page.
 * An app supplying its brand states a value per scheme too, as a single `light-dark()` pair on `:root` that every
 * scheme and every pinned subtree follows, and rechecks that the text roles still hold AA contrast against the page
 * and the striped row in both:
 *
 * ```css
 * :root {
 *     --skin--color-subtle: light-dark(#1C275D, #9AB);
 *     --skin--color-strong: light-dark(#06C, #4AF);
 * }
 * ```
 *
 * **Accents** — `colorSubtle` is the quieter of the brand pair and `colorStrong` the louder. The pair states an
 * emphasis relative to each other and nothing else: which elements read them, and in which state, is settled by the
 * roles derived from them rather than by the anchors. A brand of any hue or lightness therefore fits by supplying
 * two values; the quieter one is the less saturated, which leaves it free to hold the higher contrast, as it does by
 * default.
 *
 * **Status** — `colorNote`, `colorPass`, `colorFlag`, `colorWarn` and `colorFail` are a five-step scale every
 * meaning a widget carries lands on. `note` is not a milder `pass` but the absence of a verdict, so the scale reads
 * as one unjudged step ahead of a four-step ramp, `pass`, `flag`, `warn` and `fail`, each verdict asking more of the
 * reader than the last. `flag` singles a thing out for attention, where `warn` says that something has gone wrong.
 *
 * Three kinds of meaning share it, and which one a widget carries follows from what the widget is, so no widget
 * carries two: `level` on content, how much attention a passage deserves; `mode` on controls, what activating will
 * do; `status` on reported things, what the system says happened. Each declares `normal` explicitly, and `normal` is
 * not a step: it paints nothing and leaves the ordinary page colours. A widget maps its remaining values onto the
 * steps and states that mapping in its own documentation.
 *
 * How loud a widget appears is a separate axis, its `look`, told in placement, size and weight and never in colour.
 *
 * The five stand apart as anchors rather than derivations of an accent, so a meaning keeps reading as itself
 * whatever an app brands with, and each pairs with a `backgroundColor*` role tinting a notice. A step is never told
 * in colour alone: an icon or a word carries it too, since `pass` and `fail` are the pair that colour vision
 * deficiency collapses most readily, and a reader who cannot tell them apart still reads the icon and the word.
 *
 * **What a status colour may paint** — `colorNote`, `colorPass`, `colorFlag` and `colorFail` hold AA contrast on
 * the page, the striped row and their own tint in both colour schemes, so each paints text, a mark or a fill.
 * `colorWarn` is a gold in both schemes, painting text or a mark on the page and the striped row, or a fill with its
 * message in `colorOver`; it is never set on its own tint, where the light gold falls short.
 *
 * **Status text** — `colorNoteStroke`, `colorPassStroke`, `colorFlagStroke`, `colorWarnStroke` and
 * `colorFailStroke` paint text in the colour of a step. Each is its anchor and holds AA contrast in both colour
 * schemes on the page, the striped row and its step's tint, except `colorWarnStroke`, which falls short on the light
 * caution tint and is never set there. A widget setting a label over any other fill, such as a tint deepened under
 * the pointer, holds it to AA there itself, falling back on the page text, `color`, wherever the stroke falls short.
 *
 * **Text** — `colorLabel` names a field and `colorPlaceholder` stands in for a value not yet given. `colorEnabled`
 * marks a control that answers and `colorDisabled` one that does not. The enabled colour stays apart from the link
 * colours and from the surrounding text, so a control that answers is never mistaken for a link or for plain copy.
 *
 * Every text role holds AA contrast against the page and the striped row in both colour schemes, and `colorLabel`
 * holds it on the pressed fill of a control too, the deepest surface a label is set on. `colorPlaceholder` holds it
 * on the page, the striped row and the edit background, lighter than an entered value but legible. The one exception
 * is `colorDisabled`, which shares its value with {@link borders `borderColor`}: WCAG exempts a disabled control.
 *
 * **Links** — `colorLink` paints a link and `colorLinkHover` a link under the pointer, both in the hue of the subtle
 * accent at a lightness of their own, so a link follows a brand while holding AA contrast whatever the brand supplies.
 *
 * **States** — `colorHover` marks what the pointer is over, `colorPressed` what is being acted on, `colorSelected`
 * what an earlier choice left standing, and `colorFocus` what the keyboard has reached. A state is never told in
 * colour alone: weight, shape or wording carries it too, for a reader who cannot tell the colours apart.
 *
 * The first three answer to the strong accent, so they follow a brand. `colorHover` and `colorPressed` step away
 * from the page in either colour scheme, the press further than the hover, so the two read as rising emphasis. Each
 * of the three pairs with a `backgroundColor*` role for a control filling its whole box rather than colouring its
 * text, and the two are never combined on the same element, which would state the emphasis twice.
 *
 * No base rule paints `colorSelected` or the three state fills: they are reserved for the controls a component
 * library builds on the design system, a tab, a menu item or a toggle filling its box, and the suite holds each to
 * its budget on the surfaces such a control reaches.
 *
 * `colorFocus` carries a value of its own per colour scheme, so that where the keyboard stands is told the same way
 * whatever an app brands with. It holds 3:1 on every surface a ring is drawn against, a pressed fill included, but
 * not against a fill in `colorStrong`: a ring around such a control is offset outside the fill, against the page.
 *
 * **Filled caution** — `colorOver` is what text takes over a fill painted in `colorWarn`: the page background, white
 * over the light gold and dark over the dark one. It is not the text over any other step: a fill painted in
 * `colorFail` flips as `colorStrongOver` does, white in the light colour scheme and black in the dark one.
 *
 * **Filled accent** — `colorStrongOver` is what text takes over a fill painted in `colorStrong`. It is white or
 * black, whichever contrasts more with the accent, so a label holds AA contrast whatever accent an app brands with.
 *
 * Neither over colour is read by a base rule, since plain markup paints no filled badge and no filled button: both
 * are reserved for the component library, and the suite holds each to AA contrast on the fill it is named for.
 *
 * **Surfaces** — `backgroundColorEdit` marks a field that takes a value and `backgroundColorStripe` a table row
 * telling itself from its neighbour. A rule paints `background-color` with them rather than retuning
 * `backgroundColor`, which every other colour here stands on. A thing lifted off the page takes an
 * {@link elevations elevation surface} instead.
 *
 * The chart, map and editor colours stand outside this: the {@link palettes heat scale, the series slots, the area
 * classes and the editor colours} keep values of their own, so a rebrand repaints neither what they code nor the
 * content an author coloured with them: a chart, a map and a coloured passage all look the same under any brand.
 *
 * @module colors
 */


/**
 * The custom property behind every colour token.
 *
 * Narrowed to literals, so the design system contract can name the tokens and the custom properties they resolve to.
 */
export const colors = {

	color: "--skin--color",
	backgroundColor: "--skin--background-color",

	colorSubtle: "--skin--color-subtle",
	colorStrong: "--skin--color-strong",

	colorNote: "--skin--color-note",
	colorPass: "--skin--color-pass",
	colorFlag: "--skin--color-flag",
	colorWarn: "--skin--color-warn",
	colorFail: "--skin--color-fail",

	colorNoteStroke: "--skin--color-note-stroke",
	colorPassStroke: "--skin--color-pass-stroke",
	colorFlagStroke: "--skin--color-flag-stroke",
	colorWarnStroke: "--skin--color-warn-stroke",
	colorFailStroke: "--skin--color-fail-stroke",

	colorLabel: "--skin--color-label",
	colorPlaceholder: "--skin--color-placeholder",
	colorEnabled: "--skin--color-enabled",
	colorDisabled: "--skin--color-disabled",

	colorLink: "--skin--color-link",
	colorLinkHover: "--skin--color-link-hover",

	colorHover: "--skin--color-hover",
	colorPressed: "--skin--color-pressed",
	colorSelected: "--skin--color-selected",
	colorFocus: "--skin--color-focus",
	colorOver: "--skin--color-over",
	colorStrongOver: "--skin--color-strong-over",

	backgroundColorEdit: "--skin--background-color-edit",
	backgroundColorStripe: "--skin--background-color-stripe",

	backgroundColorHover: "--skin--background-color-hover",
	backgroundColorPressed: "--skin--background-color-pressed",
	backgroundColorSelected: "--skin--background-color-selected",

	backgroundColorNote: "--skin--background-color-note",
	backgroundColorPass: "--skin--background-color-pass",
	backgroundColorFlag: "--skin--background-color-flag",
	backgroundColorWarn: "--skin--background-color-warn",
	backgroundColorFail: "--skin--background-color-fail"

} as const;
