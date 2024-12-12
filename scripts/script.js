new Vue({
  el: "#app",
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      tracks: [
        {
          name: "Aankhon Se Tune",
          artist: "Kumar Sanu, Alka Yagnik",
          cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/1.jpg",
          source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/1.mp3",
          url: "https://t.me/ll_KEX_ll",
          favorited: false
        },
        {
          name: "Bade Achhe Lagte",
          artist: "Amit Kumar",
          cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/2.jpg",
          source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/2.mp3",
          url: "https://t.me/ll_KEX_ll",
          favorited: true
        },
        {
          name: "Ek Pyar Ka Naghma",
          artist: "Sachin Gupta",
          cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/3.jpg",
          source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/3.mp3",
          url: "https://t.me/ll_KEX_ll",
          favorited: false
        }
      ],
      playlists: [],
      currentPlaylist: null,
      showPlaylists: false,
      currentTrackIndex: 0, // Track index to manage playback
    };
  },
  methods: {
    playTrack(index) {
      this.currentTrackIndex = index;
      let track = this.tracks[index];
      this.audio.src = track.source;
      this.audio.play();
      this.isTimerPlaying = true;
    },
    togglePlay() {
      if (this.isTimerPlaying) {
        this.audio.pause();
      } else {
        this.audio.play();
      }
      this.isTimerPlaying = !this.isTimerPlaying;
    },
    nextTrack() {
      if (this.currentPlaylist) {
        let playlist = this.playlists.find(p => p.name === this.currentPlaylist);
        if (playlist) {
          this.currentTrackIndex = (this.currentTrackIndex + 1) % playlist.tracks.length;
          let track = playlist.tracks[this.currentTrackIndex];
          this.audio.src = track.source;
          this.audio.play();
        }
      } else {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        let track = this.tracks[this.currentTrackIndex];
        this.audio.src = track.source;
        this.audio.play();
      }
    },
    previousTrack() {
      if (this.currentPlaylist) {
        let playlist = this.playlists.find(p => p.name === this.currentPlaylist);
        if (playlist) {
          this.currentTrackIndex =
            (this.currentTrackIndex - 1 + playlist.tracks.length) % playlist.tracks.length;
          let track = playlist.tracks[this.currentTrackIndex];
          this.audio.src = track.source;
          this.audio.play();
        }
      } else {
        this.currentTrackIndex =
          (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
        let track = this.tracks[this.currentTrackIndex];
        this.audio.src = track.source;
        this.audio.play();
      }
    },
    createPlaylist(name) {
      if (name && !this.playlists.find(playlist => playlist.name === name)) {
        this.playlists.push({ name, tracks: [] });
        localStorage.setItem("playlists", JSON.stringify(this.playlists));
      }
    },
    addToPlaylist(playlistName, trackIndex) {
      let playlist = this.playlists.find(p => p.name === playlistName);
      if (playlist) {
        let track = this.tracks[trackIndex];
        if (!playlist.tracks.find(t => t.source === track.source)) {
          playlist.tracks.push(track);
          localStorage.setItem("playlists", JSON.stringify(this.playlists));
        }
      }
    },
    loadPlaylists() {
      let storedPlaylists = localStorage.getItem("playlists");
      if (storedPlaylists) {
        this.playlists = JSON.parse(storedPlaylists);
      }
    },
    playFromPlaylist(playlistName, trackIndex) {
      this.currentPlaylist = playlistName;
      let playlist = this.playlists.find(p => p.name === playlistName);
      if (playlist) {
        this.currentTrackIndex = trackIndex;
        let track = playlist.tracks[trackIndex];
        this.audio.src = track.source;
        this.audio.play();
        this.isTimerPlaying = true;
      }
    },
    togglePlaylistView() {
      this.showPlaylists = !this.showPlaylists;
    },
  },
  mounted() {
    this.audio = new Audio();
    this.loadPlaylists();

    this.audio.ontimeupdate = () => {
      this.currentTime = this.audio.currentTime;
      this.barWidth = (this.audio.currentTime / this.audio.duration) * 100 + "%";
      this.circleLeft = this.barWidth;
    };

    this.audio.onloadedmetadata = () => {
      this.duration = this.audio.duration;
    };

    this.audio.onended = () => {
      this.isTimerPlaying = false;
      this.nextTrack();
    };
  },
});
