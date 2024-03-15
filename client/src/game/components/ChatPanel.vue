<script setup lang="ts">
import { ref, type Ref } from "vue";
import g from "../utils/global";
import { socket } from "../utils/socket";
import type { NewChatMessage } from "../types/chatMessage";

const toggleChatPanel: Ref<boolean> = ref(false);
const newMessage: Ref<string> = ref("");

function sendMessage(): void {
  if (newMessage.value !== "" && g.myInfo !== null) {
    const message: NewChatMessage = {
      playerId: g.myInfo?.playerId,
      msg: newMessage.value
    };

    // 소켓 통신 emit
    socket.emit("chat-message-send", message);
    newMessage.value = ""; // 입력 필드를 비웁니다
  }
}
</script>

<template>
  <div class="container">
    <div class="chat-container" v-if="toggleChatPanel">
      <span class="close-button" @click="toggleChatPanel = false">✖</span>
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
        @mousedown="toggleChatPanel = true"
        @keyup.enter="sendMessage"
      />
      <button class="send-button" @click="sendMessage">💌</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
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

    .input-area {
      width: 20rem;
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
