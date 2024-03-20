<script setup lang="ts">
import { ref, toRaw } from "vue";
import type { MainMenu } from "./game/scenes/MainMenu";
import PhaserGame from "./game/PhaserGame.vue";
import type { SceneType } from "./game/types/scene";

// The sprite can only be moved in the MainMenu Scene

//  References to the PhaserGame component (game and scene are exposed)
const phaserRef = ref();

const changeScene = (newScene: SceneType): void => {
  const scene = toRaw(phaserRef.value.scene) as MainMenu;

  if (scene !== null) {
    //  Call the changeScene method defined in the `MainMenu`, `Game` and `GameOver` Scenes
    scene.changeScene(newScene);
  }
};
</script>

<template>
  <PhaserGame ref="phaserRef" @change-scene="changeScene" />
</template>

<style>
.game-container {
  width: 100vw;
  height: 100vh;
}
</style>
