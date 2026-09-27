# Portfolio Design Specification

## Purpose and scope

This document describes the current design and behavior of the portfolio home page. It is intended to be the editable source of truth for future changes to `src/app/page.tsx`.

The site presents Sai Siddartha Alleni as a robotics and software engineer. The experience should feel precise, capable, and technical: a restrained dark interface with luminous aqua accents, compact information density, and robotics/project evidence at the center.

## Implementation context

- Framework: Next.js App Router, React, TypeScript, Tailwind CSS v4.
- Route: the entire experience is the `/` route, rendered by `src/app/page.tsx`.
- Interactivity: `page.tsx` is a client component because navigation state, carousel state, project filtering, and the project modal are all browser-driven.
- Icons: `react-icons/lu` (Lucide icon set).
- Fonts: Geist Sans and Geist Mono are loaded by `src/app/layout.tsx`. Use the mono face only for compact labels, dates, metrics, and technology tags; use the sans face for body copy and headings.
- Global styling: `src/app/globals.css` imports Tailwind and defines the root page colors. Most visual rules live directly in Tailwind utility classes in `page.tsx`.

## Visual direction

### Design character

The page is a dark, glassy engineering portfolio. It uses a nearly-black slate canvas, subtly translucent slate surfaces, hairline borders, low-key shadows, and a bright aqua signal color. The interface should remain calm and legible; aqua is for focus, status, interaction, and measured emphasis—not large filled surfaces.

### Color system

| Role                      | Current value / Tailwind token   | Use                                                                 |
| ------------------------- | -------------------------------- | ------------------------------------------------------------------- |
| Page canvas               | `slate-950`                      | Full-page background and dark image fallback areas.                 |
| Primary surface           | `slate-900/50`                   | About, achievements, and project card panels.                       |
| Elevated surface          | `slate-900/95`                   | Project modal.                                                      |
| Recessed surface          | `slate-950/50` to `slate-950/80` | Modal content panels, metrics, empty media preview.                 |
| Default body text         | `slate-200` / `slate-300`        | General readable content.                                           |
| Muted text                | `slate-400`                      | Supporting copy, labels, and low-priority UI.                       |
| Heading text              | `white`                          | Main hierarchy.                                                     |
| Signature accent          | `#00ffd0`                        | Active tab indicator, key metrics, bullets, interactive highlights. |
| Supporting green          | `emerald-300` to `emerald-500`   | Intro, icons, badges, tags.                                         |
| Group-project distinction | `amber-300` / `amber-400`        | Group category badges only.                                         |

Use translucent colors with `backdrop-blur` on major panels. Borders are normally `slate-800` at reduced opacity, transitioning to semi-transparent aqua when an interactive project tile is hovered.

### Typography and shape

- Main hero name: 48 px (`text-5xl`), bold, tight tracking, white.
- Section heading: 30 px (`text-3xl`), bold, white.
- Card/modal title: 18–20 px on project cards; 24–30 px in the modal.
- Body copy: 16–18 px for introductory/achievement copy; 12–16 px for dense project content.
- UI microcopy: 10–12 px, often uppercase with expanded tracking and Geist Mono.
- Standard panel corners: 12 px (`rounded-xl`). Modal: 16 px (`rounded-2xl`). Carousel arrow controls are circular.
- Project surfaces use a moderate shadow; only hover and primary modal actions receive a soft aqua glow.

## Page structure and layout

### Global frame

- The root is a full-height vertical layout on `slate-950` with light slate text.
- The content column is centered and capped at `max-w-5xl` (1024 px).
- Main horizontal padding is 24 px (`px-6`), with 96 px top padding to clear the fixed navigation and 48 px bottom padding.
- The main sections have a 48 px vertical gap (`gap-12`).
- The fixed navigation spans the viewport; only its inner content is constrained to the same 1024 px maximum as the page.

### Fixed navigation

- Position: fixed to the top edge, full width, `z-40`.
- Surface: `slate-950/90` plus a large backdrop blur; there is no conventional card border.
- Four equal-width links: **Home**, **About Me**, **Achievements**, and **Projects**.
- Link styling: centered, uppercase, 14 px, semibold, wide letter spacing, 20 px vertical padding.
- Inactive link: `slate-400`; hover: pale emerald. Active link: aqua.
- A 3 px aqua bar sits at the bottom of the active link. It measures the rendered link width and slides horizontally in 300 ms.
- Clicking a link prevents native hash navigation, sets active state, and smoothly scrolls to the matching section.
- Scrolling changes the active link when a section reaches the viewport midpoint.

### Hero (`#hero`)

