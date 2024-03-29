<script setup lang="ts">
import { onMounted, ref, watch, type Ref, onUnmounted } from "vue";
import { EventBus } from "../EventBus";
import g from "../utils/global";
import { speciesMap } from "../constants/species";
import HealthIcon from "@public/assets/components/icons/heart.png";
import PowerIcon from "@public/assets/components/icons/power.png";
import evolutionService from "@/game/services/player/feat/evolution";
import { type SpeciesId } from "@/game/types/species";
import { isNumber } from "@/game/utils/calcs/isNumber";

const currentSpeciesId: Ref<SpeciesId> = ref<SpeciesId>(g.myInfo?.speciesId ?? 1);
const show: Ref<boolean> = ref<boolean>(false);

const sendPlayerEvolution = async (selectedSpeciesId: SpeciesId): Promise<boolean> => {
  let isEvolutionSuccess: boolean = false;
  if (g.myInfo !== null) {
    isEvolutionSuccess = await evolutionService.evolve({
      speciesId: selectedSpeciesId,
      playerId: g.myInfo.playerId,
      nowExp: g.myInfo.nowExp
    });
  }
  return isEvolutionSuccess;
};

const handleMouseEvolution = async (e: MouseEvent, selectedSpeciesId: SpeciesId): Promise<void> => {
  const isEvolutionSuccess: boolean = await sendPlayerEvolution(selectedSpeciesId);
  if (isEvolutionSuccess) {
    currentSpeciesId.value = selectedSpeciesId;
    show.value = false;
  } else {
    console.error("진화에 실패했습니다.");
  }
};

const handleKeyboardEvolution = (e: KeyboardEvent): void => {
  void (async (): Promise<void> => {
    if (isNumber(e.key)) {
      const evolutionList: SpeciesId[] | undefined = speciesMap.get(currentSpeciesId.value)?.evolutionList;
      if (evolutionList === undefined) {
        throw new Error("해당 개체 정보가 불완전합니다.");
      }

      const isEvolutionDone = evolutionList.length === 0;
      if (isEvolutionDone) {
        // TODO: 진화가 완료됐을 때 다음 구현
      } else {
        const idx = parseInt(e.key) - 1;
        if (idx in evolutionList) {
          const selectedSpeciesId: SpeciesId = evolutionList[idx];
          const isEvolutionSuccess: boolean = await sendPlayerEvolution(selectedSpeciesId);
          if (isEvolutionSuccess) {
            currentSpeciesId.value = selectedSpeciesId;
            show.value = false;
          } else {
            console.error("진화에 실패했습니다.");
          }
        }
      }
    }
  })();
};

watch(show, () => {
  if (show.value) {
    window.addEventListener("keydown", handleKeyboardEvolution);
  } else {
    window.removeEventListener("keydown", handleKeyboardEvolution);
  }
});

onMounted(() => {
  EventBus.on("player-evolution-required", () => {
    show.value = true;
  });
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyboardEvolution);
});
</script>

<template>
  <div v-if="show" class="container">
    <p class="desc">진화할 생명을 선택하세요.</p>
    <ul class="list-evolution">
      <li
        v-for="(speciesId, idx) in speciesMap.get(currentSpeciesId)?.evolutionList"
        :key="speciesId"
        @click="
          (e: MouseEvent) => {
            handleMouseEvolution(e, speciesId);
          }
        "
        class="item-evolution"
      >
        <span class="number">{{ idx + 1 }}</span>
        <span class="name">{{ speciesMap.get(speciesId)?.name }}</span>
        <img :src="speciesMap.get(speciesId)?.baseSpriteUrl" :alt="speciesMap.get(speciesId)?.name + '입니다.'" class="sprite" />
        <ul class="list-info">
          <li class="item-info">
            <img :src="HealthIcon" alt="체력 아이콘입니다." class="icon" />
            <span>{{ speciesMap.get(speciesId)?.health }}</span>
          </li>
          <li class="item-info">
            <img :src="PowerIcon" alt="공격력 아이콘입니다." class="icon" />
            <span>{{ speciesMap.get(speciesId)?.power }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.container {
  $bg_black: rgba(0, 0, 0, 0.4);
  $bg_light_green: rgba(74, 141, 116, 0.2);
  $dark_green: #4a6963;
  $mid_green: rgba(74, 141, 116, 0.4);

  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;

  p,
  ul,
  li {
    margin: initial;
    padding: initial;
    list-style: none;
  }

  .desc {
    background-color: $bg_black;
    padding: 0.5rem 1rem 1rem 1rem;
    border-radius: 0 0 0.5rem 0.5rem;
  }

  .list-evolution {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    padding: initial;
    gap: 0.1rem;

    .item-evolution {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: end;
      overflow: hidden;
      background-color: $bg_light_green;
      border-radius: 0 0 0.5rem 0.5rem;
      padding: 0.5rem 1rem;
      gap: 0.5rem;
      cursor: pointer;

      .number {
        position: absolute;
        right: 0.5rem;
        top: 0.5rem;
        display: inline-block;
        background-color: $bg_black;
        padding: 0.3rem;
        border-radius: 20%;
        font-size: 0.6rem;
        border: 1px solid $dark_green;
      }

      .name {
        font-size: 0.6rem;
        font-weight: 800;
      }

      .sprite {
        width: 64px;
        height: 64px;
        object-fit: contain;
        vertical-align: top;
      }

      .list-info {
        font-size: 0.7rem;
        display: flex;
        justify-content: space-around;
        width: 100%;

        .item-info {
          height: 20%;
          padding: initial;
          display: flex;
          gap: 0.1rem;
          align-items: center;

          .icon {
            vertical-align: top;
            width: 1em;
            height: 1em;
          }
        }
      }
    }
  }

  .item-evolution:hover {
    background-color: $mid_green;
    transition: background-color 0.3s;
  }
}
</style>
