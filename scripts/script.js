<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue Music Player</title>
  <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
  <style>
    /* Simple CSS for layout */
    body {
      font-family: Arial, sans-serif;
    }
    #app {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }
    .search-container {
      margin-bottom: 20px;
    }
    input[type="text"] {
      padding: 10px;
      width: 80%;
      margin: 10px;
      font-size: 16px;
    }
    .song-list {
      list-style: none;
      padding: 0;
    }
    .song-list li {
      margin: 10px 0;
      cursor: pointer;
      text-align: left;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .song-list img {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
    .controls button {
      margin: 5px;
      padding: 10px;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <div id="app">
    <!-- Search Bar Container -->
    <div class="search-container">
      <input v-model="searchQuery" @input="searchSongs" placeholder="Search for songs..." />
    </div>

    <!-- Song List -->
    <ul class="song-list">
      <li v-for="(track, index) in searchResults" :key="index" @click="selectTrack(track)">
        <img :src="track.cover" alt="cover" />
        <div>{{ track.name }} - {{ track.artist }}</div>
      </li>
    </ul>

    <!-- Audio Controls -->
    <div v-if="currentTrack">
      <img :src="currentTrack.cover" alt="cover" style="width: 100px; height: 100px;" />
      <div>{{ currentTrack.name }} - {{ currentTrack.artist }}</div>
      <audio ref="audio" v-if="audio" :src="currentTrack.source" controls></audio>
      <div class="controls">
        <button @click="prevTrack">Previous</button>
        <button @click="play">{{ isTimerPlaying ? 'Pause' : 'Play' }}</button>
        <button @click="nextTrack">Next</button>
        <button @click="downloadTrack">Download</button>
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
        };
      },
      methods: {
        searchSongs() {
          if (this.searchQuery.trim() === '') {
            this.searchResults = [];
            return;
          }

          // Replace with actual API call (e.g., YouTube API, Free Music Archive, etc.)
          fetch(`https://youtube.com/search?q=${this.searchQuery}`)
            .then(response => response.json())
            .then(data => {
              // Assuming the API returns an array of song objects
              this.searchResults = data.results.map(song => ({
                name: song.name,
                artist: song.artist,
                cover: song.coverImage,
                source: song.audioUrl // Or any valid audio URL
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
            this.currentTrackIndex = this.searchResults.length - 1;
          }
          this.currentTrack = this.searchResults[this.currentTrackIndex];
          this.resetPlayer();
        },
        nextTrack() {
          if (this.currentTrackIndex < this.searchResults.length - 1) {
            this.currentTrackIndex++;
          } else {
            this.currentTrackIndex = 0;
          }
          this.currentTrack = this.searchResults[this.currentTrackIndex];
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
        },
        downloadTrack() {
          const link = document.createElement('a');
          link.href = this.currentTrack.source;
          link.download = this.currentTrack.name + '.mp3';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    });
  </script>
</body>
</html>
