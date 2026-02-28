/**
 * OUR MEMORIES - PREMIUM MEMORY ARCHIVE
 * Vintage Film Strip Gallery with Infinite Scroll List
 * 
 * Features:
 * - Animated vintage film strip displaying memory previews
 * - Background decorative film layers
 * - Infinite scroll memory list
 * - Hover triggers film strip to highlight memory (PAUSED while hovering)
 * - Background music with mute toggle
 * - Smooth cinematic animations
 * 
 * CHANGES MADE:
 * - Fixed hover behavior: strip now PAUSES while hovering sidebar items
 * - Removed date/number overlays from frames
 * - Improved background film strips with multi-directional movement
 * - Added proper pause/resume functions for seamless scrolling
 */

// ============================================
// CONFIGURATION - Easy to customize
// ============================================
const CONFIG = {
    // Film strip settings
    mainStripSpeed: 45,           // Pixels per second for auto-scroll (slightly faster)
    backgroundStripCount: 12,     // Number of decorative background strips (increased)
    highlightPause: 0,            // No auto-resume timeout - wait for mouseleave
    
    // Audio settings
    audioVolume: 0.3,  // 0.0 to 1.0 (30% volume)
    
    // Relationship start date - EDIT THIS!
    // Format: Year, Month (0-11), Day, Hour, Minute, Second
    // Example: July 27, 2025 at 22:20:00
    relationshipStart: new Date(2025, 6, 27, 22, 20, 0),
    
    // Memory data - Add your memories here
    memories: [
        {
            id: 'first-date',
            title: 'Our First Date!',
            date: 'August 10, 2025',
            image: 'assets/images/first-date-cube.JPG',
            url: 'memories/first-date.html'
        },
        {
            id: 'graduation-endrian',
            title: 'Graduation Endrian 2025',
            date: 'June 15, 2025',
            image: 'assets/images/cube-wispril.JPG',
            url: 'memories/graduation-endrian.html'
        },
        {
            id: 'graduation-tiara',
            title: 'Deans Award Tiara 2025',
            date: 'July 20, 2025',
            image: 'assets/images/cube-deans.JPG',
            url: 'memories/graduation-tiara.html'
        },
        {
            id: 'anniversary-dinner',
            title: 'Graduation Tiara',
            date: 'September 5, 2025',
            image: 'assets/images/cube-ked.JPG',
            url: 'memories/anniversary-dinner.html'
        },
        {
            id: 'JFW 2025',
            title: 'JFW 2025',
            date: 'October 1, 2024',
            image: 'assets/images/cube-jfw.JPG',
            url: 'memories/first-photo.html'
        }
    ]
};

// ============================================
// GLOBAL VARIABLES
// ============================================
// Three.js variables (kept for compatibility but unused)
let scene, camera, renderer, cube;
let targetRotation = { x: 0, y: 0, z: 0 };
let currentRotation = { x: 0, y: 0, z: 0 };
let isHoveringList = false;
let hoveredMemoryIndex = -1;
let autoRotate = true;
let texturesLoaded = 0;
let totalTextures = 0;
let cubeMaterials = [];
let originalMaterials = [];

// Film strip variables
let filmStripElements = [];
let mainStripTimeline = null;
let bgStripTimelines = [];
let frameHeight = 0;
let isFilmStripPaused = false;
let currentHighlightedIndex = -1;
let currentStripY = 0; // Track current Y position for seamless resume

// Infinite scroll variables
let scrollPosition = 0;
let scrollVelocity = 0;
let isScrolling = false;
let scrollAnimationId = null;
const itemHeight = 58; // Height of each memory item + margin
const scrollFriction = 0.95;
const scrollSpeed = 0.02;

// Audio
let bgMusic = null;
let musicToggle = null;
let isMusicPlaying = false;

// Timer
let timerInterval = null;

