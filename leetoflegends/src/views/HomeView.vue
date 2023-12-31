<template>
  <div class="home">
    <FriendsList :userName="username" :tagline="tagline" />
    <PlayerCard :userName="username" :tagline="tagline" style="margin-top: 250px;" />
    <FindMatch  />
  </div>
</template>

<script>
import PlayerCard from '../components/PlayerCard.vue'
import FriendsList from '../components/FriendsList.vue'
import AuthenticationService from '../services/Authservice/Authservice.js'
import FindMatch from '../components/FindMatch.vue'

export default {
  name: 'HomeView',
  components: {
    PlayerCard,
    FriendsList,
    FindMatch
  },
  data() {
    return {
      username: '', // initialize username
      tagline: 'Default Tagline'
    }
  },
  async mounted() {
    try {
      const response = await AuthenticationService.getUserInfo()
      this.username = response.data.username
    } catch (error) {
      console.error('Could not fetch user info:', error)
    }
  }
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 150px;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: var(--color-background-mute);
}
</style>
