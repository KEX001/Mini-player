<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue Music Player</title>
  <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
</head>
<body>
  <div id="app">
    <!-- Search Bar -->
    <input v-model="searchQuery" @input="searchSongs" placeholder="Search for songs..." />

    <!-- Search Results -->
    <ul>
      <li v-for="(track, index) in searchResults" :key="index" @click="selectTrack(track)">
        <img :src="track.cover" alt="cover" style="width: 50px; height: 50px;" />
        <div>{{ track.name }} - {{ track.artist }}</div>
      </li>
    </ul>

    <!-- Player Controls -->
    <div v-if="currentTrack">
      <img :src="currentTrack.cover" alt="cover" style="width: 100px; height: 100px;" />
      <div>{{ currentTrack.name }} - {{ currentTrack.artist }}</div>
      <audio ref="audio" v-if="audio" :src="currentTrack.source" controls></audio>
      <div>
        <button @click="prevTrack">Previous</button>
        <button @click="play">{{ isTimerPlaying ? 'Pause' : 'Play' }}</button>
        <button @click="nextTrack">Next</button>
      </div>
    </div>
  </div>

  <script>
    new Vue({
      el: "#app",
      data() {
        return {
          audio: null,
          searchQuery: '',
          searchResults: [],
          currentTrack: null,
          currentTrackIndex: 0,
          isTimerPlaying: false,
          tracks: [
            {
              name: "Aankhon Se Tune",
              artist: "Kumar Sanu, Alka Yagnik",
              cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/1.jpg",
              source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/1.mp3"
            },
            // Add more predefined tracks here...
          ]
        };
      },
      methods: {
        searchSongs() {
          if (this.searchQuery.trim() === '') {
            this.searchResults = [];
            return;
          }

          // Replace with actual API call (e.g., Spotify, YouTube API)
          fetch(`https://api.example.com/search?q=${this.searchQuery}`)
            .then(response => response.json())
            .then(data => {
              // Assuming the API returns an array of song objects
              this.searchResults = data.results.map(song => ({
                name: song.name,
                artist: song.artist,
                cover: song.coverImage,
                source: song.audioUrl
              }));
            })
            .catch(error => console.error("Error fetching songs:", error));
        },
        selectTrack(track) {
          this.currentTrack = track;
          this.audio = new Audio(track.source);
          this.audio.play();
          this.isTimerPlaying = true;
        },
        play() {
          if (this.audio.paused) {
            this.audio.play();
            this.isTimerPlaying = true;
          } else {
            this.audio.pause();
            this.isTimerPlaying = false;
          }
        },
        prevTrack() {
          if (this.currentTrackIndex > 0) {
            this.currentTrackIndex--;
          } else {
            this.currentTrackIndex = this.tracks.length - 1;
          }
          this.currentTrack = this.tracks[this.currentTrackIndex];
          this.resetPlayer();
        },
        nextTrack() {
          if (this.currentTrackIndex < this.tracks.length - 1) {
            this.currentTrackIndex++;
          } else {
            this.currentTrackIndex = 0;
          }
          this.currentTrack = this.tracks[this.currentTrackIndex];
          this.resetPlayer();
        },
        resetPlayer() {
          this.audio.currentTime = 0;
          this.audio.src = this.currentTrack.source;
          setTimeout(() => {
            if (this.isTimerPlaying) {
              this.audio.play();
            } else {
              this.audio.pause();
            }
          }, 300);
        }
      },
      created() {
        this.currentTrack = this.tracks[0];
        this.audio = new Audio(this.currentTrack.source);
      }
    });
  </script>
</body>
</html>
