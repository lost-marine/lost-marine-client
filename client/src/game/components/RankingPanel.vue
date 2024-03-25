<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import { socket } from "../utils/socket";

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
  point: 80 + 10
});

const rankingPlaces = ["🥇", "🥈", "🥉", "#4", "#5", "#6", "#7", "#8", "#9", "#10"];

onMounted(() => {
  socket.on("ranking-receive", (rankingResponse: Ranking[]) => {
    rankingList.value = rankingResponse;
    console.log(rankingResponse);
  });
});
</script>

<template>
  <div class="container">
    <div class="ranking-title">Leader Board</div>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Nickname</th>
          <th>Species</th>
          <th>Point</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ranking, index) in rankingList" :key="index">
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
</template>

<style scoped lang="scss">
.container {
  max-width: 15rem;
  width: 100%;
  background-color: var(--transparent-black);

  position: absolute;
  right: 1rem;
  top: 1rem;
  padding: 10px;
  border-radius: 10px;
  font-size: 0.8rem;
  text-align: center;

  .ranking-title {
    font-size: 1.1rem;
  }

  thead {
    font-weight: lighter;
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
</style>
