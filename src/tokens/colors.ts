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
 * **Status** — `colorInfo`, `colorPass`, `colorWarn` and `colorFail` are a four-step scale every meaning a widget
 * carries lands on: `info` says no verdict has been passed, and `pass`, `warn` and `fail` are a verdict getting
 * worse. `info` is therefore not a milder `pass` but the absence of one, which is why the scale reads as one
 * unjudged step ahead of a three-step ramp.
 *
 * Three kinds of meaning share it, and which one a widget carries follows from what the widget is, so no widget
 * carries two: `level` on content, how much attention a passage deserves; `mode` on controls, what activating will
 * do; `status` on reported things, what the system says happened. Each declares `normal` explicitly, and `normal` is
 * not a step: it paints nothing and leaves the ordinary page colours. A widget maps its remaining values onto the
 * steps and states that mapping in its own documentation.
 *
 * How loud a widget appears is a separate axis, its `look`, told in placement, size and weight and never in colour.
 *
 * The four stand apart as anchors rather than derivations of an accent, so a meaning keeps reading as itself
 * whatever an app brands with, and each pairs with a `backgroundColor*` role tinting a notice. A step is never told
 * in colour alone: an icon or a word carries it too, since the two ends of the ramp are the pair colour vision
 * deficiency collapses most readily.
 *
 * **What a status colour may paint** — `colorFail` holds AA contrast on the page, the striped row and its own
 * tint, so it paints text or a mark. `colorInfo` and `colorPass` are **marks**, holding 3:1 rather than 4.5:1 in
 * the light colour scheme: they paint a glyph, a rule or a fill, and text over their tint takes `color`. In the dark
 * colour scheme they are tuned to read as loud as in the light one, so a notice keeps its weight across schemes.
 * `colorWarn` is a **fill**: a caution paints a filled badge with it and sets its message in the dark page anchor
 * over it, at 12.5:1. Stroking it on the page gives 1.68:1 and is a defect, so caution text takes `colorWarnStroke`.
 *
 * **Status text** — `colorInfoStroke`, `colorPassStroke`, `colorWarnStroke` and `colorFailStroke` paint text in
 * the colour of a step. Each holds AA contrast in both colour schemes on the page, the striped row and its step's
 * tint. A control deepening that tint under the pointer or the press, by a further 24% of the step, sets its label
 * in whichever of the stroke and `colorOver` holds AA there: the info and pass strokes do on their own, every
 * stroke does in the dark colour scheme, and the light caution and failure strokes hand over to `colorOver`.
 *
 * The asymmetry is forced by the colour space rather than chosen. Red reaches full saturation at a middling
 * lightness, so the failure colour is dark enough to read on white and loud at once; yellow reaches full saturation
 * only when it is very light, so a yellow dark enough to stroke on white has already spent its chroma. As a fill it
 * carries chroma 0.158 against the failure's 0.218, so the two shout equally, and it takes one value in both colour
 * schemes, as a {@link palettes series slot} does, since a warning yellow that dimmed on a dark page would stop being one.
 *
 * **Text** — `colorLabel` names a field and `colorPlaceholder` stands in for a value not yet given. `colorEnabled`
 * marks a control that answers and `colorDisabled` one that does not. The enabled colour stays apart from the link
 * colours and from the surrounding text, so a control that answers is never mistaken for a link or for plain copy.
 *
 * Every text role holds AA contrast against the page and the striped row in both colour schemes, and `colorLabel`
 * holds it on the pressed fill of a control too, the deepest surface a label is set on. The exceptions are
 * `colorDisabled` and `colorPlaceholder`, which share one value with {@link borders `borderColor`} and carry no
 * meaning on their own. Both stand for text the reader has not supplied, and a disabled control is told from an
 * empty one by its background, never by the weight of its text, so neither colour is ever read as a text role.
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
 * **Filled caution** — `colorOver` is what text takes over a fill painted in `colorWarn`, the one step that is always
 * a fill. It resolves to whichever page anchor is the dark one, so it stays dark in both colour schemes where
 * `color` and `backgroundColor` each swap sides. It is not the text over any other step: a fill painted in
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
 * The chart and map colours stand outside this: the {@link palettes heat scale, the series slots and the area
 * classes} keep values of their own, so a rebrand leaves what they code unchanged.
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

	colorInfo: "--skin--color-info",
	colorPass: "--skin--color-pass",
	colorWarn: "--skin--color-warn",
	colorFail: "--skin--color-fail",

	colorInfoStroke: "--skin--color-info-stroke",
	colorPassStroke: "--skin--color-pass-stroke",
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

	backgroundColorInfo: "--skin--background-color-info",
	backgroundColorPass: "--skin--background-color-pass",
	backgroundColorWarn: "--skin--background-color-warn",
	backgroundColorFail: "--skin--background-color-fail"

} as const;
