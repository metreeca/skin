# @metreeca/skin

[![npm](https://img.shields.io/npm/v/@metreeca/skin)](https://www.npmjs.com/package/@metreeca/skin)

Essential design tokens and styles.

**@metreeca/skin** is a foundational design system with clean, minimalist tokens for typography, spacing, colour,
elevation and motion, and a base stylesheet that gives plain document markup a coherent look in light and dark schemes.

The default look sets the Metreeca colours in the platform faces and adapts to any brand book: a preset or an app
restating the tokens for a brand's faces, colours and shapes restyles every interface without a component change.

# Installation

```shell
npm install @metreeca/skin
```

> [!WARNING]
>
> TypeScript consumers must use `"moduleResolution": "nodenext"/"node16"/"bundler"` in `tsconfig.json`.
> The legacy `"node"` resolver is not supported.

# Usage

> [!NOTE]
>
> This section introduces essential concepts; for complete coverage, see the
> [API reference](https://metreeca.github.io/skin/).

Include the stylesheet once, at the entry point of the app, ahead of the app styles overriding it:

```typescript
import "@metreeca/skin/index.css";
```

An app assembling its own HTML links it in the document head instead: the stylesheet has to reach the document before
it is painted, or the first frame shows the unstyled markup.

## Presets

A preset is the whole design system restyled for a brand, included **in place of** `index.css`, never beside it:

```typescript
import "@metreeca/skin/presets/roboto.css";
```

| Stylesheet           | Faces                                                                              |
|----------------------|------------------------------------------------------------------------------------|
| `index.css`          | the platform faces, with no download                                               |
| `presets/inter.css`  | Inter for text, Inter Tight for headings, Geist Mono for code                      |
| `presets/roboto.css` | Roboto, Roboto Condensed and Roboto Mono, the variable faces of the Metreeca brand |

Every stylesheet keeps the Metreeca colours unless it states colours of its own, so the presets shipped today differ in
their faces alone. An app overrides a preset exactly as it overrides `index.css`, and its rules win over the preset.

A preset bundles its faces with the app through package imports, which a bundler such as Vite resolves. Linked from the
document head without one, it skips them and sets the type in the generic fallbacks after them.

A bundle carries only the faces of the stylesheet an app imports: an app on `index.css` ships no face file, and the
presets it does not import never reach its build, although every preset's face packages are installed with this one.

## Theming

An app brands the interface by restating tokens in an ordinary rule, with no change to any component. A colour that
differs by scheme is stated once, as a `light-dark()` pair with the light value first:

```html
<style>
    :root {
        --skin--color-subtle: light-dark(#1C275D, #9AB);
        --skin--color-strong: light-dark(#06C, #4AF);
    }
</style>
```

The stylesheet declares its rules in a `skin` cascade layer, so a rule an app writes outside a layer wins whatever order
the two stylesheets reach the document in, and whichever selector is the more specific. An app declaring layers of its
own orders them after `skin`, or the design system outranks them, along with every rule they hold.

A preset restates tokens inside the same layer, after the defaults it overrides, so an app rule wins over a preset too.

An override in the document head, as above, is in force from the first frame, so a loader painted before the
stylesheet arrives already reads the brand. An override in an app stylesheet takes effect once that stylesheet loads.

A malformed override is caught only where the token has a fixed type: a weight, a duration or an opacity the browser
cannot parse stays on its default. Most tokens, the colour anchors and the sizes among them, take an override as
written, so a malformed value leaves whatever reads it unstyled rather than on the default.

### Colours

Retheme by retuning the anchors alone, `--skin--color`, `--skin--background-color`, `--skin--color-subtle`,
`--skin--color-strong` and the five status colours `--skin--color-note`, `--skin--color-pass`, `--skin--color-flag`,
`--skin--color-warn` and `--skin--color-fail`: labels, borders, stripes, focus rings, state fills, notice tints and
elevation surfaces derive from them and follow. The status colours take values of their own rather than derivations of
an accent, so a success or a failure reads as itself in both colour schemes, whatever accents an app brands with.

Each anchor holds its `light-dark()` pair unresolved, so every scheme and every pinned subtree follows a single
override, with no rule restated in a `prefers-color-scheme` query or per pinned scheme.

The accents ship the Metreeca slate and orange, so an app supplies its own: a quieter value and a louder one, for each
colour scheme. Each accent has a contrast target set by what it paints. An accent that meets its target keeps every
colour derived from it within [WCAG 2.2](https://www.w3.org/TR/WCAG22/) AA, on the page and on the fills a control
paints: 4.5:1 for [text](https://www.w3.org/TR/WCAG22/#contrast-minimum), and 3:1 for marks, control boundaries and
focus rings, as [non-text contrast](https://www.w3.org/TR/WCAG22/#non-text-contrast) requires.

| Accent                 | Paints                                | Target in each scheme                                  |
|------------------------|---------------------------------------|--------------------------------------------------------|
| `--skin--color-strong` | selected items, labels on state fills | 5.3:1 on the page, for 4.5:1 on the pressed fill       |
| `--skin--color-subtle` | text set in the top of its scale      | 4.5:1 on the page                                      |

The other accent colours need no target of their own. Hover and pressed text moves the strong accent further from the
page, so it gains contrast. Links and enabled controls take only the hue of the subtle accent and set their own
lightness. Text over a strong fill picks black or white, whichever reads better.

To try a candidate pair, open the [theming tuner](https://metreeca.github.io/skin/lab/#theming) of the specimen. It
applies both accents to the whole page, and the [colour roles table](https://metreeca.github.io/skin/lab/#colours)
marks every role that falls short of its budget, the strong accent included on the pressed fill it is tightest on.
Against white, the defaults hold 5.51:1 for the strong orange and 10.0:1 for the subtle slate, so the orange clears its
target by a hair and the slate by far, so a brand's strong accent is the one that needs checking in the tuner.

The package test suite holds only the shipped colours to these targets. A preset or an app stating colours of its own
checks them in the tuner, since a brand falling short of its targets fails no build and shows only on the page.

### Typography

`--skin--font-family` sets the body face, `--skin--font-family-heading` the face titles are set in, and
`--skin--font-family-mono` the face for code spans and aligned figures, each a stack read in order.

The faces default to the platform faces, which cost no download, and a [preset](#presets) sets faces it bundles.

An app setting a face of its own imports `index.css`, so its build carries no face it does not use. It loads the face
in the same stylesheet restating the tokens that name it, so the two never drift apart:

```css
@import "@metreeca/skin/index.css";
@import "@fontsource-variable/source-sans-3";

:root {
    --skin--font-family: "Source Sans 3 Variable", system-ui, sans-serif;
}
```

A variable face covers every weight the weight tokens may be retuned to, where a face loaded in fixed weights leaves
the browser synthesising the rest, and a generic fallback after it keeps text readable until it loads.

`--skin--font-size-mono` sizes code, keys and program output relative to the text around them. It defaults to `100%`,
since the platform faces differ on every system; a preset or an app setting a mono face states the share for its pair.

`--skin--font-size`, `--skin--font-size-heading`, `--skin--font-weight` and `--skin--line-height` retune the type
scale, and `--skin--letter-spacing-heading` corrects the heading tracking for a condensed or a wide face.

`--skin--line-height-display` sets the tighter leading of display type, `--skin--letter-spacing-caps` the tracking of
small capitals and `--skin--inline-size-prose` the reading measure of prose. A component reads them in place of
literals, so an app retuning one of them reaches every title, label and lead in the interface at once.

Running text wraps so that no lone word is left on its last line, and a heading spread over several lines has them
balanced, while text being typed keeps the platform wrapping. No token carries this choice: an app opting out writes
`text-wrap-style: auto` in an ordinary rule, which outranks the design system wherever it reaches the page.

### Other Tokens

Spacings, radii, elevations, palettes, motions and the other families are overridden the same way. Every token is listed
by family in the [API reference](https://metreeca.github.io/skin/), along with what it decides, so an app finds the
token to retune without reading through the stylesheets and the modules that state its value.

The viewport breakpoints are the one exception: CSS does not accept a custom property in a media query, so an app cannot
move them, though it can still force a breakpoint on or off by overriding its switch.

### Subtrees

An interface follows the platform colour scheme on its own. An app that has to pin one sets `data-scheme` to `light` or
`dark`, on the root element or on any subtree that has to differ from the page around it, which a
`prefers-color-scheme` query cannot express. The pinned subtree takes its side of every `light-dark()` pair, the app's
overrides included, and the stylesheet states `color-scheme` alongside, so native controls and scrollbars follow it
too.

A single subtree takes a look of its own from tokens assigned inline through `css`. It names each token by its
TypeScript entry, so a misspelt name fails the build rather than leaving the subtree unstyled:

```tsx
<section style={css({ colorStrong: "#06C" })}>
```

## Modes

A widget built on the design system says what it is for through at most two attributes, and the two never compete
for the same channel, so a widget can carry both without one reading interfering with the other.

**`look` — how loud it appears.** Structural, carried by layout, weight and border rather than by colour: `subtle`
recedes, `normal` is ordinary, `strong` is larger, earlier, heavier and bounded, and would read as strong in a
single-colour interface. The pair is the one the colour anchors already use, so a single vocabulary names this axis
throughout. A widget offers the steps that say something about it and names them in its own documentation, so a tab
strip with no form louder than its rule takes `subtle` and `normal` alone, and an area written in a step it does not
offer lands on the nearest one it does.

A widget stating no `look` takes the one the area around it is written in, from `--skin--look`, which is `normal`
where nothing assigns it. An app quietens a whole toolbar, panel or screen by assigning the token there, and the one
control in it that asks to be loud still is, since a stated attribute answers to itself alone.

```tsx
<div style={css({ look: "subtle" })}>
```

**What it means** is colour-coded, and every meaning lands on one five-step scale:

| Step   | Says                      | Token                |
|--------|---------------------------|----------------------|
| `note` | stated or provisional     | `--skin--color-note` |
| `pass` | completed as intended     | `--skin--color-pass` |
| `flag` | singled out for attention | `--skin--color-flag` |
| `warn` | completed with caveats    | `--skin--color-warn` |
| `fail` | failed to complete        | `--skin--color-fail` |

The shape is one unjudged step plus a four-step verdict ramp: `note` is not a milder `pass`, it is the absence of a
verdict, and `flag` is not a milder `warn`, since it says a thing deserves attention without anything having gone
wrong. Five steps is the ceiling, because colour carries no more at a glance, so a meaning the scale does not carry
is stated in words rather than in a sixth colour that readers would have to learn.

Three kinds of meaning share the scale, and which one a widget carries follows from what the widget is, so no widget
carries two:

- **`level`**, on content: how much attention a passage deserves, set by the author ahead of time
- **`mode`**, on controls: what activating will do, a consequence not yet incurred
- **`status`**, on reported things: what the system says happened, at runtime

`normal` is **the default of all three, and it is not a step**: it carries no colour coding at all and leaves the
ordinary page colours, so a widget that states nothing is `normal` and a `level="normal"` passage is not a blue `note`
admonition. Only the marked values reach the scale. The widget maps those onto the steps and states that mapping in
its own documentation, so two widgets never put the same meaning on different steps.

| Attribute | `normal`            | `note`    | `pass`     | `flag`    | `warn`     | `fail`                |
|-----------|---------------------|-----------|------------|-----------|------------|-----------------------|
| `level`   | an ordinary passage | `neutral` | `positive` | `notable` | `negative` | `critical`            |
| `mode`    | an ordinary control | `safe`    | `commit`   | `publish` | `alert`    | `danger`              |
| `status`  | nothing to report   | `pending` | `success`  | `paused`  | `warning`  | `failure` or `defect` |

The two attributes together read as how it appears and what it means, here on two widgets:

```tsx
<Button look="subtle" mode="danger"/>
<Note   look="strong" level="negative"/>
```

> [!IMPORTANT]
>
> A step is never told by colour alone: an icon and the wording carry the same meaning, since the two ends of the
> ramp are the pair colour vision deficiency collapses most readily. Text in the colour of a step takes its stroke
> role, `--skin--color-note-stroke`, `--skin--color-pass-stroke`, `--skin--color-flag-stroke`,
> `--skin--color-warn-stroke` or `--skin--color-fail-stroke`, which holds AA contrast on the page, the striped row
> and the step's tint. The light caution stroke is the exception: it falls short of AA on the caution tint, so
> caution text is set on the page or a striped row, and never on the caution tint.

A thing lifted off the page takes a surface and the shadow that goes with it together, `--skin--background-color-raised`
with `--skin--box-shadow-raised` for a card that stays in the flow and `--skin--background-color-overlay` with
`--skin--box-shadow-overlay` for a menu or a dialog that leaves it. `--skin--z-index-*` settles which of two overlapping
things wins, and `--skin--background-color-blanket` dims what a modal covers.

Motion is stated the same way: `--skin--duration-*` says what kind of change a transition carries and
`--skin--easing-*` how it accelerates, and every duration collapses to zero for a reader who asked for less motion, so
a transition written through the tokens honours the preference with no rule of its own.

Where an author colours content, as a word set in red or a table cell filled in yellow, take the colour from the editor
grid: `--skin--color-black`, `--skin--color-gray` and `--skin--color-white` for a neutral, and red, yellow, green, blue
and purple in three steps, as `--skin--color-red-strong`, `--skin--color-red` and `--skin--color-red-subtle`. A strong
step stands out from the page and a subtle one stays close to it, in either colour scheme. Each colour serves as text or
as fill and keeps its hue whatever an app brands with. The colours carry no meaning, so a widget never states a status
with one. The plain step holds 3:1 on the page in either colour scheme, enough for large text and for a mark such as an
underline. That is the only contrast guarantee: any other step or pairing is the author's to judge, and so is text set
at body size, which WCAG holds to 4.5:1 rather than the 3:1 that large text and marks need.

Where a colour stands for a position rather than for a role, take it from a ten-step scale: `--skin--color-gray-*` for
a neutral, `--skin--color-subtle-*` and `--skin--color-strong-*` for a branded one, `--skin--color-heat-*` for a
magnitude. The number is the share of the anchor the step carries, `010` the faintest and `100` the anchor itself, so
the three derived scales follow a retheme. The heat scale keeps literals of its own and codes by hue, so a step means a
band a legend names rather than a position on a gradient, and a consumer states the band in text beside the colour.

Where a colour stands for one thing among others, take it from a slot or a class. `--skin--color-series-1` to
`--skin--color-series-9` paint a bar, a line or a wedge: taken in sequence and held to the thing each one paints, so a
filter dropping a series leaves the survivors their colours. `--skin--color-area-1` to `--skin--color-area-4` fill a
shape instead, a region on a choropleth or a cell on a grid, and four is the limit: a fifth class is a second map. Both
families keep one value per slot across colour schemes, and neither follows a rebrand. Nine series hold where only
neighbours are compared; where every pair is compared, on a scatter, a bubble chart or a map, the first three hold.
Some of both stay under 3:1 against the light page, so a chart carrying them states its figures in text as well and a
map keeps its boundaries drawn and names its classes in the legend.

Measures are stated in `em`, so a subtree given a size of its own takes its rhythm along. The two ladders answer
different questions: `--skin--spacing-*` sets a thing apart from what surrounds it, while `--skin--scaling-*` sizes what
is measured against the text rather than spaced from it, a glyph, a spinner, a swatch or a dot, with
`--skin--scaling-100` matching the text it sits in.

Radii come both ways: `--skin--border-radius` is a length, rounding a field, a panel or a button by the same amount
whatever size it is given, while `--skin--border-radius-*` carries a share of the box, so a mark rounds with its own
size and every share above a half draws the same roundel. `--skin--stroke-width` carries a bare number, in the user
units of the vector viewport it applies to, so the weight of a glyph holds at any size.

A breakpoint is not a width token, because CSS accepts no custom property in a media feature and
`@media (min-width: var(--x))` never matches. The design system runs the four queries once and hands the answers on as
`--skin--viewport-*` tokens, `off` by default and `on` from each width upwards, which a rule branches on through a
style query.

| Token                     | From    | What it answers                                              |
|---------------------------|---------|--------------------------------------------------------------|
| `--skin--viewport-small`  | `30rem` | a phone held upright, the one-column floor                   |
| `--skin--viewport-medium` | `48rem` | a tablet or a split window, where a second column fits       |
| `--skin--viewport-large`  | `64rem` | a laptop, where navigation becomes a rail                    |
| `--skin--viewport-xlarge` | `90rem` | a desktop, where the measure is capped rather than stretched |

Every width is a floor, so the narrow layout is what a rule states unconditionally and each breakpoint only adds to
it, leaving the narrower switches on; a band pairs the wider switch as `off` with the narrower one as `on`.

```css
@container style(--skin--viewport-medium: on) {
    app-screen {
        grid-template-columns: 1fr 2fr;
    }
}
```

The tokens are assigned on the root element and inherit, so every element sits inside a container the query matches
and no rule declares one of its own. They make a breakpoint reusable rather than retunable: the width stays in the
stylesheet, so overriding a switch forces it without moving the threshold, and an app wanting thresholds of its own
writes its own media queries. Code needing the same answer reads the token through `getComputedStyle`, as it reads
any other value outside the cascade, and gets the same answer a style query would at that moment.

A widget changing shape because of the space it was given states a `@container` size query against its own inline size
instead and needs no breakpoint at all.

A component styled against a token it cannot count on, because the stylesheet may not be loaded at all, names its own
fallback in the reference:

```css
color: var(--skin--color-strong, #B74300);
```

Restyle a single subtree instead by assigning the tokens inline, naming them through the published contract rather than
as literal strings, so a renamed token breaks the build instead of silently losing its styling:

```tsx
import { css } from "@metreeca/skin";

<section style={css({ colorStrong: "#06C" })}>
```

Read a token where a single CSS value is written by hand rather than by a rule, in an inline style or a presentation
attribute. The reference resolves wherever it is read, so it carries whatever the app overrode and whichever colour
scheme is in force:

```tsx
import { css, skin } from "@metreeca/skin";

<span style={{ backgroundColor: css.var(skin.colorStrong) }}/>
```

A component that cannot count on the stylesheet being loaded writes the reference by hand instead, naming in it the
fallback it wants, as above.

Tint a surface with a colour rather than paint it in one, to class an area as the columns of a board along its flow or
the lanes of a swimlane by type. The colour is washed into the sunken surface by the share given, so at a low share the
text the area holds stays readable on the page colour, in either colour scheme, with no `color` of its own:

```tsx
import { css, skin } from "@metreeca/skin";

<div style={css({ backgroundColor: css.tint(skin.colorHeat030, 20) })}>
```

Where a reference doesn't reach, on a canvas or against an API taking a colour as text, take the value a token resolves
to for the element it applies to, rather than a copy of the default, and keep whatever the app overrode along with the
colour scheme in force:

```typescript
import { skin } from "@metreeca/skin";

getComputedStyle(element).getPropertyValue(skin.colorStrong);
```

## Heading Groups

An `hgroup` titles a page or a section with no class attached. Its heading is set as display type, on the tighter
display leading and with no rule beneath; an `h1` or `h2` also stands well above its size in running text. A paragraph
ahead of the heading is an eyebrow naming the part of the page, set in strong small capitals of the strong accent. A
paragraph after it is a lead saying what follows, set larger in the label colour. The whole group keeps to the prose
measure, so a long title or a long lead never runs across the full width of a wide column.

```html
<hgroup>
    <p>Foundations</p>
    <h2>Colours</h2>
    <p>A handful of anchors carry literal values, and every other colour derives from them.</p>
</hgroup>
```

## Navigation

A list nested inside a `nav` reads as a compact table of contents, one level of nesting for each level of sections.
Entries are set small in the label colour. Where any top-level entry heads subsections, every top-level entry is set in
strong small capitals with its subsections unindented beneath it; an outline of top-level entries alone reads as a
plain list. Each level from the third on is indented, and a link answers the pointer as any link does. How deep an
outline runs is left to its markup: the outline never hides an entry it lists, so it stays reachable by every reader.

A top-level group may fold behind its label: wrap its label and its list in a `details` element, the label as the
`summary`. The summary reads as the label it stands for, with a chevron at the far end of the line, and folded groups
close up into a tight run of labels. Mark a group `open` to show its entries from the start, such as the group holding
the section in view, so the reader finds the current entry without opening anything.

Each entry is a link to the heading of its section, or a `span` naming a section that has no heading to link to, such
as a group of sections. Keep the entries out of headings: the page outline then lists every heading once, and a screen
reader announces the depth of each entry from the nesting of its list, as for any other nested list on the page.

```html
<nav aria-label="Contents">
    <ul>
        <li><span>Foundations</span>
            <ul>
                <li><a href="#colours">Colours</a></li>
            </ul>
        </li>
    </ul>
</nav>
```

The entry for the section in view carries `aria-current="location"`. Assistive technologies announce it as the
current location, and the design system sets it in the strong weight and the strong accent. The app sets the mark from
the scroll position rather than from the location fragment, which says only where the reader last jumped. Watch every
section, including a lead section with no entry of its own, so that scrolling back to the top clears every mark:

```typescript
const links = [...document.querySelectorAll<HTMLAnchorElement>("nav a")];

const observer = new IntersectionObserver(entries => entries
    .filter(entry => entry.isIntersecting)
    .forEach(entry => links.forEach(link => link.hash === `#${entry.target.id}`
        ? link.setAttribute("aria-current", "location") // an empty value reads as false
        : link.removeAttribute("aria-current")
    )), { rootMargin: "-30% 0px -65% 0px" } // a band a third of the way down the viewport
);

document.querySelectorAll("main > section").forEach(section => observer.observe(section));
```

# Support

- open an [issue](https://github.com/metreeca/skin/issues) to report a problem or to suggest a new feature
- start a [discussion](https://github.com/metreeca/skin/discussions) to ask a how-to question or to share an idea

# License

This project is licensed under the Apache 2.0 License –
see [LICENSE](https://github.com/metreeca/skin?tab=Apache-2.0-1-ov-file) file for details.
