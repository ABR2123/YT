// Music Player with YouTube API via Backend Proxy
class MusicPlayer {
    constructor() {
        this.player = null;
        this.playlist = [];
        this.currentTrack = 0;
        this.isPlaying = false;
        this.searchResults = [];
        
        this.init();
        this.setupEventListeners();
    }

    init() {
        // Initialize YouTube API player
        window.onYouTubeIframeAPIReady = () => {
            this.player = new YT.Player('player', {
                height: '390',
                width: '640',
                events: {
                    onReady: this.onPlayerReady.bind(this),
                    onStateChange: this.onPlayerStateChange.bind(this),
                    onError: this.onPlayerError.bind(this)
                }
            });
        };
    }

    setupEventListeners() {
        // Search
        document.getElementById('searchBtn').addEventListener('click', () => this.search());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.search();
        });

        // Playback Controls
        document.getElementById('playBtn').addEventListener('click', () => this.play());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pause());
        document.getElementById('prevBtn').addEventListener('click', () => this.previous());
        document.getElementById('nextBtn').addEventListener('click', () => this.next());

        // Volume
        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            if (this.player) {
                this.player.setVolume(e.target.value);
            }
        });

        // Progress bar
        document.querySelector('.progress-bar').addEventListener('click', (e) => {
            if (this.player && this.player.getDuration()) {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                const time = percent * this.player.getDuration();
                this.player.seekTo(time);
            }
        });
    }

    async search() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) return;

        try {
            // Use backend proxy endpoint instead of direct YouTube API call
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data.error) {
                alert('Error: ' + data.error.message);
                return;
            }

            this.searchResults = data.items || [];
            this.displaySearchResults();
        } catch (error) {
            console.error('Search error:', error);
            alert('Error searching YouTube. Please try again.');
        }
    }

    displaySearchResults() {
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = '';

        this.searchResults.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.innerHTML = `
                <img src="${item.snippet.thumbnails.default.url}" alt="thumbnail" class="result-thumbnail">
                <div class="result-info">
                    <div class="result-title">${item.snippet.title}</div>
                    <div class="result-channel">${item.snippet.channelTitle}</div>
                </div>
            `;
            div.addEventListener('click', () => this.addToPlaylist(item));
            resultsContainer.appendChild(div);
        });
    }

    addToPlaylist(item) {
        const track = {
            videoId: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.default.url
        };

        this.playlist.push(track);
        this.updatePlaylistDisplay();
        
        if (this.playlist.length === 1) {
            this.loadTrack(0);
        }
    }

    updatePlaylistDisplay() {
        const playlistContainer = document.getElementById('playlist');
        playlistContainer.innerHTML = '';

        this.playlist.forEach((track, index) => {
            const div = document.createElement('div');
            div.className = `playlist-item ${index === this.currentTrack ? 'active' : ''}`;
            div.innerHTML = `
                <img src="${track.thumbnail}" alt="thumbnail" class="playlist-item-thumbnail">
                <div class="playlist-item-info">
                    <div class="playlist-item-title">${track.title}</div>
                    <div class="playlist-item-channel">${track.channel}</div>
                </div>
            `;
            div.addEventListener('click', () => this.loadTrack(index));
            playlistContainer.appendChild(div);
        });
    }

    loadTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;

        this.currentTrack = index;
        const track = this.playlist[index];

        if (this.player) {
            this.player.loadVideoById(track.videoId);
        }

        document.getElementById('trackTitle').textContent = track.title;
        document.getElementById('trackArtist').textContent = track.channel;
        this.updatePlaylistDisplay();
    }

    play() {
        if (this.player) {
            this.player.playVideo();
        }
    }

    pause() {
        if (this.player) {
            this.player.pauseVideo();
        }
    }

    next() {
        if (this.currentTrack < this.playlist.length - 1) {
            this.loadTrack(this.currentTrack + 1);
            this.play();
        }
    }

    previous() {
        if (this.currentTrack > 0) {
            this.loadTrack(this.currentTrack - 1);
            this.play();
        }
    }

    onPlayerReady() {
        document.getElementById('volumeSlider').value = 70;
        this.player.setVolume(70);
    }

    onPlayerStateChange(event) {
        const playBtn = document.getElementById('playBtn');
        const pauseBtn = document.getElementById('pauseBtn');

        switch (event.data) {
            case YT.PlayerState.PLAYING:
                this.isPlaying = true;
                playBtn.classList.add('hidden');
                pauseBtn.classList.remove('hidden');
                this.updateProgress();
                break;
            case YT.PlayerState.PAUSED:
                this.isPlaying = false;
                playBtn.classList.remove('hidden');
                pauseBtn.classList.add('hidden');
                break;
            case YT.PlayerState.ENDED:
                this.next();
                break;
        }
    }

    updateProgress() {
        if (!this.isPlaying || !this.player) return;

        const current = this.player.getCurrentTime();
        const duration = this.player.getDuration();
        const percent = (current / duration) * 100;

        document.getElementById('progressFill').style.width = percent + '%';
        document.getElementById('currentTime').textContent = this.formatTime(current);
        document.getElementById('duration').textContent = this.formatTime(duration);

        setTimeout(() => this.updateProgress(), 1000);
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    onPlayerError(event) {
        console.error('Player error:', event.data);
        alert('Error loading video. It may be restricted or unavailable.');
    }
}

// Initialize player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});
