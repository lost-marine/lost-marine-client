<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import g from "../utils/global";
import { socket } from "../utils/socket";
import type { InputChat } from "../types/chat";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

const toggleChatPanel: Ref<boolean> = ref(false);
const inputMessage: Ref<string> = ref("");
const focusInput: Ref<boolean> = ref(false);

function sendMessage(): void {
  if (inputMessage.value !== "" && g.myInfo !== null) {
    const message: InputChat = {
      playerId: g.myInfo?.playerId,
      msg: inputMessage.value
    };

    socket.emit("chat-message-send", message);
    inputMessage.value = "";
  }
}

watch(
  () => g.chatList.value,
  (newValue) => {
    if (newValue.length > 0) {
      if (newValue[newValue.length - 1].playerId === g.myInfo?.playerId) {
        scrollToBottom();
      } else if (endIndex.value === newValue.length) {
        scrollToBottom();
      }
    }
  },
  { deep: true, flush: "post" }
);

const endIndex: Ref<number> = ref(0);
function onUpdate(viewStartIndex: number, viewEndIndex: number, visibleStartIndex: number, visibleEndIndex: number): void {
  endIndex.value = visibleEndIndex;
}

const scroller: Ref<any> = ref(null);
function scrollToBottom(): void {
  if (scroller.value !== null) {
    scroller.value.scrollToBottom();
  }
}

addEventListener("keydown", (event: KeyboardEvent) => {
  const inputElement: HTMLInputElement | null = document.querySelector(".input-field");

  // 채팅창에 포커스되어있을 때, 공백 입력을 받습니다.
  if (focusInput.value && event.key === " ") {
    inputMessage.value += " ";
  }
  // Enter를 입력하면, 채팅창이 열립니다.
  else if (event.key === "Enter" && !toggleChatPanel.value) {
    inputElement?.focus();
    openChatPanel();
  }
  // Enter를 입력하면, 채팅창에 포커스됩니다.
  else if (!focusInput.value && event.key === "Enter") {
    inputElement?.focus();
  }
  // Escape를 입력하면, 채팅창이 닫힙니다.
  else if (event.key === "Escape" && toggleChatPanel.value) {
    inputElement?.blur();
    closeChatPanel();
  }
});

function openChatPanel(): void {
  toggleChatPanel.value = true;
  inputMessage.value = "";
}

function closeChatPanel(): void {
  toggleChatPanel.value = false;
}
</script>

<template>
  <div class="container">
    <div class="chat-container" v-show="toggleChatPanel">
      <span class="close-button" @click="closeChatPanel()">✖</span>
      <DynamicScroller
        ref="scroller"
        @resize="scrollToBottom()"
        :items="g.chatList.value"
        :min-item-size="3"
        class="chat-list"
        key-field="timeStamp"
        :emit-update="true"
        @update="onUpdate"
      >
        <template v-slot="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :data-index="index"
            :active="active"
            :size-dependencies="[item.speciesname, item.nickname]"
          >
            <div class="scroller-item">
              [{{ item.speciesname }}] <strong>{{ item.nickname }}</strong> 💬 {{ item.msg }}
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </div>

    <div class="input-group">
      <input
        class="input-field"
        type="text"
        v-model="inputMessage"
        placeholder="텍스트 입력..."
        @mousedown="openChatPanel()"
        @keyup.enter="sendMessage()"
        @focus="focusInput = true"
        @blur="focusInput = false"
      />
      <button class="send-button" @click="sendMessage()">💌</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  max-width: 25rem;
  width: 100%;

  position: absolute;
  background-color: var(--semi-transparent-black);
  bottom: 2rem;
  left: 1rem;

  padding: 10px;
  border-radius: 10px;

  .scroll-end-float-button {
    position: absolute;
    bottom: 3rem;
    right: 3rem;
    cursor: pointer;
  }

  .chat-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5rem;

    .close-button {
      cursor: pointer;
      align-self: flex-end;
    }

    .chat-list {
      height: 20rem;
      overflow-y: scroll;
    }

    .chat-list::-webkit-scrollbar {
      width: 16px;
      height: 16px;
    }

    .chat-list::-webkit-scrollbar-track {
      background: transparent;
    }

    .chat-list::-webkit-scrollbar-thumb {
      border: 6px solid transparent;
      background-clip: padding-box;
      border-radius: 8px;
      background-color: white;
    }
  }

  .input-group {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .input-field {
      width: 100%;
      background-color: black;
      color: white;

      border-radius: 5px;
      height: 2rem;
      font-size: 1rem;
      border: none;
    }

    .input-field:focus {
      outline: none;
    }

    .send-button {
      background-color: black;
      border: 2px solid white;
      border-radius: 10px;
      height: 2rem;
      font-size: larger;
    }

    .send-button:focus {
      outline: none;
    }
  }
}
</style>
../types/chat
