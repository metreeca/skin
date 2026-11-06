# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0](https://github.com/metreeca/skin/compare/v0.2.0...HEAD)

### Added

- `borderColorField` - the edge of a field, held to the 3:1 a control boundary takes on the page, the striped row and
  the edit background, which `markup/forms.css` draws around inputs, text areas and selects
- `colorStrongOver` - text colour for a fill painted in the strong accent, taking white or black, whichever contrasts
  more with the fill, so a label on it holds AA contrast whatever accent an app supplies, shipped orange included
- `colorFlag`, `colorFlagStroke`, `backgroundColorFlag` - a fifth step of the meaning scale, between `pass` and
  `warn`, singling a thing out for attention although nothing has gone wrong; a violet holding AA on the page, the
  stripe and its own tint in both schemes, which the important Markdown alert now takes in place of the note blue

### Fixed

- `colorPlaceholder` - shared the disabled colour, at 1.76:1 on the edit background, though WCAG holds placeholder
  text to AA; now a mix of its own at 4.7:1 or more on the page, the striped row and the edit background, still
  well short of an entered value, which takes the full text anchor, so the two are never mistaken for each other
- `colorLabel` - held AA contrast on the page and the striped row only, dropping to 4.0:1 on a pressed control and
  on the overlay surface in the dark scheme; now pinned by the tightest surface it is set on, the pressed tint,
  holding 5.5:1 on it in the light scheme and 4.6:1 in the dark one, with the suite holding it on every fill and tint
- `backgroundColorPressed` - the share drops from 14% to 12%, so a brand two tenths lighter than the shipped orange
  still holds AA contrast on its own pressed fill, at 4.6:1 for a green brand and 4.65:1 for the shipped one
- `backgroundColorHover`, `backgroundColorSelected`, `backgroundColorPressed` - on the dark page the state fills
  were the light shares of the accent, which read as three greys a hair off the page, so a selected item in a rail
  was barely told from its neighbours; the dark fills now take 10%, 13% and 16% of the accent at twice the chroma
  the mix leaves, boosted as the status tints are, the pressed fill rising to where the label holds AA on it, 4.58:1
- `colorFocus` - the ring fell to 2.9:1 around a pressed control in both schemes; now holds 3:1 on every surface it
  is drawn against, the pressed tint being the tightest at 3.3:1 in either scheme and the page the widest at 4:1
- `button:active` - painted its text in the focus grey, a 3:1 mark token, rather than in `colorPressed`
- `borderColor` - now reads `colorDisabled`, which it coincided with by two separate derivations in two modules, so
  an app retuning either one carries the other along rather than leaving it behind at the old value
- `colorHover`, `colorPressed` - darkened the strong accent in both schemes, so on a dark page a control under the
  pointer sank towards the ground, from 7.9:1 to 5.4:1, and then leapt past its rest colour when pressed; now the
  accent carried a fifth and two fifths towards the text anchor, away from the page in either scheme, holding
  9.3:1 and 10.8:1 on the dark page and 8.6:1 and 13.1:1 on the light one, and more on the tints a control fills
- `colorLinkHover` - lightened the dark link to within 1.23:1 of the body text, so the hover cue read as a fade;
  now steps the link away from the page by the same amount in either scheme and takes more chroma, as the light
  hover already did, which keeps it at 1.45:1 from the text and 14.3 ΔE from it rather than 9
- `colorDisabled` - the dark share moves from 25% to 28%, the same eight-point dark offset `colorLabel` is pinned
  by; it holds 1.94:1 on the edit background, and carries `borderColor` along with it, since the line reads it
- `colorWarnStroke`, `colorHover`, `colorPressed`, `colorLinkHover`, `colorEnabled` - the derivations left the sRGB
  gamut, so each browser painted its own colour: Chrome and Firefox clipped the channels, which turned the light
  caution stroke into a brand orange at ΔE 5 from the strong accent and the dark pressed control into the caution
  amber at ΔE 1.9, while Safari reduced the chroma instead; every derivation now stays inside the gamut, as a mix
  towards the text anchor or with its chroma capped where the gamut ends, so every browser paints the one colour the
  figures in the token comments describe, and the suite can compute those figures in Node without a browser
- `colorNote`, `colorPass`, `colorFlag`, `colorWarn`, `colorFail` - the dark anchors were retouched one at a time
  as the light ones were retuned, so the note was a cyan where the light one is a blue, the flag a value never held
  to a budget, at 4.4:1 on the page, and the caution a yellow fill with a stroke of its own; each is now set as its
  light partner is, in the same hue, at the most chroma the gamut holds where it reaches AA on the tightest dark
  surface, the overlay, which lands every one at 5.4:1 on the page and above AA on the stripe and its own tint
- `colorEnabled` - sat ΔE 3.3 from `colorLink` in the dark scheme and 4.0 from `colorLinkHover` in the light one,
  so an enabled control read as a link; now steps towards the page in either scheme, ΔE 6.1 and 10.4 from a link at
  rest and 13 and 18 from one under the pointer, holding 6.0:1 and 5.9:1 on the page and 5.5:1 on the stripe
- `backgroundColorRaised`, `backgroundColorOverlay` - on the dark page the raised surface landed on the same
  `#181818` as the table stripe, so a raised card on a striped row had no edge but its shadow; both steps now lift
  further, to L 0.23 and L 0.26, where the label and the focus ring still hold 4.66:1 and 3.33:1 on the overlay
