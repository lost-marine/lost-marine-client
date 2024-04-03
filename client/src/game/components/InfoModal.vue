<script setup lang="ts">
import infoImage1 from "@public/assets/images/info1.png";
import infoImage2 from "@public/assets/images/info2.png";
import leftArrow from "@public/assets/components/icons/LeftArrow.png";
import rightArrow from "@public/assets/components/icons/RightArrow.png";
import closeIcon from "@public/assets/components/icons/Close.png";

import { ref } from "vue";
const emit = defineEmits(["modal-close"]);
const modalClose = (): void => {
  emit("modal-close");
};
const isSwiped = ref<boolean>(false);
const onSwipe = (): void => {
  isSwiped.value = true;
};

const onSwipeBack = (): void => {
  isSwiped.value = false;
};
</script>

<template>
  <div class="modal-wrap" @click="modalClose">
    <div class="modal-container" @click.stop="">
      <button @click="modalClose" class="close-btn"><img :src="closeIcon" /></button>
      <div class="swiper" :class="{ swiped: isSwiped }">
        <button @click="onSwipeBack" class="swipe-btn" :class="{ selected: !isSwiped }">
          <img :src="leftArrow" />
        </button>
        <div class="img-wrap">
          <img :src="infoImage1" />
          <img :src="infoImage2" />
        </div>
        <button @click="onSwipe" class="swipe-btn" :class="{ selected: isSwiped }"><img :src="rightArrow" /></button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$white: #ffffff;
$soft-gray: #e6e6e6;
$gray: #666666;
$black-tint: rgba(0, 0, 0, 0.4);

/* dimmed */
.modal-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: $black-tint;
  z-index: 30;
}
/* modal or popup */
.modal-container {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  background: $white;
  border-radius: 1rem;
  padding: 2rem;
  box-sizing: border-box;
}
.close-btn {
  position: absolute;
  right: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
}

.swiper {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.swipe-btn {
  background: linear-gradient(145deg, $white, $soft-gray);
  box-shadow:
    5px 5px 10px $gray,
    -5px -5px 10px $white;
  border: none;
  border-radius: 3rem;
  height: 3rem;
  width: 3rem;
  &:hover {
    border-radius: 50px;
    background: linear-gradient(145deg, $soft-gray, $white);
    box-shadow:
      5px 5px 10px $gray,
      -5px -5px 10px $white;
  }
}
.img-wrap {
  width: 80%;
  display: flex;
  overflow: hidden;
  margin-left: auto;
  margin-right: auto;
  img {
    width: 100%;
    transition: all 0.5s;
  }
}
.swiped {
  .img-wrap {
    img {
      transform: translateX(-100%);
    }
  }
}

.selected {
  display: none;
}
</style>
