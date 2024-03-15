<script setup lang="ts">
import { ref, type Ref } from "vue";

interface Message {
  playerId: number;
  speciesName: string;
  nickname: string;
  msg: string;
  timeStamp: number;
}

interface NewMessage {
  playerId: number;
  msg: string;
}

const toggleChatPanel: Ref<boolean> = ref(false);
const messages: Ref<Message[]> = ref([]);
const newMessage: Ref<string> = ref("");

// 소켓 통신 on

function sendMessage(): void {
  if (newMessage.value.trim() !== "") {
    const message: NewMessage = {
      playerId: 1,
      msg: newMessage.value
    };
    // 소켓 통신 emit
    message.msg = message.msg.trim();
    newMessage.value = ""; // 입력 필드를 비웁니다
  }
}
</script>

<template>
  <div class="container">
    <div class="chat-container" v-if="toggleChatPanel">
      <span class="close-button" @click="toggleChatPanel = false">✖</span>
      <div class="chat-message">
        메시지목록
        <div v-for="(message, idx) in messages" :key="idx">
          {{ message.msg }}
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

    .close-button {
      cursor: pointer;
      align-self: flex-end;
    }

    .chat-message {
      height: 15rem;
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
      border: none;
    }

    .input-area::placeholder {
      color: rgba(255, 255, 255, 0.752);
    }

    .send-button {
      background-color: black;
      border: 2px solid white;
      border-radius: 10px;
      height: 2rem;
      font-size: larger;
    }
  }
}
</style>
