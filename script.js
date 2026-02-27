/**
 * OUR MEMORIES - PREMIUM MEMORY ARCHIVE
 * Three.js 3D Cube Gallery with Infinite Scroll List
 * 
 * Features:
 * - Auto-rotating cube with DRAMATIC multi-axis motion (frontspin, sidespin, tilts)
 * - Infinite scroll memory list - FIXED VISIBILITY
 * - Hover triggers cube rotation to preview memory
 * - Background music with mute toggle
 * - Smooth cinematic animations
 */

// ============================================
// CONFIGURATION - Easy to customize
// ============================================
const CONFIG = {
    // Cube settings - BIGGER AND FASTER
    cubeSize: 4.2,              // Increased from 3.5
    autoRotateSpeed: 0.025,     // Much faster rotation (was 0.008)
    hoverRotateSpeed: 0.08,     // Faster response (was 0.02)
    
    // Audio settings
    audioVolume: 0.3,  // 0.0 to 1.0 (30% volume)
    
    // Relationship start date - EDIT THIS!
    // Format: Year, Month (0-11), Day, Hour, Minute, Second
    // Example: July 27, 2025 at 22:20:00
    relationshipStart: new Date(2025, 6, 27, 22, 20, 0),
    
    // Memory data - Add your memories here
    memories: [
        {
            id: 'graduation-endrian',
            title: 'Graduation Endrian 2025',
            date: 'June 15, 2025',
            image: 'assets/images/cube-graduation-endrian.jpg',
            url: 'memories/graduation-endrian.html'
        },
        {
            id: 'graduation-tiara',
            title: 'Graduation Tiara 2025',
            date: 'July 20, 2025',
            image: 'assets/images/cube-graduation-tiara.jpg',
            url: 'memories/graduation-tiara.html'
        },
        {
            id: 'first-trip',
            title: 'First Trip Together',
            date: 'August 10, 2025',
            image: 'assets/images/cube-first-trip.jpg',
            url: 'memories/first-trip.html'
        },
        {
            id: 'anniversary-dinner',
            title: 'Anniversary Dinner',
            date: 'September 5, 2025',
            image: 'assets/images/cube-anniversary-dinner.jpg',
            url: 'memories/anniversary-dinner.html'
        },
        {
            id: 'first-photo',
            title: 'Our First Photo',
            date: 'October 1, 2024',
            image: 'assets/images/cube-first-photo.jpg',
            url: 'memories/first-photo.html'
        }
    ]
};

// ============================================
// GLOBAL VARIABLES
// ============================================
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

