<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import g from "../utils/global";
import { socket } from "../utils/socket";
import type { NewChatMessage } from "../types/chatMessage";

const toggleChatPanel: Ref<boolean> = ref(false);
const newMessage: Ref<string> = ref("");
const focusInput: Ref<boolean> = ref(false);

function sendMessage(): void {
  if (newMessage.value !== "" && g.myInfo !== null) {
    const message: NewChatMessage = {
      playerId: g.myInfo?.playerId,
      msg: newMessage.value
    };

    socket.emit("chat-message-send", message);
    newMessage.value = "";
  }
}

watch(
  () => g.chatMessageList.value,
  () => {
    window.setTimeout(autoScrollDown, 1);
  },
  { deep: true }
);

function autoScrollDown(): void {
  const chatElement: HTMLInputElement | null = document.querySelector(".chat-message");
  if (chatElement !== null) {
    chatElement.scrollTop = chatElement.scrollHeight;
    chatElement.scrollIntoView({ behavior: "smooth" });
  }
}

addEventListener("keydown", (event: KeyboardEvent) => {
  const inputElement: HTMLInputElement | null = document.querySelector(".input-area");

  // 채팅창에 포커스되어있을 때, 공백 입력을 받습니다.
  if (focusInput.value && event.key === " ") {
    newMessage.value += " ";
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
  newMessage.value = "";
  window.setTimeout(autoScrollDown, 1);
}

function closeChatPanel(): void {
  toggleChatPanel.value = false;
}
</script>

<template>
  <div class="container">
    <div class="chat-container" v-if="toggleChatPanel">
      <span class="close-button" @click="closeChatPanel()">✖</span>
      <div class="chat-message">
        <div v-for="(message, idx) in g.chatMessageList.value" :key="idx">
          [{{ message.speciesname }}] <strong>{{ message.nickname }}</strong> 💬 {{ message.msg }}
        </div>
      </div>
    </div>

    <div class="input-group">
      <input
        class="input-area"
        type="text"
        v-model="newMessage"
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

    .chat-message {
      height: 15rem;
      overflow-y: scroll;
    }

    .chat-message::-webkit-scrollbar {
      width: 16px;
      height: 16px;
    }

    .chat-message::-webkit-scrollbar-track {
      background: transparent;
    }

    .chat-message::-webkit-scrollbar-thumb {
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

    .input-area {
      width: 100%;
      background-color: black;
      color: white;

      border-radius: 5px;
      height: 2rem;
      font-size: 1rem;
      border: none;
    }

    .input-area:focus {
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
