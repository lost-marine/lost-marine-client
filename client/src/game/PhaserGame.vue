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
import RankingPanel from "./components/RankingPanel.vue";
import EvolutionList from "./components/EvolutionList.vue";
import InfoModal from "./components/InfoModal.vue";
// Save the current scene instance
const scene = ref();
const game = ref();
const isOpenInfoModal: Ref<boolean> = ref<boolean>(false);
const emit = defineEmits(["current-active-scene", "change-scene"]);
const showGamePanel: Ref<boolean> = ref<boolean>(false);
const closeModal = (): void => {
  isOpenInfoModal.value = false;
};

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

  EventBus.on("open-info-modal", () => {
    isOpenInfoModal.value = true;
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
    <RankingPanel v-show="showGamePanel" />
    <PlayerStatus v-if="showGamePanel" />
    <EvolutionList v-if="showGamePanel" />
    <InfoModal v-show="isOpenInfoModal" @modal-close="closeModal" />
  </div>
</template>
