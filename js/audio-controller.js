// Audio Controller using Howler.js for better audio management - COMMENTED OUT AS MUSIC OPTIONS REMOVED
/*
class AudioController {
  constructor() {
    this.howler = null;
    this.isPlaying = false;
    this.currentSong = null;
    this.volume = 0.5;
    this.songMap = {
      'clair-de-lune': 'assets/music/Clair de Lune (Studio Version).mp3',
      'lovers-rock': 'assets/music/Lovers Rock.mp3',
      'love-theme': 'assets/music/Love Theme.mp3'
    };
  }

  // Initialize audio controller
  init() {
    this.loadPreferences();
    this.setupEventListeners();
  }

  // Load saved preferences
  loadPreferences() {
    this.currentSong = localStorage.getItem('selectedSong') || 'clair-de-lune';
    this.volume = parseFloat(localStorage.getItem('musicVolume') || '0.5');
    this.isPlaying = localStorage.getItem('musicPlaying') === 'true';
  }

  // Setup event listeners
  setupEventListeners() {
    // Volume slider real-time update
    const volumeSlider = document.getElementById('volume-slider');
    const volumeDisplay = document.getElementById('volume-display');

    if (volumeSlider && volumeDisplay) {
      // Set initial values
      volumeSlider.value = this.volume;
      volumeDisplay.textContent = Math.round(this.volume * 100) + '%';

      // Real-time volume update
      volumeSlider.addEventListener('input', (e) => {
        const newVolume = parseFloat(e.target.value);
        this.setVolume(newVolume);
        volumeDisplay.textContent = Math.round(newVolume * 100) + '%';
      });

      // Save volume on change
      volumeSlider.addEventListener('change', (e) => {
        const newVolume = parseFloat(e.target.value);
        this.volume = newVolume;
        localStorage.setItem('musicVolume', newVolume.toString());
      });
    }
  }

  // Load and play music
  loadMusic(songKey = null) {
    if (songKey) {
      this.currentSong = songKey;
    }

    const songUrl = this.songMap[this.currentSong];
    if (!songUrl) {
      console.log('Música não encontrada:', this.currentSong);
      return;
    }

    // Stop current music if playing
    if (this.howler) {
      this.howler.stop();
      this.howler.unload();
    }

    // Create new Howler instance
    this.howler = new Howl({
      src: [songUrl],
      volume: this.volume,
      loop: true,
      onload: () => {
        console.log('Música carregada:', this.currentSong);
        if (this.isPlaying) {
          this.play();
        }
      },
      onloaderror: (id, error) => {
        console.log('Erro ao carregar música:', error);
      },
      onplay: () => {
        console.log('Música tocando:', this.currentSong);
        this.isPlaying = true;
        localStorage.setItem('musicPlaying', 'true');
      },
      onpause: () => {
        console.log('Música pausada');
        this.isPlaying = false;
        localStorage.setItem('musicPlaying', 'false');
      },
      onstop: () => {
        console.log('Música parada');
        this.isPlaying = false;
        localStorage.setItem('musicPlaying', 'false');
      }
    });
  }

  // Play music
  play() {
    if (this.howler) {
      this.howler.play();
    } else {
      this.loadMusic();
    }
  }

  // Pause music
  pause() {
    if (this.howler) {
      this.howler.pause();
    }
  }

  // Stop music
  stop() {
    if (this.howler) {
      this.howler.stop();
    }
  }

  // Set volume (0.0 to 1.0)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.howler) {
      this.howler.volume(this.volume);
    }
  }

  // Get current volume
  getVolume() {
    return this.volume;
  }

  // Check if music is playing
  isMusicPlaying() {
    return this.isPlaying && this.howler && this.howler.playing();
  }

  // Toggle play/pause
  togglePlayback() {
    if (this.isMusicPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

  // Change song
  changeSong(songKey) {
    if (this.songMap[songKey]) {
      this.currentSong = songKey;
      localStorage.setItem('selectedSong', songKey);
      this.loadMusic(songKey);
    }
  }

  // Get current song
  getCurrentSong() {
    return this.currentSong;
  }

  // Cleanup
  destroy() {
    if (this.howler) {
      this.howler.stop();
      this.howler.unload();
    }
  }
}

// Global audio controller instance
const audioController = new AudioController();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  audioController.init();
});

// Export for global use
window.AudioController = AudioController;
window.audioController = audioController;
*/
