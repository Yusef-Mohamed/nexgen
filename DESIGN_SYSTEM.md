# Nexgen Frontend Design System

This document is the source of truth for visual style across the public site.
When asked for a "design pass" or "make page X look better / synced with the
landing page," follow the patterns here. The landing page (`src/app/[locale]/(root)/page.tsx`
and its `components/`) is the canonical reference.

---

## 1. Color Tokens

All colors live as CSS variables in `src/app/[locale]/globals.css` and are
exposed via Tailwind utilities. **Never hard-code hex/HSL values in components.**
If you need a tinted variant, use opacity (e.g. `bg-primary/10`).

### Brand

| Token              | Tailwind                       | Use                                           |
| ------------------ | ------------------------------ | --------------------------------------------- |
| `--primary`        | `bg-primary`, `text-primary`   | Primary CTAs, links, primary tone accents.    |
| `--primary-main`   | `text-primary-main`            | Slightly darker primary for badge text.       |
| `--primary-faded`  | `bg-primary-faded`             | Soft tinted panel background (panels, hero).  |
| `--secondary`      | `bg-secondary`, `text-secondary` | Secondary tone (purple) — alternates with primary. |
| `--gold`           | `bg-gold`, `text-gold`         | Tertiary accent — ratings, highlights, "premium". |
| `--green` / `--fadedGreen` | `text-green`, `bg-fadedGreen` | Success, "free", positive deltas.       |
| `--destructive`    | `text-destructive`             | Errors, warnings.                             |

### Surface / text

| Token              | Tailwind            | Use                                           |
| ------------------ | ------------------- | --------------------------------------------- |
| `--background`     | `bg-background`     | Page background (handled by `<main>`).        |
| `--clear-ground`   | `bg-clear-ground`   | Card / panel surface (works in light & dark). |
| `--muted`          | `bg-muted`          | Skeleton/disabled.                             |
| `--text-1`         | `text-text-1`       | Primary text (titles).                        |
| `--text-2`         | `text-text-2`       | Body text.                                    |
| `--text-3`         | `text-text-3`       | Tertiary / captions.                          |

> Light **and** dark modes are already wired up — only use these tokens and the
> theme will swap automatically.

---

## 2. Spacing, radius, typography

