<template>
  <v-sheet class="add-face mx-auto" width="300">
    <v-form ref="form">

      <div v-if="isLoggedIn" class="text-body-2"> Hi {{ user.name }} Welcom to swift shop gen ai.</div>
      <div v-if="progress && progress < 100" class="text-body-2">Recognizing the face and logging you in....</div>

      <v-video
        v-show="progress && progress < 100 || processing"
        ref="videoEl"
        @faceDetected="faceDetected"
        @multipleFacesDetected="multipleFacesDetected"
      />
      <canvas v-show="false" ref="canvasEl" class="preview" />
      <v-progress-linear
        v-show="progress && progress < 100 || processing"
        :buffer-value="progress + 10"
        :model-value="progress"
        stream
        color="success"
        height="10"
        class="mt-4"
        :indeterminate="processing"
      ></v-progress-linear>
      <v-btn
        v-show="progress && progress < 100 || processing"
          class="mt-4"
          color="error"
          block
          @click="cancel"
        >
          Cancel
        </v-btn>
    </v-form>
  </v-sheet>
</template>
  <script>
import { mapActions, mapState } from "pinia";
import { set } from '~/node_modules/nuxt/dist/app/compat/capi';
export default {
  data: () => ({
    faceRecognized: false,
    progress: 0,
    processing: false,
  }),
  computed: {
    ...mapState(useUserStore, {
      user: (state) => state.userData,
      isLoggedIn: (state) => state.isLoggedIn,
    }),
  },
  methods: {
    ...mapActions(useUserStore, ["recognizeFaceAndLogin"]),
    async faceDetected(data) {
      console.log('>> face detected');
      console.log(this.isLoggedIn);
      console.log(this.faceRecognized);
      console.log(this.processing);

      if (this.isLoggedIn || this.faceRecognized || this.processing) return;
      if (data.score < 0.96) {
        this.progress = 5;
        return;
      } else this.progress += 5;
      if (this.progress < 99) return;
      const videoElement = data.videoEl.value;
      const canvas = this.$refs.canvasEl;
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      console.log("captured to canvas");
      this.faceRecognized = true;
      this.validate();
    },
    async multipleFacesDetected(data) {
      console.log(data);
    },
    cancel() {
      this.faceRecognized = true;
      this.progress = 100;
      setTimeout(() => {
        this.faceRecognized = false;
        this.processing = false;
        this.progress = 0;
      }, 5000);
    },
    async validate() {
      if (this.faceRecognized) {
        const faceData = {
          dataUrl: this.$refs.canvasEl.toDataURL(),
        };
        try {
          this.processing = true;
          await this.recognizeFaceAndLogin(faceData);
        } catch (e) {
          console.error(e);
        } finally {
          
          this.progress = 100;
          setTimeout(() => {
            this.faceRecognized = false;
            this.processing = false;
            this.progress = 0;
          }, 3000);

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