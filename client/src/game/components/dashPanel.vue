<script setup lang="ts">
import dash from "@/assets/dash/dash.svg";
import { ref, type Ref } from "vue";
import g from "../utils/global";

const dashBackgroundRef: Ref<HTMLDivElement | undefined> = ref();

addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === " " && !g.chatInputFocused && g.dashInfo.dashable) {
    if (dashBackgroundRef.value !== undefined && dashBackgroundRef.value !== null) {
      dashBackgroundRef.value.style.visibility = "visible";
      dashBackgroundRef.value.style.setProperty("--dash-delay", `${g.dashInfo.delayTime}s`);
      dashBackgroundRef.value.style.setProperty("--dash-duration", `${g.dashInfo.durationTime}s`);
      dashBackgroundRef.value.style.height = "0%";
      g.dashInfo.dashing = true;
      g.dashInfo.dashable = false;
    }

    setTimeout(() => {
      g.dashInfo.dashing = false;
    }, g.dashInfo.durationTime * 1000);

    setTimeout(() => {
      if (dashBackgroundRef.value !== undefined && dashBackgroundRef.value !== null) {
        dashBackgroundRef.value.style.visibility = "hidden";
        dashBackgroundRef.value.style.setProperty("--active-dash-delay", `0s`);
        dashBackgroundRef.value.style.height = "100%";
        g.dashInfo.dashable = true;
      }
    }, g.dashInfo.delayTime * 1000);
  }
});
</script>

<template>
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
      transition: height var(--dash-delay) linear var(--dash-duration);
      height: 100%;
      width: 100%;
      background-color: $dark-black;
    }
  }
}
</style>
