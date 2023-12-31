import Api from './Api.js';

export default {
  executeCode(code, problemId) {
    return Api().post('/execute', {
      code,
      language: 'python',
      problemId,
    });
  },
};