// ============================================
// RELATIONSHIP TIMER
// ============================================
function initRelationshipTimer() {
    updateRelationshipTimer(); // Initial call
    timerInterval = setInterval(updateRelationshipTimer, 1000); // Update every second
}

function updateRelationshipTimer() {
    const now = new Date();
    const start = CONFIG.relationshipStart;
    const diff = now - start;
    
    if (diff < 0) {
        // Relationship hasn't started yet
        document.getElementById('relationship-timer').innerHTML = 
            '<span class="time-value">Starting soon...</span>';
        return;
    }
    
    // Calculate accurate calendar difference
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();
    let hours = now.getHours() - start.getHours();
    let minutes = now.getMinutes() - start.getMinutes();
    let seconds = now.getSeconds() - start.getSeconds();
    
    // Adjust for negative values
    if (seconds < 0) {
        seconds += 60;
        minutes--;
    }
    if (minutes < 0) {
        minutes += 60;
        hours--;
    }
    if (hours < 0) {
        hours += 24;
        days--;
    }
    if (days < 0) {
        // Get days in previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
    }
    if (months < 0) {
        months += 12;
        years--;
    }
    
    // Format display
    const timerDisplay = document.getElementById('relationship-timer');
    if (timerDisplay) {
        timerDisplay.innerHTML = `
            <span class="time-value">${years}</span><span class="time-unit">Y</span>
            <span class="time-value">${months}</span><span class="time-unit">M</span>
            <span class="time-value">${days}</span><span class="time-unit">D</span>
            <span class="time-value">${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}</span>
        `;
    }
}

// ============================================
// LOADING SCREEN
// ============================================
function updateLoadingProgress() {
    const progress = Math.round((texturesLoaded / totalTextures) * 100);
    const progressBar = document.querySelector('.loading-progress');
    const percentageText = document.querySelector('.loading-percentage');
    
    if (progressBar && percentageText) {
        progressBar.style.width = `${progress}%`;
        percentageText.textContent = `${progress}%`;
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContainer = document.getElementById('main-container');
    
    if (loadingScreen && mainContainer) {
        loadingScreen.classList.add('hidden');
        mainContainer.classList.remove('hidden');
        
        // Animate elements in
        animatePageEntrance();
        
        // Try to autoplay music
        initAudio();
        
        // Start relationship timer
        initRelationshipTimer();
    }
}

function animatePageEntrance() {
    gsap.from('.main-nav', {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    // Note: hero-letter animation kept but hero-typography is hidden via CSS
    gsap.from('.hero-letter', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2
    });
    
    gsap.from('.memory-sidebar', {
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.4
    });
    
    // Animate film strip entrance
    gsap.from('.main-film-strip', {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.6
    });
}

// ============================================
// AUDIO / MUSIC CONTROL
// ============================================
function initAudio() {
    bgMusic = document.getElementById('bg-music');
    musicToggle = document.getElementById('music-toggle');
    
    if (!bgMusic || !musicToggle) return;
    
    // Set volume
    bgMusic.volume = CONFIG.audioVolume;
    
    // Try autoplay (may be blocked by browser)
    const playPromise = bgMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isMusicPlaying = true;
            musicToggle.classList.add('playing');
        }).catch(() => {
            // Autoplay blocked - user needs to click
            isMusicPlaying = false;
            musicToggle.classList.remove('playing');
        });
    }
    
    // Toggle button click handler
    musicToggle.addEventListener('click', toggleMusic);
}

function toggleMusic() {
    if (!bgMusic) return;
    
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
    } else {
        bgMusic.play();
        musicToggle.classList.add('playing');
    }
    
    isMusicPlaying = !isMusicPlaying;
}

// ============================================
// THREE.JS SETUP (DISABLED - kept for compatibility)
// ============================================
function initThreeJS() {
    // Film strip system replaces Three.js cube
    // This function is kept for compatibility but does nothing
    console.log('Three.js cube disabled - using film strip system');
}

function createCube() {
    // Disabled - kept for compatibility
}

