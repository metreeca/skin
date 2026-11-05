# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0](https://github.com/metreeca/skin/compare/v0.2.0...HEAD)

### Added

- `colorStrongOver` - text colour for a fill painted in the strong accent, taking white or black, whichever contrasts
  more with the fill, so a label on it holds AA contrast whatever accent an app supplies, shipped orange included

### Fixed

- `colorLabel` - held AA contrast on the page and the striped row only, dropping to 4.0:1 on a pressed control and
  on the overlay surface in the dark scheme; now pinned by the tightest surface it is set on, holding 5.5:1 on the
  light pressed tint and 4.7:1 on the dark overlay, with the suite holding it there on every fill and tint
- `backgroundColorPressed` - the share drops from 14% to 12%, so a brand two tenths lighter than the shipped orange
  still holds AA contrast on its own pressed fill, at 4.6:1 for a green brand and 4.65:1 for the shipped one
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
- `colorDisabled` - the dark share moves from 25% to 28%, so that every mix of the text anchor towards the page
  takes the same eight-point dark offset `colorLabel` is pinned by; it holds 1.94:1 on the edit background, and
  carries `borderColor` and `colorPlaceholder` along with it, since both read it
- `colorWarnStroke`, `colorHover`, `colorPressed`, `colorLinkHover`, `colorEnabled` - the derivations left the sRGB
  gamut, so each browser painted its own colour: Chrome and Firefox clipped the channels, which turned the light
  caution stroke into a brand orange at ΔE 5 from the strong accent and the dark pressed control into the caution
  amber at ΔE 1.9, while Safari reduced the chroma instead; every derivation now stays inside the gamut, as a mix
  towards the text anchor or with its chroma capped where the gamut ends, so every browser paints the one colour the
  figures in the token comments describe, and the suite can compute those figures in Node without a browser
- `colorInfo`, `colorPass` - the dark anchors held 9.6:1 and 9.1:1 on the page, text grade twice over where the
  light ones are marks at 3.6:1, so a notice read about twice as loud on a dark page and the stroke roles derived
  from them lightened and shed chroma for no contrast they needed; now pinned by the stroke table, where the strokes
  land within a tenth of the light figures in every column, at 7.1:1 on the page and 4.7:1 on the deepened tint
- `colorEnabled` - sat ΔE 3.3 from `colorLink` in the dark scheme and 4.0 from `colorLinkHover` in the light one,
  so an enabled control read as a link; now steps towards the page in either scheme, ΔE 6.1 and 10.4 from a link at
  rest and 13 and 18 from one under the pointer, holding 6.0:1 and 5.9:1 on the page and 5.3:1 on the stripe
- `backgroundColorRaised`, `backgroundColorOverlay` - on the dark page the raised surface landed on the same
  `#181818` as the table stripe, so a raised card on a striped row had no edge but its shadow; both steps now lift
  further, to L 0.23 and L 0.26, where the label and the focus ring still hold 4.66:1 and 3.33:1 on the overlay
- `backgroundColorInfo`, `backgroundColorPass`, `backgroundColorWarn`, `backgroundColorFail`, `colorWarnStroke` - on
  the dark page the status tints were a plain mix that left a quarter of each anchor's chroma, so the caution read as
  brown and the four notices as four greys; a dark tint now keeps two and a half times that chroma, which the gamut
  holds at its lightness, and the dark caution stroke half again its own, so each notice reads as the hue it stands
  for, with the label and the focus ring still holding their budgets on every tint in both schemes

- `colorWarnStroke`, `colorFailStroke` - on the light page the caution title was an olive and the failure title a
  maroon, because every stroke was held to AA on its tint deepened by a further 24% of the anchor; a stroke is now
  held to the page, the stripe and its own tint, and a label over a deepened fill takes whichever of the stroke and
  `colorOver` holds there, so the light caution stroke is an amber at 5.3:1 and the light failure stroke a red a
  shade under the anchor at 6.7:1, each reading as the meaning it carries rather than as a shade of brown
- GitHub alerts - sit on the tint of their step behind the stroke bar, so a warning reads as one by its yellow fill
  rather than by its title alone; a note takes the first step of the subtle scale

### Changed

- `colorWarn` - the caution anchor moves from the mustard `#E6A92F` to the yellow `#F2C230`, a dozen degrees further
  from orange: the mustard turned brown as soon as a tint or a dark stroke dimmed it, and under simulated protanopia
  sat ΔE 10 from the pass green, the tightest pair in the scale, where the yellow holds 17 and keeps 30 from the
  failure red under deuteranopia; the caution stroke takes 60% of the anchor rather than 64%, which is where the
  lighter anchor holds AA on the deepened tint, and the caution notice reads as a yellow one on the dark page
- `colorOver` - documented as the text over the caution fill alone, which it was derived for, rather than over any
  filled step: black over the failure red holds 3.57:1 in the light scheme, short of AA, so a fill painted in
  `colorFail` flips as `colorStrongOver` does, white at 5.89:1 in the light scheme and black at 6.60:1 in the dark

## [0.2.0](https://github.com/metreeca/skin/compare/v0.1.0...v0.2.0) - 2026-11-05

### Added

- `@metreeca/skin` - the design system moved over from `@metreeca/tile`: the `skin` token map naming every
  `--skin--*` custom property, covering typography, spacings, scalings, colours, borders, elevations, palettes,
  layers, motions, opacities, viewports and visuals, so components and apps address every token by name
- `@metreeca/skin/index.css` - the stylesheet stating the token values in both colour schemes and styling plain
  document markup, GitHub alerts and highlight.js code inside the `skin` cascade layer, so that an app or component
  overrides any of it with an ordinary unlayered rule, needing no `!important` and no control over load order
- Metreeca brand defaults: slate and orange accent anchors and the bundled variable Roboto faces, which an app
  replaces with its own brand by redefining the anchor and face tokens alone, with no change to a component
- Specimen page, built with the docs, showing every token live in both colour schemes with contrast readouts and a
  brand tuner previewing, in both schemes at once, the `:root` override an app would state for its own accents

## [0.1.0](https://github.com/metreeca/skin/releases/tag/v0.1.0) - 2026-11-05

Initial release, claiming the package name ahead of the design system moving over from `@metreeca/tile`.

- `@metreeca/skin` - root module, empty pending the design system sources
