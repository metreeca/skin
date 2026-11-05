---
title: Project Guidelines
description: Development guidelines and conventions for the @metreeca/skin package.
---

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
>   is touched; this file carries only what is specific to the package
> - Revising a token means revising it in **every** place listed under [Token Contract](#token-contract)
> - The suite checks token **names** for every family, and **values** for the colours alone: `colors.test.ts` paints
>   every colour role in both schemes under three brands and holds it to its contrast budget and to the gamut, so a
>   wrong size reaches production unnoticed where a wrong colour fails the build
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

`src/index.css` imports the modules and is the only entry an app includes. The token modules come first, the
anchors ahead of what derives from them, then the base rules by increasing structural complexity, so a composite lands
after the plain elements it is built from and takes precedence where the two match with equal specificity. It carries
the page defaults itself and nothing else: `color-scheme`, the page colours and the page typography, every one of them
reading a token it does not state.

The package ships the **Metreeca brand as its defaults**: the accent anchors carry its slate and orange, and the font
family tokens lead with the variable Roboto faces, which `index.css` imports from `@fontsource-variable/*` so a
bundler ships them with the app. **A stylesheet naming a face loads it**, and never from a remote URL. An app setting
faces of its own pays only for the unused files in its build and about 2.6 KB of gzipped `@font-face` rules: a
browser fetches a face only once text set in it is painted, so its visitors never download Roboto. Neither CSS nor a
bundler can make the imports conditional on an override, which is a runtime cascade fact; do **NOT** reintroduce a
separate font or brand entry to avoid that cost.

The modules fall into two groups, one folder each, and the split holds in both directions: nothing in `markup/`
assigns a token, and every `var()` in `tokens/` is a token deriving from another.

`src/tokens/` — a family per pair, `<family>.ts` naming the tokens and `<family>.css` stating their values, and the
only place either side of the family is revised:

- `typography` — the faces, defaulting to the variable Roboto family `index.css` bundles, the sizes, the weights, the
  line height and the heading tracking
- `spacings` — the ladder a thing is set apart from its neighbour on
- `scalings` — the ladder a thing measured against the text is sized on
- `colors` — the eight colour anchors, each registered as a `light-dark()` pair where it varies by scheme, and the
  text, status, state and surface roles derived from them
- `borders` — the line, the radii, the focus ring, the invalid outline and the vector stroke width
- `elevations` — the surfaces a thing lifted off the page is painted on, the shadows pairing with them, the
  translucent glass ground gathering floating surfaces without a shadow, and the blanket dimming what a modal covers
- `palettes` — the four ten-step colour scales, the nine series slots and the four area classes, the three
  accent-derived scales following the anchors and the heat scale, the slots and the classes stated as literals
- `layers` — the stacking order two things overlapping the page are settled by
- `motions` — the durations a change takes and the curves it accelerates on, the durations collapsing under
  `prefers-reduced-motion`
- `opacities` — how far a thing present but not available is faded
- `viewports` — which breakpoints the viewport has passed, one flag each, `off` registered and `on` set from its width
  upwards

A breakpoint cannot be a width token: CSS does not accept a custom property in a media feature, so
`@media (min-width: var(--x))` never matches. `viewports` carries the *answer* instead of the question, and this is
the one measure in the package an app cannot retune through a custom property.

**Nothing outside `viewports.css` ever states a width**, in CSS or in TypeScript. The stylesheet runs the four queries
once and hands the answers on as tokens, and a rule branches on one through a style query:

```css
@container style(--skin--viewport-medium: on) {
    app-screen {
        grid-template-columns: 1fr 2fr;
    }
}
```

The tokens are assigned on `:root` and inherit, so every element sits inside a container a style query matches and no
rule declares one of its own. Each is registered with `off`, so the narrow case is a value a rule matches rather than
the absence of one. What this buys is **reuse, not retuning**: the width still lives in `viewports.css`, and
overriding a flag forces it without moving the threshold.

The standard set, and the **only** widths a rule breaks at, here or in a component built on the design system:

| Token            | From    | What it answers                                              |
|------------------|---------|--------------------------------------------------------------|
| `viewportSmall`  | `30rem` | a phone held upright, the one-column floor                   |
| `viewportMedium` | `48rem` | a tablet or a split window, where a second column fits       |
| `viewportLarge`  | `64rem` | a laptop, where navigation becomes a rail                    |
| `viewportXlarge` | `90rem` | a desktop, where the measure is capped rather than stretched |

Every width is a **floor**, so the narrow layout is what a rule states unconditionally and each breakpoint only adds
to it, leaving the narrower flags on. A `max-width` query is **NEVER** mixed in: at the boundary two rules then both
match, or neither does. A band is expressed by pairing the wider flag as `off` with the narrower one as `on`.

Code needing the same answer reads the token through `getComputedStyle` as it reads any other, which is a
point-in-time read; a component reacting to a threshold being crossed watches the element rather than polling. There
is deliberately **no** TypeScript copy of the widths and **no** composed `matchMedia` string: one existed briefly and
earned nothing but a test policing its own duplicate.

A widget changing shape because of the space it was **given** states a `@container` size query against its own inline
size and takes no breakpoint at all. These four are for the page-level decisions a container query cannot answer.

The `*.core.ts` modules hold what the design system surface stands on without offering it, so `typedoc.json` leaves
them out of the reference.

`src/markup/` — base rules for plain document markup, carrying **no** `.ts` side and declaring no token of their own:

- `reset.css`, then `headings.css`, `inlines.css`, `blocks.css`, `highlights.css`, `lists.css`, `tables.css`,
  `forms.css`, `alerts.css` — one group of elements each
- `highlights.css` and `alerts.css` are the two modules selecting classes, and only classes a published convention
  fixes rather than names of the design system: the `hljs-*` tokens of highlight.js and the `markdown-alert*` blocks
  GitHub renders alerts as

# Layering

The whole design system sits in one cascade layer, `skin`. Each module is imported into it, and the page defaults in
`index.css` are wrapped in a block of their own:

```css
@import "./tokens/typography.css" layer(skin);
@import "./markup/reset.css" layer(skin);

@layer skin {
    :root { /* … */ }
}
```

What this buys is a single guarantee: **an unlayered rule beats every layered one**, whatever the specificity and
whatever order the stylesheets reach the document in. An app or a binding package therefore overrides the design
system by writing an ordinary rule, with no `!important`, no specificity inflation and no control over load order. It
is what lets an app state its brand in an inline `<style>` and still win over the bundle vite injects afterwards,
whatever order the two reach the document in.

Three rules follow, and they are the whole of the discipline:

- a rule added to **any** module here **ALWAYS** goes inside the layer; one left outside would outrank the entire
  design system and could never be overridden again
- a component stylesheet in a binding package stays **unlayered**, which it does simply by not being imported through
  `index.css`
- an app with layers of its own orders them after `skin`

Two things the arrangement deliberately does not do:

- **It does not subdivide.** One layer, not `skin.tokens` / `skin.base` / `skin.composites`: inside a single layer,
  source order and specificity decide exactly as they did before, so the module order in `index.css` still carries the
  precedence a composite needs over its plain elements. Every extra layer name is a public commitment an app has to
  order against, bought for nothing.
- **It does not touch the font imports.** The `@fontsource-variable/*` imports in `index.css` stay unlayered, since
  they carry only `@font-face`, which a layer has no effect on.

`@property` registrations are global regardless of the layer they are declared in, so a token module behaves
identically inside it.

> [!WARNING]
>
> Layering removes specificity from the comparison **between** stylesheets: a design system rule can no longer outrank
> a component rule, however specific it is. Nothing relies on that today, since no module here selects `label` or `nav`,
> which components commonly style. Adding a high-specificity base rule for an element a component also styles is the
> case to watch.

# Token Contract

A token lives in two places, both inside its family pair, revised together:

- `src/tokens/<family>.ts` — the entry naming it, which is what components and apps address
- `src/tokens/<family>.css` — its `@property` registration, and its `:root` assignment where it needs one

**Its value is stated exactly once**, and which of the two carries it follows from what the value is:

- a **literal** is the registration's `initial-value` and gets **no** `:root` assignment: a spacing step, a radius, a
  weight, an anchor, a heat step, a series slot, an area class
- a **derivation**, reading `var()`, `color-mix()` or `oklch()`, is a `:root` assignment and the registration carries
  **no** `initial-value`, which it could not resolve anyway: a colour role, a derived scale step, the border colour,
  the focus ring, the invalid outline
- a **scheme-varying value** states both schemes in one value, as `light-dark(light, dark)`, registered
  `syntax: "*"`: a literal pair is the registration's `initial-value`, a pair of derivations a `:root` assignment. It
  is **NEVER** stated in a `prefers-color-scheme` query or a `[data-theme]` rule

**Neither scheme is the default of the other**, and **one value covers every case**. A `"*"` token holds the pair
unresolved and inherits it as written, so it is picked where a rule paints with it, against the `color-scheme` in
force there: `index.css` settles that from the platform on `:root` and from `data-theme` on any element, so a pinned
root and a pinned subtree each take their own side. An app overrides the token the same way, once on `:root`, and the
override follows every scheme and every pinning with no selector restated.

> [!CAUTION]
> A scheme-varying token is **NEVER** registered with a real syntax such as `<color>`: a typed property resolves
> `light-dark()` where it is declared, on the root, and hands every subtree the side the page happened to be on. The
> same holds for a derivation reading one, which is why every colour role is registered `"*"`.

Scheme rules would bring back what this avoids: an app overriding a token stated in four rules has to restate all
four, since an unlayered `:root` rule under a media query beats the layered `[data-theme]` rule on a pinned root, and a
pinned subtree takes the layered attribute rule over what it inherits.

Native controls, scrollbars and the caret answer to `color-scheme` as the tokens do, and `index.css` restates the page
colours on any `[data-theme]` element, which would otherwise inherit them as the root resolved them.

`src/index.ts` gathers the families into `skin` and adds nothing of its own; a new family is added to the spread and
to the imports in `src/index.css`.

`src/index.test.ts` fails when a declared name is defined in neither place or in both, when a defined name is not
declared, when a rule reads a token no one declares, when a registration is missing or duplicated, when a token
is stated per colour scheme in a query or attribute rule, and when a derived token carries a default it cannot
resolve. It says nothing about the value behind the name.

`src/tokens/colors.test.ts` is where a colour value is held to its budget. It evaluates every colour token as the
page would, in both schemes and under the shipped brand, a navy and a green, with the OKLab mixing and relative
colour maths the browsers share, and fails when a role leaves the sRGB gamut, when a text role or a stroke drops
below 4.5:1 on a surface it is set on, when a mark or the focus ring drops below 3:1, or when the raised surface
lands on the stripe. It runs in Node with no browser, which is sound only because nothing leaves the gamut: the
in-gamut check is what makes the other figures the figures every browser paints. A figure in a token comment is
documentation of what the test asserts, never the guard.

An `@property` registration states the type a token takes and the default it falls back on, under the constraints
`css-developer` §Registrations sets out: only an absolute value takes a real type, and a derived token carries no
default at all.

# Token Lifecycle

A published token name is a public commitment, so it is **NEVER** renamed in place: a consumer's stylesheet reads the
custom property directly and no compiler catches the break.

Retiring a name runs in two releases:

1. **Deprecate.** Add the new token through the contract above. Keep the old one declared and registered, and redefine
   it as a derivation reading the new one, so both resolve and nothing painted through either changes. Mark the entry
   in the `.ts` side with `@deprecated`, naming the replacement, and record the pair in `CHANGELOG.md`.
2. **Remove.** Drop the old entry, its registration and its assignment in the next **minor** line, never in a patch.

A consumer migrates by rewriting the call sites, which takes two passes because a token appears in two shapes: the
TypeScript entry (`skin.colorStrong`), which an IDE rename or a `jscodeshift` codemod rewrites safely, and the custom
property (`--skin--color-strong`), which a plain search and replace over `.css` files settles since the name cannot
occur as anything else.

The suite is **NOT** a lifecycle check: a deprecated token passes exactly as any other, since it is still declared,
registered and defined. Only the changelog records that it is on its way out.

> [!WARNING]
>
> Because a literal default now lives only in its registration, a browser that ignores `@property` leaves every one of
> them unset rather than falling back on a `:root` copy. That is not a new floor: `oklch(from …)`, which the colour
> roles are derived with, lands in the same browsers and versions, so nothing here was reachable without `@property`
> support to begin with.

# Colours

Eight anchors carry literals in `colors.css`. Seven state a value per colour scheme, as the `light-dark()` pair the
contract above sets out; `--skin--color-warn` alone carries one value for both:

- `--skin--color` and `--skin--background-color`
- `--skin--color-subtle`, which an interface carries at rest, and `--skin--color-strong`, which marks a thing out;
  both ship the Metreeca brand, a slate and an orange, and an app supplies its own by overriding them; the light
  orange is darkened from the brand book's `#D60`, at 3.51:1 on white, to `#B74300`, which holds AA on its own tints
- `--skin--color-info`, `--skin--color-pass`, `--skin--color-warn` and `--skin--color-fail`, the four steps of the
  meaning scale below

`--skin--color-focus` carries a literal per scheme alongside them without being an anchor: the focus mark says where
the keyboard stands, which reads the same whatever an app brands with, so it is **NEVER** derived from an accent. It
is stated as a `light-dark()` pair alongside them and held to the ring budget of 3:1 against the page **and** against
the stripe.

> [!CAUTION]
> **Every derivation stays inside the sRGB gamut**, for the shipped brand and for the navy and green brands the suite
> runs. Browsers disagree on a colour outside it: Chrome and Firefox clip the channels, which shifts the hue, and
> Safari reduces the chroma, which keeps it, so an out-of-gamut derivation is a different colour in each. A mix of two
> paintable colours in OKLab stays paintable, which is why the states and the strokes are `color-mix()` towards the
> text anchor; an `oklch(from …)` step that raises chroma or pushes lightness towards an end caps it with `min()`.
> The figures in the comments and the suite's contrast checks are computed in Node from the same maths, and they
> describe what ships only because nothing leaves the gamut.
>
> A second hazard the suite cannot see: Chrome marks the **hue** of a colour under about 0.02 chroma as powerless,
> so a relative `oklch(from …)` reading `h` off a near-grey, such as a 12% tint, paints **red**. A derivation
> raising the chroma of such a colour scales `a` and `b` in `oklab(from …)` instead, which carries no hue to lose.

## The meaning scale

Every meaning a widget carries lands on these four steps, and **NO** widget invents a fifth colour: a meaning the
scale does not carry is stated in words.

| Step   | Says                   |
|--------|------------------------|
| `info` | stated or provisional  |
| `pass` | completed as intended  |
| `warn` | completed with caveats |
| `fail` | failed to complete     |

`info` is **NOT** a milder `pass`: it is the absence of a verdict, so the scale is one unjudged step ahead of a
three-step ramp. Three kinds of meaning share it, chosen by what the widget **is**, so no widget carries two:
`level` on content, `mode` on controls, `status` on reported things:

| Attribute | `normal`            | `info`    | `pass`      | `warn`    | `fail`                |
|-----------|---------------------|-----------|-------------|-----------|-----------------------|
| `level`   | an ordinary passage | `info`    | `highlight` | `warning` | `critical`            |
| `mode`    | an ordinary control | `safe`    | `commit`    | `alert`   | `danger`              |
| `status`  | nothing to report   | `pending` | `success`   | `warning` | `failure` or `defect` |

**`normal` is the default of all three, and it is NOT a step**: it carries no colour coding at all, leaving the
ordinary page colours. A widget that states nothing is `normal`, and a `level="normal"` passage is **NOT** a blue
`info` admonition. Only the four marked values reach the scale.

Four steps is the ceiling, because colour carries no more: one absence of hue and three hues told apart at a glance.
A meaning the scale does not carry is stated in **words**, never in a fifth colour.

A widget maps its remaining values onto the steps and states that mapping where its consumers read it, or two widgets
put the same meaning on different steps and the learned scale breaks:

```
note         level   info → info    highlight → pass    warning → warn    critical → fail
button       mode    safe → info    commit → pass       alert → warn      danger → fail
toast        status  pending → info success → pass      warning → warn    failure → fail    defect → fail
GitHub alert kind    important → info                   tip → pass        warning → warn    caution → fail
```

A GitHub `note` is an aside rather than a meaning, so it stays off the scale and takes the subtle accent, leaving
`info` to `important`, whose purple GitHub colour would be a fifth colour; the strong orange would read as a caution.

### Which attribute a widget takes

Decided by **tense**, which also places any new value:

| Attribute | Answers                          | Tense    | Set by                    | Taken by        |
|-----------|----------------------------------|----------|---------------------------|-----------------|
| `level`   | how much attention this deserves | timeless | the author, ahead of time | content         |
| `mode`    | what activating this will do     | future   | the designer              | controls        |
| `status`  | what the system says happened    | past     | the system, at runtime    | reported things |

Written into the page by a human: `level`. Appears because something ran: `status`. A consequence not yet incurred:
`mode`. No tense at all: it is `look`, not a meaning.

### `look`

How loud a thing appears is a separate axis, carried by the `look` attribute and **NOT** colour-coded: it is told in
layout, weight and border, so it never competes with the scale for the same channel and a widget carries one of each
without the readings interfering.

| Value    | Means                                                          |
|----------|----------------------------------------------------------------|
| `subtle` | recedes: ordinary weight, no border, less room                 |
| `normal` | ordinary weight, ordinary room                                 |
| `strong` | carries the moment: heavier weight, a border, more room, first |

`subtle` and `strong` are the pair the colour anchors already use, so one vocabulary names this axis everywhere.

> [!CAUTION]
> Do **NOT** name this attribute `role`, which collides with ARIA, or `style`, which collides with the DOM attribute
> and the JSX prop. `primary` is **NOT** a value: it names a position in a flow, one per dialog, which a control
> cannot know about itself, where `strong` names a level the control does know.

How loud a widget appears is a property of the **area** rather than of the widget, so an area settles it for
everything it holds through `--skin--look`, from the `visuals` family. **EVERY** widget taking a `look` reads it the
same way, so an app learns the mechanism once:

- the widget **NEVER** defaults the attribute: it renders one only where the consumer asked for it, since the
  attribute has to be absent for the area to have a say
- the stylesheet keys each step on the attribute, `[look="subtle"]`, and repeats that step for a widget carrying no
  attribute inside `@container style(--skin--look: subtle)`, which is the only way a rule branches on a value
- the two forms carry the same declarations, restated: a style query is a conditional group and takes rules of its
  own, so they cannot be written as one selector

A widget stating a `look` answers to that alone, which is what leaves one loud control standing in a quietened
toolbar.

> [!CAUTION]
> What a widget **means** is **NEVER** settled this way. A meaning belongs to the one widget carrying it, so `mode`,
> `level` and `status` are stated at the widget and inherited by nothing: an area quietening its controls leaves each
> of them saying what it says.

### Tensions on the record

- **Orange crowds the warm steps.** `--skin--color-strong` ships orange, which sits ΔE 6.9 from the `fail` red in
  the light scheme (`#B74300` against `#C00`) and ΔE 13 from the `warn` yellow in the dark one (`#F80` against
  `#F2C230`), so a strong control and a failure are confusable where colour alone tells them apart. A strong control
  is therefore told by weight and border as well, which `look` already carries.
- **A pressed control and a caution label are both pale orange on the dark page.** The states are the strong accent
  carried towards the text anchor, and above a bright saturated orange there is little room: the dark pressed
  colour sits ΔE 9.4 from the dark caution stroke, and the hover and pressed steps are ΔE 5.5 each where the light
  ones are 11. A control fills its box with the state tints as well, so the state never rests on the text colour,
  and a caution is told by its glyph and its tint. Stepping the lightness instead bought nothing: it left the gamut,
  and the clipped result was the caution stroke itself.
- **Blue collides with a blue brand.** An app branding in blue makes the `info` step and a strong control
  confusable. The info token is a cyan for this reason.
- **A step is NEVER told in colour alone**, since `pass` and `fail` are the pair colour vision deficiency collapses
  most readily; the icon and the wording carry the same meaning.
- **`mode="commit"` and `look="strong"` co-occur on nearly every Save button.** They stay distinct, but the pairing
  has to stay the exception or green-plus-prominence becomes the default and means nothing.
- **`pending` and `info` share the `info` step.** A pending that must read as *moving* rather than merely unjudged
  adds the loading opacity and the motion tokens on top of the hue, not instead of it.
- **A failure can be told by either attribute.** A note takes `level="critical"` for a failure shown in place of
  the content, and a toast takes `status="failure"` for one floated over the screen. Both land on `fail`. Only
  `status` carries `pending`, since an authored admonition is never pending.
- **`failure` and `defect` share the `fail` step.** A fault of the interface itself is a failure all the same to the
  reader, so the two are told apart by glyph and wording, never by a fifth colour the scale cannot carry.
- **`highlight` is the thinnest cell.** A passage reporting that something *went* well is really reporting a
  `status`, so it earns its place only for a passage singled out as worth having.

> [!WARNING]
>
> `--skin--color-warn` is a **fill, never a stroke**, and it carries **one value in both colour schemes**. A
> caution paints a filled badge with it and sets its message in the dark page anchor over it, at 12.5:1. Stroking it
> on the page gives **1.68:1** and is a defect.
>
> This is forced by the colour space, **NOT** chosen. Red reaches full saturation at a middling lightness, so
> `--skin--color-fail` is dark enough to read on white and loud at once. Yellow reaches full saturation only when
> it is very light, so any yellow dark enough to stroke on white has already spent its chroma. Three rounds inside a
> stroke budget proved it: `#850` at 4.5:1 read as mud, `#A40` escaped the mud only by moving to a burnt orange
> sitting ΔE 2.0 from the failure red under simulated deuteranopia, and `#B67C00` at 3:1 was still muted at chroma
> 0.132. As a fill it reaches **chroma 0.158** against the failure's 0.218, and separates from it by **ΔE 29.8
> deutan**, and from the pass green by **ΔE 17.0 protan**, the tightest pair in the scale. The yellow sits a dozen
> degrees further from orange than the mustard it replaced, which managed 10.0 against the green and turned brown as
> soon as a tint or a dark stroke dimmed it.
>
> Retuning it for a better stroke contrast walks straight back into the mud. A caution needing coloured text or a
> mark takes the **second token**, `--skin--color-warn-stroke`, never a change to this one.
>
> `--skin--color-fail` alone holds 4.5:1 on the page and serves as either text or mark there. `--skin--color-info` and
> `--skin--color-pass` are **marks at 3:1**, not text: cyan and green are chroma-starved at the lightness 4.5:1
> forces, so holding them to it left `info` at chroma 0.090 against the failure's 0.218, reading as dull beside
> every other step. At the mark budget they reach 0.107 and 0.202 and lift from L 0.52 to L 0.61. They paint the
> glyph, the rule and the fill of a notice whose text takes `--skin--color` on the tint, at 18.5:1.
>
> Do **NOT** drop `--skin--color-fail` to the mark budget to match them: `markup/forms.css` and the components built on
> the design system paint text with it, and red is the one hue reaching full chroma at a lightness dark enough to carry
> a sentence.

Text painted in the colour of a step over its tint takes the step's **stroke role**, `--skin--color-info-stroke`,
`--skin--color-pass-stroke`, `--skin--color-warn-stroke` or `--skin--color-fail-stroke`. A stroke holds AA on the
page, the stripe and its own tint in both schemes. Over a tint a control deepens under the pointer, with a further 24%
of the anchor, the label takes whichever of the stroke and `--skin--color-over` holds AA there: the info and pass
strokes hold on their own, every stroke does on the dark page, and the light caution and failure strokes hand over to
the dark page anchor, as a filled caution badge does. Holding every stroke to the deepened tint is what once made the
caution an olive and the failure a maroon, and **neither is allowed back**: a warning is read by an amber and a
failure by a red.

| Role   | Light page | Light stripe | Light tint | Dark page | Dark stripe | Dark tint |
|--------|------------|--------------|------------|-----------|-------------|-----------|
| `info` | 7.05:1     | 6.28:1       | 6.19:1     | 7.07:1    | 6.66:1      | 6.29:1    |
| `pass` | 7.15:1     | 6.36:1       | 6.27:1     | 7.21:1    | 6.78:1      | 6.38:1    |
| `warn` | 5.28:1     | 4.70:1       | 4.80:1     | 13.1:1    | 12.4:1      | 10.9:1    |
| `fail` | 6.70:1     | 5.97:1       | 5.64:1     | 7.58:1    | 7.13:1      | 6.70:1    |

The info and pass strokes carry their anchors 74% towards the text. The failure stroke carries its anchor 94% on the
light page, a shade under the red that shouts, and 86% on the dark one. The caution stroke is the yellow carried 60%
towards the text and, on the light page, turned 34° towards orange at the chroma the gamut holds, since a dim yellow
is an olive; on the dark page it keeps its yellow with half again the chroma.

The dark `info` and `pass` anchors are pinned by this table rather than by a mark budget of their own: at L 0.60
their strokes land within a tenth of the light figures, so a notice reads as loud in either scheme. Lighter dark
anchors held text contrast twice over, and their strokes then lightened and shed chroma for nothing.

A widget deepening a status fill under the pointer or the press keeps the label as it stands: it **NEVER** retints the
label per state, deepens past the 24% the shares are pinned by, or restates a derivation inline.

Every other colour derives from them through `color-mix(in oklab, …)` or `oklch(from …)`, so an app retuning the
anchors carries the whole interface along.

The accent pair is named for the emphasis it carries rather than for how it looks, as `css-developer` §Colours requires.
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

The striped table row is where the custom property cycle `css-developer` warns of would bite: it paints
`background-color` instead of retuning `--skin--background-color`, which every other colour here stands on.

Text roles hold WCAG AA contrast, 4.5:1 against the background they sit on, in **both** schemes and over the stripe;
the focus ring holds 3:1. The exceptions a contrast check is allowed to pass over, each **by design**:

- `--skin--border-color`, `--skin--color-disabled` and `--skin--color-placeholder`, below 3:1, carrying no meaning
  on their own. The three share one value, 1.76:1 and 1.94:1 on the edit background: the last two stand for
  text the reader has not supplied, and a disabled control is told from an empty one by its **background**, never by
  the weight of its text. Reading either as a text role is the mistake to avoid
- `--skin--color-info` and `--skin--color-pass`, marks at 3:1, since the hues cannot hold chroma at the lightness
  4.5:1 forces
- `--skin--color-warn`, a fill, at 1.68:1 stroked

The stroke roles are the text roles standing in for all four.

# Palettes

`palettes.css` carries the colours a chart, a coding or a map reads: four ten-step scales, nine series slots and four
area classes. A step, a slot or a class is **NEVER** a substitute for a role token: a role says what a colour means in
the interface, these say where a value sits or which thing it belongs to.

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

> [!WARNING]
>
> The heat scale codes by **hue**, and its lightness is deliberately **NOT** monotone: it peaks mid-scale and falls at
> both ends. A step therefore means a band a legend names, never a position on a continuous gradient, and a consumer
> **ALWAYS** states the band in text beside the colour. Ranking its steps by lightness, or reading a gradient across
> them, is a misuse the values cannot support; a continuous heat map needs a monotone scale of its own.

Text over a heat step takes `--skin--color` up to `070` and `--skin--background-color` from `080` on, where the scale
turns dark enough to carry it. Only the last two steps carry a `light-dark()` pair, since at their light values they
sit at 2.05:1 and 2.76:1 against the dark page and lose the top of the range; the cool half holds in both schemes and
is stated once.

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
> the candidate orderings. Nine hold only where neighbours are compared, on grouped bars, stacked
> segments and lines; where every pair is compared, on a scatter, a bubble chart or a map, **only the first three
> hold**.

> [!WARNING]
>
> Four of the nine fall short of 3:1 against the light page: the yellow at 1.61:1, the pink at 1.98:1, the teal at
> 2.29:1 and the orange at 2.42:1.
> A chart carrying them **ALWAYS** states its figures in text as well, through direct labels or a table view, and the
> slots are the one family a contrast check passes over wholesale rather than slot by slot.

A tenth slot has no room left: at this lightness every candidate that clears the gates repeats a hue already in the
set, passing on adjacency alone while colliding wherever all pairs are compared. A tenth thing is therefore gathered
under one residual slot rather than coloured.

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

> [!WARNING]
>
> **Four is the limit.** Paired stops being colourblind-safe past four classes, so a fifth class is a second map, an
> inset or a facet, never a fifth colour. The normal-vision shortfall of 14.1 is accepted here **only** because a map
> keeps its boundaries drawn and names its classes in the legend; a chart, which has neither, may not borrow these
> four in place of the series slots.

# Literals

The scale tokens are declared here, so a rule in this package reads them exactly as a consumer does, never as the
number behind them. The optical nudges that stay literal are the `0.1em` between quoted paragraphs and the mono-face
adjustments in `inlines.css`; each says in a comment why it sits below the scale.
