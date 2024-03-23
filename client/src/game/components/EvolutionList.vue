<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { EventBus } from '../EventBus';
import type { PlayerEvolutionInfo } from "../services/player/types/evolution";
import g from '../utils/global';
import { speciesMap } from "../constants/species";
// import { socket } from '../utils/socket';

const currentSpeciesId: Ref<number> = ref<number>(g.myInfo?.speciesId ?? 1);
const show: Ref<boolean> = ref<boolean>(true);
const evolutionMap: Map<number, number[]> = new Map<number, number[]>([[1, [3]], [2, [3]]])
const handleEvolutionButton = (e: MouseEvent, speciesId: number): void => {
  // TODO: 소켓 통신, 숫자 버튼에 이벤트, 진화 요청 소켓통신
  // if (g.myInfo !== null) {
  //   socket.emit('player-evolution', {speciesId, playerId: g.myInfo.playerId, point: g.myInfo.point})
  // }
}

onMounted(() => {
  EventBus.on("player-evolution", (playerEvolutionInfo: PlayerEvolutionInfo) => {
    show.value = true;  
  });
});

</script>

<template>
  <div v-if="show" class="container">
    <p>진화할 생명을 선택하세요.</p>
    <ul class="list-evolution">
      <li v-for="(speciesId, idx) in evolutionMap.get(currentSpeciesId)" :key="speciesId"
        @click="(e: MouseEvent) => { handleEvolutionButton(e, speciesId) }">
        <span class="number">{{ idx + 1 }}</span>
        <img :src="speciesMap.get(speciesId)?.spritesheetUrl" :alt="speciesMap.get(speciesId)?.name + '입니다.'"
          class="sprite">
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.container {
  position: absolute;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  p, ul {
    margin: initial;
    padding: initial;
  }

  .list-evolution {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    padding: initial;
    gap: 0.2rem;

    li {
      background-color: green;
      position: relative;
      width: 4.5rem;
      height: 5.35rem;
      display: flex;
      align-items: center;
      overflow: hidden;
      background-color: rgba(74, 141, 116, 0.2);
      border-radius: 0.5rem;
      padding: 0.25rem;
      cursor: pointer;

      .number {
        position: absolute;
        right: 0.5rem;
        top: 0.5rem;
        display: inline-block;
        background-color: rgba(0, 0, 0, 0.4);
        padding: 0.3rem 0.5rem;
        border-radius: 20%;
        font-size: 0.6rem;
      }

      .sprite {
        width: 100%;
        height: 100%;
        object-fit: cover;
        vertical-align: top;
      }
    }
  }

  li:hover {
    background-color: rgba(74, 141, 116, 0.4);
    transition: background-color 0.3s;
  }
}

</style>