<script setup lang="ts">
import dash from "@/assets/dash/dash.svg";
import { ref, type Ref } from "vue";

const dashBackgroundRef: Ref<HTMLDivElement | undefined> = ref();
const activeDashDelay: number = 10; // seconds

// g.chatInputFocused가 false 이면서, enter를 입력받고, gameScene이 현재 게임인 경우에만 실행

const test = function (): void {
  if (dashBackgroundRef.value !== undefined && dashBackgroundRef.value !== null) {
    dashBackgroundRef.value.style.visibility = "visible";
    dashBackgroundRef.value.style.setProperty("--active-dash-delay", `${activeDashDelay}s`);
    dashBackgroundRef.value.style.height = "0%";
  }

  setTimeout(() => {
    if (dashBackgroundRef.value !== undefined && dashBackgroundRef.value !== null) {
      dashBackgroundRef.value.style.visibility = "hidden";
      dashBackgroundRef.value.style.setProperty("--active-dash-delay", `0s`);
      dashBackgroundRef.value.style.height = "100%";
    }
  }, activeDashDelay * 1000);
};
</script>

<template>
  <div
    @click="test()"
    style="background-color: red; position: absolute; height: 100px; width: 100px; bottom: 3rem; left: 10%"
  ></div>
  <div class="container">
    <div class="dash-container">
      <div class="dash-flex-items">
        <img :src="dash" alt="" />
        <div>SPACE</div>
      </div>
      <div id="dash-background" class="dash-background" ref="dashBackgroundRef"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  position: absolute;
  bottom: 2rem;
  left: calc(50% + 14rem);
  $dark-black: rgba(0, 0, 0, 0.5);

  .dash-container {
    width: 50px;
    height: 50px;
    border-radius: 10%;
    background-color: var(--transparent-white);
    overflow: hidden;

    .dash-flex-items {
      position: absolute;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;

      img {
        width: 90%;
        height: 90%;
      }

      div {
        font-size: 0.5rem;
        font-weight: bold;
        color: var(--transparent-black);
      }
    }

    .dash-background {
      visibility: hidden;
      transition: height var(--active-dash-delay) linear;
      height: 100%;
      width: 100%;
      background-color: $dark-black;
    }
  }
}
</style>
