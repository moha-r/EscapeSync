# EscapeSync Landing Mission-Control Refresh

## Goal

Refresh only Phase 1 so EscapeSync immediately communicates its differentiator: it keeps a group trip on track when plans change.

## Scope

Keep the existing page structure, navigation, copy, route preview, Trip Health Score, weather alert, Pip message, actions, palette, and responsive layout. Improve the hero's composition and movement with a mission-control-inspired route surface and deliberately layered live-status cards.

## Visual direction

- Preserve the midnight, teal/cyan, and lime EscapeSync palette and the Space Grotesk, Manrope, and JetBrains Mono type system.
- Elevate the route visual into a bounded map/radar panel with a faint grid, animated scan ring, route pulse, and labelled endpoints.
- Give each status card a consistent data-label, value, and state treatment. The weather card remains visibly urgent while the health card stays reassuring.
- Use restrained motion only: route pulse and scan ring respect `prefers-reduced-motion`.

## Behaviour and accessibility

The existing `data-action` controls and their handlers remain unchanged. Decorative motion is hidden from assistive technology; the route panel retains its descriptive accessible label. The reduced-motion media query disables non-essential animation.

## Verification

Extend the existing Node page tests to assert that Phase 1 retains the primary trip action and includes the mission-control route affordances plus a reduced-motion fallback. Run the complete Node test suite after the HTML change.