// Infinite scroll variables
let scrollPosition = 0;
let scrollVelocity = 0;
let isScrolling = false;
let scrollAnimationId = null;
const itemHeight = 58; // Height of each memory item + margin
const scrollFriction = 0.95;
const scrollSpeed = 0.4;

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
    
    gsap.from('.memory-item', {
        x: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
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
// THREE.JS SETUP
// ============================================
function initThreeJS() {
    const container = document.getElementById('cube-container');
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Scene
    scene = new THREE.Scene();
    
    // Camera - adjusted for bigger cube
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 8;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Create cube
    createCube();
    
    // Add lighting
    addLighting();
    
    // Start animation loop
    animate();

    // FAILSAFE - show page even if textures fail
    setTimeout(hideLoadingScreen, 3000);
}

function createCube() {
    const geometry = new THREE.BoxGeometry(CONFIG.cubeSize, CONFIG.cubeSize, CONFIG.cubeSize);
    
    // Load textures for each face
    const textureLoader = new THREE.TextureLoader();
    
    // Create materials array (6 faces)
    // Order: right, left, top, bottom, front, back
    const faceImages = [
        CONFIG.memories[0].image, // right - face 0
        CONFIG.memories[1].image, // left - face 1
        CONFIG.memories[2].image, // top - face 2
        CONFIG.memories[3].image, // bottom - face 3
        CONFIG.memories[4].image, // front - face 4
        CONFIG.memories[0].image  // back - fallback to first
    ];
    totalTextures = faceImages.length;
    
    cubeMaterials = [];
    originalMaterials = [];
    
    faceImages.forEach((imagePath, index) => {
        textureLoader.load(
            imagePath,
            (texture) => {
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                
                const material = new THREE.MeshStandardMaterial({
                    map: texture,
                    roughness: 0.3,
                    metalness: 0.1,
                    side: THREE.FrontSide,
                    emissive: 0x000000,
                    emissiveIntensity: 0
                });
                
                cubeMaterials[index] = material;
                originalMaterials[index] = material.clone();
                texturesLoaded++;
                updateLoadingProgress();
                
                if (texturesLoaded === totalTextures) {
                    setTimeout(hideLoadingScreen, 500);
                }
            },
            undefined,
            (error) => {
                console.warn(`Failed to load texture: ${imagePath}`, error);
            
                const fallbackMaterial = new THREE.MeshStandardMaterial({
                    color: 0x1a1a1a,
                    roughness: 0.3,
                    metalness: 0.1
                });
            
                cubeMaterials[index] = fallbackMaterial;
                originalMaterials[index] = fallbackMaterial.clone();
            
                texturesLoaded++;
                updateLoadingProgress();
            
                if (texturesLoaded === totalTextures) {
                    setTimeout(hideLoadingScreen, 500);
                }
            }
        );
    });
    
    // Create cube with placeholder materials initially
    const placeholderMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.3,
        metalness: 0.1
    });
    
    cube = new THREE.Mesh(geometry, [
        placeholderMaterial, placeholderMaterial,
        placeholderMaterial, placeholderMaterial,
        placeholderMaterial, placeholderMaterial
    ]);
    
    scene.add(cube);
    
    // Update materials once loaded
    const checkMaterials = setInterval(() => {
        if (cubeMaterials.length === 6 && cubeMaterials.every(m => m !== undefined)) {
            cube.material = cubeMaterials;
            clearInterval(checkMaterials);
        }
    }, 100);
}

function addLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 8);
    scene.add(directionalLight);
    
    // Warm accent light
    const warmLight = new THREE.PointLight(0xc9a962, 0.4);
    warmLight.position.set(-5, 3, 5);
    scene.add(warmLight);
    
    // Rim light for depth
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, 0, -5);
    scene.add(rimLight);
}

// ============================================
// CUBE HIGHLIGHT EFFECT
// ============================================
function highlightCubeFace(faceIndex) {
    if (!cube || !cube.material[faceIndex]) return;
    
    // Reset all faces
    for (let i = 0; i < 6; i++) {
        if (cube.material[i]) {
            cube.material[i].emissive = new THREE.Color(0x000000);
            cube.material[i].emissiveIntensity = 0;
        }
    }
    
    // Highlight selected face
    const material = cube.material[faceIndex];
    material.emissive = new THREE.Color(0xc9a962);
    material.emissiveIntensity = 0.3;
}

function resetCubeHighlight() {
    if (!cube) return;
    
    for (let i = 0; i < 6; i++) {
        if (cube.material[i]) {
            cube.material[i].emissive = new THREE.Color(0x000000);
            cube.material[i].emissiveIntensity = 0;
        }
    }
}

// ============================================
// CUBE ROTATION - DRAMATIC MULTI-AXIS MOTION
// ============================================
function rotateToMemory(index) {
    // Calculate target rotation to show the specified memory face
    const faceRotations = [
        { x: 0, y: -Math.PI / 2, z: 0 },      // right (0)
        { x: 0, y: Math.PI / 2, z: 0 },       // left (1)
        { x: -Math.PI / 2, y: 0, z: 0 },      // top (2)
        { x: Math.PI / 2, y: 0, z: 0 },       // bottom (3)
        { x: 0, y: 0, z: 0 },                 // front (4)
        { x: 0, y: Math.PI, z: 0 }            // back (5)
    ];
    
    // Map memory index to face
    const faceIndex = index % 6;
    const target = faceRotations[faceIndex];
    
    // Smooth rotation with GSAP
    gsap.to(targetRotation, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 0.6,
        ease: 'power3.out'
    });
    
    // Highlight the face
    highlightCubeFace(faceIndex);
}

