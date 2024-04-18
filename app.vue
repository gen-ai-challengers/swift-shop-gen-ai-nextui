<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <v-toast />
  <div id="grecaptcha"></div>
</template>
<script>
import { mapActions } from "pinia";
export default {
  methods: {
    ...mapActions(useUserStore, ["getUser"]),
  },
  mounted() {
    this.getUser();
  },
};
</script>