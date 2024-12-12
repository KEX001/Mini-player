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
      playlists: [], // Array to store playlists
      currentPlaylist: null, // Currently active playlist
    };
  },
  methods: {
    playTrack(index) {
      let track = this.tracks[index];
      this.audio.src = track.source;
      this.audio.play();
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
        if (!playlist.tracks.includes(track)) {
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
      let playlist = this.playlists.find(p => p.name === playlistName);
      if (playlist) {
        let track = playlist.tracks[trackIndex];
        this.audio.src = track.source;
        this.audio.play();
      }
    },
  },
  mounted() {
    this.audio = new Audio();
    this.loadPlaylists();
  },
});
