import Api from './Api.js'

export default {
  addFriend(friendInfo) {
    return Api().post('addFriend', friendInfo)
  },
  getFriends() {
    return Api().get('getFriends')
  }
}
