# Our Memories - Premium Memory Archive

A beautiful, cinematic interactive memory gallery with auto-rotating 3D cube preview, infinite scroll memory list, and background music. Perfect for celebrating your love story.

![Website Preview](assets/images/cube-first-photo.jpg)

## Live Demo

**Homepage:** https://ivictkftmwuee.ok.kimi.link

## ✨ Features

### 🎲 3D Cube Preview (Visual Only)
- **Auto-rotating** cube with smooth idle animation
- **NOT clickable** - purely visual storytelling
- **Hover-triggered rotation** - hovering a memory in the list rotates the cube to preview that face
- **Face highlighting** - selected memory face glows with warm accent color
- **Shadow effects** and cinematic lighting

### 📜 Infinite Scroll Memory List
- **Seamless infinite scrolling** - scroll past the end to loop back to the beginning
- **Smooth scroll physics** with momentum and friction
- **Hover to preview** - hover any memory to see it on the cube
- **Click to open** - clicking a memory navigates to its detail page
- **Supports 30+ memories** easily scalable
- **Progress indicator** shows current position

### 🎵 Background Music
- **Chill piano music** placeholder included
- **Autoplay** (if browser allows)
- **Loop continuously** at low volume (30%)
- **Mute/Unmute toggle** button in bottom right corner
- Easy to replace with your own music

### 🎨 Premium Design
- Dark cinematic theme with warm gold accents
- Vignette and gradient background effects
- Smooth GSAP animations
- Responsive design for all devices
- Custom scrollbar styling

## 📁 Updated Folder Structure

```
mensiv-site/
│
├── index.html              # Homepage with 3D cube & infinite scroll list
├── style.css               # All styles (dark cinematic theme)
├── script.js               # Three.js cube + infinite scroll + music
├── README.md               # This file
│
├── memories/               # Memory detail pages
│   ├── graduation-endrian.html
│   ├── graduation-tiara.html
│   ├── first-trip.html
│   ├── anniversary-dinner.html
│   └── first-photo.html
│
├── assets/
│   ├── images/             # All photos (18 images included)
│   │   ├── cube-*.jpg      # Cube face images (5 files)
│   │   └── *-1.jpg, *-2.jpg # Gallery images (13 files)
│   │
│   └── audio/              # Music folder
│       └── background-music.mp3  # Chill piano placeholder
│
```

## 🚀 Quick Start

1. **Download all files** from this project
2. **Replace placeholder images** with your own photos (see instructions below)
3. **Optionally replace music** with your own track
4. **Upload to GitHub** and enable GitHub Pages

## 📖 Customization Guide

### 1. Replace Images with Your Photos

#### Cube Face Images (5 images - SQUARE format)
Replace these files in `assets/images/`:
- `cube-graduation-endrian.jpg` → Your memory photo
- `cube-graduation-tiara.jpg` → Your memory photo
- `cube-first-trip.jpg` → Your memory photo
- `cube-anniversary-dinner.jpg` → Your memory photo
- `cube-first-photo.jpg` → Your memory photo

**Requirements:**
- Square format (1:1 ratio)
- Minimum 800x800 pixels
- JPG format
- File size: under 500KB each

#### Gallery Images (3 per memory)
Replace gallery images for each memory:
- `graduation-endrian-1.jpg`, `graduation-endrian-2.jpg`
- `graduation-tiara-1.jpg`, `graduation-tiara-2.jpg`
- etc.

**Requirements:**
- 4:3 ratio recommended
- Minimum 1200x900 pixels
- JPG format

### 2. Add a New Memory

#### Step 1: Add cube face image
Add your new square image to `assets/images/cube-your-memory.jpg`

#### Step 2: Update script.js
Open `script.js` and find the `CONFIG.memories` array. Add your new memory:

```javascript
memories: [
    // ... existing memories ...
    {
        id: 'your-memory-id',
        title: 'Your Memory Title',
        date: 'Month Day, Year',
        image: 'assets/images/cube-your-memory.jpg',
        url: 'memories/your-memory.html'
    }
]
```

#### Step 3: Create memory page
Copy an existing memory page (e.g., `first-trip.html`) and rename it to `your-memory.html`. Update:
- Title tag
- Hero image src
- Date
- Title
- Description
- Gallery images
- Navigation links (prev/next)

#### Step 4: Add gallery images
Add 2-3 gallery images to `assets/images/`:
- `your-memory-1.jpg`
- `your-memory-2.jpg`

### 3. Replace Background Music

#### Option A: Replace the file directly
1. Add your music file to `assets/audio/`
2. **Rename it to:** `background-music.mp3`
3. Done! The website will use your music automatically

#### Option B: Use a different filename
If you want to keep your original filename:

1. Add your music file to `assets/audio/your-music.mp3`
2. Open `index.html`
3. Find this line (around line 40):
```html
<source src="assets/audio/background-music.mp3" type="audio/mpeg">
```
4. Change it to:
```html
<source src="assets/audio/your-music.mp3" type="audio/mpeg">
```

#### Adjust Volume
Open `script.js` and find:
```javascript
audioVolume: 0.3,  // 0.0 to 1.0 (30% volume)
```
Change `0.3` to your desired volume (0.0 = silent, 1.0 = full volume)

**Music recommendations:**
- Format: MP3
- File size: under 5MB for fast loading
- Style: Chill, romantic, instrumental works best
- Length: 1-3 minutes (will loop)

