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
      tracks: [],
      userPlaylists: [],
      likedTracks: [],
      currentPlaylistTracks: [],
      currentTrackIndex: 0,
      isAuthenticated: false,
      userName: "",
      userProfilePicture: "",
      spotifyApiToken: "",
    };
  },
  methods: {
    async authenticateSpotify() {
      const clientId = "YOUR_SPOTIFY_CLIENT_ID";
      const redirectUri = "YOUR_REDIRECT_URI";
      const scopes = "user-library-read playlist-read-private";
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;

      window.location.href = authUrl;
    },
    async fetchSpotifyUserData() {
      if (!this.spotifyApiToken) return;

      try {
        const userResponse = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${this.spotifyApiToken}` },
        });
        const userData = await userResponse.json();

        this.isAuthenticated = true;
        this.userName = userData.display_name;
        this.userProfilePicture = userData.images[0]?.url || "";

        await this.fetchUserPlaylists();
        await this.fetchLikedTracks();
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    },
    async fetchUserPlaylists() {
      try {
        const response = await fetch("https://api.spotify.com/v1/me/playlists", {
          headers: { Authorization: `Bearer ${this.spotifyApiToken}` },
        });
        const data = await response.json();

        this.userPlaylists = data.items.map((playlist) => ({
          name: playlist.name,
          id: playlist.id,
          image: playlist.images[0]?.url || "",
        }));
      } catch (error) {
        console.error("Error fetching playlists: ", error);
      }
    },
    async fetchLikedTracks() {
      try {
        const response = await fetch("https://api.spotify.com/v1/me/tracks", {
          headers: { Authorization: `Bearer ${this.spotifyApiToken}` },
        });
        const data = await response.json();

        this.likedTracks = data.items.map((item) => ({
          name: item.track.name,
          artist: item.track.artists.map((a) => a.name).join(", "),
          cover: item.track.album.images[0]?.url || "",
          source: item.track.preview_url,
        }));
      } catch (error) {
        console.error("Error fetching liked tracks: ", error);
      }
    },
    async playPlaylist(playlistId) {
      try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: { Authorization: `Bearer ${this.spotifyApiToken}` },
        });
        const data = await response.json();

        this.currentPlaylistTracks = data.items.map((item) => ({
          name: item.track.name,
          artist: item.track.artists.map((a) => a.name).join(", "),
          cover: item.track.album.images[0]?.url || "",
          source: item.track.preview_url,
        }));

        this.playTrack(0);
      } catch (error) {
        console.error("Error playing playlist: ", error);
      }
    },
    playTrack(index) {
      if (this.currentPlaylistTracks.length > 0) {
        this.currentTrackIndex = index;
        const track = this.currentPlaylistTracks[index];
        this.audio.src = track.source;
        this.audio.play();
        this.isTimerPlaying = true;
      }
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
      if (this.currentPlaylistTracks.length > 0) {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.currentPlaylistTracks.length;
        this.playTrack(this.currentTrackIndex);
      }
    },
    previousTrack() {
      if (this.currentPlaylistTracks.length > 0) {
        this.currentTrackIndex =
          (this.currentTrackIndex - 1 + this.currentPlaylistTracks.length) % this.currentPlaylistTracks.length;
        this.playTrack(this.currentTrackIndex);
      }
    },
  },
  mounted() {
    this.audio = new Audio();

    // Extract Spotify token from URL hash if present
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      this.spotifyApiToken = params.get("access_token");
      window.location.hash = "";
      this.fetchSpotifyUserData();
    }

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
