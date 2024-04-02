<script setup lang="ts">
import dash from "@/assets/dash/dash.svg";
import { onMounted, ref, type Ref } from "vue";
import g from "../utils/global";

const dashBackgroundRef: Ref<HTMLDivElement | undefined> = ref();
const dashBorderRef: Ref<HTMLDivElement | undefined> = ref();

async function delay(seconds: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

async function handleSpaceKeyPress(): Promise<void> {
  if (g.dashInfo.dashable) {
    g.dashInfo.dashing = true;
    g.dashInfo.dashable = false;
    if (dashBackgroundRef.value !== null && dashBackgroundRef.value !== undefined) {
      dashBackgroundRef.value.style.visibility = "visible";
      dashBackgroundRef.value.style.setProperty("--dash-delay", `${g.dashInfo.delayTime}s`);
      dashBackgroundRef.value.style.setProperty("--dash-duration", `${g.dashInfo.durationTime}s`);
      dashBackgroundRef.value.style.height = "0%";
    }
    if (dashBorderRef.value !== null && dashBorderRef.value !== undefined) {
      dashBorderRef.value.style.border = "1px solid black";
    }

    await delay(g.dashInfo.durationTime);
    g.dashInfo.dashing = false;

    await delay(g.dashInfo.delayTime);
    g.dashInfo.dashable = true;
    if (dashBackgroundRef.value !== null && dashBackgroundRef.value !== undefined) {
      dashBackgroundRef.value.style.visibility = "hidden";
      dashBackgroundRef.value.style.setProperty("--dash-delay", `0s`);
      dashBackgroundRef.value.style.setProperty("--dash-duration", `0s`);
      dashBackgroundRef.value.style.height = "100%";
    }
    if (dashBorderRef.value !== null && dashBorderRef.value !== undefined) {
      dashBorderRef.value.style.border = "1px solid antiquewhite";
    }
  }
}

onMounted(() => {
  addEventListener("keydown", (event: KeyboardEvent): void => {
    if (event.key === " " && !g.chatInputFocused) {
      try {
        void handleSpaceKeyPress();
      } catch (event) {
        console.debug(event);
      }
    }
  });
});
</script>

<template>
  <div class="container">
    <div class="dash-container" ref="dashBorderRef">
      <div class="dash-flex-items">
        <img :src="dash" alt="" />
        <div>SPACE</div>
      </div>
      <div class="dash-background" ref="dashBackgroundRef"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  position: absolute;
  bottom: 2rem;
  left: calc(50% + 14rem);
  $dark-black: rgba(0, 0, 0, 0.5);
  $semi-transparent-white: rgba(255, 255, 255, 0.7);

  .dash-container {
    width: 50px;
    height: 50px;
    border-radius: 10%;
    background-color: var(--transparent-white);
    overflow: hidden;
    border: 1px solid antiquewhite;

    .dash-flex-items {
      position: absolute;
      height: 90%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;

      img {
        width: 80%;
        height: 80%;
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
