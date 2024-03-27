<script setup lang="ts">
import { onMounted, ref } from "vue";
import { EventBus } from "../EventBus";
import type { PlayerStatusInfo } from "../services/player/types/crash";

const healthContainerRef = ref<HTMLDListElement>();
const healthRef = ref<HTMLDivElement>();
const nowExpRef = ref<HTMLDivElement>();
const fadein = ref<boolean>(false);
const fadeout = ref<boolean>(false);

onMounted(() => {
  EventBus.on("player-status-sync", (playerStatusInfo: PlayerStatusInfo) => {
    // 점수바 관리
    if (nowExpRef.value !== undefined && nowExpRef.value !== null) {
      nowExpRef.value.style.width = `${playerStatusInfo.nowExp}%`;
    }

    // 체력바 관리
    if (healthContainerRef.value === undefined || healthContainerRef.value === null) {
      return;
    }

    // 체력이 닳은 경우
    if (playerStatusInfo.health < 100 && healthRef.value !== undefined && healthRef.value !== null) {
      if (fadein.value) {
        // 리플로우를 발생시켜서 애니메이션 재실행
        healthContainerRef.value.style.animation = "none";
        // 아래와 같은 프로퍼티를 호출하는 것만으로도 reflow가 발생합니다.
        void healthContainerRef.value.offsetHeight;
        healthContainerRef.value.style.animation = "";
      } else {
        fadein.value = true;
      }
      healthRef.value.style.width = `${playerStatusInfo.health}%`;
    }

    if (healthRef.value !== undefined && healthRef.value !== null) {
      healthRef.value.style.width = `${playerStatusInfo.health}%`;
    }
  });
});
</script>

<template>
  <div class="player-status">
    <div class="health cont-bar" :class="{ fadein, fadeout }" ref="healthContainerRef">
      <span>HP</span>
      <div ref="healthRef" class="bar"></div>
    </div>
    <div class="now-exp cont-bar">
      <span>EXP</span>
      <div ref="nowExpRef" class="bar"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@keyframes heartbeat {
  from {
    transform: scale(1.2);
  }
  to {
    transform: scale(1);
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
    transition: opacity 1s;
  }

  .cont-bar.health.fadein {
    opacity: 1;
    animation: heartbeat 1s ease-out;
  }

  .cont-bar.health.fadeout {
    opacity: 0;
  }

  .cont-bar.now-exp {
    width: 26rem;
    .bar {
      width: 0%;
      background: linear-gradient(90deg, #17ff3c 1.86%, rgba(0, 209, 255, 0.94));
    }
  }
}
</style>
