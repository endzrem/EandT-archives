# Film Strip System - Changelog

## Overview
Replaced the Three.js 3D cube with a vintage film-strip system while keeping all other functionality intact.

---

## Files Modified

### 1. `script.js` - Major Changes

#### Added Functions:
- `initFilmStrip()` - Main entry point for film strip system
- `createBackgroundStrips(count)` - Creates decorative background film strips with GSAP animations
- `createMainStrip()` - Creates the main interactive film strip container
- `populateMainStripFrames()` - Populates frames with memory images (creates Set A + Set B for seamless looping)
- `createFilmFrame(memory, index, setId)` - Creates individual film frame elements
- `animateMainStrip()` - Continuous scrolling animation using GSAP
- `previewMemoryOnFilmStrip(index)` - Centers and highlights a frame on sidebar hover
- `highlightFrame(index)` - Adds visual highlight (glow + scale) to frames
- `resetFrameHighlight()` - Removes highlight from all frames
- `resizeFilmStrip()` - Handles window resize for film strip

#### Modified Functions:
- `initThreeJS()` - Now disabled (logs message only, kept for compatibility)
- `createCube()` - Disabled (kept for compatibility)
- `addLighting()` - Disabled (kept for compatibility)
- `animate()` - Disabled (kept for compatibility)
- `previewMemoryOnCube(index)` - Now calls `previewMemoryOnFilmStrip(index)`
- `handleItemHover()` - Calls `previewMemoryOnFilmStrip(index)` instead of cube preview
- `handleItemLeave()` - Resumes film strip speed + removes highlight
- `DOMContentLoaded` - Now calls `initFilmStrip()` instead of `initThreeJS()`

#### New Configuration Options (in CONFIG):
- `mainStripSpeed: 40` - Pixels per second for auto-scroll
- `backgroundStripCount: 8` - Number of decorative background strips
- `highlightPause: 1500` - ms to pause on highlight

---

### 2. `style.css` - Added Film Strip Styles

#### Added at end of file (lines 1001+):

**Background Film Layers:**
- `.bg-film-layer` - Fixed position decorative strips
- `.bg-film-strip` - SVG pattern for film strip appearance
- `.bg-film-layer.diagonal` / `.diagonal-reverse` - Rotated variants

**Main Film Stage:**
- `.main-film-stage` - Container for interactive strip (65vw x 70vh)
- `.film-grain-overlay` - Noise texture overlay for vintage feel
- Warm gradient overlay for sepia effect

**Film Strip Elements:**
- `.main-film-strip` - Vertical scrolling container
- `.film-set` - Container for one period of frames (Set A/B)
- `.film-frame` - Individual frame with 4:3 aspect ratio
- `.film-frame::before/::after` - Perforation holes (CSS pseudo-elements)
- `.frame-inner-shadow` - Inner shadow for depth
- `.film-sprockets` - Sprocket hole decorations

**Interactive States:**
- `.film-frame.film-highlight` - Active state with gold glow + scale(1.02)
- `.film-frame-number` - Frame number indicator
- `.film-frame-date` - Memory date label

**Responsive Breakpoints:**
- `@media (max-width: 1200px)` - Reduced strip width
- `@media (max-width: 900px)` - Further reduced
- `@media (max-width: 768px)` - Mobile layout (horizontal, centered)
- `@media (prefers-reduced-motion: reduce)` - Respects user preferences

**Utility:**
- `#cube-container.canvas-hidden canvas` - Hides Three.js canvas

---

### 3. `index.html` - No Changes Required

The HTML file remains unchanged. All DOM elements for the film strip are created dynamically via JavaScript inside `#cube-container`.

---

## Visual Changes

### Before:
- 3D rotating cube in center-right area
- Cube displayed memory images on its faces
- Hover rotated cube to show memory

### After:
- Vertical film strip scrolling continuously top→bottom
- Film strip displays memory images in frames
- Decorative background film strips moving across viewport
- Vintage aesthetic: grayscale + sepia + film grain
- Hover pauses/slows strip and centers highlighted frame
- Gold glow effect on active frame

---

## Behavior Changes

| Feature | Before (Cube) | After (Film Strip) |
|---------|---------------|-------------------|
| Preview trigger | `previewMemoryOnCube(index)` | `previewMemoryOnFilmStrip(index)` |
| Animation | 3D rotation | Vertical scroll + centering |
| Auto-animation | Continuous rotation | Continuous scroll (40px/sec) |
| Hover effect | Rotate to face | Center frame + glow highlight |
| Background | None | Moving decorative strips |
| Visual style | 3D glossy | Vintage film + grain |

---

## Unchanged Features

The following remain exactly as before:
- Sidebar infinite scroll behavior
- Memory list item hover/active states
- Progress indicator updates
- Click navigation to memory pages
- Relationship timer
- Music control
- Loading screen
- Quote section
- Footer
- Memory detail pages
- Gallery/lightbox functionality
- All page transitions

---

## Performance Notes

- Uses `transform: translateY()` with `will-change: transform` for GPU acceleration
- `force3D: true` on GSAP animations
- Lazy loading on frame images (`loading="lazy"`)
- Background strips use CSS opacity (0.03-0.12) for minimal impact
- Only 2 sets of frames in DOM (N × 2 elements, not dozens)

---

## Accessibility

- Frame images have `alt` text from memory titles
- Keyboard focus on sidebar items triggers highlight
- Respects `prefers-reduced-motion` media query
- All interactive elements maintain keyboard accessibility

---

## Browser Compatibility

- Modern browsers with CSS Grid/Flexbox support
- GSAP 3.x required (already included)
- Fallbacks for reduced motion preference
