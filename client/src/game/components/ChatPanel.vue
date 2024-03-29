<script setup lang="ts">
import { ref, watch, type Ref, onMounted } from "vue";
import g from "../utils/global";
import { socket } from "../utils/socket";
import type { InputChat } from "../types/chat";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

const toggleChatPanel: Ref<boolean> = ref(false);
const inputMessage: Ref<string> = ref("");

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

onMounted(() => {
  const inputElement: HTMLInputElement | null = document.querySelector(".input-field");

  addEventListener("keydown", (event: KeyboardEvent) => {
    // Enter키로 채팅을 시작합니다.
    if (event.key === "Enter") {
      if (g.chatInputFocused) {
        sendMessage(inputElement);
      } else {
        openChatPanel(inputElement);
      }
    }
    // Esc키로 채팅창을 숨깁니다.
    else if (event.key === "Escape") {
      closeChatPanel(inputElement);
    }
    // html input에 사용자 입력을 받습니다.
    else if (g.chatInputFocused) {
      if (event.key === " ") {
        inputMessage.value += " ";
      }
    }
  });
});

function sendMessage(inputElement: HTMLInputElement | null): void {
  if (inputMessage.value !== "" && g.myInfo !== null) {
    const message: InputChat = {
      playerId: g.myInfo?.playerId,
      msg: inputMessage.value
    };

    socket.emit("chat-message-send", message);
    inputMessage.value = "";
  }
  inputElement?.blur();
}

function openChatPanel(inputElement: HTMLInputElement | null): void {
  toggleChatPanel.value = true;
  inputElement?.focus();
}

function closeChatPanel(inputElement: HTMLInputElement | null): void {
  toggleChatPanel.value = false;
  inputElement?.blur();
}
</script>

<template>
  <div class="container">
    <div class="chat-container" v-show="toggleChatPanel">
      <div class="close">
        <div class="close-esc">Esc키로 채팅창 숨기기</div>
        <div class="close-button" @click="closeChatPanel(null)">✖</div>
      </div>
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
        placeholder="Enter키로 채팅 시작하기"
        @mousedown="openChatPanel(null)"
        @focus="g.chatInputFocused = true"
        @blur="g.chatInputFocused = false"
      />
      <button class="send-button" @click="sendMessage(null)">💌</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  max-width: 20rem;
  width: 100%;

  position: absolute;
  background-color: var(--transparent-black);
  bottom: 2rem;
  left: 1rem;

  padding: 10px;
  border-radius: 10px;

  .chat-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5rem;

    .close {
      display: flex;
      align-items: center;
      justify-content: end;

      .close-esc {
        color: var(--transparent-white);
        padding-right: 10px;
        font-size: x-small;
      }

      .close-button {
        cursor: pointer;
      }
    }

    .chat-list {
      height: 10rem;
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
    justify-content: space-between;
    height: 2rem;

    .input-field {
      height: 100%;
      width: 100%;
      background-color: var(--transparent-black);
      color: white;
      border-radius: 5px;
      font-size: 1rem;
      border: none;
    }

    .input-field:focus {
      outline: none;
    }

    .send-button {
      height: 100%;
      background-color: var(--transparent-black);
      border: 2px solid white;
      border-radius: 10px;
      font-size: larger;
      cursor: pointer;
    }

    .send-button:focus {
      outline: none;
    }
  }
}
</style>
../types/chat
