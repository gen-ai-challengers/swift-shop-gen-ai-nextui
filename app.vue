<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <v-toast />
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