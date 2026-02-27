# Quick Customization Guide

## 🖼️ Replace Images

### 1. Cube Face Images (Square, 800x800px minimum)
Replace these 5 files in `assets/images/`:
```
cube-graduation-endrian.jpg
cube-graduation-tiara.jpg
cube-first-trip.jpg
cube-anniversary-dinner.jpg
cube-first-photo.jpg
```

### 2. Gallery Images (4:3 ratio, 1200x900px minimum)
Replace these files for each memory:
```
graduation-endrian-1.jpg, graduation-endrian-2.jpg
graduation-tiara-1.jpg, graduation-tiara-2.jpg
first-trip-1.jpg, first-trip-2.jpg
anniversary-dinner-1.jpg, anniversary-dinner-2.jpg
first-photo-1.jpg, first-photo-2.jpg
```

## 🎵 Replace Music

### Option 1: Same filename
1. Add your music to `assets/audio/`
2. Rename to `background-music.mp3`
3. Done!

### Option 2: Different filename
1. Add your music to `assets/audio/your-music.mp3`
2. Open `index.html`
3. Find line 42: `<source src="assets/audio/background-music.mp3"`
4. Change to: `<source src="assets/audio/your-music.mp3"`

### Change Volume
Open `script.js`, find line 18:
```javascript
audioVolume: 0.3,  // Change this number (0.0 to 1.0)
```

## ✏️ Edit Text

### Homepage
Open `index.html`:
- Line 76: `Endrian & Tiara` → Your names
- Line 77: `Our Love Story` → Your subtitle
- Line 85: `Month 12` → Your mensiversary number

### Memory Pages
Open files in `memories/` folder:
- `.memory-hero-title` - Memory title
- `.memory-hero-date` - Date
- `.memory-hero-description` - Story text

## 🎨 Change Colors

Open `style.css`, edit lines 12-20:
```css
--accent-color: #c9a962;        /* Change this gold color */
--accent-hover: #e8d5a3;        /* Hover color */
```

**Color ideas:**
- Rose gold: `#b76e79`
- Soft pink: `#d4a5a5`
- Lavender: `#9b8aa5`

## ➕ Add a New Memory

### Step 1: Add to script.js
Open `script.js`, find `CONFIG.memories` (line 22). Add after the last memory:
```javascript
{
    id: 'your-memory-id',
    title: 'Your Memory Title',
    date: 'Month Day, Year',
    image: 'assets/images/cube-your-memory.jpg',
    url: 'memories/your-memory.html'
}
```

### Step 2: Add images
- Add `cube-your-memory.jpg` to `assets/images/`
- Add `your-memory-1.jpg`, `your-memory-2.jpg` for gallery

### Step 3: Create memory page
1. Copy `memories/first-trip.html`
2. Rename to `memories/your-memory.html`
3. Edit the content

## 🌐 Deploy to GitHub Pages

1. Create GitHub repo named `our-memories`
2. Upload all files
3. Go to Settings → Pages
4. Source: Deploy from branch → main → root
5. Save and wait 2-3 minutes
6. Visit: `https://YOUR_USERNAME.github.io/our-memories/`

---

**Need more help?** See the full README.md file!
