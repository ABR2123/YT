# YouTube Music Player

A modern, feature-rich music player that integrates with the YouTube API to search for and play music videos.

## Features

- 🎵 Search YouTube for songs, artists, and playlists
- ▶️ Play/pause/next/previous controls
- 🔊 Volume control
- 📋 Playlist management
- ⏱️ Progress bar with seek functionality
- 📱 Fully responsive design
- 🎨 Modern gradient UI

## Setup

### 1. Get a YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use your existing project ID: `843541807226`)
3. Enable the YouTube Data API v3
4. Create an API key (Credentials → Create Credentials → API Key)
5. Copy your API key

### 2. Update the API Key

In `app.js`, replace `'YOUR_YOUTUBE_API_KEY'` with your actual API key:

```javascript
this.apiKey = 'YOUR_ACTUAL_API_KEY_HERE';
```

### 3. Run the Application

Simply open `index.html` in your web browser, or serve it with a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server
```

Then open `http://localhost:8000` in your browser.

## Usage

1. **Search for Music**: Enter a song title, artist name, or playlist in the search box
2. **Add to Playlist**: Click on search results to add them to your playlist
3. **Playback Controls**: Use the player buttons to play, pause, skip, or go back
4. **Volume Control**: Use the volume slider to adjust playback volume
5. **Seek**: Click on the progress bar to jump to a specific time

## API Limits

- Free YouTube API quota: 10,000 requests per day
- Be mindful of your usage to avoid hitting the quota limit

## Troubleshooting

- **"API key invalid"**: Make sure you've added the correct API key in `app.js`
- **"Video restricted"**: Some videos are unavailable in certain regions or for embedding
- **No results**: Try different search terms or check your internet connection
- **Player not loading**: Make sure you're serving the files via HTTP/HTTPS (not file://)

## Technologies Used

- HTML5
- CSS3 (Gradients, Flexbox, Animations)
- Vanilla JavaScript
- YouTube IFrame API
- YouTube Data API v3

## Project Information

- **Google Cloud Project ID**: 843541807226
- **Repository**: [github.com/ABR2123/YT](https://github.com/ABR2123/YT)

## License

MIT License - Feel free to use and modify!