### 4. Edit Titles and Descriptions

#### Homepage titles
Open `index.html` and edit:
- `.couple-names` - Your names (line ~75)
- `.relationship-label` - Subtitle
- `.anniversary-date` - Current mensiversary number

#### Memory page content
In each memory HTML file in `memories/` folder, edit:
- `.memory-hero-title` - Memory title
- `.memory-hero-date` - Date
- `.memory-hero-description` - Description paragraph
- `.meta-value` items - Location, category, year

### 5. Change Colors and Fonts

#### Colors
Open `style.css` and edit the CSS variables at the top:

```css
:root {
    --accent-color: #c9a962;        /* Gold accent - change this! */
    --accent-hover: #e8d5a3;        /* Hover color */
    --accent-glow: rgba(201, 169, 98, 0.4);  /* Glow effect */
    /* ... more colors ... */
}
```

**Suggested romantic accent colors:**
- Rose gold: `#b76e79`
- Soft pink: `#d4a5a5`
- Warm coral: `#e8a598`
- Classic red: `#c45c48`
- Lavender: `#9b8aa5`

#### Fonts
The website uses:
- **Inter** - For UI text (clean, modern)
- **Playfair Display** - For quotes and titles (elegant serif)

To change fonts, update the Google Fonts link in `index.html` and the CSS variables in `style.css`.

## 🌐 Deploy to GitHub Pages

### Step 1: Create a GitHub repository
1. Go to [GitHub](https://github.com)
2. Create a new repository named `our-memories`
3. Make it public

### Step 2: Upload your files
**Option 1 - Using Git:**
```bash
cd mensiv-site
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/our-memories.git
git push -u origin main
```

**Option 2 - Manual upload:**
1. Go to your repository on GitHub
2. Click "Add file" → "Upload files"
3. Drag and drop all files
4. Commit changes

### Step 3: Enable GitHub Pages
1. Go to repository **Settings**
2. Scroll down to **Pages** section
3. Source: **Deploy from a branch**
4. Branch: **main** / **root**
5. Click **Save**
6. Wait 2-3 minutes for deployment
7. Your site will be at: `https://YOUR_USERNAME.github.io/our-memories/`

## 🎯 How to Use the Website

### On the Homepage:
1. **Watch the cube** auto-rotate through your memories
2. **Scroll the memory list** on the right (infinite scroll!)
3. **Hover over a memory** to see it previewed on the cube
4. **Click a memory** to open its detail page
5. **Toggle music** with the button in the bottom right

### On Memory Pages:
1. View the full hero image
2. Read the story and details
3. Browse the photo gallery
4. Click images to enlarge (lightbox)
5. Navigate between memories with prev/next buttons

## 📱 Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- iOS Safari 13+
- Chrome Android 80+

## 🔧 Troubleshooting

### Cube not appearing
- Check browser console for errors
- Ensure Three.js is loading (internet connection required)
- Try refreshing the page

### Images not loading
- Check file paths are correct
- Ensure images are in the right folder
- Check file extensions match (.jpg vs .jpeg)

### Music not playing
- Browsers block autoplay - click the music button to start
- Check your audio file is in MP3 format
- Verify the file path in index.html

### Slow performance
- Reduce image file sizes (use TinyPNG)
- Use fewer gallery images per memory
- Close other browser tabs

## 💝 Tips for Best Results

### Photo Recommendations
- Use high-quality, well-lit photos
- Keep a consistent warm color tone
- Square photos for cube faces
- Landscape (4:3) for gallery images
- Optimize file sizes (under 500KB each)

### Writing Descriptions
- Keep descriptions personal and emotional
- Use 2-4 sentences per memory
- Mention specific details (location, feelings)
- Write in first person for intimacy

### Adding Many Memories (30+)
The infinite scroll list easily supports 30+ memories:
1. Add all memory entries to `CONFIG.memories` in `script.js`
2. Add corresponding cube images to `assets/images/`
3. Create memory pages for each
4. The list will automatically handle scrolling!

## 📄 Files Summary

| File | Purpose |
|------|---------|
| `index.html` | Homepage with cube and infinite scroll list |
| `style.css` | All styles, colors, animations |
| `script.js` | Three.js cube, scroll logic, music control |
| `memories/*.html` | Individual memory detail pages |
| `assets/images/cube-*.jpg` | Cube face images (5 required) |
| `assets/images/*-1.jpg` | Gallery images (3 per memory) |
| `assets/audio/background-music.mp3` | Background music |

## 📝 Code Comments

All code is heavily commented for easy customization:
- `// CONFIGURATION` - Easy-to-edit settings
- `// MUSIC CUSTOMIZATION GUIDE` - In HTML for music changes
- Inline comments throughout JavaScript

## 🎓 For Beginners

### To change text:
1. Open the HTML file
2. Find the text you want to change
3. Edit between the HTML tags

### To change images:
1. Add your new image to the `assets/images/` folder
2. Replace the old file, keeping the same name
3. Or update the `src` attribute in HTML

### To add a memory:
1. Add entry to `CONFIG.memories` in `script.js`
2. Add cube image
3. Create memory page

## Credits

- **Three.js** - 3D graphics library
- **GSAP** - Animation library
- **Google Fonts** - Inter & Playfair Display

---

**Made with love for your special memories** ❤️

For questions or issues, check the troubleshooting section above.
