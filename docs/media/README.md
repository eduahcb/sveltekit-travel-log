# Media

Drop the screenshots, GIFs, and demo clips referenced from the project README here.

Suggested files (referenced by the main README):

- `home.png` — landing / sign-in page
- `dashboard.png` — dashboard with the map and location list
- `add-location.gif` — adding a location with the draggable marker + Nominatim search
- `location-detail.png` — location detail page with logs
- `add-log.gif` — creating a location log entry
- `image-gallery.png` — image gallery on a location log
- `image-upload.gif` — uploading images to a log (SeaweedFS/S3)

Demo clips are GIFs, not `.mp4`, because GitHub only renders `<video>` embeds pointing at its
`user-attachments` upload domain — relative repo paths and `raw.githubusercontent.com` links get
stripped from the rendered README. Record a screen capture, then convert to an optimized GIF:

```bash
ffmpeg -i input.mov -vf "fps=8,scale=640:-1:flags=lanczos,palettegen=max_colors=128" palette.png
ffmpeg -i input.mov -i palette.png -filter_complex "fps=8,scale=640:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer" output.gif
```

Keep filenames matching what's linked in `README.md` / `README.pt-BR.md`, or update the links if you rename them.
