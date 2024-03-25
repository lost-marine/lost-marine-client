<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import { socket } from "../utils/socket";
import unfold from "../../../public/assets/components/unfold.svg";
import fold from "../../../public/assets/components/fold.svg";

type Ranking = {
  playerId: number;
  nickname: string;
  speciesname: string;
  point: number;
};

const rankingList: Ref<Ranking[]> = ref([]);

for (let i = 100; i < 109; i++) {
  rankingList.value.push({
    playerId: i,
    nickname: `테스트${i}`,
    speciesname: `고등어`,
    point: 80 + i
  });
}

rankingList.value.push({
  playerId: 110,
  nickname: "나의이름은열두글자이지요",
  speciesname: "바나나시클리드",
  point: 10000
});

const rankingPlaces = ["🥇", "🥈", "🥉", "#4", "#5", "#6", "#7", "#8", "#9", "#10"];

onMounted(() => {
  socket.on("ranking-receive", (rankingResponse: Ranking[]) => {
    // rankingList.value = rankingResponse;
    console.log(rankingResponse);
  });
});

const toggleRankingPanel: Ref<boolean> = ref(true);
</script>

<template>
  <div class="container" @click="toggleRankingPanel = !toggleRankingPanel">
    <div class="ranking-title">
      <div style="font-weight: bold">랭킹</div>
      <img v-if="toggleRankingPanel" class="ranking-toggle" :src="unfold" alt="" />
      <img v-else class="ranking-toggle" :src="fold" alt="" />
    </div>
    <div class="ranking-container" v-show="toggleRankingPanel">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>닉네임</th>
            <th>어종</th>
            <th style="white-space: nowrap">경험치</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ranking, index) in rankingList" :key="index" :class="{ 'font-bold': index < 3 }">
            <td class="ranking-place">{{ rankingPlaces[index] }}</td>
            <td style="overflow: hidden">
              <div class="ranking-nickname">{{ ranking.nickname }}</div>
            </td>
            <td style="overflow: hidden">
              <div class="ranking-speciesname">{{ ranking.speciesname }}</div>
            </td>
            <td>{{ ranking.point }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.font-bold {
  font-weight: bold;
}

.container {
  max-width: 15rem;
  width: 100%;
  background-color: var(--transparent-black);

  position: absolute;
  right: 1rem;
  top: 1rem;
  padding: 10px;
  border-radius: 10px;

  .ranking-title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .ranking-toggle {
      height: 0.5rem;
    }
  }

  .ranking-container {
    font-size: 0.8rem;
    text-align: center;

    table {
      border-collapse: collapse; // tr에 border 설정 시 필요

      thead {
        font-size: 0.65rem;

        th {
          font-weight: lighter;
        }
      }

      tr {
        border-bottom: 1px solid var(--transparent-white);
      }

      td {
        padding: 3px 0;
      }
    }

    .ranking-place {
      color: yellowgreen;
    }

    .ranking-nickname {
      width: 6rem;
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .ranking-nickname:hover {
      position: relative;
      overflow: visible;
      transition: transform 3s ease-in;
      transform: translateX(-100%);
    }

    .ranking-speciesname {
      width: 5rem;
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
