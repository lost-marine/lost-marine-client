<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { EventBus } from "./EventBus";
import StartGame from "./main";
import type Phaser from "phaser";
import io from "socket.io-client";
import type { Creature } from "./types";

// Save the current scene instance
const scene = ref();
const game = ref();
const emit = defineEmits(["current-active-scene", "change-scene"]);
const socket = io("http://70.12.246.252:3000");
const userInfo = ref<Creature>();

onMounted(() => {
  game.value = StartGame("game-container");

  EventBus.on("current-scene-ready", (sceneInstance: Phaser.Scene) => {
    emit("current-active-scene", sceneInstance);
    scene.value = sceneInstance;
  });

  EventBus.on("change-scene", () => {
    emit("change-scene");
  });

  // 참가자 본인 위치 전송
  EventBus.on("player-moved", (startX: number, startY: number, direction: number) => {
    const param = {
      code: 2001,
      data: {
        playerId: userInfo.value?.playerId,
        startX,
        startY,
        direction
      }
    };
    socket.emit("", param);
  });
});

onUnmounted(() => {
  if (game.value !== null) {
    game.value.destroy(true);
    game.value = null;
  }
});

defineExpose({ scene, game });
</script>

<template>
  <div id="game-container"></div>
</template>