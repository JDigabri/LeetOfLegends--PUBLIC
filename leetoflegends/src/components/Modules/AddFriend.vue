<template>

  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Add Friend</h2>
      </div>
      <div class="modal-body">
        <input
          type="text"
          @keydown.enter="onEnterPress"
          placeholder="Enter Username"
          v-model="friendName"
        />
      </div>
      <div class="modal-footer">
        <button class="btn" @click="addFriend">Add Friend</button>
      </div>
    </div>
  </div>
  <div @click="close" class="bg"></div>

</template>

<script>
import Friendservice from '../../services/Friendservice/Friendservice'

export default {
  name: 'AddFriend',
  emits: ['close'],

  data() {
    return {
      friendName: ''
    }
  },
  props: {
    userName: {
      type: String,
      required: true
    },

  },
  methods: {
    close() {
      this.$emit('close')
    },
    async addFriend() {
      try {
        const friendInfo = {
          friendUsername: this.friendName,
          myUsername: this.userName
        }
        const response = await Friendservice.addFriend(friendInfo)
        console.log('Friend added:', response.data)
        this.close()
      } catch (error) {
        console.error('Adding Friend Failed:', error)
      }
    },
    onEnterPress() {
      this.addFriend()
    }
  },
}
</script>

<style scoped>
.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  background-color: #000000;
  opacity: 0.5;
  z-index: 1;
}

.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  background-color: var(--color-background);
  padding: 25px;
}

.logins {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  justify-content: center;
  width: 100%;
}
input {
  width: 100%;
  height: 40px;
  font-size: 16px;
  background-color: #d9d9d9;
  border: none;
  border-radius: 5px;
  font-family: 'Inter', sans-serif;
}
input:focus {
  outline: none;
}

input[type='text'] {
  padding-left: 10px;
}
input[type='password'] {
  padding-left: 10px;
}

button {
  width: 100%;
  height: 40px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  background-color: #57c3ff;
  font-family: 'Source Code Pro', monospace;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease-in-out;
  user-select: none;
  margin-top: 5px;
}

button:hover {
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.35);
  cursor: pointer;
}
</style>