- `backgroundColorNote`, `backgroundColorPass`, `backgroundColorWarn`, `backgroundColorFail` - on the dark page the
  status tints were a plain mix that left a quarter of each anchor's chroma, so the caution read as brown and the
  four notices as four greys; a dark tint now keeps two and a half times that chroma, inside the gamut, so each
  notice reads as its hue and the label and the focus ring still hold their budgets on every tint in both schemes
- `colorWarnStroke`, `colorFailStroke` - on the light page the caution title was an olive and the failure title a
  maroon, because every stroke was held to AA on a tint deepened under the pointer, a fill no token names; a stroke
  is now held to the surfaces it is set on alone, and a widget setting a label over any other fill holds it to AA
  there itself, falling back on the page text wherever the stroke falls short of AA on that fill

### Changed

- `Flag` - the type naming the viewport tokens is renamed `Breakpoint`, so `flag` names the meaning scale step alone
- `colorInfo`, `colorInfoStroke`, `backgroundColorInfo` - renamed `colorNote`, `colorNoteStroke` and
  `backgroundColorNote`, with the custom properties `--skin--color-note`, `--skin--color-note-stroke` and
  `--skin--background-color-note`, so the step pairs with `pass`, `flag`, `warn` and `fail`; the old names are gone
- `colorWarn` - the dark caution moves from the mustard `#E6A92F` to the gold `#BB7E00`, in the hue of the light
  gold and at the lightness where it holds AA on the overlay, so one value serves as text, mark and fill on the dark
  page as on the light one, and a caution badge sets its message in `colorOver` at 5.48:1
- `colorOver` - documented as the text over the caution fill alone, which it was derived for, rather than over any
  filled step: black over the failure red holds 3.58:1 in the light scheme, short of AA, so a fill painted in
  `colorFail` flips as `colorStrongOver` does, white at 5.86:1 in the light scheme and black at 5.45:1 in the dark
- `colorNote`, `colorPass`, `colorFail` - the light anchors move to a blue `#0066D8`, a green `#0B7C00` and a crimson
  `#C3222A`, the first two as saturated as the gamut allows where they hold AA on their own tint, at 5.4:1 on the
  page, and the crimson a shade deeper, at 5.8:1, so it does not glare; the note and pass colours were a cyan
  and a green held to 3:1 as marks, and are now text grade as well, so each paints text or a mark on the page
- `colorNote`, `colorPass`, `colorFlag`, `colorFail` - the dark anchors move to a blue `#2F88FF`, a green `#11A000`,
  a violet `#9D6EFF` and a red `#F74B4A`, in the hues of the light ones, each lifted to where it holds AA on the
  overlay, the tightest dark surface, at 5.4:1 on the page; the note, pass and flag colours were held to 3:1 as
  marks on the dark page, and are now text grade in both schemes, so each paints text or a mark in either
- `colorNoteStroke`, `colorPassStroke`, `colorFlagStroke`, `colorWarnStroke`, `colorFailStroke` - each stroke is now
  its anchor in both schemes, rather than the anchor mixed towards the page text, which held 6.7:1 to 7.2:1 on the
  light page and 6.5:1 to 13:1 on the dark one and dulled the hue for contrast no reader needs
- Markdown alerts - sit on the page behind a bar in the stroke of their step, with the title and glyph in the same
  colour and the body in the page text, rather than on a tint; a note takes the note step
- `backgroundColorStripe`, `backgroundColorWarn` - in the light scheme the striped row takes 2.5% of the text anchor
  rather than 4%, which leaves the stripe fainter and the caution stroke holding AA on it, and the caution tint 12% of
  its anchor rather than 20%, the share every other tint takes, so the five notices read as one family
- `colorWarn`, `colorWarnStroke` - the light caution is one dark gold `#9A6700` for both the anchor and the stroke,
  in place of a yellow fill beside a separate burnt-orange stroke, which looked brown; it holds AA on the page and
  the stripe, at 4.87:1 and 4.53:1, and falls to 4.16:1 on its tint, where caution text is not set; text over a
  caution fill takes the page background, white over the light gold and dark over the dark one

## [0.2.0](https://github.com/metreeca/skin/compare/v0.1.0...v0.2.0) - 2026-11-05

### Added

- `@metreeca/skin` - the design system moved over from `@metreeca/tile`: the `skin` token map naming every
  `--skin--*` custom property, covering typography, spacings, scalings, colours, borders, elevations, palettes,
  layers, motions, opacities, viewports and visuals, so components and apps address every token by name
- `@metreeca/skin/index.css` - the stylesheet stating the token values in both colour schemes and styling plain
  document markup, Markdown alerts and highlight.js code inside the `skin` cascade layer, so that an app or component
  overrides any of it with an ordinary unlayered rule, needing no `!important` and no control over load order
- Metreeca brand defaults: slate and orange accent anchors and the bundled variable Roboto faces, which an app
  replaces with its own brand by redefining the anchor and face tokens alone, with no change to a component
- Specimen page, built with the docs, showing every token live in both colour schemes with contrast readouts and a
  brand tuner previewing, in both schemes at once, the `:root` override an app would state for its own accents

## [0.1.0](https://github.com/metreeca/skin/releases/tag/v0.1.0) - 2026-11-05

Initial release, claiming the package name ahead of the design system moving over from `@metreeca/tile`.

- `@metreeca/skin` - root module, empty pending the design system sources
