# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0](https://github.com/metreeca/skin/compare/v0.2.0...HEAD)

### Added

- `presets/roboto.css` - a preset setting the interface in the variable Roboto faces of the Metreeca brand, with
  Roboto Condensed for headings and Roboto Mono for code, bundled with the app in place of the platform faces
- `presets/inter.css` - a preset setting the interface in the variable Inter face, headings in Inter Tight, with
  Geist Mono for code, bundled with the app as the Roboto preset bundles its faces
- Matched mono faces - each preset scales its mono face to the lowercase of its text face, nudged down for the wider
  advance, Roboto Mono to `93%` and Geist Mono to `96%`, so anything set in `fontFamilyMono` matches the text around
  it, a label a component sets in the mono face as much as a code span, with no size restated beside the face
- `borderColorField` - the edge of a field, held to the 3:1 a control boundary takes on the page, the striped row and
  the edit background, which `markup/forms.css` draws around inputs, text areas and selects
- `colorStrongOver` - text colour for a fill painted in the strong accent, taking white or black, whichever contrasts
  more with the fill, so a label on it holds AA contrast whatever accent an app supplies, shipped orange included
- `colorFlag`, `colorFlagStroke`, `backgroundColorFlag` - a fifth step of the meaning scale, between `pass` and
  `warn`, singling a thing out for attention although nothing has gone wrong; a violet holding AA on the page, the
  stripe and its own tint in both schemes, which the important Markdown alert now takes in place of the note blue
- Editor colours - what an author picks to colour content, as text or fill: a neutral column of `colorBlack`,
  `colorGray` and `colorWhite`, and red, yellow, green, blue and purple in a `Strong`, a plain and a `Subtle` step,
  as `colorRedStrong`, `colorRed` and `colorRedSubtle`, each stating both colour schemes; the plain step holds 3:1
  on the page, enough for large text and marks, and no other step or pairing carries a contrast guarantee
- Form markup - disabled fields recede in the disabled colour, read-only fields keep their value in the text colour
  behind the decorative line in place of the field edge, checkboxes and radios take the size of the text, the
  enabled colour marks a ticked box, a slider and a progress bar, a file field's button is boxed as a button is, a
  fieldset stays inside its column and a legend is set in the strong weight, as the heading of its group; a meter
  is drawn flat in the enabled colour, taking the caution and failure steps for a value off or far from the optimum,
  its bar held clear of the outline by even room; a colour well holds its swatch by even room on every side as well;
  the button clearing a search field is drawn as a cross in the colour of the value, in place of the platform glyph;
  a date or time field shows the button opening its picker only while hovered or focused, so filled fields at rest
  read as values rather than as controls, and a disabled or read-only field, which takes no input, never shows it
- Text markup - `h4` to `h6` are styled as headings, `b` is bold and `i`, `cite`, `dfn` and `var` italic, `kbd` is
  drawn as a key cap and `samp` set in the mono face, `mark` lies on the selected tint, `sub` and `sup` are set
  smaller without opening the line, and an `abbr` carrying a title offers it as help
- Block markup - images, videos and frames never overflow their column, a `figure` takes a caption in the label size
  and colour, a `details` summary offers the pointer and the focus mark and trades the platform triangle for a chevron
  in the quiet stroke of a field border at the end of its first line, pointing down while closed and up once open in
  either writing direction, a `dialog` is an overlay surface centred over the blanket, and a table `caption` titles
  its table from above, set at the start in the strong weight as a header cell is; an image floated by its `align`
  attribute stops floating on a narrow screen and stretches across the column instead, keeping its proportions
- Navigation markup - nested lists in a `nav` read as a compact table of contents: small entries in the label colour
  without markers, top-level entries over subsections in strong small capitals, each level from the third on indented,
  a `span` naming a section with no heading, a top-level group folding behind its label as a `details` disclosure
  with a quiet chevron at the end of the line, and the `aria-current` link strong in the strong accent; a label too
  long for the column, such as an identifier with no spaces, breaks at its edge rather than widening the column;
  entries in a flat outline close up as those beneath a group do, so both share one rhythm, yet siblings still sit
  further apart than the lines of one label, so a wrapped label still reads as one entry however many lines it takes
- `lineHeightDisplay`, `letterSpacingCaps`, `inlineSizeProse` - the tight leading of display type, the tracking of
  small capitals and the reading measure of prose, so a component titling, labelling or leading a section reads
  them in place of literals and an app retuning one reaches every title, label and lead across the interface
- `textTransformHeading`, `textTransformCaps` - the casing of headings, as written by default, and of labels in
  capitals, uppercase by default, so a call site recases every title or label in a subtree by restating one token
- Heading groups - an `hgroup` sets its heading as display type with no rule beneath, a paragraph ahead of it as an
  eyebrow in strong small capitals of the strong accent and one after it as a lead, larger and in the label colour,
  the whole group held to the prose measure, so a page or section title needs no class of its own
- Text wrapping - running text keeps a lone word off its last line and a heading spread over several lines has them
  balanced, while text areas and editable content keep the platform wrapping so words entered never jump between lines
- Off-screen markup - an element carrying `data-offscreen` is kept from sight and out of the page flow while staying
  in the accessibility tree, for a status region or the name of a control shown as an icon, which the native `hidden`
  attribute would remove for every reader alike, and which no consumer package now has to hide with styles of its own
- `backgroundColorHoverNeutral`, `backgroundColorPressedNeutral` - translucent states for a control answering to no
  accent, deepening whatever surface it stands on by the same step, so a tool in a sunken tray reacts as visibly as
  one on the page; text, labels, enabled controls and the focus ring hold their budgets over both on every surface
  but the overlay, where a control on a menu, a popover or a dialog takes the accent states instead
