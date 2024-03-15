<script setup lang="ts">
import { onMounted, ref } from "vue";
import { EventBus } from "../EventBus";
import type { PlayerStatusInfo } from "../services/player/types/crash";

const healthRef = ref<HTMLDivElement>();
const pointRef = ref<HTMLDivElement>();
const fadeinout = ref<boolean>(false);

onMounted(() => {
  EventBus.on("player-status-sync", (playerStatusInfo: PlayerStatusInfo) => {
    // if (playerStatusInfo.isGameOver && g.currentScene === SCENE.GAME) {
    //   g.currentScene = SCENE.GAME_OVER;
    //   showGamePanel.value = false;
    //   emit("change-scene");
    // }
    if (healthRef.value !== undefined) {
      fadeinout.value = true;
      healthRef.value.style.width = `${playerStatusInfo.health}%`;
    }
    if (pointRef.value !== undefined) {
      pointRef.value.style.width = `${playerStatusInfo.point}%`;
    }
  });
});
</script>

<template>
  <div class="player-status">
    <div class="health cont-bar" :class="{ fadeinout }">
      <span>HP</span>
      <div ref="healthRef" class="bar"></div>
    </div>
    <div class="point cont-bar">
      <span>EXP</span>
      <div ref="pointRef" class="bar"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@keyframes fadeinout {
  0% {
    opacity: 1;
    transform: scale(1.2);
  }
  4% {
    transform: scale(1);
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.player-status {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  font-size: 1.2rem;

  .cont-bar {
    background-color: rgba(0, 0, 0, 0.44);
    border-radius: 1.2rem;
    overflow: hidden;
    height: 2rem;
    position: relative;

    .bar {
      height: 100%;
      border-radius: 1.2rem;
      transition: width 0.5s;
    }

    span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .cont-bar.health {
    opacity: 0;
    width: 18rem;
    .bar {
      width: 100%;
      background: linear-gradient(90deg, #ff4f17 1.86%, rgba(255, 168, 0, 0.94));
    }
  }

  .cont-bar.health.fadeinout {
    animation: fadeinout 8s cubic-bezier(0, 0, 0.2, 1);
  }

  .cont-bar.point {
    width: 26rem;
    .bar {
      width: 0%;
      background: linear-gradient(90deg, #17ff3c 1.86%, rgba(0, 209, 255, 0.94));
    }
  }
}
</style>
