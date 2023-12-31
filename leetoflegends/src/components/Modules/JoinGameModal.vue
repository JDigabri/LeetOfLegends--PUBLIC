<!-- GameJoinModal.vue -->
<template>
    <div class="modal" >
      <div class="modal-content">
        <h2 style="margin-left: 30px;">Join a Game</h2>
        <input v-model="gameId" class="gameid" placeholder="Enter Game ID" />
        <div style="display: flex;    margin-left: 27.5px; gap: 5px;">
        <button class="button" @click="joinGame">Join</button>
        <button class="button"  @click="$emit('close')">Cancel</button>
            </div>
    </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        gameId: ''
      };
    },
    methods: {
      joinGame() {
        this.$emit('join', this.gameId);
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add styles for your modal here */
  .modal { 
    position: absolute;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #0000003c;
    top: 0;
   }

  .gameid {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    padding: 5px;
    font-weight: 300;
    border-radius: 5px;
    color: var(--color-text);
    background-color: var(--color-background-mute);
    border: 3px solid var(--color-background);
    margin-bottom: 5px;
    width: 450px;
    display: flex;
    align-items: center;
    margin-left: 25px;
    transition: all 0.3s ease;
}
.gameid:focus {
    outline: none;
    background-color: var(--color-background-soft);
}
.modal-content { 
    width: 500px;
    background-color: var(--color-background);
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    margin-top: 3px;
    height: 150px;
    color: var(--color-text);
    box-shadow: 0px 4px 12px 2px rgba(0, 0, 0, 0.25);
}

.button{
    width: 85px;
    height: 30px;
    flex-shrink: 0;
    background: var(--color-background-mute);
    color: var(--color-text);
    transition: all 0.3s ease;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
}
.button:hover {
    background: var(--color-background-soft);
    color: var(--color-text);
    cursor: pointer;
}
  </style>
  