function addLighting() {
    // Disabled - kept for compatibility
}

function highlightCubeFace(faceIndex) {
    // Disabled - kept for compatibility
}

function resetCubeHighlight() {
    // Disabled - kept for compatibility
}

function rotateToMemory(index) {
    // Disabled - kept for compatibility
}

function previewMemoryOnCube(index) {
    // Disabled - replaced by previewMemoryOnFilmStrip
    previewMemoryOnFilmStrip(index);
}

function animate() {
    // Disabled - kept for compatibility
}

// ============================================
// VINTAGE FILM STRIP SYSTEM
// ============================================

/**
 * Initialize the film strip system
 * Main entry point called on homepage load
 */
function initFilmStrip() {
    const container = document.getElementById('cube-container');
    if (!container) return;
    
    // Hide any existing canvas (Three.js)
    container.classList.add('canvas-hidden');
    
    // Create background decorative strips
    createBackgroundStrips(CONFIG.backgroundStripCount);
    
    // Create main interactive film strip
    createMainStrip();
    
    // Populate frames with memory images
    populateMainStripFrames();
    
    // Start animation
    animateMainStrip();
    
    // Setup resize handler
    window.addEventListener('resize', resizeFilmStrip);
    
    // Hide loading screen after setup
    setTimeout(hideLoadingScreen, 800);
}

/**
 * Create decorative background film strips
 * IMPROVED: Larger, more visible, multi-directional movement
 */
function createBackgroundStrips(count) {
    // Remove existing background strips
    document.querySelectorAll('.bg-film-layer').forEach(el => el.remove());
    bgStripTimelines = [];
    
    const directions = ['left-right', 'right-left', 'top-bottom', 'bottom-top', 'diagonal', 'diagonal-reverse'];
    
    for (let i = 0; i < count; i++) {
        const strip = document.createElement('div');
        strip.className = 'bg-film-layer';
        
        // Assign direction (cycle through directions)
        const direction = directions[i % directions.length];
        strip.classList.add(direction);
        
        const stripInner = document.createElement('div');
        stripInner.className = 'bg-film-strip';
        strip.appendChild(stripInner);
        
        // Position based on direction
        if (direction === 'top-bottom' || direction === 'bottom-top') {
            strip.style.left = `${(i / count) * 100}%`;
            strip.style.top = direction === 'top-bottom' ? '-20%' : '120%';
            strip.style.width = '80px';
            strip.style.height = '150%';
        } else if (direction === 'diagonal' || direction === 'diagonal-reverse') {
            strip.style.left = '-20%';
            strip.style.top = `${Math.random() * 80}%`;
            strip.style.width = '150%';
            strip.style.height = '100px';
        } else {
            // Horizontal directions
            strip.style.left = '-20%';
            strip.style.top = `${(i / count) * 100}%`;
            strip.style.width = '150%';
            strip.style.height = '80px';
        }
        
        // Higher opacity and less blur for visibility
        const opacity = 0.3 + (Math.random() * 0.3); // 0.08 - 0.20
        const blur = 0.3 + (Math.random() * 0.3); // 0.5 - 1.5px
        strip.style.opacity = opacity;
        strip.style.filter = `blur(${blur}px) grayscale(100%) saturate(0.3)`;
        strip.style.mixBlendMode = 'multiply';
        
        document.body.appendChild(strip);
        
        // Create GSAP animation for this strip
        const duration = 30 + Math.random() * 60; // 30-90 seconds
        
        const tl = gsap.timeline({ repeat: -1, ease: 'none' });
        
        switch (direction) {
            case 'left-right':
                tl.fromTo(strip, 
                    { x: '-100%' },
                    { x: '100%', duration: duration, ease: 'none' }
                );
                break;
            case 'right-left':
                tl.fromTo(strip,
                    { x: '100%' },
                    { x: '-100%', duration: duration, ease: 'none' }
                );
                break;
            case 'top-bottom':
                tl.fromTo(strip,
                    { y: '-100%' },
                    { y: '100%', duration: duration * 1.5, ease: 'none' }
                );
                break;
            case 'bottom-top':
                tl.fromTo(strip,
                    { y: '100%' },
                    { y: '-100%', duration: duration * 1.5, ease: 'none' }
                );
                break;
            case 'diagonal':
                tl.fromTo(strip,
                    { x: '-50%', y: '-50%' },
                    { x: '50%', y: '50%', duration: duration, ease: 'none' }
                );
                break;
            case 'diagonal-reverse':
                tl.fromTo(strip,
                    { x: '50%', y: '-50%' },
                    { x: '-50%', y: '50%', duration: duration, ease: 'none' }
                );
                break;
        }
        
        bgStripTimelines.push(tl);
    }
}

