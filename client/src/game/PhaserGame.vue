<script setup lang="ts">
import type Phaser from "phaser";
import { onMounted, onUnmounted, ref, type Ref } from "vue";
import { SCENE } from "./constants/scene";
import { EventBus } from "./EventBus";
import StartGame from "./main";
import g from "./utils/global";
import ChatPanel from "./components/ChatPanel.vue";
import { socket } from "./utils/socket";
import PlayerStatus from "./components/PlayerStatus.vue";
import type { SceneType } from "./types/scene";

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

  EventBus.on("change-scene", (newScene: SceneType) => {
    g.currentScene = newScene;
    showGamePanel.value = g.currentScene === SCENE.GAME;
    emit("change-scene", g.currentScene);
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
    <ChatPanel v-show="showGamePanel" />
    <PlayerStatus v-if="showGamePanel" />
  </div>
</template>
