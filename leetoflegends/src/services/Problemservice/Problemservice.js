import Api from './Api.js';

export default {
  getRandomProblem() {
    return Api().get('randomProblem');
  },
  getProblemByTitle(title) {
    return Api().get(`/problem/${title}`);
  },
};