/**
 * Create the main interactive film strip container
 */
function createMainStrip() {
    const container = document.getElementById('cube-container');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create main film stage
    const stage = document.createElement('div');
    stage.className = 'main-film-stage';
    stage.id = 'main-film-stage';
    
    // Create film grain overlay
    const grainOverlay = document.createElement('div');
    grainOverlay.className = 'film-grain-overlay';
    stage.appendChild(grainOverlay);
    
    // Create viewport (visible window)
    const viewport = document.createElement('div');
    viewport.className = 'main-film-viewport';
    viewport.id = 'main-film-viewport';
    stage.appendChild(viewport);
    
    // Create main film strip container (inside viewport)
    const strip = document.createElement('div');
    strip.className = 'main-film-strip';
    strip.id = 'main-film-strip';
    viewport.appendChild(strip);
    
    container.appendChild(stage);
}

/**
 * Populate the main strip with memory frames
 * Creates two sets (A and B) for seamless looping
 * REMOVED: Date and number overlays from frames
 */
function populateMainStripFrames() {
    const strip = document.getElementById('main-film-strip');
    if (!strip) return;
    
    // Clear existing frames
    strip.innerHTML = '';
    filmStripElements = [];
    
    // Create Set A
    const setA = document.createElement('div');
    setA.className = 'film-set';
    setA.id = 'film-set-a';
    
    // Create Set B (duplicate for seamless loop)
    const setB = document.createElement('div');
    setB.className = 'film-set';
    setB.id = 'film-set-b';
    
    // Generate frames for both sets
    CONFIG.memories.forEach((memory, index) => {
        // Frame for Set A
        const frameA = createFilmFrame(memory, index, 'a');
        setA.appendChild(frameA);
        filmStripElements.push(frameA);
        
        // Frame for Set B
        const frameB = createFilmFrame(memory, index, 'b');
        setB.appendChild(frameB);
        filmStripElements.push(frameB);
    });
    
    strip.appendChild(setA);
    strip.appendChild(setB);
    
    // Calculate frame height after rendering
    requestAnimationFrame(() => {
        const firstFrame = strip.querySelector('.film-frame');
        if (firstFrame) {
            frameHeight = firstFrame.offsetHeight;
        }
    });
}

/**
 * Create a single film frame element
 * REMOVED: Frame number and date overlays (only alt text for accessibility)
 */
function createFilmFrame(memory, index, setId) {
    const frame = document.createElement('div');
    frame.className = 'film-frame';
    frame.dataset.index = index;
    frame.dataset.set = setId;
    frame.dataset.memoryId = memory.id;
    
    // Inner shadow overlay
    const innerShadow = document.createElement('div');
    innerShadow.className = 'frame-inner-shadow';
    frame.appendChild(innerShadow);
    
    // Image
    const img = document.createElement('img');
    img.src = memory.image;
    img.alt = memory.title; // Accessibility: alt text from memory title
    img.loading = 'lazy';
    frame.appendChild(img);
    
    // REMOVED: Frame number overlay
    // REMOVED: Frame date overlay
    
    // Sprocket holes decoration
    const sprockets = document.createElement('div');
    sprockets.className = 'film-sprockets';
    frame.appendChild(sprockets);
    
    return frame;
}