- Minimum height: 70% of the viewport; content is horizontally and vertically centered with 40 px of top breathing room.
- Profile image: local `src/img/zero_bg.png`, displayed as a circular image with a maximum height of 192 px and 32 px margin below. Preserve its circular treatment if replacing it.
- Heading: `Sai Siddartha, Alleni` on the first line and `Robotics & Software Engineer` on the second.
- Supporting statement: centered, maximum 448 px wide, 18 px emerald text.
- Social actions sit 48 px below the heading group: LinkedIn, GitHub, and email. They are icon-only, emerald, initially scaled to 125%, and enlarge to 150% on hover.

### About Me (`#about-me`)

- Minimum height: 50% of the viewport, vertically centered with 80 px section padding.
- Title is centered on small screens and left-aligned from the `md` breakpoint upward.
- A full-width glass panel contains the biography: 32 px padding, 12 px corners, low-opacity slate border, 18 px muted body copy, and relaxed line height.

### Achievements (`#achievements`)

- Same minimum-height and section-padding rhythm as About.
- The achievement content is a full-width carousel inside a glass panel with clipped overflow and 12 px corners.
- Each slide occupies 100% of the carousel width and has 32 px padding on small screens, 48 px from `md` upward.
- Slide content is vertically stacked and centered: aqua-tinted mono date pill; bold white title; optional external-link icon revealed on hover; muted description constrained to a wide readable line length.
- Previous/next controls are centered vertically at the left/right, inset 16 px. They are dark circular icon buttons with an aqua focus ring and aqua hover text.
- Dot controls are centered 16 px from the bottom. Active dot is aqua; inactive dots are slate.
- The carousel advances automatically every 5 seconds. Arrow and dot actions change the slide directly. With only one achievement, the control UI remains visible but does not cause a visual change.

### Projects (`#projects`)

- Minimum height: 70% of the viewport, with 80 px vertical section padding.
- Header layout stacks on narrow screens and becomes a horizontally distributed row at the `sm` breakpoint.
- The title and explanatory line are centered on mobile and left-aligned on `sm` and larger screens.
- Filter control: a compact slate container with three pills, **All**, **Solo**, and **Group**. The selected pill is an aqua-tinted bordered surface; unselected pills are muted and receive a subtle slate hover fill.
- Project cards are a vertical list with 20 px gaps. They are clickable as a whole to open project details.

#### Project card anatomy

1. **Media rail** — full card width and 144 px high on mobile; a left rail from `sm` upward (176 px at `sm`, 208 px at `md`, with a 140–150 px minimum height). Real media uses cover cropping and scales to 105% on hover. Missing media shows a dark gradient, Layers icon, and `PREVIEW` label.
2. **Category badge** — positioned over the media rail, 10 px from top/left. Solo uses aqua; Group uses amber. Both include a person/team icon and mono microcopy.
3. **Information area** — 16 px padding, increasing to 20 px at `md`. It contains up to three technology badges, a `+N more` indicator, title, and two clamped overview bullets.
4. **Footer bar** — separated with a subtle top border. Left side reads `Full Details & Architecture` with a expand icon. Right side is a compact GitHub action. This external link stops click propagation so it does not open the modal.
5. **Hover state** — slightly stronger surface, aqua-tinted border, a very subtle left-to-right green gradient overlay, aqua title/action text, and a restrained aqua shadow.

## Project detail modal

- Opening a project displays a full-screen, `z-50` dark translucent backdrop with medium blur. Background page scrolling is disabled while open.
- The modal is centered with 16/24/32 px responsive outer padding, a maximum width of 672 px (`max-w-2xl`), and a maximum height of 88vh. Its content scrolls internally.
- Modal surface: near-opaque `slate-900`, visible `slate-700` border, 16 px corners, 24 px padding on small screens and 32 px at `md`, large soft cyan-black shadow.
- Clicking the backdrop, clicking either Close control, or pressing Escape closes it. Clicking inside the panel does not close it.
- Content order:
  1. Category and `• Purdue University` metadata; title; optional green subtitle; close icon.
  2. Optional key performance metric in a bordered recessed panel—mono all-caps label left, aqua metric right.
  3. Wrapped technology badges.
  4. Recessed `Project Overview` block.
  5. `Key Technical Highlights & Implementation` bullet list, using aqua triangular bullets.
  6. Optional contribution callout, using a 4 px aqua left rule and check-mark bullets.
  7. Footer with outlined dark GitHub action (aqua icon, hover glow) and secondary Close action.

## Motion and interaction rules

| Interaction       | Required behavior                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| Navigation        | Smooth section scroll; active tab follows section position; indicator transitions for 300 ms.          |
| Social icons      | Color lightens and scale increases on hover.                                                           |
| Achievement slide | Horizontal transform animation, 500 ms, ease-in-out; automatic next slide every 5 seconds.             |
| Project card      | Border, color, overlay, shadow, and image scale transition over 200–500 ms depending on property.      |
| External links    | Open in a new tab with `noopener noreferrer`.                                                          |
| Modal             | Blocks document scroll; Escape and backdrop close it; inner scrolling preserves access to all content. |

