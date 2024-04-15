<template>
  <section class="display">
    <video
      ref="videoEl"
      autoplay="true"
      playsinline
      @loadedmetadata="runModel"
    />
    <canvas ref="canvasEl" />
  </section>
</template>


<script setup>
import * as faceAPI from "face-api.js";

const emit = defineEmits(["multipleFacesDetected", "faceDetected"]);
const initParams = reactive({
  modelUri: "/models",
  option: new faceAPI.SsdMobilenetv1Options({ minConfidence: 0.5 }),
});
const constraints = reactive({
  video: {
    width: {
      min: 120,
      ideal: 320,
      max: 1024,
    },
    height: {
      min: 120,
      ideal: 240,
      max: 720,
    },
    frameRate: {
      min: 10,
      ideal: 15,
      max: 30,
    },
    facingMode: "environment",
  },
});
const videoEl = ref(null);
const canvasEl = ref(null);
const board = reactive({
  fps: 0,
});

let forwardTimes = [];

/**
 * caculate fps for detection
 * @function
 * @param number
 */
const updateTimeStats = (timeInMs) => {
  forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30);
  const avgTimeInMs =
    forwardTimes.reduce((total, t) => total + t) / forwardTimes.length;
  board.fps = faceAPI.utils.round(1000 / avgTimeInMs);
};

/**
 * @function
 * @description detect input video
 */
const runModel = async () => {
  if (!canvasEl.value||!videoEl.value){
    return;
  }
  const beforeDetect = Date.now();
  const result = await faceAPI
    .detectAllFaces(videoEl.value, initParams.option)
    .withAgeAndGender();
  updateTimeStats(Date.now() - beforeDetect);
  if (!canvasEl.value||!videoEl.value){
    return;
  }
  if (result) {
    const dims = faceAPI.matchDimensions(canvasEl.value, videoEl.value, true);
    const resizeResults = faceAPI.resizeResults(result, dims);

    const facesWithHighScore = resizeResults.filter(
      (data) => data.detection.score > 0.7
    );

    if (facesWithHighScore.length > 0) {
      if (facesWithHighScore.length > 1) {
        emit("multipleFacesDetected");
      } else {
        const faceData = JSON.parse(JSON.stringify(facesWithHighScore[0]));
        faceData.score = facesWithHighScore[0].detection.score;
        delete faceData.detection;
        faceData.videoEl = videoEl;
        faceData.canvasEl = canvasEl;
        emit("faceDetected", faceData);
      }
    }
    faceAPI.draw.drawDetections(canvasEl.value, facesWithHighScore);
  }
  setTimeout(() => runModel());
};

onMounted(() => {
  /**
   * @function
   * @description load the trained model
   */
  const initModel = async () => {
    await faceAPI.nets.ssdMobilenetv1.loadFromUri(initParams.modelUri);
    await faceAPI.nets.ageGenderNet.loadFromUri(initParams.modelUri);
  };

  /**
   * startup webcam
   * @function
   */
  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoEl.value.srcObject = stream;
    } catch (error) {
      console.error(error.message);
    }
  };

  initModel().then(() => startStream());
});
onBeforeUnmount(() => {
  /**
   * stop webcam
   * @function
   */
  const stopStream = () => {
    videoEl.value.srcObject.getTracks().forEach((track) => track.stop());
  };

  stopStream();
});
</script>
  
  <style lang="scss" scoped>
.display {
  width: 100%;
  height: auto;
  min-height: 220px;
  position: relative;
  > video {
    position: absolute;
    object-fit: cover;
    width: 100%;
  }
  > canvas {
    position: absolute;
    z-index: 10;
    width: 100%;
  }
  > .board {
    font-size: 30px;
    list-style: none;
    background-color: rgba(255, 255, 255, 0.65);
    border-radius: 10px;
    left: 10px;
    padding: 15px;
    position: absolute;
    top: 10px;
    z-index: 20;
  }
}
</style>