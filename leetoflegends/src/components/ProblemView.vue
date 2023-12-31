<template>
  <div class="ed" style="width: 55vw; height: 99vh">
    <h1>{{ problem.problem.title }}</h1>
    <p>{{ problem.problem.description }}</p>
    <div v-for="(testCase, index) in testCases" :key="index">
      <p>Input: {{ testCase.input }}</p>
      <p>Expected Output: {{ testCase.output }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    problem: {
      type: Object,
      required: true,
    },
  testCases: { // Add this prop
      type: Array,
      required: true,
    },
  },
  mounted() {
    console.log("Received problem:", this.problem);  // Debugging line
  },
};
</script>

<style scoped>
.ed {
  margin: 5px;
  border-radius: 5px;
  padding: 10px;
  background-color: var(--color-background);
  height: 93.5vh;
}
</style>
