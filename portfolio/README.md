# Creative Portfolio

Separate from the corporate resume (`../index.html`). Executive black / stone / gold layout for game dev, Unity, environments, and generative AI work.

## View locally

With live-server running on `D:\Resume`:

**http://127.0.0.1:5174/portfolio/**

Or open `index.html` directly (some browsers block local video).

## Media status

All files from `D:\gitClones\Portfolio\assets` were copied here (HDRP, URP, Stable Diffusion, mocap videos, Kling ad, Suno audio, GPT prompts). Unity and game-dev slots use your screenshots and environment stills as aliases (`.jpg` paths, PNG data).

## Add or replace media

Drop files into these folders using the **exact filenames** shown on each frame (or edit `index.html` to match your names):

```
portfolio/
  assets/
    images/     PNG, JPG, WebP
    videos/     MP4
    audio/      MP3
```

### Quick copy from existing GitHub portfolio

If your files live in `D:\gitClones\Portfolio\assets\`:

```powershell
Copy-Item -Path "D:\gitClones\Portfolio\assets\*" -Destination "D:\Resume\portfolio\assets\" -Recurse -Force
```

That fills `hdrp_*.png`, `urp_*.png`, `stable_diffusion_*.png`, `video_*.mp4`, `suno_*.mp3`, `prompt_*.png`, and `kling_001.mp4` automatically.

### Unity / game stills (new filenames)

Add screenshots with the names referenced in `index.html`, e.g.:

- `unity-kewb-pro.jpg`
- `unity-brainrot.jpg`
- `gamedev-01.jpg` through `gamedev-05.jpg`
- `gamedev-hero.jpg`

Placeholders disappear when the file loads; broken paths stay as labeled frames.

## Structure

| Section | Content |
|---------|---------|
| Unity Projects | Row layout + links (edit hrefs in HTML) |
| Game Development | Screenshot grid |
| Environments | HDRP + URP |
| Animation & Character | MP4 + optional still |
| AI Still & Brand | Stable Diffusion |
| AI Advertisement Video | Kling / Veo |
| AI Audio | Suno MP3 |
| Tools & Prompt Systems | GPT / tools |

## Files

- `index.html` - page structure
- `css/site.css` - styling
- `js/gallery.js` - placeholder detection + nav scroll spy
