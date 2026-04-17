# DiasporaJunxion Motion System

## Direction
- Motion should feel like glide, reveal, continuity, and soft landing.
- Motion should never feel bouncy, flashy, or like a demo reel.
- The header stays stable while page content moves beneath it.

## Route Transitions
- Route content is wrapped at the root layout level.
- Page changes use a shared fade plus slight vertical drift plus light blur reduction.
- Current timing:
  - enter: about `440ms`
  - exit: about `300ms`
- The effect is intentionally soft, but still responsive.

## Navigation Rules
- Header is persistent across routes.
- Desktop nav uses restrained hover motion and a subtle active underline.
- Active links get stronger contrast and a clearer resting state.
- Mobile menu uses:
  - backdrop fade
  - soft blur
  - right-side panel slide/fade

## Section Reveal Rules
- Public page sections reveal on viewport entry through a shared observer-based system.
- Default language:
  - fade in
  - rise slightly
  - soften from light blur to crisp
  - stagger direct children when the section structure supports it
- This is applied from the root route wrapper so pages feel related without copy-pasted timelines.

## Hero Motion
- Hero content uses the same reveal language, but with a tighter stagger.
- Motion is applied to grouped hero content rather than per-letter gimmicks.
- Readability stays first over video and image backgrounds.

## Interaction Motion
- Buttons use gentle lift on hover and a restrained press state.
- Cards use a small rise and shadow shift.
- Nav links and mobile menu items share the same easing family.
- Nothing should bounce.

## Timing And Easing
- Fast interaction: `180ms`
- Standard interaction: `320ms`
- Slow or reveal timing: `520ms` to `720ms`
- Standard easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- Soft reveal easing: `cubic-bezier(0.16, 1, 0.3, 1)`

## Reduced Motion
- Route transitions and reveal logic respect `prefers-reduced-motion`.
- When reduced motion is enabled:
  - route movement is effectively removed
  - reveal elements render immediately
  - smooth scrolling is disabled

## Restraint Guidelines
- Do not animate every nested element separately.
- Do not stack route, section, and component animations so they compete.
- If a section already has strong media, keep motion lighter.
