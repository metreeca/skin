---
title: Project Guidelines
description: Development guidelines and conventions for the @metreeca/skin package.
---

# References

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) - the contrast budget every colour is held to:
  [1.4.3 Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum) for text,
  [1.4.11 Non-text Contrast](https://www.w3.org/TR/WCAG22/#non-text-contrast) for marks, control boundaries and
  focus rings, [1.4.1 Use of Color](https://www.w3.org/TR/WCAG22/#use-of-color) for meaning carried in colour
- [CSS Cascade 5](https://drafts.csswg.org/css-cascade-5/) - cascade layers and what an unlayered rule outranks
- [CSS Properties and Values API](https://drafts.csswg.org/css-properties-values-api/) - `@property` registrations
- [CSS Color 4](https://drafts.csswg.org/css-color-4/) - OKLab, OKLCh and the sRGB gamut
- [CSS Color 5](https://drafts.csswg.org/css-color-5/) - `color-mix()`, relative colour syntax and `light-dark()`
- [CSS Conditional 5](https://drafts.csswg.org/css-conditional-5/) - container style queries the viewport switches
  are read through
- [Tableau 10](https://www.tableau.com/blog/colors-upgrade-tableau-10-56782) and
  [ColorBrewer Paired](https://colorbrewer2.org/#type=qualitative&scheme=Paired&n=4) - the sources of the series slots
  and the area classes

> [!CAUTION]
>
> - **ONLY** modify code when explicitly requested or clearly required.
> - **NEVER** make unsolicited changes or revert **unrelated** user edits.
> - **ALWAYS** monitor IDE diagnostics when working on a file

> [!CAUTION]
> Activating and following skill guidance is **MANDATORY** for every task. Before starting any work, identify and
> activate all relevant skills. Skill instructions are binding and override default behaviours. When in doubt about
> whether skill guidance is current, relevant skills MUST be reloaded.

> [!CAUTION]
>
> - `css-developer` carries the conventions every stylesheet here is written to, and **MUST** be activated before one
>   is touched: `css-developer:tokens` for the token contract and lifecycle, `css-developer:meaning`,
>   `css-developer:palettes` and `css-developer:viewports` for the vocabularies consumers are held to; this file
>   carries only what is specific to the package: layout, suite, anchors, measured figures and the rationale behind them
> - Revising a token means revising it in **every** place listed under [Token Contract](#token-contract)
> - The suite checks token **names** for every family, and **values** for the colours alone: `colors.test.ts` paints
>   every colour role in both schemes under the shipped brand and holds it to its contrast budget and to the gamut,
>   so a wrong size reaches production unnoticed where a wrong colour fails the build
> - Retuning an anchor means rechecking the contrast ratios under [Colours](#colours)

# Overview

Metreeca Skin is the design system of the Metreeca stack: a typed token contract and the stylesheet that gives it
values, so that interfaces built on it share one look and adopt a brand book by redefining tokens alone.

The package is a token layer and the base rules applying it to plain document markup. It carries no components and
no behaviour, and nothing in it imports a rendering framework.

# NPM Scripts

- **`npm run clean`** - Remove dependencies and build artefacts
- **`npm run prime`** - Install dependencies from the lockfile
- **`npm run setup`** - Install dependencies and link sibling `@metreeca/*` repositories
- **`npm run build`** - Compile sources and generate docs
- **`npm run check`** - Run the test suite
- **`npm run proof`** - Serve live docs

> [!CAUTION]
> **`prime` and `setup` are not interchangeable.** Run `prime` when finalising a public release: `@metreeca/*` imports
> resolve to the published releases recorded in the lockfile. Run `setup` for local development against unpublished
> sibling branches: imports resolve to the working copies in the neighbouring repositories.

# Module Layout

`src/index.css` imports the modules and is the entry an app includes, unless the app includes a [preset](#presets)
built on it instead. The token modules come first, the anchors ahead of what derives from them, then the base rules by
increasing structural complexity, so a composite lands after the plain elements it is built from and takes precedence
where the two match with equal specificity. It carries the page defaults itself: `color-scheme`, the page colours and
the page typography, its wrapping included, every value it reads a token it does not state. Beside them it carries
only the rules for the attributes that apply to any element: `data-scheme`, pinning a colour scheme, and
`data-offscreen`, keeping text from sight while leaving it to assistive technology.

The package ships the **Metreeca colours as its defaults**: the accent anchors carry its slate and orange. The font
family tokens default to the platform faces, so `index.css` loads **no** face and an app including it bundles none.
Bundled faces belong to a preset, never to `index.css`: neither CSS nor a bundler can make a face import conditional on
an override, which is a runtime cascade fact, so a face `index.css` imported would ship in every app's build.

The modules fall into three groups, one folder each. Between `tokens/` and `markup/` the split holds in both
directions: nothing in `markup/` assigns a token, and every `var()` in `tokens/` is a token deriving from another.
`presets/` sits outside both, as an entry built on `index.css` rather than a module it imports.

`src/tokens/` — a family per pair, `<family>.ts` naming the tokens and `<family>.css` stating their values, and the
only place either side of the family is revised:

- `typography` — the faces, defaulting to the platform faces, the sizes, the weights, the
  line heights of text and display type, the heading and small capitals tracking and casing, and the prose measure
- `spacings` — the ladder a thing is set apart from its neighbour on
- `scalings` — the ladder a thing measured against the text is sized on
- `colors` — the nine colour anchors, each registered as a `light-dark()` pair where it varies by scheme, and the
  text, status, state and surface roles derived from them
- `borders` — the line, the radii, the focus ring, the invalid outline and the vector stroke widths, plain and strong
- `elevations` — the surfaces a thing lifted off the page is painted on, the shadows pairing with them, the
  translucent glass ground gathering floating surfaces without a shadow and the blur taken behind it, and the blanket
  dimming what a modal covers
- `palettes` — the four ten-step colour scales, the nine series slots, the four area classes and the eighteen
  editor colours, the three accent-derived scales following the anchors and the heat scale, the slots, the classes
  and the editor colours stated as literals
- `layers` — the stacking order two things overlapping the page are settled by
- `motions` — the durations a change takes and the curves it accelerates on, the durations collapsing under
  `prefers-reduced-motion`, and the period a busy mark turns at, which keeps turning under it
- `opacities` — how far a thing present but not available is faded
- `viewports` — which breakpoints the viewport has passed, one switch each, `off` registered and `on` set from its width
  upwards

A breakpoint cannot be a width token, since CSS accepts no custom property in a media feature, so `viewports.css`
carries the *answer* instead of the question: it is the **only** place in the package stating a width, in CSS or in
TypeScript, and the one measure an app cannot retune through a custom property. How rules and code read the switches,
and the four widths themselves, are in `css-developer:viewports`; a TypeScript copy of the widths existed briefly and
earned nothing but a test policing its own duplicate.

The `*.core.ts` modules hold what the design system surface stands on without offering it, so `typedoc.json` leaves
them out of the reference.

`src/markup/` — base rules for plain document markup, carrying **no** `.ts` side and declaring no token of their own:

- `reset.css`, then `headings.css`, `inlines.css`, `blocks.css`, `highlights.css`, `lists.css`, `tables.css`,
  `forms.css`, `alerts.css` — one group of elements each
- `highlights.css` and `alerts.css` are the two modules selecting classes, and only classes a published convention
  fixes rather than names of the design system: the `hljs-*` tokens of highlight.js and the `markdown-alert*` blocks
  Markdown renders alerts as

`src/presets/` — one entry per preset, each the whole design system set in faces of its own:

- `inter.css` — the variable Inter face for text, Inter Tight for headings and Geist Mono for code; Inter's optical
  size axis was tried for headings and dropped, since at the heading sizes, 21px at most, it narrows them by under 3%
- `roboto.css` — the variable Roboto, Roboto Condensed and Roboto Mono faces of the Metreeca brand

A preset's mono face is scaled through the `size-adjust` descriptor of its `@font-face` rules, never through a size
token: a size only takes effect where a rule reads it, so a component setting the mono family alone would draw it at
full size, while a face scaled on itself matches the text wherever it is set.

The share matches the **lowercase** of the two faces, then takes a **`0.93` nudge** offsetting the wider mono advance:
the text x-height over the mono x-height, from the face files themselves, times `0.93`, rounded to the nearest whole
percent:

| Pair                    | Width ratio | x-heights     | x-height match | Share |
|-------------------------|-------------|---------------|----------------|-------|
| Roboto with Roboto Mono | 1.355       | 0.528 / 0.528 | `100%`         | `93%` |
| Inter with Geist Mono   | 1.266       | 0.546 / 0.530 | `103%`         | `96%` |

> [!WARNING]
>
> The nudge was settled by eye, comparing shares side by side in running text with bold mono labels, **NOT** derived.
> Matching x-heights alone left mono labels looking large, since the advance runs 27% to 36% wider. Matching glyph area
> instead, the earlier rule at `86%` and `90%`, cut the x-height by 14% and left mono labels looking small. Retuning
> the nudge rechecks both presets in the browser, and a new preset measures its x-heights with `fontTools` reading the
> `*-latin-wght-normal.woff2` file of each face.

# Presets

A preset is an alternative entry: an app includes it **in place of** `index.css`, never beside it. It overrides tokens
the way an app would, so it states values rather than defining tokens, and stays outside the
[Token Contract](#token-contract). Every preset follows the same shape:

```css
@import "../index.css";

@import "@fontsource-variable/roboto";

@layer skin {
    :root {
        --skin--font-family: "Roboto Variable", system-ui, sans-serif;
    }
}
```

- it imports `../index.css` first, so its assignments land after the token modules in the same layer and override
  their defaults, colours included
- it states tokens **only** on `:root` inside `@layer skin`, so an unlayered app rule still overrides the preset
- it restates only tokens the design system declares, and **NEVER** registers one: a second `@property` for a name
  would replace the registration globally
- it loads every face its font tokens name, from `@fontsource-variable/*` and never from a remote URL; the face
  imports and its own `@font-face` rules stay unlayered, since a layer has no effect on `@font-face`
- it takes only faces published as a variable `@fontsource-variable/*` package under the SIL Open Font License 1.1 or
  a licence as permissive: the package stays Apache-2.0 and depends on the faces without redistributing them, and
  an app embedding them in its pages is what the OFL allows, provided no one sells the face files on their own
- a preset setting a mono face **ALWAYS** declares it itself, under a `Skin <Face>` family, restating every
  `@font-face` rule its package's `index.css` publishes with the `url()` pointing at the package file and
  `size-adjust` set to the share measured for the pair; it does **NOT** import that package, whose faces would load
  unscaled under their own family, and the suite fails once the restated faces drift from those the package publishes
- `package.json` exports it as `./presets/<name>.css`, with the `@metreeca/source` condition, one entry per preset and
  never a wildcard

Vite carries into a bundle only the faces reached from the stylesheet an app imports, so the presets it does not import
are left out of the build: an app on `index.css` bundles no face, and an app on a preset bundles that preset's faces
alone. A throwaway build confirmed it, at 0 `.woff2` files under `index.css` against 22 under `presets/roboto.css`. An
app overriding the faces of a preset still bundles them, so it includes `index.css` instead.

The face packages stay in `dependencies`, so every consumer installs the faces of every preset. That cost is
**immaterial** and is **NOT** a reason to move them to optional peers: installing a package puts nothing in a build.

`src/index.test.ts` holds every file under `presets/` to the rules above, so a new preset is checked once it is added
there. It does **not** hold a preset's colours to their budget: `colors.test.ts` evaluates the default colours alone,
so a preset restating a colour anchor rechecks its figures as an app supplying its own brand does.

# Layering

The whole design system sits in one cascade layer, `skin`, as `css-developer:tokens` §The Layer sets out. Each module
is imported into it, and the page defaults in `index.css` are wrapped in a block of their own:

```css
@import "./tokens/typography.css" layer(skin);
@import "./markup/reset.css" layer(skin);

@layer skin {
    :root { /* … */ }
}
```

The guarantee bought is that **an unlayered rule beats every layered one**, so an app states its brand in an inline
`<style>` and still wins over the bundle Vite injects afterwards. A rule added to **any** module here **ALWAYS** goes
inside the layer; the `@fontsource-variable/*` imports of a preset stay outside, carrying only `@font-face`.

> [!WARNING]
>
> Layering removes specificity from the comparison **between** stylesheets: a design system rule can no longer outrank
> a component rule, however specific it is. Nothing relies on that today: no module selects `label`, and `lists.css`
> reaches `nav` only for the lists, links and disclosures it holds, which a component styling its own navigation
> overrides by staying unlayered. Adding a high-specificity base rule for an element a component also styles is the case to watch.

# Token Contract

A token lives in two places, both inside its family pair, revised together:

- `src/tokens/<family>.ts` — the entry naming it, which is what components and apps address
- `src/tokens/<family>.css` — its `@property` registration, and its `:root` assignment where it needs one

**Its value is stated exactly once**, in the place `css-developer:tokens` §One Value, One Place assigns from its shape:
a literal in the registration, a derivation on `:root`, a scheme-varying value as one `light-dark()` pair registered
`syntax: "*"`. `index.css` settles the `color-scheme` from the platform on `:root` and from `data-scheme` on any
element, so a pinned root and a pinned subtree each take their own side.

Native controls, scrollbars and the caret answer to `color-scheme` as the tokens do, and `index.css` restates the page
colours on any `[data-scheme]` element, which would otherwise inherit them as the root resolved them.

`src/index.ts` gathers the families into `skin` and adds nothing of its own; a new family is added to the spread and
to the imports in `src/index.css`.

`src/index.test.ts` fails when a declared name is defined in neither place or in both, when a defined name is not
declared, when a rule reads a token no one declares, when a registration is missing or duplicated, when a token
is stated per colour scheme in a query or attribute rule, and when a derived token carries a default it cannot
resolve. It says nothing about the value behind the name. The presets stay outside these checks and answer to their own,
listed under [Presets](#presets).

`src/tokens/colors.test.ts` is where a colour value is held to its budget. It evaluates every colour token as the
page would, in both schemes and under the shipped brand, with the OKLab mixing and relative colour maths the
browsers share, and fails when a role leaves the sRGB gamut, when a text role or a stroke drops below 4.5:1 on a
surface it is set on, or when a mark or the focus ring drops below 3:1. It runs in Node with no browser, which is
sound only because nothing leaves the gamut: the in-gamut check is what makes the other figures the figures every
browser paints. An app supplying its own brand rechecks its own figures: the suite holds no derivation to
hypothetical brands. A figure in a token comment is documentation of what the test asserts, never the guard.

# Token Lifecycle

A published token name is retired in two releases, deprecated then removed in the next minor line, as
`css-developer:tokens` §Lifecycle sets out. The suite is **NOT** a lifecycle check: only the changelog records a
deprecation.

> [!WARNING]
>
> Because a literal default now lives only in its registration, a browser that ignores `@property` leaves every one of
> them unset rather than falling back on a `:root` copy. That is not a new floor: `oklch(from …)`, which the colour
> roles are derived with, lands in the same browsers and versions, so nothing here was reachable without `@property`
> support to begin with.

# Colours

Every colour is held to `css-developer:colours`: the WCAG 2.2 minimums on the surfaces it is actually painted on and
the sRGB gamut, **nothing else**. The figures in the comments and the suite's checks are computed in Node from the
same maths as the browsers, and describe what ships only because nothing leaves the gamut.

Nine anchors carry literals in `colors.css`, each stating a value per colour scheme, as the `light-dark()` pair the
contract above sets out:

- `--skin--color` and `--skin--background-color`
- `--skin--color-subtle`, which an interface carries at rest, and `--skin--color-strong`, which marks a thing out;
  both ship the Metreeca brand, a slate and an orange, and an app supplies its own by overriding them; the light
  orange is darkened from the brand book's `#D60`, at 3.51:1 on white, to `#B74300`, which holds AA on its own tints
- `--skin--color-note`, `--skin--color-pass`, `--skin--color-flag`, `--skin--color-warn` and `--skin--color-fail`,
  the five steps of the meaning scale below

`--skin--color-focus` carries a literal per scheme alongside them without being an anchor: the focus mark says where
the keyboard stands, which reads the same whatever an app brands with, so it is **NEVER** derived from an accent. It
is stated as a `light-dark()` pair alongside them and held to the ring budget of 3:1 against the page **and** against
the stripe.

## The meaning scale

The five steps, the `level`, `mode` and `status` attributes, the `look` axis and the rules a widget follows are in
`css-developer:meaning`, which `note`, `pass`, `flag`, `warn` and `fail` anchor. What stays here is what the anchors
were tuned against.

**The dark hover and pressed steps are half the light ones.** The states are the strong accent carried towards the
text anchor, and above a bright saturated orange there is little room: the steps are ΔE 5.5 each where the light ones
are 11. A control fills its box with the state tints as well, so the state never rests on the text colour. Stepping
the lightness instead bought nothing: it left the gamut, and the clipped result was a caution amber.

> [!WARNING]
>
> `--skin--color-warn` is a dark gold on the light page and a gold on the dark one. A caution paints a filled badge
> with it and sets its message in `--skin--color-over`, at 4.87:1 and 5.48:1.
>
> `--skin--color-note`, `--skin--color-pass`, `--skin--color-flag` and `--skin--color-fail` hold 4.5:1 on the page,
> the stripe and their own tint in **both** schemes, so each serves as text or mark; `markup/forms.css` paints text
> with the failure. `--skin--color-warn` holds it on the light page and the stripe, at 4.87:1 and 4.53:1, and is
> never set on its tint, where it falls to 4.16:1 there: any caution light enough to stay a gold rather than a brown
> does. The dark gold holds on its tint, at 4.88:1, but the rule is the light one's, since a consumer writes one rule.

Every stroke role is its anchor, set at the most chroma the gamut holds where the tightest surface reaches 4.5:1: the
tint on the light page, the overlay on the dark one, where it lifts to L 0.64:

| Role   | Light page | Light stripe | Light tint | Dark page | Dark stripe | Dark tint | Dark overlay |
|--------|------------|--------------|------------|-----------|-------------|-----------|--------------|
| `note` | 5.40:1     | 5.02:1       | 4.58:1     | 5.47:1    | 5.15:1      | 4.87:1    | 4.54:1       |
| `pass` | 5.39:1     | 5.01:1       | 4.56:1     | 5.44:1    | 5.12:1      | 4.79:1    | 4.51:1       |
| `flag` | 5.38:1     | 5.01:1       | 4.57:1     | 5.49:1    | 5.17:1      | 4.92:1    | 4.55:1       |
| `warn` | 4.87:1     | 4.53:1       | 4.16:1     | 5.48:1    | 5.16:1      | 4.88:1    | 4.54:1       |
| `fail` | 5.86:1     | 5.45:1       | 4.93:1     | 5.45:1    | 5.13:1      | 4.90:1    | 4.52:1       |

Every other colour derives from them through `color-mix(in oklab, …)` or `oklch(from …)`, so an app retuning the
anchors carries the whole interface along.

The accent pair is named for the emphasis it carries rather than for how it looks, as `css-developer:colours` requires.
`subtle` and `strong` are relative to each other, which any brand honours by supplying a quieter value and a louder one,
and neither name survives being read as an absolute.

> [!WARNING]
>
> `subtle` is about **chroma**, **NOT** contrast or lightness: the subtle accent is near-neutral, carrying about a
> fifth of the strong one's chroma (0.036 against 0.163 in the light scheme, 0.031 against 0.181 in the dark). It is
> a slate beside a saturated colour, and it holds the higher contrast of the two, 10.0:1 against 5.51:1 on white. A
> "fix" darkening it or giving it the hue of its partner undoes both the reading and the text roles derived from it.

`--skin--color-fail` is an anchor rather than a derivation of an accent on purpose: deriving it carried the hue an
app brands with into the role marking a failure, so a blue-branded interface rejected a value in blue.

Text roles hold WCAG AA contrast, 4.5:1 against the background they sit on, in **both** schemes and over the stripe;
the focus ring holds 3:1. The exceptions a contrast check is allowed to pass over, each **by design**:

- `--skin--border-color` and `--skin--color-disabled`, below 3:1, sharing one value: a decorative line carries no
  meaning, and WCAG exempts a disabled control. A line that identifies a control takes `--skin--border-color-field`
  at 3:1, and a placeholder is text like any other, held to 4.5:1
- `--skin--color-warn` and `--skin--color-warn-stroke` on the light caution tint, at 4.16:1, so caution text is never
  set there

The stroke roles are the text roles standing in for all five.

# Palettes

These are content colours, never interface roles: how a consumer uses each family is in `css-developer:palettes`.
What stays here is how each was sampled and measured.

> [!NOTE]
> The ΔE and colour vision deficiency gates below are **chart-readability guarantees** for these palettes alone, not
> contrast rules: WCAG lets a chart rely on its labels, and the gates keep the colours themselves apart. They bind
> nothing outside `palettes.css`, so the WCAG-only budget under [Colours](#colours) still governs every role.

## Editor

The editor colours are what an **author** picks to colour content, as text or as fill: a word set in red, a table
cell filled in yellow, a highlight behind a phrase. They are editing colours, not interface roles, laid out as the
pickers of document editors lay theirs out, simplified to a grid of a neutral and five hues by three steps:

| Step     | Neutral | Red          | Yellow          | Green          | Blue          | Purple          |
|----------|---------|--------------|-----------------|----------------|---------------|-----------------|
| `strong` | `black` | `red-strong` | `yellow-strong` | `green-strong` | `blue-strong` | `purple-strong` |
| normal   | `gray`  | `red`        | `yellow`        | `green`        | `blue`        | `purple`        |
| `subtle` | `white` | `red-subtle` | `yellow-subtle` | `green-subtle` | `blue-subtle` | `purple-subtle` |

Every name takes the `--skin--color-` prefix.

- **No text and fill axis.** Any colour serves as text or as fill, and how an author combines them is **NOT** the
  design system's concern: the grid is held to the gamut, as the series slots are, and the plain step to 3:1 against
  the page, so a word set in it stays legible as large text; no other pairing carries a contrast guarantee
- **Steps named as `look` names its own.** `strong` stands out from the page and `subtle` stays close to it, the
  plain name sitting between; the neutral column takes `black`, `gray` and `white` for its three steps
- **Muted, three steps.** Chroma 0.04 to 0.19, sampled from document-editor pickers rather than set at the
  gamut's edge, on three steps in OKLab lightness: near 0.91, 0.66 to 0.69 and 0.49 on the light page, and near
  0.37, 0.57 and 0.78 on the dark one, where a tint is capped at chroma 0.06
- **Plain step at 3:1, NOT 4.5:1.** The plain step is the one an author picks first and sets as text, so it holds
  3:1 on the page, the WCAG minimum for large text and marks, which the editor pickers it was sampled from hold too.
  Spaced evenly at 0.70 the light side fell to 2.6:1, so it is lowered by as little as 3:1 requires; the dark side
  holds 3.9:1 at its even spacing and is left there. Taking it to 4.5:1 would crowd the strong step into two
  near-identical darks per hue, and no step is held to 4.5:1 for body-size text. Lowering it further, or raising it
  towards 0.70 again, is **NOT** a free retune: the suite fails below 3:1
- **Five hues.** Red, yellow, green and blue are the hues every author names, a quarter turn apart, and purple the
  one between them sitting next to none; orange, teal, lime, sky and magenta each fall between two of the five
- **Named by hue.** The `css-developer:colours` rule naming a colour for its emphasis does **NOT** apply: the author
  picks a hue and attaches no meaning, so the hue is the content
- **Literals, NOT derivations,** for the reason `--skin--color-fail` is one: a passage an author made blue stays blue
  under any brand, and no hue follows a status anchor, so retuning an outcome repaints no content
- **One `light-dark()` pair each.** The steps are measured from the page, so `strong` is dark on the light page and
  light on the dark one and `subtle` the reverse, `black` and `white` included

## Scales

Four ten-step scales address a colour by position rather than by role, the number being the share of the anchor a step
carries: `010` is the faintest and `100` the anchor at full strength, which the top step of each derived scale reads
straight off.

`--skin--color-gray-*`, `--skin--color-subtle-*` and `--skin--color-strong-*` derive from the anchors, so an app
retuning a brand carries them along and a step mixes towards the page in either scheme. A step is **NOT** a
replacement for a role token: the text and background roles in `colors.css` do not land on the ladder, and
`--skin--background-color-edit` and `--skin--background-color-stripe` sit below its first step.

`--skin--color-heat-*` carries literals, for the same reason `--skin--color-fail` does: a magnitude coding taking
the hue an app brands with stops reading as a temperature. It runs cool blue → green → yellow → red → violet, the
violet standing for a measure past the top of the range.

The heat scale codes by **hue**, and its lightness is deliberately **NOT** monotone: it peaks mid-scale and falls at
both ends, which is why a step reads as a band and never as a point on a gradient. Only the last two steps carry a
`light-dark()` pair, since at their light values they sit at 2.05:1 and 2.76:1 against the dark page and lose the top
of the range; the cool half holds in both schemes and is stated once.

## Series

`--skin--color-series-1` to `--skin--color-series-9` tell one thing apart from another. A number is a slot, not a
share, so the three-digit form of a scale would misread here. The slots carry literals, for the reason
`--skin--color-fail` does: a series colour follows the thing it paints, so neither a rebrand nor a filter that
drops a series may repaint the survivors. One value serves both schemes, since a tint that recedes on the light page
stands out on the dark one.

They are nine of the ten hues of [Tableau 10](https://www.tableau.com/blog/colors-upgrade-tableau-10-56782), its grey
left out, reordered: Tableau's own sequence puts adjacent hues at the same lightness, which the gates reject.

Validated against the package surfaces rather than against the defaults the `dataviz` skill ships:

- worst adjacent CVD ΔE 13.7, worst adjacent normal-vision ΔE 16.7, in the order declared
- the order leads with Tableau's blue and clears both gates; 347 of 30,000 sampled blue-leading orders do
- every slot clears 4.1:1 on `#111`, so one column serves both schemes

> [!WARNING]
>
> **Lightness alternation carries the separation**, not hue spacing. Simulated protan and deutan vision collapses hue,
> so a run of slots at one lightness fails however evenly their hues are spread: a generated set with even hues at one
> lightness measured ΔE 0.7 against a target of 8, and needed a swing of 0.14 in OKLCh L before it passed. That is
> what the declared order buys, and why it is not Tableau's.

> [!WARNING]
>
> The **order** is the separation mechanism, not a preference: the figures above hold for adjacent pairs in the order
> declared. Reordering the slots, resampling a hue or inserting a tenth forfeits the guarantee and means re-measuring
> the candidate orderings. Four of the nine fall short of 3:1 against the light page: the yellow at 1.61:1, the pink
> at 1.98:1, the teal at 2.29:1 and the orange at 2.42:1, so the slots are the one family a contrast check passes over
> wholesale rather than slot by slot.

A tenth slot has no room left: at this lightness every candidate that clears the gates repeats a hue already in the
set, passing on adjacency alone while colliding wherever all pairs are compared.

## Areas

`--skin--color-area-1` to `--skin--color-area-4` fill a shape rather than draw a mark: a region on a choropleth, a
band on a terrain, a cell on a grid. They are the four colourblind-safe classes of the
[ColorBrewer Paired](https://colorbrewer2.org/#type=qualitative&scheme=Paired&n=4) scheme, in its own order.

The structure is the point: two pairs, a light and a dark of one hue each. A reader tells the members of a pair apart
by lightness where hue alone would fail, and reads the two hues as two families, which is what a greyscale print or a
photocopy survives on.

Every pair of classes meets on a shared boundary, not only the ones a legend lists side by side, so the four are held
to the **all-pairs** measure rather than the adjacent one:

- worst all-pairs CVD ΔE 13.3 (`pale green ↔ pale blue`, deutan), tritan 4.3
- worst all-pairs normal-vision ΔE 14.1, against the skill's floor of 15: the two pale classes are what sits below it
- the pale classes hold 1.67:1 and 1.52:1 on the light page, the dark ones 4.77:1 and 3.38:1; on `#111` every class
  clears 3.9:1

Paired stops being colourblind-safe past four classes, which is where the limit of four comes from. The normal-vision
shortfall of 14.1 is accepted **only** because a map keeps its boundaries drawn and names its classes in the legend.

# Literals

The scale tokens are declared here, so a rule in this package reads them exactly as a consumer does, never as the
number behind them. The optical nudges that stay literal are the `0.1em` between quoted paragraphs, the underline
offset and code tint in `inlines.css`; each says in a comment why it sits below the scale. The small capitals
tracking, the display leading and the prose measure are **NOT** among them: each is a token, since consumer components
read the same values. The mono face size is no literal either: a preset scales the face itself.
