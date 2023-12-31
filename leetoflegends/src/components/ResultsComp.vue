<template>
  <div class="bot">
      <h1>Game Session Results</h1>
      <div class="sessionResults" v-if="session != null">
          <div class="sessionInfo">
              <span class="label">Session ID:</span> {{ session.gameSession.sessionId }}
          </div>
          <div class="sessionInfo">
              <span class="label">Problem ID:</span> {{ session.gameSession.problemId }}
          </div>
          <div class="sessionInfo">
              <span class="label">Game Duration:</span> {{ gameDuration }}
          </div>
          <div class="results">
              <span class="label">Results:</span>
                  <span v-for="result in parsedResults" :key="result.winner">
                      Winner: {{ result.winner }}
                  </span>
          </div>
      </div>
      <button @click="home()">Home</button>
  </div>
</template>


<script>
export default {
name: 'ResultsComp',
props: {
  session: {
    type: Object,
    required: true
  }
},
computed: {
  parsedResults() {
    try {
      return JSON.parse(this.session.gameSession.results);
    } catch (e) {
      return [];
    }
  },
  gameDuration() {
    const createdAt = new Date(this.session.gameSession.createdAt);
    const updatedAt = new Date(this.session.gameSession.updatedAt);
    const duration = updatedAt - createdAt;
    return this.formatDuration(duration);
  }
},
methods: {
  home() {
    this.$router.push({ name: 'home' });
  },
  formatDuration(duration) {
    let seconds = Math.floor(duration / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${minutes} minutes and ${seconds} seconds`;
  }
}
}
</script>

<style scoped>
.bot {
    width: 80vw;
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background-color: var(--color-background);
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 15px;
    border: 2px solid var(--color-background-mute);
    color: var(--color-text);
}

h1 {
    color: var(--color-primary);
    margin-bottom: 15px;
}

.sessionInfo, .results {
    width: 100%;
    margin-bottom: 10px;
    padding: 10px;
    background-color: var(--color-background-light);
    border-radius: 8px;
}

.label {
    font-weight: bold;
}

.sessionInfo span, .results span {
    display: inline-block;
    min-width: 120px;
}

ul {
    list-style-type: none;
    padding-left: 0;
}

button {
    padding: 10px 20px;
    margin-top: 15px;
    border: none;
    border-radius: 8px;
    background-color: var(--color-primary);
    color: white;
    cursor: pointer;
}

button:hover {
    background-color: var(--color-primary-dark);
}
</style>
