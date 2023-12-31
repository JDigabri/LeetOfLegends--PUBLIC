<template>
    <div class="bg">
        <TopNavBar />
        <ResultsComp :session="session" />
    </div>
</template>
  
<script>
import Problemservice from '../services/Problemservice/Problemservice'
import TopNavBar from '../components/TopNavBar.vue'
import ResultsComp from '../components/ResultsComp.vue'
import Gameservice from '../services/GameService/Gameservice'
export default {
    name: 'MonacoEditor',
    components: {
        TopNavBar,
        ResultsComp
    },
    data() {
        return {
            problem: null,
            testCases: null,
            session: null,
        }
    },
    async mounted() {
        try {
            const problemTitle = this.$route.params.problemId;
            const response = await Problemservice.getProblemByTitle(problemTitle);
            const sessionId = this.$route.params.sessionId;
            const sessionResponse = await Gameservice.getGameSession(sessionId);
            this.session = sessionResponse.data;
            this.problem = response.data;
            this.testCases = response.data.testCases;
        } catch (error) {
            console.error('An error occurred while fetching data:', error);
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
    background-color: var(--color-background-mute);
    display: flex;
    flex-direction: column;
}

</style>
  