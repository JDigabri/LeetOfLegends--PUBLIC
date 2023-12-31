import Api from './Api.js'

export default {
  createGame(problemId, results) {
    return Api().post('createGameSession', { problemId, results });
  },
  joinGame(gameId, username) {
    return Api().post('joinGameSession', { gameId, username });
  },
  getGameSession(sessionId) {
    return Api().get(`/getGameSession/${sessionId}`);
  },
  updateGameSessionResults(sessionId, results) {
    return Api().put(`updateGameSession/${sessionId}`, { results });
  },



}