- `strokeWidthStrong` - the stroke counterpart of `fontWeightStrong`, half again as thick as `strokeWidth`, so a
  glyph set beside strong text reads at the same weight and follows the plain width wherever an app retunes it
- `backdropFilterGlass` - the faint blur taken behind `backgroundColorGlass`, keeping what shows through from
  competing with the surfaces gathered on the glass, typed by the new exported `Filter` ladder
- `durationSpin` - the period of one turn of a busy mark, kept under `prefers-reduced-motion` while every other
  duration collapses, since a mark that stopped turning would say the work was over while it is still under way

### Fixed

- Form fields - a date field, a menu and a text field stood at different heights, since a control kept the line height
  the platform gives it and a date field the padding of its parts; every control now inherits the page line height
- `progress` - painted as a flat green bar in Blink, the reset handing it a ground and a border of its own
- Invalid field - the failure mark doubled the edge of the field, drawn beside its border rather than over it
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
- `colorDisabled` - the shares move from 20% and 25% to 19% and 23.5%, halfway in lightness between the stripe and
  the field edge, so a disabled field stays in sight but reads lighter than one taking input; it holds 1.81:1 and
  1.73:1 on the page in the light and the dark scheme, and carries `borderColor` along, since the line reads it
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
- `table` - a header cell made sticky lost the rule under it, which stayed behind as the rows scrolled; cells now
  stand separate, so each carries its own rule, and a stylesheet relying on collapsed borders has to adapt: a border
  on a row or a row group no longer draws, and a `hidden` border no longer suppresses the rule of the cell beside it
- Focus and failure marks - the part of a ring drawn outside a link, a preformatted block, a `details` summary, a
  checkbox or a radio was hidden under the background of the content following it; a ringed element is now lifted
  over that content, while a rule positioning the element itself still takes precedence over the lift
- Checkbox and radio focus marks - the drawn ring squared off around the rounded corners the platform paints on the
  box; a focused box now takes the platform ring in the focus colour, which follows those corners at a width the
  browser settles, while a failed box keeps the drawn invalid ring at the width and offset the design system states

### Changed

- `code`, `kbd`, `samp` - set at the size of the text around them rather than at the unmeasured `87.5%` of it, the
  mono face of a preset being scaled on the face itself; with the platform faces they are no longer set smaller
- `small` - set in the placeholder colour in place of the label colour, receding further from the prose around it
  while holding AA contrast on the page and the striped row in both schemes, though no longer over a control tint
- Description lists - a `dt` term is set at the size of the text around it rather than at nine tenths of it, keeping
  the strong weight and the label colour that tell it apart from the description beneath
- Enlarged images - an image carrying `active` is set on an overlay card hugging the picture, outlined, rounded and
  padded as a dialog is, rather than stretched over the viewport, so a picture with transparent areas stands on a
  surface, and a picture smaller than the viewport keeps its own size rather than being scaled up to fill the screen;
  the card stands within a narrow margin, the same at every size and in either orientation, so a phone held upright
  or sideways leaves the picture as much of the screen as it can take rather than framing it in a wide border
- Quotations and preformatted blocks - wider room to either side, so the text stands clear of the edge of the stripe,
  and a preformatted block made focusable to scroll it by keyboard shows the focus mark the controls carry
- Focus marks - links and `details` summaries are ringed with the corners a control is rounded with, and a
  preformatted block is rounded at rest, so the focus mark curves the same wherever the keyboard lands
- Headings - `h2` stands an eighth over the heading size, so it is told from `h3` at a glance, and `h4` takes the
  label colour at the heading size while `h5` and `h6` are set in the small size and the label colour; `h2` to `h6`
  stand as far off a bare container as off a paragraph, adding no room where they open their container, title a
  heading group or follow straight on from another heading, since what holds or precedes them already sets them apart
- `Flag` - the type naming the viewport tokens is renamed `Breakpoint`, so `flag` names the meaning scale step alone
- `data-theme` - the attribute pinning a colour scheme on the root element or on any subtree is renamed
  `data-scheme`, after the `color-scheme` it settles; an element left on the old name follows the platform
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
- `fontSize` - the page takes the base size on `body`, leaving the root at the size the reader set, so the token
  resolves to one length at every depth and a `rem` means the reader's setting in a rule as it does in a media query;
  a measure stated in `rem` to follow the base text size is restated in `em` or as a token
- Form fields - an invalid value is marked once the reader has edited it, through `:user-invalid`, so a required
  field left empty on arrival no longer shows as failed, and the focus ring of a field follows `:focus-visible`; a
  field an app rejects itself is marked at once through `aria-invalid="true"`, which assistive technology announces;
  a select is marked as an input and a text area are, where an invalid choice was left unmarked before
- Form values - an input, a text area, a select or an output reads in the text colour whatever colour its label takes
- Faces - `index.css` no longer bundles the Roboto faces and the font tokens default to the platform faces, so an app
  setting faces of its own ships no Roboto files; an app keeping the Metreeca brand faces imports the new
  `presets/roboto.css` preset in place of `index.css`, and its bundle carries the three Roboto faces as it did before
- `backgroundColorGlass` - a shallow step below the page and close to opaque, so on the light page the surfaces it
  gathers sit on a pale tray rather than a mid-grey slab; the dark ground stays close to black, and in either scheme
  what the glass covers shows through only faintly, where it competed with the gathered surfaces before

### Removed

- `look` - the area-wide visual register and its `--skin--look` custom property, along with `look` in `css()`: one
  value reaching every widget in an area could not quieten the buttons of a toolbar without its fields, so a binding
  package settles a default look per kind of widget, and a widget stating `look` itself is unaffected

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
