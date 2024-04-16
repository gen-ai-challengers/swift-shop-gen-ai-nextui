<script setup lang="ts">
import { SRGBColorSpace } from 'three';
import { ref } from 'vue';
import { Color } from 'three';

import { useRenderLoop, TresCanvas } from '@tresjs/core';
import { OrbitControls, useTweakPane } from '@tresjs/cientos';

import TheModel from './mediapipe.vue';

useTweakPane();
</script>

<template>
  <Suspense>
    <TresCanvas
      clear-color="#82DBC5"
      shadows
      alpha
      window-size
      power-preference="high-performance"
      :output-color-space="SRGBColorSpace"
    >
      <TresPerspectiveCamera
        :position="[5, 5, 5]"
        :fov="75"
        :near="0.1"
        :far="1000"
      />
      <OrbitControls />
      <TresAmbientLight :color="0xffffff" :intensity="0.25" />
      <TresDirectionalLight :position="[0, 8, 4]" :intensity="2" cast-shadow />
      <Suspense>
        <TheModel />
      </Suspense>
    </TresCanvas>
  </Suspense>
</template>
