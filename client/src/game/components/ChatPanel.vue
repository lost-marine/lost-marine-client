<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import g from "../utils/global";
import { socket } from "../utils/socket";
import type { InputChat } from "../types/chat";

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
  () => {
    const chatElement: HTMLInputElement | null = document.querySelector(".chat-list");
    if (chatElement !== null) {
      chatElement.scrollTop = chatElement.scrollHeight;
      chatElement.scrollIntoView({ behavior: "smooth" });
    }
  },
  { deep: true, flush: "post" }
);

addEventListener("keydown", (event: KeyboardEvent) => {
  const inputElement: HTMLInputElement | null = document.querySelector(".input-field");

  // 채팅창에 포커스되어있을 때, 공백 입력을 받습니다.
  if (focusInput.value && event.key === " ") {
    inputMessage.value += " ";
  }
  // Enter를 입력하면, 채팅창에 포커스됩니다.
  else if (event.key === "Enter" && !toggleChatPanel.value) {
    inputElement?.focus();
    openChatPanel();
  }
  // Escape를 입력하면, 채팅창 포커스가 해제됩니다.
  else if (event.key === "Escape" && toggleChatPanel.value) {
    inputElement?.blur();
    closeChatPanel();
  }
});

function openChatPanel(): void {
  toggleChatPanel.value = true;
  inputMessage.value = "";
  // 자동으로 스크롤을 아래로 내리는 코드 추가
}

function closeChatPanel(): void {
  toggleChatPanel.value = false;
}
</script>

<template>
  <div class="container">
    <div class="chat-container" v-if="toggleChatPanel">
      <span class="close-button" @click="closeChatPanel()">✖</span>
      <div class="chat-list">
        <div v-for="(message, idx) in g.chatList.value" :key="idx">
          [{{ message.speciesname }}] <strong>{{ message.nickname }}</strong> 💬 {{ message.msg }}
        </div>
      </div>
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
  background-color: rgba(0, 0, 0, 0.5);
  bottom: 2rem;
  left: 1rem;

  padding: 10px;
  border-radius: 10px;

  .chat-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5rem;

    .close-button {
      cursor: pointer;
      align-self: flex-end;
    }

    .chat-list {
      height: 15rem;
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
      border: 6px solid rgba(255, 255, 255, 0);
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
