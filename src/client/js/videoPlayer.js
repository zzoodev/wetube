const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const time = document.getElementById("time");
const volumn = document.getElementById("volumn");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const videoContainer = document.getElementById("videoContainer");
const fullScreenBtn = document.getElementById("fullScreenBtn");
const fullScreenBtnIcon = fullScreenBtn.querySelector("i");
const videoController = document.querySelector(".videoController");

let controllTimeout = null;
let hideControllerId = null;
let hiddenControllerId = null;
let videoVolumn = 0.5;

const handlePlayBtn = (event) => {
  video.paused ? video.play() : video.pause();
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumn.value = video.muted ? "0" : videoVolumn;
};

const handleVolumn = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  video.volume = value;
  videoVolumn = value;
};

const fomatTime = (second) => {
  return new Date(second * 1000).toISOString().substring(14, 19);
};

const loadedMetadata = (event) => {
  totalTime.innerText = fomatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};
const handleTimeUpdate = (event) => {
  currenTime.innerText = fomatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const controlTimeline = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};
const handleScreenMode = () => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    fullScreenBtnIcon.classList = "fas fa-expand";
    document.exitFullscreen();
  } else {
    fullScreenBtnIcon.classList = "fas fa-compress";
    videoContainer.requestFullscreen();
  }
};

const removeClassAtController = () => {
  videoController.classList.remove("showVideoController");
};

const handleMousemove = () => {
  if (controllTimeout) {
    clearTimeout(controllTimeout);
    controllTimeout = null;
  }
  if (hideControllerId) {
    clearTimeout(hideControllerId);
    hideControllerId = null;
  }
  videoController.classList.add("showVideoController");
  hideControllerId = setTimeout(removeClassAtController, 3000);
};

const handleMouseleave = () => {
  controllTimeout = setTimeout(removeClassAtController, 3000);
};
const handleSpaceBar = (event) => {
  if (event.keyCode === 32) {
    handlePlayBtn();
  }
};
const handleEnded = (event) => {
  console.log(event);
};
playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMute);
volumn.addEventListener("input", handleVolumn);
video.addEventListener("loadedmetadata", loadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("mousemove", handleMousemove);
video.addEventListener("mouseleave", handleMouseleave);
video.addEventListener("click", handlePlayBtn);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", controlTimeline);
fullScreenBtn.addEventListener("click", handleScreenMode);
document.addEventListener("keydown", handleSpaceBar);
