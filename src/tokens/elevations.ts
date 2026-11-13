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
 * Elevation tokens.
 *
 * Names what a thing lifted off the page is painted on: the surface it carries its own background in, the shadow
 * setting it apart from what it covers, the blanket dimming the page behind a thing demanding an answer, and the glass
 * gathering surfaces that float over the page into one group without a shadow of their own.
 *
 * @remarks
 *
 * **Pairing** — a surface and its shadow are taken together, `backgroundColorRaised` with `boxShadowRaised` and
 * `backgroundColorOverlay` with `boxShadowOverlay`. A surface without its shadow reads as a flat patch of a slightly
 * different colour, and a shadow without its surface lets the page show through wherever the reset hands an element
 * `background-color: inherit`.
 *
 * **Steps** — `backgroundColorRaised` lifts a thing that stays in the flow, a card or a sticky header, and
 * `backgroundColorOverlay` lifts one that leaves it, a menu, a popover or a dialog. `backgroundColorSunken` goes the
 * other way, for a well a thing is dropped into.
 *
 * **Lifting** — `boxShadow` is the shadow of the one element {@link index.css css} assigns it to, set from a step.
 *
 * **White pages** — the surfaces are derived by lightening the page, so on a light scheme whose page is already white
 * they resolve to the page colour itself and the shadow carries the whole separation, while on a dark scheme they
 * lighten as expected. This is what lets one derivation serve both schemes; a design needing a visible card on a light
 * page overrides the page anchor to an off-white rather than the surface.
 *
 * **Blankets** — `backgroundColorBlanket` is a translucent value, so it dims whatever it covers rather than replacing
 * it. It pairs with the {@link layers `zIndexBlanket`} slot, which decides what it covers.
 *
 * **Glass** — `backgroundColorGlass` is a ground a shallow step darker than the page, gathering surfaces that float
 * over the page into one group without a shadow to set them apart, such as a stack of transient notices. It is close
 * to opaque, so what it covers shows through only faintly. It carries no text of its own: the surfaces set on it do,
 * painted with `backgroundColorOverlay`, which stands out from it in either scheme, so their text keeps its contrast
 * whatever the glass lets through. The glass takes `backdropFilterGlass` as its backdrop filter, a faint blur that
 * keeps what shows through from competing with the surfaces gathered on the glass.
 *
 * @module elevations
 */


/**
 * The custom property behind every elevation token.
 *
 * Narrowed to literals, so the design system contract can name the tokens and the custom properties they resolve to.
 */
export const elevations = {

	backgroundColorRaised: "--skin--background-color-raised",
	backgroundColorOverlay: "--skin--background-color-overlay",
	backgroundColorSunken: "--skin--background-color-sunken",
	backgroundColorBlanket: "--skin--background-color-blanket",
	backgroundColorGlass: "--skin--background-color-glass",
	backdropFilterGlass: "--skin--backdrop-filter-glass",

	boxShadowRaised: "--skin--box-shadow-raised",
	boxShadowOverlay: "--skin--box-shadow-overlay",
	boxShadow: "--skin--box-shadow"

} as const;