- **Container**: `className="container"` — already centered with `max-width: 1400px`.
- **Section padding**: `className="container secPadding"` — vertical rhythm matches landing.
- **Border radius**:
  - Pills / chips: `rounded-full`
  - Inner row cards: `rounded-xl`
  - Section panels: `rounded-2xl`
  - Hero / large frames: `rounded-3xl` (or `rounded-[32px]` / `rounded-[40px]` for the
    landing hero's image frame — only use that for the largest framed image).
- **Typography**: rely on `<h1> .. <h5>` inside `.main` (defined in `globals.css`).
  Don't override font sizes manually unless you have a reason.
- **Shadows**:
  - `cardShadow` — primary-tinted shadow for elevated panels.
  - `cardShadowSm` — same, smaller blur (chips, floating badges).
  - `cardShadowSecondary` — secondary-tinted variant for purple-themed cards.

---

## 3. Core Patterns

These are the building blocks. Reuse them; don't reinvent.

### 3.1 Eyebrow pill

A small pill above section headings. Comes in three tones.

```tsx
{/* Primary */}
<div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-primary/10 border border-primary/20">
  <span className="size-1.5 rounded-full bg-primary animate-pulse" />
  <span className="text-xs sm:text-sm font-medium text-primary">
    {eyebrowText}
  </span>
</div>
```

Tone variants — swap the three color references together:

| Tone      | bg              | border              | dot/text         |
| --------- | --------------- | ------------------- | ---------------- |
| primary   | `bg-primary/10` | `border-primary/20` | `text-primary`   |
| secondary | `bg-secondary/10` | `border-secondary/20` | `text-secondary` |
| gold      | `bg-gold/10`    | `border-gold/25`    | `text-gold`      |

For an eyebrow with a glass-morphic look (used inside the hero), use
`bg-clear-ground/80 backdrop-blur-sm border border-primary/20 cardShadowSm`
and put a `HiOutlineSparkles` (or other heroicon) on the left.

### 3.2 Section heading block

For section titles inside content panels (e.g. "What you'll learn"):

```tsx
<div className="flex items-center gap-3 mb-5 md:mb-6">
  <div className="inline-flex items-center justify-center size-10 rounded-xl bg-primary/15 text-primary">
    <Icon className="size-5" />
  </div>
  <div>
    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border bg-primary/10 border-primary/20 text-primary text-[10px] sm:text-xs font-semibold uppercase tracking-wide">
      <span className="size-1 rounded-full bg-current opacity-70" />
      {eyebrow}
    </div>
    <h3 className="mt-1 font-bold text-text-1">{title}</h3>
  </div>
</div>
```

For centered section heroes (above grids), use the centered eyebrow + heading
pattern from `Features.tsx` (`text-center max-w-2xl mx-auto`).

### 3.3 Tinted section panel ("SectionBlock")

The landing's `Features` and `WhyChooseUs` cards use this pattern. Reuse it for
any grouped content. Each panel has:

1. A tone-tinted background (`bg-primary-faded` / `bg-secondary/10` / `bg-gold/10`).
2. A matching border (`border-primary/15` / `border-secondary/20` / `border-gold/25`).
3. A 1px top accent bar in the brand tone.
4. The Section heading block above (3.2).

```tsx
<div className="relative my-6 md:my-8 rounded-2xl border bg-primary-faded border-primary/15 p-5 sm:p-6 md:p-7 overflow-hidden">
  <div className="absolute top-0 left-6 right-6 h-1 rounded-b-full opacity-70 bg-primary" />
  {/* ...heading + content... */}
</div>
```

A reusable implementation lives at the bottom of
`src/app/[locale]/(root)/courses/[courseId]/page.tsx` as `SectionBlock`.
If you copy it into another page, lift it into a shared file the second time
you need it.

### 3.4 Decorative blob accents

Used throughout the hero, sticky cards, panels. Always `aria-hidden`,
`pointer-events-none`, and use brand tokens (no raw hex).

```tsx
<div
  aria-hidden
  className="absolute -top-24 -left-24 size-72 rounded-full bg-secondary/30 dark:bg-secondary/40 blur-[110px] opacity-70 animate-pulse pointer-events-none"
/>
```

- Two opposing blobs (secondary top-left, gold bottom-right) is the standard
  hero treatment.
- For a smaller card, drop the size to `size-40` / `size-48` and the blur to
  `blur-[80px]` or `blur-[100px]`.

### 3.5 Floating stat / badge card

Small white pill with an icon tile + 1–2 lines of text. Used to overlay images.

```tsx
<div className="px-4 py-3 rounded-2xl bg-clear-ground border border-primary/10 cardShadowSm flex items-center gap-3">
  <div className="size-10 rounded-xl bg-fadedGreen flex items-center justify-center">
    <HiOutlineCheckCircle className="size-5 text-green" />
  </div>
  <div>
    <div className="text-sm font-bold text-text-1 leading-none">{title}</div>
    <div className="text-xs text-text-3 mt-1">{subtitle}</div>
  </div>
</div>
```

Position absolutely with `top/bottom` + `start/end` (use logical
properties so RTL works) and add a gentle `float` animation if it overlays a
hero image (see `Hero.tsx`).

### 3.6 Numbered tone-rotating cards

When showing a 3-step set (Features, WhyChooseUs), rotate primary → secondary
→ gold across the items. Each card has:

- Tinted bg + tinted border + hover-darker border.
- Top accent bar (`absolute top-0 left-6 right-6 h-1 rounded-b-full`) OR side
  accent bar (vertical `top-4 bottom-4 w-1 ltr:left-0 rtl:right-0`).
- A faded "01" / "02" / "03" backdrop number OR a circular badge with the number.
- Hover: `hover:-translate-y-1.5 hover:shadow-lg hover:shadow-text-1/5`.

Refer to `Features.tsx` (`toneStyles` map) for the canonical implementation.

### 3.7 List item rows

For bullet-style lists (e.g. "What you'll learn"), upgrade plain `<li>`s to
mini cards:

```tsx
<li className="flex items-start gap-3 rounded-xl bg-clear-ground/70 border border-primary/10 p-3 sm:p-4 transition-colors hover:border-primary/30">
  <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
    <HiOutlineCheckCircle className="size-4" />
  </span>
  <p className="flex-1 text-sm md:text-base text-text-2 leading-relaxed">
    {text}
  </p>
</li>
```

Swap the icon and tone to match the section's tone.

### 3.8 Card hover behavior

Cards (course cards, feature cards, list rows) all share the same hover
language:

- Slight lift: `hover:-translate-y-1` (or `-translate-y-1.5` for big cards).
- Border darkens: e.g. `border-primary/10 hover:border-primary/40`.
- Optional shadow grow: `hover:shadow-lg hover:shadow-text-1/5` (use the
  text token so it works in dark mode) or `hover:shadow-xl hover:shadow-primary/5`.
- `transition-all duration-300` (cards) or `transition-colors` (rows).

### 3.9 Buttons

Use the variants in `src/components/ui/button.tsx`. Don't restyle inline.

- **Primary CTA**: `<Button>` (default — gradient blue).
- **Secondary CTA next to primary**: `<Button variant="primaryOutline">`.
  Add `bg-clear-ground/60 backdrop-blur-sm` if it sits on a tinted panel.
- **Inside cards**: `size="sm"` with `rounded-full`.
- **Animated arrow on hover**: pair with `HiOutlineArrowRight` and
  `transition-transform group-hover:translate-x-1` (and `rtl:rotate-180
  group-hover:-translate-x-1` for RTL).

---

## 4. Iconography

Default to **Heroicons 2 Outline** via `react-icons/hi2`:

- `HiOutlineSparkles` — promo/hero eyebrow.
- `HiOutlineCheckCircle` — "what you'll learn", success.
- `HiOutlineUserGroup` — "who is this for", audience.
- `HiOutlineClipboardDocumentList` — prerequisites, requirements.
- `HiOutlineBookOpen` — course/category badge.
- `HiOutlineArrowRight` — link affordance, CTA arrows.
- `HiOutlineQueueList` — content listing.
- `HiOutlineClock` — duration.
- `HiOutlineChatBubbleLeftRight` — reviews/comments.
- `HiOutlineStar`, `HiOutlineAcademicCap`, `HiOutlineUsers` — stat tiles.

Existing pages also use `react-icons/fi` (FiPlayCircle), `react-icons/pi`
(PiExam), `react-icons/ci` (CiMobile2/CiDiscount1), `react-icons/go`
(GoInfinity), `react-icons/gr` (GrCertificate). Keep those for their
established meanings; reach for `hi2` first for new icons.

Standard icon sizes: `size-3.5` (tiny inline), `size-4` (default inline),
`size-5` (in 40px tile), `size-6` (in 48–56px tile).

---

## 5. RTL & i18n

The site supports Arabic (`ar`). Always:

- Use `start`/`end` instead of `left`/`right` for positioning
  (`absolute start-3`, `ms-auto`, `text-end`).
- For arrow icons in CTAs: `rtl:rotate-180` (and flip the hover translate).
- For decorative absolute positioning that has no `start/end` equivalent,
  use the `ltr:` / `rtl:` modifier explicitly.
- For background-image accents that should mirror, apply `rtl:-scale-x-100`.
- New strings always go through `next-intl` — read from `useTranslations` /
  `getTranslations` and add the keys to **both** `messages/en.json` and
  `messages/ar.json`.

---

## 6. Layout patterns

### Hero panel (top of a content page)

A rounded-3xl `bg-primary-faded` panel containing two corner blobs (secondary +
gold), an optional grid overlay, an eyebrow pill, a styled `<h1>`, supporting
copy, two CTAs, and a stats row. Reference: `Hero.tsx`.

### Sticky purchase / sidebar card

For pages with a buy box (`courses/[courseId]`), the right column at `lg+` is
`lg:sticky lg:top-24`, wrapped in a soft gradient backdrop:

```tsx
<div className="hidden lg:block lg:sticky lg:top-24 ...">
  <div aria-hidden className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary/15 via-secondary/10 to-gold/10 blur-2xl -z-10" />
  <div className="relative rounded-3xl bg-clear-ground border border-primary/10 cardShadow p-6">
    {/* card content */}
  </div>
</div>
```

### Content + sidebar split

`flex gap-12 xl:gap-20 secPadding` with `flex-1 w-full min-w-0` for the
content column and `basis-[40%] max-w-[29rem]` for the sticky aside.

---

## 7. Anti-patterns (do NOT do these)

- ❌ Hard-coded hex/HSL inline (`style={{ background: "linear-gradient(...#B2F7FF...)" }}`).
  Use `bg-primary-faded` etc. instead.
- ❌ Inline `useTheme` checks to swap colors. Tokens already adapt.
- ❌ `text-3xl md:text-4xl ...` on headings inside `<main>`. Use `<h1>..<h5>`
  and the global heading rules in `globals.css`.
- ❌ Creating a new shadow utility per component. Use `cardShadow` /
  `cardShadowSm` / `cardShadowSecondary`.
- ❌ Using `left-X` / `right-X` for layout positioning. Use logical
  `start-X` / `end-X`.
- ❌ Adding decorative blobs without `aria-hidden` and `pointer-events-none`.
- ❌ Plain `<h2>{...}</h2>` section openers without an eyebrow + supporting
  context. The site's voice is illustrative — always frame headings.
- ❌ Mixing the brand palette with arbitrary accent colors (teal, pink, etc.).
  Stick to primary / secondary / gold (+ green for success).

---

## 8. Pages already aligned with this system

These are good references when designing a new page:

- `src/app/[locale]/(root)/page.tsx` — landing (canonical).
- `src/app/[locale]/(root)/components/Hero.tsx` — hero pattern.
- `src/app/[locale]/(root)/components/Features.tsx` — tone-rotating cards.
- `src/app/[locale]/(root)/components/WhyChooseUs.tsx` — image + accents + numbered list.
- `src/app/[locale]/(root)/courses/[courseId]/page.tsx` — content + sticky-buy
  layout, `SectionBlock` reusable, redesigned 2026-05-02.
- `src/app/[locale]/(root)/courses/[courseId]/components/CourseMetadata.tsx` —
  primary-faded panel with ringed icon tiles.
- `src/app/[locale]/(root)/courses/[courseId]/components/CourseContent.tsx` —
  numbered accordion inside a `SectionBlock`.
- `src/components/cards/CourseCard.tsx` — card hover + footer-CTA pattern.

---

## 9. Course page redesign — 2026-05-02 changelog

What was changed when this doc was first written, kept here so you can see
"before vs after" reasoning:

**`page.tsx`**
- Replaced the bare `flex gap-20` layout with a tone-aware section-block
  layout (primary / secondary / gold rotation).
- Added decorative blob strip at the top to anchor the page to the hero
  language.
- Each "What you'll learn" / "Who this course is for" / "Prerequisites" list
  is now a tinted `SectionBlock` with an eyebrow, icon tile, top accent bar,
  and individual list-item cards.
- "Recommended to see" became a highlighted gold callout with an arrow link.
- Added an eyebrow pill above the `<h1>` showing the course's category.
- Reviews section grew an eyebrow + centered heading.
- Sticky buy card (lg+) became `lg:sticky lg:top-24` and got a soft
  primary→secondary→gold blurred backdrop.
- The "This course includes" list inside the buy card now uses tone-rotating
  icon chips.

**`CourseMetadata.tsx`**
- Removed the hard-coded `#FFF → #B2F7FF` (light) / `#282828 → #00424A` (dark)
  gradient — clashed with the brand palette.
- Replaced with `bg-primary-faded` panel + secondary/gold blob accents and
  white inner cards with ringed icon tiles in primary / secondary / gold.
- Dropped the `useTheme` hook (tokens handle dark mode).

**`CourseContent.tsx`**
- Wrapped the accordion in the `SectionBlock` visual language.
- Added a "N sections · M lessons" summary chip.
- Section rows are individual cards with a numbered chip; lessons hover-
  highlight and show duration with a clock icon.
- "Show more" became a `primaryOutline` pill button with an animated
  chevron. Skeleton placeholders match the new card style.

---

## 10. How to use this doc when redesigning a new page

1. **Read the current page.** Note which patterns are missing (eyebrow,
   blobs, tone rotation, list-item cards, sticky aside, etc.).
2. **Map content to patterns.** Each grouped section becomes a `SectionBlock`
   with a tone (rotate primary → secondary → gold for visual rhythm).
3. **Add an entry hero/heading.** Eyebrow pill + styled `<h1>` + supporting
   copy + (optional) CTA pair.
4. **Replace plain bullets with row cards.** Use the tone-matched icon chip.
5. **Add decorative blobs** at section corners using brand tokens — never
   raw hex.
6. **Audit for tokens.** No hex, no inline gradient strings, no `useTheme`
   color swaps, no `left/right` positioning.
7. **Run `npx tsc --noEmit`** before declaring done.
8. **Append a changelog entry** to section 9 of this doc so the next
   redesign has a precedent.
