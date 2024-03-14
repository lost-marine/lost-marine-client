<script setup lang="ts">
import type Phaser from "phaser";
import { onMounted, onUnmounted, ref, type Ref } from "vue";
import { SCENE } from "./constants/scene";
import { EventBus } from "./EventBus";
import StartGame from "./main";
import g from "./utils/global";
import { socket } from "./utils/socket";
import PlayerStatus from "./components/PlayerStatus.vue";
// Save the current scene instance
const scene = ref();
const game = ref();
const emit = defineEmits(["current-active-scene", "change-scene"]);
const showGamePanel: Ref<boolean> = ref<boolean>(false);

onMounted(() => {
  game.value = StartGame("game-container");

  EventBus.on("current-scene-ready", (sceneInstance: Phaser.Scene) => {
    emit("current-active-scene", sceneInstance);
    scene.value = sceneInstance;
  });

  EventBus.on("game-start", () => {
    if (g.currentScene === SCENE.MAIN_MENU) {
      g.currentScene = SCENE.GAME;
      showGamePanel.value = true;
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
  <div id="game-container">
    <PlayerStatus v-if="showGamePanel" />
  </div>
</template>