/**
 * Animate the main film strip with continuous scrolling
 * Uses GSAP timeline with repeat:-1 for seamless loop
 */
function animateMainStrip() {
    const strip = document.getElementById('main-film-strip');
    const setA = document.getElementById('film-set-a');
    
    if (!strip || !setA) return;
    
    // Calculate total height of one set
    const setHeight = setA.offsetHeight;
    
    // Kill any existing timeline
    if (mainStripTimeline) {
        mainStripTimeline.kill();
    }
    
    // Create continuous scrolling animation
    mainStripTimeline = gsap.to(strip, {
        y: -setHeight,
        duration: setHeight / CONFIG.mainStripSpeed,
        ease: 'none',
        repeat: -1,
        force3D: true,
        onUpdate: function() {
            // Track current Y position for seamless resume
            currentStripY = gsap.getProperty(strip, 'y');
        },
        onRepeat: () => {
            // Reset position seamlessly
            gsap.set(strip, { y: 0 });
            currentStripY = 0;
        }
    });
}

/**
 * PAUSE the main film strip timeline
 * Called when hovering a sidebar item
 */
function pauseMainStrip() {
    if (mainStripTimeline) {
        mainStripTimeline.pause();
        isFilmStripPaused = true;
    }
}

/**
 * RESUME the main film strip timeline from current position
 * Called on mouseleave from sidebar item
 * Ensures smooth continuation without jumps
 */
function resumeMainStrip() {
    if (mainStripTimeline) {
        // Resume from current position - no jump
        mainStripTimeline.play();
        isFilmStripPaused = false;
    }
}

/**
 * Preview a memory on the film strip
 * Called when hovering a sidebar item
 * FIXED: Now properly PAUSES the strip while hovering
 */
function previewMemoryOnFilmStrip(index) {
    const strip = document.getElementById('main-film-strip');
    const stage = document.getElementById('main-film-stage');
    const viewport = document.getElementById('main-film-viewport');
    
    if (!strip || !stage || !viewport) return;
    
    // PAUSE the animation immediately (don't just slow down)
    pauseMainStrip();
    
    // Get viewport height for centering calculation
    const viewportHeight = viewport.offsetHeight;
    
    // Calculate frame height if not already known
    if (frameHeight === 0) {
        const firstFrame = strip.querySelector('.film-frame');
        if (firstFrame) {
            frameHeight = firstFrame.offsetHeight;
        }
    }
    
    const centerOffset = viewportHeight / 2 - frameHeight / 2;
    
    // Get current Y position
    const currentY = gsap.getProperty(strip, 'y');
    
    // Calculate the position of the target frame within the strip
    const framesPerSet = CONFIG.memories.length;
    const targetFrameY = index * frameHeight;
    
    // Get set height
    const setA = document.getElementById('film-set-a');
    const setHeight = setA ? setA.offsetHeight : framesPerSet * frameHeight;
    
    // Calculate positions for both occurrences (set A and set B)
    const posA = targetFrameY;
    const posB = targetFrameY + setHeight;
    
    // Determine which occurrence is closer to center based on current view
    const currentVisibleY = -currentY + centerOffset;
    
    const distA = Math.abs(posA - currentVisibleY);
    const distB = Math.abs(posB - currentVisibleY);
    
    let targetY;
    if (distA <= distB) {
        targetY = -(posA - centerOffset);
    } else {
        targetY = -(posB - centerOffset);
    }
    
    // Animate to target position (center the frame)
    gsap.to(strip, {
        y: targetY,
        duration: 0.75,
        ease: 'power3.out',
        force3D: true,
        onComplete: () => {
            // Update tracked position
            currentStripY = targetY;
            // Strip stays PAUSED while hover continues
        }
    });
    
    // Highlight the frame
    highlightFrame(index);
}

