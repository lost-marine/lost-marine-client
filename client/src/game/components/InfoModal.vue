<script setup lang="ts">
const emit = defineEmits(["modal-close"]);
const modalClose = (): void => {
  emit("modal-close");
};
</script>

<template>
  <div class="modal-wrap" @click="modalClose">
    <div class="modal-container"></div>
  </div>
</template>

<style lang="scss">
/* dimmed */
.modal-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 30;
}
/* modal or popup */
.modal-container {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 550px;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
}
</style>
