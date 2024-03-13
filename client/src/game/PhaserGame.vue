<script setup lang="ts">
import { onMounted, onUnmounted, ref, type Ref } from "vue";
import { EventBus } from "./EventBus";
import StartGame from "./main";
import type Phaser from "phaser";
import { socket } from "./utils/socket";
import g from "./utils/global";
import { SCENE } from "./constants/scene";
import type { PlayerStatusInfo } from "./services/player/types/crash";
// Save the current scene instance
const scene = ref();
const game = ref();
const emit = defineEmits(["current-active-scene", "change-scene"]);
const showPlayerStatus: Ref<boolean> = ref<boolean>(false);
const healthRef = ref<HTMLSpanElement>();
const pointRef = ref<HTMLSpanElement>();

onMounted(() => {
  game.value = StartGame("game-container");

  EventBus.on("current-scene-ready", (sceneInstance: Phaser.Scene) => {
    emit("current-active-scene", sceneInstance);
    scene.value = sceneInstance;
  });

  EventBus.on("game-start", () => {
    if (g.currentScene === SCENE.MAIN_MENU) {
      g.currentScene = SCENE.GAME;
      showPlayerStatus.value = true;
      emit("change-scene");
    }
  });

  EventBus.on("change-scene", () => {
    emit("change-scene");
  });

  EventBus.on("player-status-sync", (playerStatusInfo: PlayerStatusInfo) => {
    if (playerStatusInfo.isGameOver && g.currentScene === SCENE.GAME) {
      g.currentScene = SCENE.GAME_OVER;
      showPlayerStatus.value = false;
      emit("change-scene");
    }
    if (healthRef.value !== undefined) {
      healthRef.value.textContent = playerStatusInfo.health.toString();
    }
    if (pointRef.value !== undefined) {
      pointRef.value.textContent = playerStatusInfo.point.toString();
    }
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
  <div v-if="showPlayerStatus" class="cont-player-status">
    <span ref="healthRef" class="health">100</span>
    <span ref="pointRef" class="point">0</span>
  </div>
  <div id="game-container"></div>
</template>

<style scoped>
.cont-player-status {
  position: fixed;
  bottom: 1rem;
  left: 1rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  font-size: 3rem;
  background-color: black;
}
</style>
