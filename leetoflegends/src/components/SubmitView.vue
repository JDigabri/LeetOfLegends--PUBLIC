<template>
  <div class="eed">
    <div v-if="parsedResults && parsedResults.length > 0">
      <div 
        v-for="(result, index) in parsedResults" 
        :key="index" 
        class="test-case"
        :class="{ 'passed': result.passed, 'failed': !result.passed }"
        @click="toggleDetails(index)"
      >
        <p><strong>Test Case {{ index + 1 }}</strong></p>
        <div v-if="showDetails[index]" class="details">
          <p><strong>Input:</strong> {{ formatObject(result.input) }}</p>
          <p><strong>Output:</strong> {{ formatObject(result.output) }}</p>
          <p><strong>Status:</strong> {{ result.passed ? 'Passed' : 'Failed' }}</p>
        </div>
      </div>
    </div>
    <p v-else>No result available</p>
  </div>
</template>

<script>
export default {
  props: {
    result: {
      type: Object,
      required: false,
    }
  },
  data() {
    return {
      showDetails: [],
    };
  },
  computed: {
    parsedResults() {
      if (this.result && this.result.result) {
        try {
          // Split the string into individual JSON objects
          let results = this.result.result
            .trim()
            .split('\n')
            .map(str => {
              str = str.replace(/'/g, '"').replace(/True/g, 'true').replace(/False/g, 'false');
              return JSON.parse(str);
            });
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.showDetails = new Array(results.length).fill(false);
          return results;
        } catch (error) {
          console.error('Error parsing JSON:', error);
          return [];
        }
      }
      return [];
    }
  },
  methods: {
    formatObject(obj) {
      return JSON.stringify(obj, null, 2);
    },
    toggleDetails(index) {
    this.showDetails[index] = !this.showDetails[index];
  }
  }
};
</script>

<style scoped>
.eed {
  margin: 5px;
  margin-top: 0px;
  border-radius: 5px;
  padding: 10px;
  background-color: var(--color-background);
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 64px;
}

.test-case {
  cursor: pointer;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.test-case:hover {
  background-color: #f5f5f518;
}

.passed {
  border-left: 5px solid green;
}

.failed {
  border-left: 5px solid red;
}

.details {
  margin-top: 10px;
}
</style>