/**
 * Clear the preview - remove highlight
 * Called when mouse leaves sidebar item
 */
function clearPreview() {
    resetFrameHighlight();
}

/**
 * Highlight a specific frame
 */
function highlightFrame(index) {
    // Remove highlight from all frames
    document.querySelectorAll('.film-frame').forEach(frame => {
        frame.classList.remove('film-highlight');
    });
    
    // Add highlight to frames with matching index
    document.querySelectorAll(`.film-frame[data-index="${index}"`).forEach(frame => {
        frame.classList.add('film-highlight');
    });
    
    currentHighlightedIndex = index;
}

/**
 * Remove highlight from all frames
 */
function resetFrameHighlight() {
    document.querySelectorAll('.film-frame').forEach(frame => {
        frame.classList.remove('film-highlight');
    });
    currentHighlightedIndex = -1;
}

/**
 * Handle resize for film strip
 */
function resizeFilmStrip() {
    // Recalculate frame height
    const strip = document.getElementById('main-film-strip');
    const firstFrame = strip?.querySelector('.film-frame');
    if (firstFrame) {
        frameHeight = firstFrame.offsetHeight;
    }
    
    // Restart animation with new dimensions
    if (mainStripTimeline) {
        mainStripTimeline.kill();
        animateMainStrip();
    }
}

// ============================================
// INFINITE SCROLL MEMORY LIST - FIXED VISIBILITY
// ============================================
function initMemoryList() {
    const scrollContent = document.getElementById('memory-scroll-content');
    const memoryCount = document.getElementById('memory-count');
    const progressText = document.getElementById('progress-text');
    
    if (!scrollContent) return;
    
    // Update count display
    if (memoryCount) memoryCount.textContent = String(CONFIG.memories.length).padStart(2, '0');
    if (progressText) progressText.textContent = `01 / ${String(CONFIG.memories.length).padStart(2, '0')}`;
    
    // Create memory items - we create 3x the items for seamless infinite scroll
    // Original set + clone before + clone after
    const allMemories = [...CONFIG.memories, ...CONFIG.memories, ...CONFIG.memories];
    
    scrollContent.innerHTML = allMemories.map((memory, index) => {
        const originalIndex = index % CONFIG.memories.length;
        const displayNumber = String(originalIndex + 1).padStart(2, '0');
        
        return `
            <a href="${memory.url}" 
               class="memory-item" 
               data-memory="${memory.id}" 
               data-index="${originalIndex}"
               data-display-index="${displayNumber}"
               onclick="navigateToMemory(event, '${memory.url}', ${originalIndex})"
               tabindex="0">
                <span class="memory-number">${displayNumber}</span>
                <span class="memory-title">${memory.title}</span>
            </a>
        `;
    }).join('');
    
    // FIXED: Set initial scroll position to show the first set (middle)
    const singleSetHeight = CONFIG.memories.length * itemHeight;
    // Start at position 0 to show items immediately
    scrollPosition = 0;
    scrollContent.style.transform = `translateY(0px)`;
    
    // Add scroll event listener
    const scrollContainer = document.getElementById('memory-scroll');
    if (scrollContainer) {
        scrollContainer.addEventListener('wheel', handleScroll, { passive: false });
        
        // Touch support
        let touchStartY = 0;
        scrollContainer.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        scrollContainer.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            touchStartY = touchY;
            
            scrollVelocity += deltaY * 0.1;
            isScrolling = true;
            
            if (!scrollAnimationId) {
                scrollAnimationId = requestAnimationFrame(updateScroll);
            }
        }, { passive: true });
    }
    
    // Add hover listeners to items
    const items = scrollContent.querySelectorAll('.memory-item');
    items.forEach(item => {
        // Mouse events
        item.addEventListener('mouseenter', handleItemHover);
        item.addEventListener('mouseleave', handleItemLeave);
        
        // Pointer events (covers both mouse and touch)
        item.addEventListener('pointerenter', handleItemHover);
        item.addEventListener('pointerleave', handleItemLeave);
        
        // Keyboard accessibility
        item.addEventListener('focus', handleItemHover);
        item.addEventListener('blur', handleItemLeave);
    });
    
    // Animate items AFTER they exist in the DOM (GUARDED)
    if (window.gsap) {
        gsap.fromTo(
            '#memory-scroll-content .memory-item',
            { x: 30, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.05,
                ease: 'power3.out',
                delay: 0.1,
                clearProps: 'opacity,transform,translate,rotate,scale'
            }
        );
    } else {
        // Fallback: show items even if GSAP fails to load
        items.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
}

