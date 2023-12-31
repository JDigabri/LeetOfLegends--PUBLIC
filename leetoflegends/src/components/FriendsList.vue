<template>
  <div class="block">
    <div class="header" @click="showProf()">
      <div class="profPic" />
      <div class="username">
        <p>{{ userName }}</p>
        <p style="font-size: 16px">{{ tagline }}</p>
      </div>
    </div>
    <span style="margin-left: 10px; margin-top: 10px; color: #d9d9d9">Friends</span>
    <FriendCard v-for="(friend, index) in friends" :key="index" :userName="friend" :tagline="tagline" />

    <div @click="show" class="footer">
      <p>+ Add Friend</p>
    </div>
  </div>

  <AddFriend :userName="userName"  v-if="isModalVisible" @close="hide" />
  <ProfileModal :userName="userName" :tagline="tagline" v-if="isProfVis" @closeProf="hideProf" />
</template>

<script>
import FriendCard from './Modules/FriendCard.vue'
import AddFriend from './Modules/AddFriend.vue'
import Friendservice from '../services/Friendservice/Friendservice'
import ProfileModal from './ProfileModal.vue'
export default {
  name: 'FriendsList',
  components: {
    FriendCard,
    AddFriend,
    ProfileModal
  },
  data() {
    return {
      isModalVisible: false,
      friends: [],
      isProfVis: false
    }
  },
  props: {
    userName: {
      type: String,
      required: true
    },
    tagline: {
      type: String,
      required: false
    }
  },
  methods: {
    showProf() {
      this.isProfVis = true
    },
    hideProf() {
      this.isProfVis = false
    },
    show() {
      this.isModalVisible = true
    },
    hide() {
      this.isModalVisible = false
    },
    async fetchFriends() {
      try {
        const response = await Friendservice.getFriends() // Replace with your actual API endpoint
        this.friends = response.data.friends;
        this.friends = [...new Set(response.data.friends)];

      } catch (error) {
        console.error('Failed to fetch friends:', error)
      }
    }
  },
  mounted() {
    this.fetchFriends()
  }
}
</script>

<style scoped>
.block {
  width: 270px;
  height: 100vh;
  position: absolute;
  right: 0px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 12px 2px rgba(0, 0, 0, 0.25);
  background-color: var(--color-background-mute);
}
.footer {
  margin-top: auto;
  border-top: solid 1px #d9d9d9;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d9d9d9;
  transition: all 0.3s ease;
}
.footer:hover {
  background-color: #d9d9d965;
  color: #000000;
  cursor: pointer;
}

.header {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: start;
  color: #d9d9d9;
  transition: all 0.3s ease;
}
.header:hover {
  background-color: #d9d9d965;
  color: #000000;
  cursor: pointer;
}

.profPic {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  background-color: #d9d9d9;
  transition: all 0.3s ease;
  margin-left: 5px;
}
.username {
  max-height: 75px;
  margin-left: 10px;
  font-size: 18px;
  font-family: 'Inter', sans-serif;
  font-weight: 100;
}

.add {
  display: none;
}
</style>
