<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { EventBus } from "../EventBus";
import { speciesMap } from "../constants/species";
import type { PlayerStatusInfo } from "../services/player/types/crash";
import type { SpeciesId } from "../types/species";
import g from "../utils/global";

const healthContainerRef = ref<HTMLDListElement>();
const healthRef = ref<HTMLDivElement>();
const nowExpRef = ref<HTMLDivElement>();
const fadein = ref<boolean>(false);
const fadeout = ref<boolean>(false);
const currentSpeciesId = ref<SpeciesId>(g.myInfo?.speciesId ?? 1);
const requiredExp = computed<number>(() => {
  if (g.myInfo !== null) {
    return speciesMap.get(currentSpeciesId.value)?.requirementPoint ?? 100;
  }
  return 100;
});
const totalHealth = computed<number>(() => {
  if (g.myInfo !== null) {
    return speciesMap.get(currentSpeciesId.value)?.health ?? 100;
  }
  return 100;
});

const showHealthBar = (): void => {
  fadein.value = true;
  fadeout.value = false;
};

const hideHealthBar = (): void => {
  setTimeout(() => {
    fadein.value = false;
    fadeout.value = true;
  }, 2000);
};

onMounted(() => {
  EventBus.on("player-status-sync", (playerStatusInfo: PlayerStatusInfo) => {
    // 점수바 관리
    if (nowExpRef.value !== undefined && nowExpRef.value !== null) {
      nowExpRef.value.style.width = `${(playerStatusInfo.nowExp / requiredExp.value) * 100}%`;
    }

    // 체력바 관리
    if (healthContainerRef.value === undefined || healthContainerRef.value === null) {
      return;
    }

    // 체력이 닳은 경우
    if (playerStatusInfo.health < totalHealth.value && healthRef.value !== undefined && healthRef.value !== null) {
      if (fadein.value) {
        // 리플로우를 발생시켜서 애니메이션 재실행
        healthContainerRef.value.style.animation = "none";
        // 아래와 같은 프로퍼티를 호출하는 것만으로도 reflow가 발생합니다.
        void healthContainerRef.value.offsetHeight;
        healthContainerRef.value.style.animation = "";
      } else {
        showHealthBar();
      }
      healthRef.value.style.width = `${(playerStatusInfo.health / totalHealth.value) * 100}%`;
    }
  });

  EventBus.on("player-eat-plankton", (playerStatusInfo: PlayerStatusInfo) => {
    // 플랑크톤 섭취 시 점수바 관리
    if (nowExpRef.value !== undefined && nowExpRef.value !== null) {
      nowExpRef.value.style.width = `${(playerStatusInfo.nowExp / requiredExp.value) * 100}%`;
    }

    // 플랑크톤 섭취 시 체력 회복
    if (healthRef.value !== undefined && healthRef.value !== null) {
      healthRef.value.style.width = `${(playerStatusInfo.health / totalHealth.value) * 100}%`;
      // 체력 다 차면 헬스바 숨기기
      if (playerStatusInfo.health >= totalHealth.value) {
        hideHealthBar();
      }
    }
  });

  EventBus.on("player-evolution", (newSpeciesId: SpeciesId) => {
    currentSpeciesId.value = newSpeciesId;

    // 진화 시 체력 만땅 채우기
    if (healthRef.value !== undefined && healthRef.value !== null) {
      healthRef.value.style.width = `100%`;
    }
    hideHealthBar();

    // 진화 시 포인트 업데이트
    if (nowExpRef.value !== undefined && nowExpRef.value !== null) {
      if (g.myInfo !== null) {
        nowExpRef.value.style.width = `${(g.myInfo.nowExp / (speciesMap.get(newSpeciesId)?.requirementPoint ?? 100)) * 100}%`;
      }
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
