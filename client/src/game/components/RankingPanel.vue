<script setup lang="ts">
import { onMounted, ref, type Ref, onUpdated } from "vue";
import { socket } from "../utils/socket";
import fold from "@public/assets/components/ranking/fold.svg";
import unfold from "@public/assets/components/ranking/unfold.svg";
import g from "../utils/global";

type Ranking = {
  playerId: number;
  nickname: string;
  speciesname: string;
  totalExp: number;
};

const rankingList: Ref<Ranking[]> = ref([]);
const toggleRankingPanel: Ref<boolean> = ref(true);
const textEllipsisRef: Ref<HTMLDivElement[]> = ref([]);
const rankingPlaces = ["🥇", "🥈", "🥉", "#4", "#5", "#6", "#7", "#8", "#9", "#10"];
let playerCount: number = g.playerMap.size;

onMounted(() => {
  socket.on("ranking-receive", (rankingResponse: Ranking[]) => {
    rankingList.value = rankingResponse;
    playerCount = g.playerMap.size;
  });
});

onUpdated(() => {
  textEllipsisRef.value.forEach((el) => {
    // 텍스트 너비가 width를 초과하는 경우, ellipsis 적용
    if (el.offsetWidth < el.scrollWidth) {
      const translateX = -(el.scrollWidth - el.offsetWidth + 5) + "px";
      el.style.setProperty("--translate-x", translateX);
      el.classList.add("hover-ellipsis");
    }
  });
});

const formatTotalExp = (totalExp: number): string | number => {
  return totalExp >= 1000000 ? `${Math.floor(totalExp / 100000) / 10}m` : totalExp;
};
</script>

<template>
  <div class="container" @click="toggleRankingPanel = !toggleRankingPanel">
    <div class="ranking-title">
      <div class="font-bold">랭킹</div>
      <div class="ranking-title-right">
        <div class="player-count">총 {{ playerCount }}마리</div>
        <img v-show="toggleRankingPanel" class="ranking-toggle" :src="unfold" alt="" />
        <img v-show="!toggleRankingPanel" class="ranking-toggle" :src="fold" alt="" />
      </div>
    </div>
    <div class="ranking-container" v-show="toggleRankingPanel">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>닉네임</th>
            <th>어종</th>
            <th class="ranking-total-exp">경험치</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ranking, index) in rankingList" :key="index" :class="{ 'font-bold': index < 3 }">
            <td class="ranking-place">{{ rankingPlaces[index] }}</td>
            <td class="overflow-hidden">
              <div ref="textEllipsisRef" class="ranking-nickname">{{ ranking.nickname }}</div>
            </td>
            <td class="overflow-hidden">
              <div ref="textEllipsisRef" class="ranking-speciesname">{{ ranking.speciesname }}</div>
            </td>
            <td class="ranking-total-exp">{{ formatTotalExp(ranking.totalExp) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  max-width: 15rem;
  width: 100%;
  background-color: var(--transparent-black);
  position: absolute;
  left: 1rem;
  top: 1rem;
  padding: 10px;
  border-radius: 10px;
  cursor: default;

  --table-padding: 3px;

  .font-bold {
    font-weight: bold;
  }

  .overflow-hidden {
    overflow: hidden;
  }

  .ranking-title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .ranking-title-right {
      display: flex;
      align-items: center;

      .player-count {
        font-size: 0.7rem;
        padding-right: 0.5rem;
      }

      .ranking-toggle {
        height: 0.5rem;
      }
    }
  }

  .ranking-container {
    font-size: 0.8rem;
    text-align: center;

    table {
      border-collapse: collapse; // border 설정 시 필요

      thead {
        font-size: 0.65rem;
        border-bottom: 1px solid var(--transparent-white);

        th {
          font-weight: lighter;
        }
      }

      td {
        padding: var(--table-padding) 0;
      }
    }

    .ranking-place {
      color: yellowgreen;
      padding-right: var(--table-padding);
    }

    .ranking-nickname,
    .ranking-speciesname {
      width: 6rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &.hover-ellipsis:hover {
        overflow: visible;
        transition: all 1.5s ease-in-out 0.5s;
        transform: translateX(var(--translate-x, -100%));
      }
    }

    .ranking-speciesname {
      width: 5rem;
      padding-left: var(--table-padding);
    }

    .ranking-total-exp {
      padding-left: var(--table-padding);
      white-space: nowrap;
    }
  }
}
</style>
