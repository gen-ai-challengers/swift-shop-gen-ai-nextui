<script setup lang="ts">
import {
  Color,
  LoopOnce,
  Vector3,
  AnimationClip,
  AnimationAction,
} from "three";

const bgColor = new Color("#F78B3D");

const { pane } = useTweakPane();

const anmiationPlayList: Array<AnimationAction> = [];

const startAnimation = ["walkingstart", "walking", "walkingstop"];
const stopAnimation = ["look", "runback"];

const idleAnimation = ["idle", "dancing"];

const {
  nodes,
  materials,
  scene: model,
  animations,
} = await useGLTF("/gltf/main.glb");

const addAnimationsToPlayList = (animation_names: string[]) => {
  animation_names.forEach((animation: string) => {
    const index = animations.findIndex(
      (anim: AnimationClip) => anim.name === animation
    );
    if (index === -1) {
      console.error("animation not found", animation);
      return;
    }
    const anim = animations[index];
    anmiationPlayList.push(mixer.clipAction(anim));
  });
};

console.log("model", model);

const animation_names = [
  "walkingstart",
  "walking",
  "walkingstop",
  "look",
  "idle",
  "dancing",
  "runback",
  "talking1",
  "talking2",
];

await Promise.all(
  animation_names.map(async (name) => {
    const { animations: anims } = await useFBX(`/fbx/${name}.fbx`);
    anims[0].name = name;
    animations.push(anims[0]);
  })
);

const { actions, mixer } = useAnimations(animations, model);

console.log("animations", animations);
console.log("actions", actions);
console.log("mixer", mixer);

let currentAction = actions.idle;

addAnimationsToPlayList(startAnimation);

const { onLoop } = useRenderLoop();
const charecterEl = shallowRef();

const cameraEl = shallowRef();

currentAction.timeScale = 1;
currentAction.setLoop(LoopOnce, 1);
currentAction.fadeIn(0.5).play();

mixer.addEventListener("finished", (e: any) => {
  if (
    charecterEl.value.position.z < -1 &&
    startAnimation.includes(currentAction.getClip().name)
  ) {
    charecterEl.value.position.z +=
      1 * (1 + startAnimation.indexOf(currentAction.getClip().name));
  }
  console.log("finished", e);
  console.log("anmiationPlayList", anmiationPlayList);
  if (anmiationPlayList.length == 0) {
    addAnimationsToPlayList(idleAnimation);
  }
  let nextAnimation = anmiationPlayList.shift();
  console.log("nextAnimation", nextAnimation);
  currentAction.fadeOut(0.5).stop();
  currentAction.reset();
  if (!nextAnimation) {
    return;
  }
  currentAction = nextAnimation;
  currentAction.timeScale = 1 / 2;
  currentAction.setLoop(LoopOnce, 1);
  currentAction.fadeIn(0.5).play();
});

pane
  .addBlade({
    view: "list",
    label: "scene",
    options: Object.keys(actions).map((name) => ({
      text: name,
      value: name,
    })),
    value: "walkingstart",
  })
  .on("change", ({ value }: { value: any }) => {
    console.log("value", value);
    anmiationPlayList.push(value);
  });

onLoop(({ elapsed }: { elapsed: number }) => {
  // console.log("elapsed", elapsed);
  // console.log("currentAction", currentAction);
  if (currentAction && charecterEl.value) {
    if (
      charecterEl.value.position.z < -1 &&
      startAnimation.includes(currentAction.getClip().name)
    ) {
      charecterEl.value.position.z +=
        0.05 * (1 + startAnimation.indexOf(currentAction.getClip().name));
    }
  }
  if (mixer) {
    mixer.update(0.01);
  }
  // if (charecterEl.value) {
  //   // charecterEl.value.position.z = Math.sin(elapsed) * 0.5;

  //   // cameraEl.value.position.y = Math.sin(elapsed) * 1.5;

  //   // charecterEl.value.rotation.y = Math.sin(elapsed) * 0.5
  //   // charecterEl.value.rotation.x = Math.sin(elapsed) * 0.5
  //   // charecterEl.value.position.x = Math.sin(elapsed) * 0.5
  // }
});
</script>

<template>
  <Suspense>
    <TresCanvas
      shadows
      alpha
      window-size
      power-preference="high-performance"
      precision="highp"
    >
      <TresPerspectiveCamera
        ref="cameraEl"
        visible
        :position="[-10, -18, 7]"
        :fov="40"
        :near="1"
        :far="1000"
        :focus="3"
        v-always-look-at="charecterEl"
      />
      <TresScene>
        <TresAmbientLight :color="0xffffff" :intensity="0.95" />
        <TresGroup ref="charecterEl" :position="[-10, -20, -40]" :scale="[1, 1, 1]">
          <primitive :object="model" ref="objectEl" />
        </TresGroup>
      </TresScene>
      <Environment preset="sunset" />
    </TresCanvas>
  </Suspense>
</template>

<style lang="scss" scoped>
.avatar-controls {
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0.4;
}
</style>