## Responsive rules

- Base design targets narrow/mobile screens first.
- At `sm` (640 px): project header becomes a row; project cards become horizontal; media moves to the left rail; Projects heading alignment becomes left.
- At `md` (768 px): section headings remain left; card information and modal padding increase; modal/project title scales up; project media rail widens to 208 px.
- The fixed navigation remains four equal columns at all current sizes. Ensure future label changes remain short enough to avoid wrapping on a narrow viewport.

## Content model

### Project fields

Each project is rendered from the `Project` type in `page.tsx`:

| Field                                      | Used in the current UI                                                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `id`, `title`, `category`                  | Card identity, heading, filtering, category labels.                                                                       |
| `subtitle`                                 | Modal only.                                                                                                               |
| `overview`, `summaryPoints`, `fullDetails` | Modal overview, card bullets, and modal technical list.                                                                   |
| `metrics`                                  | Optional highlighted modal metric.                                                                                        |
| `role`                                     | Optional contributions callout. Do not supply an array containing an empty string; omit it when there is no role content. |
| `githubUrl`                                | Card and modal GitHub buttons. Empty URLs should not render a link in a future revision.                                  |
| `youtubeUrl`                               | Present in data but not currently rendered.                                                                               |
| `image`                                    | Card image. Empty value activates the generic preview placeholder.                                                        |
| `tags`                                     | Card shows first three; modal shows all.                                                                                  |

### Achievement fields

The `Achievement` type provides title, description, date, optional link, YouTube URL, and image. The current carousel renders only the first four fields (`title`, `description`, `date`, `link`). `youtube` and `image` are reserved for a future visual/video treatment.

## Current content inventory and intentional follow-up points

- Five active project records are present: two Solo and three Group. The displayed pill labels currently say `All (6)`, `Solo (4)`, and `Group (2)`, which does not match the rendered data. If keeping static labels, update them with the data; preferably derive counts from the project list.
- One additional solo project is commented out and is not part of the visual count.
- `src/media_sources/` contains local GIFs and images for Go2, Nav2, and Spot work, but the current cards use remote Unsplash images or a placeholder. These local assets are available for a more authentic project-media redesign.
- The three non-GitHub project records have empty `githubUrl` values, yet the current UI still creates GitHub links. A future implementation should conditionally hide or replace these actions, potentially with their existing YouTube URLs.
- The page metadata still says `Create Next App`; this does not affect visible page layout but should be updated when polishing the portfolio.

## Change guardrails

When implementing a request based on this document:

- Preserve the fixed navigation, section order, dark slate foundation, aqua accent hierarchy, and card-to-modal information flow unless the requested change explicitly replaces them.
- Keep the page usable without hover: status and content should not depend solely on hover color changes.
- Maintain visible focus treatment for buttons and links, especially carousel arrows and modal close controls.
- Preserve the mobile-first card stack and avoid making the 1024 px content column wider without a clear reason.
- Use real project imagery where available; keep media `object-cover` and provide an informative `alt` value.
- Treat this file as the design brief. A concise future request such as “update the project cards according to SPEC.md” should be understood as applying these rules to `src/app/page.tsx`.

## TODO

- [x] Improve the fixed navigation animation and keep the clicked item active during smooth scrolling.
- [x] Add a lighter, profile-compatible gradient treatment to the hero section.
- [x] Add responsive achievement image/YouTube media above the existing status, title, link, and description.
- [x] Derive project-filter counts from the project data.
- [x] Use local project media where available, prioritize YouTube video embeds, and use 16:9 media rails.
- [x] Show GitHub and video links only when a project supplies them.
- [x] Widen the project-details panel and add a subtle rounded custom scrollbar.
- [x] Add the YouTube video, when available, to the project description panel.
- [x] Inset and shorten the project-description scrollbar so it does not cover the card’s rounded corners.
- [x] Create a tagging system with v<Semantic version>+YYYYMMDD as the stable tag, v<Semantic version>-dev<number>+YYYYMMDD for development versions, v<Semantic version>-test+YYYYMMDD for versions that passed all the test cases and create a github action workflow that will only serve the latest stable tag as the webpage.
- [x] Limit commits that could be served using github pages to tagged stable versions.
- [x] The current navigation bar has a problem with adjusting different screen widths when widths get too short for the content. Need to covert the navbar to a hamburger menu when the navbar is too narrow. A good refernece point would be phone screen. The navbar should render as it is now when on a desktop or an ipad or a tablet where screen width is enough for the navbar but need to render as a hamburger menu rendered on screens too narrow.