function handleScroll(e) {
    e.preventDefault();
    
    scrollVelocity += e.deltaY * scrollSpeed;
    isScrolling = true;
    
    if (!scrollAnimationId) {
        scrollAnimationId = requestAnimationFrame(updateScroll);
    }
}

function updateScroll() {
    const scrollContent = document.getElementById('memory-scroll-content');
    if (!scrollContent) return;
    
    // Apply velocity
    scrollPosition -= scrollVelocity;
    
    // Apply friction
    scrollVelocity *= scrollFriction;
    
    // Stop if velocity is very small
    if (Math.abs(scrollVelocity) < 0.1) {
        scrollVelocity = 0;
        isScrolling = false;
    }
    
    // Infinite scroll logic - wrap around
    const singleSetHeight = CONFIG.memories.length * itemHeight;
    const totalContentHeight = scrollContent.scrollHeight;
    
    // If scrolled past the end, wrap to beginning
    if (scrollPosition < -singleSetHeight * 2 + 100) {
        scrollPosition += singleSetHeight;
    }
    
    // If scrolled before the beginning, wrap to end
    if (scrollPosition > 100) {
        scrollPosition -= singleSetHeight;
    }
    
    // Apply transform
    scrollContent.style.transform = `translateY(${scrollPosition}px)`;
    
    // Continue animation if still scrolling
    if (isScrolling || Math.abs(scrollVelocity) > 0.1) {
        scrollAnimationId = requestAnimationFrame(updateScroll);
    } else {
        scrollAnimationId = null;
    }
}

/**
 * Handle hover on memory item
 * FIXED: Now properly pauses film strip and keeps it paused while hovering
 */
function handleItemHover(e) {
    const item = e.currentTarget;
    const index = parseInt(item.dataset.index);
    
    // Mark as active
    document.querySelectorAll('.memory-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    
    // Update progress
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const displayIndex = item.dataset.displayIndex;
    
    if (progressFill) {
        const progress = ((index + 1) / CONFIG.memories.length) * 100;
        progressFill.style.width = `${progress}%`;
    }
    if (progressText) {
        progressText.textContent = `${displayIndex} / ${String(CONFIG.memories.length).padStart(2, '0')}`;
    }
    
    // Update film strip to show this memory
    isHoveringList = true;
    hoveredMemoryIndex = index;
    previewMemoryOnFilmStrip(index);
}

/**
 * Handle mouseleave from memory item
 * FIXED: Now properly resumes film strip from current position
 */
function handleItemLeave() {
    isHoveringList = false;
    hoveredMemoryIndex = -1;
    clearPreview();
    
    // Resume film strip from current position (smooth, no jump)
    resumeMainStrip();
}

// ============================================
// NAVIGATION
// ============================================
function navigateToMemory(event, url, index) {
    event.preventDefault();
    
    // Show transition overlay
    const overlay = document.getElementById('transition-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
    
    // Navigate after transition
    setTimeout(() => {
        window.location.href = url;
    }, 400);
}

// ============================================
// WINDOW RESIZE
// ============================================
function onWindowResize() {
    // Film strip resize is handled by resizeFilmStrip()
    // Kept for compatibility
}

// ============================================
// MEMORY PAGE LIGHTBOX
// ============================================
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxCounter = document.querySelector('.lightbox-counter');
    
    if (!lightbox || galleryItems.length === 0) return;
    
    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => item.querySelector('img').src);
    
    // Open lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Navigate images
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    });
    
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateLightboxImage();
        }
        if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateLightboxImage();
        }
    });
    
    function updateLightboxImage() {
        lightboxImage.src = images[currentImageIndex];
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================
// MEMORY PAGE ENTRANCE ANIMATION
// ============================================
function animateMemoryPageEntrance() {
    gsap.from('.memory-nav', {
        y: -30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
    });
    
    gsap.from('.memory-hero-image', {
        scale: 1.1,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
    });
    
    gsap.from('.memory-hero-content', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.4
    });
    
    gsap.from('.memory-meta', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.6
    });
    
    gsap.from('.gallery-item', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.8
    });
}

