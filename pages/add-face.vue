<template>
  <v-sheet class="add-face mx-auto" width="300">
    <v-form ref="form">
      <h3 class="text-h6 mb-4">Add your face for Identification</h3>

      <div class="text-body-2">
        We need to add your face for identification purposes, It will be used to
        identify you when you visit our store again.
      </div>

      <v-video
        v-if="!captuered"
        ref="videoEl"
        @faceDetected="faceDetected"
        @multipleFacesDetected="multipleFacesDetected"
      />
      <canvas v-show="captuered" ref="canvasEl" class="preview" />
      <v-progress-linear
        v-show="!captuered"
        :buffer-value="progress + 10"
        :model-value="progress"
        stream
        color="success"
        height="10"
        class="mt-4"
      ></v-progress-linear>

      <div class="d-flex flex-column">
        <v-btn
          class="mt-4"
          color="error"
          block
          @click="(captuered = false), (progress = 0)"
        >
          Retake
        </v-btn>
        <v-btn
          :disabled="!captuered"
          class="mt-4"
          color="success"
          block
          @click="validate"
        >
          Proceed
        </v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>
  <script>
import { mapActions } from "pinia";
export default {
  data: () => ({
    captuered: false,
    progress: 0,
  }),

  methods: {
    ...mapActions(useUserStore, ["addFace"]),
    async faceDetected(data) {
      if (data.score < 0.96) {
        this.progress = 5;
        return;
      } else this.progress += 5;
      console.log(data);
      if (this.progress < 100) return;
      const videoElement = data.videoEl.value;
      const canvas = this.$refs.canvasEl;
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      console.log("captured to canvas");
      this.captuered = true;
    },
    async multipleFacesDetected(data) {
      console.log(data);
    },
    async validate() {
      if (this.captuered) {
        const faceData = {
          dataUrl: this.$refs.canvasEl.toDataURL(),
        };
        try {
          await this.addFace(faceData);
          this.$toast.show("Face added successfully");
          this.$router.push("/");
        } catch (error) {
          this.$toast.error(error);
        }
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>

<style lang="scss" scoped>
.add-face {
  canvas.preview {
    z-index: 10;
    width: 100%;
  }
}
</style>