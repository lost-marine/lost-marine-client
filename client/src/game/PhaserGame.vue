<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { EventBus } from "./EventBus";
import StartGame from "./main";
import type Phaser from "phaser";
import { socket } from "./utils/socket";
import g from "./utils/global";
import { SCENE } from "./constants/scene";
// Save the current scene instance
const scene = ref();
const game = ref();
const emit = defineEmits(["current-active-scene", "change-scene"]);

onMounted(() => {
  game.value = StartGame("game-container");

  EventBus.on("current-scene-ready", (sceneInstance: Phaser.Scene) => {
    emit("current-active-scene", sceneInstance);
    scene.value = sceneInstance;
  });

  EventBus.on("game-start", () => {
    if (g.currentScene === SCENE.MAIN_MENU) {
      g.currentScene = SCENE.GAME;
      emit("change-scene");
    }
  });

  EventBus.on("change-scene", () => {
    emit("change-scene");
  });

  socket.connect();
});

onUnmounted(() => {
  if (game.value !== null) {
    game.value.destroy(true);
    game.value = null;
  }

  socket.disconnect();
});

defineExpose({ scene, game });
</script>

<template>
  <div id="game-container"></div>
</template>
