# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0](https://github.com/metreeca/skin/compare/v0.2.0...HEAD)

### Added

- `colorStrongOver` - text colour for a fill painted in the strong accent, taking white or black, whichever contrasts
  more with the fill, so a label on it holds AA contrast whatever accent an app supplies, shipped orange included

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
