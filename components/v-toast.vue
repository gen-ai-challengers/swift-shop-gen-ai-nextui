<template>
  <v-snackbar
    v-model="state"
    :color="color"
    :timeout="timeout"
    timer
    absolute
  >
    <v-icon left>{{ icon }}</v-icon>
    {{ message }}
    <template v-slot:actions>
      <v-btn
        v-if="closable"
        variant="text"
        @click="state = false"
        icon="mdi-close"
      >
      </v-btn>
    </template>
  </v-snackbar>
</template>
  
<script lang="ts" setup>
const notification = useNotificationStore();
const state = computed({
  // getter
  get(): boolean {
    return notification.$state.notification?.visible ?? false;
  },
  // setter
  set(newValue: boolean) {
    notification.setVisiblity(newValue);
  },
});

const message = computed(() => notification.$state.notification?.message ?? "");

const icon = computed(() => notification.$state.notification?.icon ?? "");
const color = computed(() => notification.$state.notification?.color ?? "");
const timeout = computed(
  () => notification.$state.notification?.timeout ?? 7000
);
const closable = computed(
  () => notification.$state.notification?.closable ?? true
);
</script>
