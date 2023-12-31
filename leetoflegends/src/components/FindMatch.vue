<template>
  <div class="button">
    <p @click="showModal = true" style="width: 80%; height: 100%; display: flex; justify-content: center; align-items: center;">Find Match</p>
    <p class="exit" @click="goToMatch">+</p>

    <!-- Game Join Modal -->
    <JoinGameModal v-if="showModal" @join="joinGame" @close="showModal = false" />
  </div>
</template>

<script>
import authService from '../services/Authservice/Authservice'; // Adjust the path as necessary
import gameService from '../services/GameService/Gameservice';  // Adjust the path as necessary
import Problemservice from '../services/Problemservice/Problemservice';
import JoinGameModal from './Modules/JoinGameModal.vue';
export default {
  name: 'FindMatch',
  components: {
    JoinGameModal,
  },
  data() {
    return {
      showModal: false,
      problemId: '',
    };
  },
  methods: {
    async goToMatch() {
      try {
        const response = await Problemservice.getRandomProblem()
        this.problem = response.data
        this.testCases = response.data.testCases;
        const problemId = this.problem.problem.title; // Use this.problem to access the prop
        // Fetch user information
        const userInfoResponse = await authService.getUserInfo();
        const username = userInfoResponse.data.username;

        // Request backend to find/create a game session
        const problemResponse = await gameService.createGame(problemId, []); // Use an actual problemId
        const sessionId = problemResponse.data.sessionId;

        // Automatically join the game session
        await gameService.joinGame(sessionId, username);

        // Navigate to the game view
        this.$router.push({ name: 'game', params: { problemId: problemId, sessionId: sessionId } });
      } catch (error) {
        console.error('Error in finding or joining game:', error);
        // Handle error
      }
    },
    async joinGame(gameId) {
      try {
        // Fetch user information
        const userInfoResponse = await authService.getUserInfo();
        const username = userInfoResponse.data.username;

        // Fetch game session data
        const gameSessionResponse = await gameService.getGameSession(gameId);
        const problemId = gameSessionResponse.data.gameSession.problemId;

        console.log('Game session data:', gameSessionResponse.data);
        console.log('Problem ID:', problemId);

        // Ensure problemId is defined
        if (!problemId) {
          throw new Error('Problem ID is undefined');
        }

        // Join the game session
        await gameService.joinGame(gameId, username);

        // Navigate to the game view with the game ID
        this.$router.push({ name: 'game', params: { problemId: problemId, sessionId: gameId } });
      } catch (error) {
        console.error('Error joining game:', error);
        // Handle error
      } finally {
        this.showModal = false;
      }
    },


  },
}
</script>

<style scoped>
.button {
  width: 450px;
  height: 100px;
  flex-shrink: 0;
  background: #57c3ff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button:hover {
  background: #4d9fe6;
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.5);

  cursor: pointer;
}

.button p {
  font-family: 'Source Code Pro', monospace;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 43px;
  color: #ffffff;
}

.exit {
  position: absolute;
  background-color: #ff9357;
  border-radius: 50%;
  padding: 5px;
  padding-left: 20px;
  padding-right: 20px;
  font-family: 'Source Code Pro', monospace;
  font-style: normal;
  font-weight: 500;
  font-size: 20px !important;
  color: #ffffff;
  border: var(--color-background-mute) solid 12px;
  margin-right: 450px;
  transition: all 0.3s ease;
}

.exit:hover {
  background-color: #ff7b3d;
  cursor: pointer;
}
</style>
