<script setup lang="ts">
import { ref, toRaw } from "vue";
import type { MainMenu } from "./game/scenes/MainMenu";
import PhaserGame from "./game/PhaserGame.vue";
import type { SceneType } from "./game/types/scene";

// The sprite can only be moved in the MainMenu Scene
const canMoveSprite = ref();

//  References to the PhaserGame component (game and scene are exposed)
const phaserRef = ref();

const changeScene = (newScene: SceneType): void => {
  const scene = toRaw(phaserRef.value.scene) as MainMenu;

  if (scene !== null) {
    //  Call the changeScene method defined in the `MainMenu`, `Game` and `GameOver` Scenes
    scene.changeScene(newScene);
  }
};

// Event emitted from the PhaserGame component
const currentScene = (scene: MainMenu): void => {
  canMoveSprite.value = scene.scene.key !== "MainMenu";
};
</script>

<template>
  <PhaserGame ref="phaserRef" @current-active-scene="currentScene" @change-scene="changeScene" />
</template>

<style>
.game-container {
  width: 100vw;
  height: 100vh;
}
</style>
