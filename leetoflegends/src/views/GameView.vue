<template>
  <div class="bg" v-if="!isWaitingForPlayer">
    <TopNavBar />
    <div class="underneath">
      <ProblemView :problem="problem" :testCases="testCases" v-if="problem && testCases" />
      <div class="editor">
        <TextEditor :problem="problem" @allTestCasesPassed="handleGameEnd" />
      </div>
    </div>
  </div>
  <div v-else class="waiting-message">
    <PlayerWait :sessionId="$route.params.sessionId" />
</div>
</template>

<script>
import TextEditor from '../components/TextEditor.vue'
import ProblemView from '../components/ProblemView.vue'
import Problemservice from '../services/Problemservice/Problemservice'
import TopNavBar from '../components/TopNavBar.vue'
import Authservice from '../services/Authservice/Authservice'
import GameService from '../services/GameService/Gameservice'
import PlayerWait from '../components/PlayerWait.vue'
export default {
  name: 'MonacoEditor',
  components: {
    TextEditor,
    ProblemView,
    TopNavBar,
    PlayerWait
  },
  data() {
    return {
      problem: null,
      testCases: null,
      isWaitingForPlayer: true, // Flag to track if waiting for another player
      ws: null,
      username: null,
    }
  },
  async mounted() {
    try {
      const problemTitle = this.$route.params.problemId;
      const response = await Problemservice.getProblemByTitle(problemTitle);
      this.problem = response.data;
      this.testCases = response.data.testCases;
      const userInfoResponse = await Authservice.getUserInfo();
      this.username = userInfoResponse.data.username;
      this.initializeWebSocket();
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
    }
  },
  methods: {
    initializeWebSocket() {
      const token = this.$store.state.token;
      console.log('Token:', token);
      const sessionId = this.$route.params.sessionId;
      
      const wsUrl = `ws://34.139.42.66:8086/?token=${token}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connection established');
        this.ws.send(JSON.stringify({ type: 'joinSession', sessionId: sessionId }));
      };

      this.ws.onmessage = (event) => {
        console.log('Message from server:', event.data);
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case 'startGame':
              this.isWaitingForPlayer = false;
              console.log('Game is starting!');
              break;
            case 'endGame':
              this.gameEnd();
              console.log('Game has ended 22');
              break;
            // Add more cases as needed for different types of messages
            default:
              console.log('Unknown message type:', data.type);
          }
        } catch (error) {
          console.error('Error parsing message from server:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket connection closed', event.code, event.reason);
      };
    },

    async handleGameEnd() {
      const sessionId = this.$route.params.sessionId;
      const problemId = this.problem.title;

      const results = [{
        winner: this.username,
        problemId: problemId,
        // Add any other result data as needed
      }];

      console.log('Updating game session with results:', results);

      try {
        await GameService.updateGameSessionResults(sessionId, results);
        this.ws.send(JSON.stringify({ type: 'endGame', sessionId: this.$route.params.sessionId }));

        console.log('Game session updated successfully');
        this.gameEnd();
      } catch (error) {
        console.error('Error updating game session:', error);
        // Handle error
      }
    },
    gameEnd() {
      this.$router.push({ name: 'results', params: { problemId: this.$route.problemId, sessionId: this.$route.params.sessionId } });
    }

    // Additional methods for game logic
  },
}






</script>


<style scoped>
.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  background-color: var(--color-background-mute);
  display: flex;
  flex-direction: column;
}

.underneath {
  display: flex;
  flex-direction: row;
  flex: 1;
}

.editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
