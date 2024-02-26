<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { EventBus } from './EventBus';
import StartGame from './main';
import Phaser from 'phaser';
import io from 'socket.io-client';

// Save the current scene instance
const scene = ref();
const game = ref();
const emit = defineEmits(['current-active-scene']);
let socket = io('http://70.12.246.252:3000');

onMounted(() => {

    const test = {
        code : 1001,
        data : {
            nickname : "서희"
        }
    }

    socket.emit('',test, (response: any) => {
        console.log(response);
    });

    game.value = StartGame('game-container');
    
    EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) => {
        
        emit('current-active-scene', scene_instance);
    
        scene.value = scene_instance;
    
    });

});

onUnmounted(() => {

    if (game.value)
    {
        game.value.destroy(true);
        game.value = null;
    }

});

defineExpose({ scene, game });

</script>

<template>
    <div id="game-container"></div>
</template>