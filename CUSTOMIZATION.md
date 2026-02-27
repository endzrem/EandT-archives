# Quick Customization Guide

## 🕐 Set Relationship Start Date

Open `script.js`, find line 20:
```javascript
relationshipStart: new Date(2025, 6, 27, 22, 20, 0),
```

**Format:** `new Date(Year, Month (0-11), Day, Hour, Minute, Second)`

**Example:** March 15, 2024 at 8:30 PM:
```javascript
relationshipStart: new Date(2024, 2, 15, 20, 30, 0),
```

## 🖼️ Replace Images

### Cube Face Images (Square, 800x800px minimum)
Replace these 10 files in `assets/images/`:
```
cube-graduation-endrian.jpg
cube-graduation-tiara.jpg
cube-first-trip.jpg
cube-anniversary-dinner.jpg
cube-first-photo.jpg
cube-rainy-day.jpg
cube-beach-sunset.jpg
cube-birthday-surprise.jpg
cube-study-night.jpg
cube-random-tuesday.jpg
```

### Gallery Images (4:3 ratio, 1200x900px minimum)
Replace these files for each memory (2 per memory):
```
graduation-endrian-1.jpg, graduation-endrian-2.jpg
graduation-tiara-1.jpg, graduation-tiara-2.jpg
first-trip-1.jpg, first-trip-2.jpg
anniversary-dinner-1.jpg, anniversary-dinner-2.jpg
first-photo-1.jpg, first-photo-2.jpg
rainy-day-1.jpg, rainy-day-2.jpg
beach-sunset-1.jpg, beach-sunset-2.jpg
birthday-surprise-1.jpg, birthday-surprise-2.jpg
study-night-1.jpg, study-night-2.jpg
random-tuesday-1.jpg, random-tuesday-2.jpg
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

### Memory Titles
Open `script.js`, find `CONFIG.memories` (line 27). Edit the `title` field for each memory.

### Memory Page Content
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

### Step 1: Add images
- Add `cube-your-memory.jpg` to `assets/images/` (square, 800x800px)
- Add `your-memory-1.jpg`, `your-memory-2.jpg` for gallery (4:3 ratio)

### Step 2: Add to script.js
Open `script.js`, find `CONFIG.memories` (line 27). Add after the last memory:
```javascript
{
    id: 'your-memory-id',
    title: 'Your Memory Title',
    date: 'Month Day, Year',
    image: 'assets/images/cube-your-memory.jpg',
    url: 'memories/your-memory.html'
}
```

### Step 3: Create memory page
1. Copy `memories/first-trip.html`
2. Rename to `memories/your-memory.html`
3. Edit the content (title, date, description, images)

### Step 4: Update navigation
Update the "Next" link in the previous memory and "Previous" link in the next memory.

## 🌐 Deploy to GitHub Pages

1. Create GitHub repo named `our-memories`
2. Upload all files
3. Go to Settings → Pages
4. Source: Deploy from branch → main → root
5. Save and wait 2-3 minutes
6. Visit: `https://YOUR_USERNAME.github.io/our-memories/`

---

**Need more help?** See the full README.md file!
