const defaultTracks = [
  {
      name: "Maula Mere Maula",
      artist: "Roop Kumar Rathod, Mithoon, Anwar",
      cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/10.jpg",
      source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/10.mp3",
      url: "https://t.me/ll_KEX_ll",
  },{
      name: "Aankhon Se Tune",
      artist: "Kumar Sanu, Alka Yagnik",
      cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/1.jpg",
      source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/1.mp3",
      url: "https://t.me/ll_KEX_ll",
  },{
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
  },
  {
    name: "Ek Ladki Bheegi Bhagi Si",
    artist: "Kishore Kumar",
    cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/4.jpg",
    source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/4.mp3",
    url: "https://t.me/ll_KEX_ll",
    favorited: false
  },
  {
    name: "Gali Me Aaj Chand Nikla",
    artist: "Alka Yagnik",
    cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/5.jpg",
    source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/5.mp3",
    url: "https://t.me/ll_KEX_ll",
    favorited: true
  },
  {
    name: "Mere Mehboob Qayamat Hogi",
    artist: "Sachin Gupta",
    cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/6.jpg",
    source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/6.mp3",
    url: "https://t.me/ll_KEX_ll",
    favorited: false
  },
  {
    name: "O Mere Dil Ke Chain",
    artist: "Kishore Kumar",
    cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/7.jpg",
    source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/7.mp3",
    url: "https://t.me/ll_KEX_ll",
    favorited: true
  },
  {
    name: "Yeh Raaten Yeh Mausam",
    artist: "Sachin Gupta",
    cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/8.jpg",
    source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/8.mp3",
    url: "https://t.me/ll_KEX_ll",
    favorited: false
  },
  {
    name: "Yeh Sham Mastani",
    artist: "Kishore Kumar",
    cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/9.jpg",
    source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/9.mp3",
    url: "https://t.me/ll_KEX_ll",
    favorited: false
  }
];

let currentTrack = 0;
let isPlaying = false;

const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const searchInput = document.getElementById('search-input');

function loadTrack(track) {
  document.getElementById('cover-image').src = track.cover;
  document.getElementById('track-name').textContent = track.name;
  document.getElementById('track-artist').textContent = track.artist;
  document.getElementById('track-link').href = track.url;
  audio.src = track.source;
  progressBar.value = 0;
}

function togglePlayPause() {
  if (isPlaying) {
      audio.pause();
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  } else {
      audio.play();
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
  }
  isPlaying = !isPlaying;
}

function nextTrack() {
  currentTrack = (currentTrack + 1) % defaultTracks.length;
  loadTrack(defaultTracks[currentTrack]);
  if (isPlaying) audio.play();
}

function prevTrack() {
  currentTrack = (currentTrack - 1 + defaultTracks.length) % defaultTracks.length; 
  loadTrack(defaultTracks[currentTrack]);
  if (isPlaying) audio.play();
}

function updateProgressBar() {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progress || 0; 
}


function setProgress() {
  const time = (progressBar.value / 100) * audio.duration;
  audio.currentTime = time || 0; 
}

function handleSearch() {
  const term = searchInput.value.toLowerCase();
  const filteredTracks = defaultTracks.filter(track => 
      track.name.toLowerCase().includes(term) ||
      track.artist.toLowerCase().includes(term)
  );

  if (filteredTracks.length > 0) {
      currentTrack = defaultTracks.indexOf(filteredTracks[0]); 
      loadTrack(filteredTracks[0]);
  }
}

playPauseBtn.addEventListener('click', togglePlayPause);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);
audio.addEventListener('timeupdate', updateProgressBar);
progressBar.addEventListener('change', setProgress);
audio.addEventListener('ended', nextTrack);
searchInput.addEventListener('input', handleSearch);

loadTrack(defaultTracks[currentTrack]);
