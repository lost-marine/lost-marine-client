<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { EventBus } from "./EventBus";
import StartGame from "./main";
import Phaser from "phaser";
import io from "socket.io-client";

// Save the current scene instance
const scene = ref();
const game = ref();
const emit = defineEmits(["current-active-scene", "change-scene"]);
let socket = io("http://70.12.246.252:3000");
const userInfo = ref<Creature>();

export interface BaseSocketData {
  code: number;
  data: undefined | object;
}

export interface Creature {
  playerId: number;
  startX: number;
  startY: number;
  direction: number;
}
export interface LoginResponse {
  data: Creature;
}

onMounted(() => {
  game.value = StartGame("game-container");

  EventBus.on("current-scene-ready", (scene_instance: Phaser.Scene) => {
    emit("current-active-scene", scene_instance);
    scene.value = scene_instance;
  });

  EventBus.on("start-game", (nickname: string) => {
    const param = {
      code: 1001,
      data: {
        nickname: nickname
      }
    };
    socket.emit("", param, (response: LoginResponse) => {
      userInfo.value = response.data;
      emit("change-scene");
    });
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
  if (game.value) {
    game.value.destroy(true);
    game.value = null;
  }
});

defineExpose({ scene, game });
</script>

<template>
  <div id="game-container"></div>
</template>