function previewMemoryOnCube(index) {
    if (!cube) return;

    const memory = CONFIG.memories[index];
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(memory.image, (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.3,
            metalness: 0.1
        });

        // FRONT FACE = index 4
        cube.material[4] = material;

        // Rotate cube to front
        gsap.to(targetRotation, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.6,
            ease: 'power3.out'
        });

        highlightCubeFace(4);
    });
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
               onclick="navigateToMemory(event, '${memory.url}', ${originalIndex})">
                <span class="memory-number">${displayNumber}</span>
                <span class="memory-title">${memory.title}</span>
            </a>
        `;
    }).join('');
    
    // Set initial scroll position to ORIGINAL (middle) set
    const singleSetHeight = CONFIG.memories.length * itemHeight;
    
    scrollPosition = -singleSetHeight;   // center on real items
    scrollContent.style.transform = `translateY(${scrollPosition}px)`;
    
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
            
            scrollVelocity += deltaY * 0.3;
            isScrolling = true;
            
            if (!scrollAnimationId) {
                scrollAnimationId = requestAnimationFrame(updateScroll);
            }
        }, { passive: true });
    }
    
    // Add hover listeners to items
    const items = scrollContent.querySelectorAll('.memory-item');
    items.forEach(item => {
        item.addEventListener('mouseenter', handleItemHover);
        item.addEventListener('mouseleave', handleItemLeave);
    });
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
    if (scrollPosition < -singleSetHeight * 2) {
        scrollPosition += singleSetHeight;
    }
    
    if (scrollPosition > 0) {
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
    
    // Rotate cube to show this memory
    isHoveringList = true;
    hoveredMemoryIndex = index;
    previewMemoryOnCube(index);
}

function handleItemLeave() {
    isHoveringList = false;
    hoveredMemoryIndex = -1;
    resetCubeHighlight();
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
    const container = document.getElementById('cube-container');
    if (!container || !camera || !renderer) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// ============================================
// ANIMATION LOOP - DRAMATIC MULTI-AXIS MOTION
// ============================================
function animate() {
    requestAnimationFrame(animate);
    
    if (!cube) return;
    
    const time = Date.now() * 0.001;
    
    // DRAMATIC auto-rotation when not hovering
    if (autoRotate && !isHoveringList) {
        // Primary Y rotation - main spin (fast)
        targetRotation.y += CONFIG.autoRotateSpeed;
        
        // X-axis tilt - dramatic front/back tilting (sidespin effect)
        targetRotation.x = Math.sin(time * 0.8) * 0.4 + Math.sin(time * 1.3) * 0.15;
        
        // Z-axis rotation - dramatic roll/tilt (frontspin effect)
        targetRotation.z = Math.sin(time * 0.5) * 0.25 + Math.cos(time * 0.7) * 0.1;
        
        // Occasional dramatic direction changes
        if (Math.sin(time * 0.3) > 0.9) {
            targetRotation.y -= CONFIG.autoRotateSpeed * 3;
        }
        
        // Add periodic "flip" effect
        if (Math.sin(time * 0.15) > 0.95) {
            targetRotation.x += 0.1;
        }
    }
    
    // Smooth rotation interpolation for all axes
    currentRotation.x += (targetRotation.x - currentRotation.x) * CONFIG.hoverRotateSpeed;
    currentRotation.y += (targetRotation.y - currentRotation.y) * CONFIG.hoverRotateSpeed;
    currentRotation.z += (targetRotation.z - currentRotation.z) * CONFIG.hoverRotateSpeed;
    
    // Apply rotation
    cube.rotation.x = currentRotation.x;
    cube.rotation.y = currentRotation.y;
    cube.rotation.z = currentRotation.z;
    
    // More dramatic floating animation
    cube.position.y = Math.sin(time * 1.2) * 0.15 + Math.sin(time * 2.1) * 0.05;
    
    // Subtle side-to-side drift
    cube.position.x = Math.sin(time * 0.4) * 0.08;
    
    renderer.render(scene, camera);
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
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the homepage
    if (document.getElementById('cube-container')) {
        initThreeJS();
        initMemoryList();
    }
    
    // Check if we're on a memory page
    if (document.querySelector('.memory-page')) {
        initLightbox();
        animateMemoryPageEntrance();
        initAudio();
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
 * To change cube size:
 * Edit CONFIG.cubeSize (line 18)
 * Default: 4.2 (was 3.5)
 */

/**
 * To change rotation speed:
 * Edit CONFIG.autoRotateSpeed (line 19)
 * Default: 0.025 (much faster than before)
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
