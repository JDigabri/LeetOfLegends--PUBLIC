<template>
  <div>
    <div class="ed" id="editor" ref="editor" style="width: 55vw; height: 80vh"></div>
    <div class="buttons">
      <button @click="executeCode">Submit</button>
      <button class="second">run</button>
    </div>
    <SubmitView :result="result" />
  </div>
</template>


<script>
import * as monaco from 'monaco-editor';
import 'monaco-editor/min/vs/editor/editor.main.css';
import Api from '../services/Codeexecutreservice/Codeservice.js'; // replace with the actual path to your API file
import { toRaw } from 'vue';
import SubmitView from './SubmitView.vue';

export default {
  name: 'MonacoEditor',
  props: {
    problem: {
      type: Object,
      required: true,
    }
  },
  components: {
    SubmitView,
  },
  data() {
    return {
      editorInstance: null,
      editorOptions: {
        value: ['def two_sum(nums, target): '].join('\n'),
        language: 'python',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: {
          enabled: false
        },
      },
      result: '',
    };
  },
  methods: {
    createEditor() {
      this.editorInstance = monaco.editor.create(this.$refs.editor, this.editorOptions);
    },
    getEditorValue() {
      // Returns the current editor value
      return toRaw(this.editorInstance).getValue();
    },

    async executeCode() {
      try {
        const code = this.getEditorValue();
        const problemId = this.problem.problem.title;
        const response = await Api.executeCode(code, problemId);
        this.result = response.data;
        console.log(response.data);

        if (this.areAllTestCasesPassed(response.data.result)) {
          this.$emit('allTestCasesPassed');
          console.log('All test cases passed!');
        }
      } catch (error) {
        console.error(error);
        this.result = error;
      }
    },


    areAllTestCasesPassed(resultString) {
      try {
        // Replace single quotes with double quotes and True with true
        const validJsonString = resultString
          .replace(/'/g, '"')
          .replace(/True/g, 'true')
          .replace(/False/g, 'false');

        // Split by newline and wrap with brackets to form an array
        const resultsArray = '[' + validJsonString.split('\n').filter(x => x).join(',') + ']';

        // Parse the JSON string
        const results = JSON.parse(resultsArray);

        // Check if all test cases are passed
        return results.every(testCase => testCase.passed);
      } catch (error) {
        console.error("Error parsing test cases:", error);
        return false;
      }
    },


    setEditorTheme() {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // User prefers dark mode
        this.editorOptions.theme = 'vs-dark';
      } else {
        // User prefers light mode
        this.editorOptions.theme = 'vs'; // or any light theme you prefer
      }
    },
  },
  mounted() {
    this.setEditorTheme();

    this.createEditor();

  },
};
</script>


<style scoped>
.ed {
  margin: 5px;
  border-radius: 5px;
  padding: 10px;
  background-color: var(--color-background);
}


.buttons {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin: 5px;
  border-radius: 5px;
  margin-bottom: 0px;
  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.1);
  border-end-end-radius: 0px;
  border-end-start-radius: 0px;
  background-color: var(--color-background);
  padding: 10px;
  z-index: 3;
  position: relative;
}

button {
  width: 170px;
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
}

button:hover {
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.35);
  cursor: pointer;
}

.second {
  background-color: #ff9357;
  width: 120px;
}
</style>
