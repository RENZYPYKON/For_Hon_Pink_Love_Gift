# For Hon — Pink Romantic Gift Website

A small, responsive romantic website built with HTML, CSS, and JavaScript. It runs locally and can be deployed as a static website.

## Open it in VS Code
1. Extract the ZIP file.
2. Open VS Code.
3. Choose **File → Open Folder...** and select `For_Hon_Pink_Love_Gift`.
4. Open `index.html`.
5. Easiest preview: install the VS Code extension **Live Server**, then right-click `index.html` → **Open with Live Server**. You can also double-click `index.html` to open it in a browser.

## Add your photos
Put your own photos in the `photos` folder and name them exactly:
- `photo1.jpg`
- `photo2.jpg`
- `photo3.jpg`

Use JPG files for the simplest setup. If your photo is PNG, either convert it to JPG or update the matching image filename in `index.html`. Keep the photo files inside the `photos` folder. Avoid sharing private photos publicly unless you're comfortable with that.

## Personalize names and the letter
Open `script.js`:
- Change `const nickname = 'Hon';` to `'Elai'` or `'Lai'` if you'd rather.
- Edit `document.getElementById('letterNickname').textContent = 'Lai';` to the name you want in the letter.
- Edit the `letter` text in the same file to make it sound like you.

Also open `index.html` and personalize the photo captions to match the real memories.

## Add a song (optional)
1. Put an MP3 you have permission to use in `music/our-song.mp3`.
2. In `index.html`, find the audio element and uncomment:
   `<source src="music/our-song.mp3" type="audio/mpeg">`
3. The website uses a play button because browsers generally block autoplay audio.

## Share it online
To share a link, deploy the folder as a static site with a hosting service such as GitHub Pages or Netlify. Upload/deploy the contents of this folder, not the ZIP itself. Test the live link on a phone before giving it to her. Any photos included in the deployed folder will be publicly accessible to people who have the link (depending on host settings), so only upload photos you're comfortable sharing.

## Notes
- No framework or build step is required.
- The website works offline except for optional Google Fonts, which need internet access.
- The photo placeholders are intentional until you add your photos.
