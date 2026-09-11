# EscapeSync Cinematic Landing Design

## Goal

Replace Phase 1 with a visibly new cinematic landing page that sells EscapeSync as the travel planner that keeps a group moving when plans change.

## Direction

The page adapts the supplied Mostar scroll choreography instead of copying its city or visual identity. Large editorial typography, layered full-bleed travel photography, sticky scroll storytelling, foreground depth, and horizontal destination cards create the cinematic feeling. EscapeSync keeps its midnight, electric-teal, cyan, lime, warm-warning palette and product language.

## Page structure

1. A transparent persistent navigation with Product, Rescue Mode, How it works, Sign in, and a strong Start planning action.
2. A full-height cinematic hero with Kuala Lumpur photography, an oversized `ESCAPE / SYNC` title, trip route status, and two clear actions.
3. A sticky scroll story that transitions from an ideal Kuala Lumpur to Melaka plan into a weather disruption, then reveals EscapeSync's Plan B.
4. A horizontal destination rail for Kuala Lumpur, Melaka, Langkawi, Penang, and Cameron Highlands with arrow controls and keyboard-friendly cards.
5. A Rescue Mode comparison showing the original outdoor stop and the indoor replacement, time impact, budget impact, and crew agreement.
6. A compact system section for Group Sync, Budget Brain, Live Route, and Pip Assistant.
7. A photographic final CTA that starts the existing trip builder.

## Assets

Use remote Unsplash images of Kuala Lumpur, Melaka, and Langkawi selected from their free-use pages. Each image receives useful alt text when informative and an empty alt only when purely decorative. CSS provides a dark gradient fallback so the page remains readable if an image request fails.

## Interaction

Existing `data-action` values remain the integration contract with `app.js`. The new page adds native JavaScript for scroll progress, pointer parallax, and the destination rail. Controls work with keyboard input. Under `prefers-reduced-motion`, parallax and eased transitions stop while all information remains visible.

## Responsive behavior

At desktop widths the hero uses layered titles and floating status elements. Tablet reduces title scale and stacking depth. Mobile uses a conventional compact navigation, single-column content, 44px touch targets, horizontally scrollable destinations, and no pointer-driven movement.

## Verification

Content tests assert the new cinematic sections, remote imagery, preserved primary actions, slider controls, and reduced-motion support. The full existing Node suite must pass. Browser checks cover 1440px and 375px widths, visible layout, navigation actions, destination controls, and console errors.