// ============================================
// MEMORY PAGE NAVIGATION BUTTONS
// Styles the prev/next navigation links as buttons
// ============================================
function styleMemoryNavigationButtons() {
    // Find navigation links in memory pages
    const navLinks = document.querySelectorAll('.memory-nav-links a, .memory-prev-next a, [class*="prev"], [class*="next"]');
    
    navLinks.forEach(link => {
        // Check if already styled
        if (link.classList.contains('memory-nav-button')) return;
        
        // Add button class
        link.classList.add('memory-nav-button');
        
        // Determine if prev or next based on text content or href
        const text = link.textContent.toLowerCase();
        const isPrev = text.includes('prev') || text.includes('back') || text.includes('←');
        const isNext = text.includes('next') || text.includes('forward') || text.includes('→');
        
        if (isPrev) {
            link.classList.add('nav-prev');
            // Add arrow icon if not present
            if (!link.querySelector('.nav-arrow')) {
                const arrow = document.createElement('span');
                arrow.className = 'nav-arrow';
                arrow.innerHTML = '←';
                link.prepend(arrow);
            }
        } else if (isNext) {
            link.classList.add('nav-next');
            // Add arrow icon if not present
            if (!link.querySelector('.nav-arrow')) {
                const arrow = document.createElement('span');
                arrow.className = 'nav-arrow';
                arrow.innerHTML = '→';
                link.appendChild(arrow);
            }
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the homepage
    if (document.getElementById('cube-container')) {
        // Initialize film strip instead of Three.js cube
        initFilmStrip();
        initMemoryList();
    }
    
    // Check if we're on a memory page
    if (document.querySelector('.memory-page')) {
        initLightbox();
        animateMemoryPageEntrance();
        initAudio();
        styleMemoryNavigationButtons(); // Style prev/next buttons
    }
    
    // Window resize
    window.addEventListener('resize', onWindowResize);
});

// ============================================
// CUSTOMIZATION HELPERS
// ============================================

/**
 * To add a new memory:
 * 1. Add entry to CONFIG.memories array above
 * 2. Add cube image to assets/images/cube-YOUR-MEMORY.jpg
 * 3. Add gallery images: YOUR-MEMORY-1.jpg, YOUR-MEMORY-2.jpg
 * 4. Create memory page at memories/YOUR-MEMORY.html
 */

/**
 * To change film strip speed:
 * Edit CONFIG.mainStripSpeed (line 20)
 * Default: 45 (pixels per second)
 */

/**
 * To change background strip count:
 * Edit CONFIG.backgroundStripCount (line 21)
 * Default: 12
 */

/**
 * To change highlight behavior:
 * The strip now PAUSES on hover and resumes on mouseleave
 * No timeout delay - immediate pause/resume
 */

/**
 * To change music:
 * 1. Replace assets/audio/background-music.mp3 with your file
 * 2. Keep the same filename, or update the src in index.html
 * 3. Adjust CONFIG.audioVolume (0.0 to 1.0) for volume
 */

/**
 * To change colors:
 * Edit CSS variables in style.css :root section
 */
