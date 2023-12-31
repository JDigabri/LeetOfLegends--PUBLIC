<template>
  <div class="logins">
    <div class="userNames">
      <p>Username<span> *</span></p>
      <input type="text" @keydown.enter="onEnterPress" v-model="username" placeholder="" />
    </div>
    <div class="userNames">
      <p>Password<span> *</span></p>
      <div class="password-container">
        <input :type="showPassword ? 'text' : 'password'" v-model="password" @keydown.enter="onEnterPress" placeholder="" />
        <div @click="showPassword = !showPassword" viewBox="0 0 24 24" class="eye-icon">
          <div v-if="showPassword">
            <svg
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 488.85 488.85"
              style="enable-background: new 0 0 488.85 488.85"
              xml:space="preserve"
            >
              <g>
                <path
                  d="M244.425,98.725c-93.4,0-178.1,51.1-240.6,134.1c-5.1,6.8-5.1,16.3,0,23.1c62.5,83.1,147.2,134.2,240.6,134.2
		s178.1-51.1,240.6-134.1c5.1-6.8,5.1-16.3,0-23.1C422.525,149.825,337.825,98.725,244.425,98.725z M251.125,347.025
		c-62,3.9-113.2-47.2-109.3-109.3c3.2-51.2,44.7-92.7,95.9-95.9c62-3.9,113.2,47.2,109.3,109.3
		C343.725,302.225,302.225,343.725,251.125,347.025z M248.025,299.625c-33.4,2.1-61-25.4-58.8-58.8c1.7-27.6,24.1-49.9,51.7-51.7
		c33.4-2.1,61,25.4,58.8,58.8C297.925,275.625,275.525,297.925,248.025,299.625z"
                 fill="#ff9357"/>
              </g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
            </svg>
          </div>
          <div v-if="!showPassword">
            <svg
              id="Capa_1"
              enable-background="new 0 0 512 512"
              height="24"
              viewBox="0 0 512 512"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path
                  d="m436.193 169.626c-5.507-4.735-11.04-9.258-16.589-13.59l-64.701 64.701c3.942 11.027 6.097 22.898 6.097 35.263 0 57.897-47.103 105-105 105-12.365 0-24.236-2.155-35.263-6.098l-48.558 48.558c28.356 11.632 56.481 17.54 83.821 17.54 32.657 0 66.432-8.396 100.384-24.955 26.662-13.005 53.514-31.063 79.809-53.671 44.455-38.226 71.841-76.024 72.984-77.615 3.765-5.232 3.765-12.285 0-17.518-1.144-1.591-28.529-39.389-72.984-77.615z"
                  fill="#ff9357"
                  />
                <path
                  d="m256 331c41.355 0 75-33.645 75-75 0-3.598-.27-7.134-.763-10.598l-84.835 84.835c3.465.493 7 .763 10.598.763z"
                  fill="#ff9357"
                  />
                <path
                  d="m507.607 4.394c-5.857-5.857-15.355-5.857-21.213 0l-117.848 117.848c-4.056-2.208-8.111-4.311-12.162-6.286-33.952-16.56-67.727-24.956-100.384-24.956s-66.432 8.396-100.384 24.955c-26.662 13.005-53.514 31.063-79.809 53.671-44.454 38.226-71.84 76.024-72.984 77.615-3.765 5.232-3.765 12.285 0 17.518 1.144 1.591 28.529 39.39 72.984 77.615 13.623 11.713 27.396 22.192 41.214 31.391l-112.627 112.629c-5.858 5.857-5.858 15.355 0 21.213 2.929 2.928 6.767 4.393 10.606 4.393s7.678-1.465 10.606-4.394l482-482c5.859-5.857 5.859-15.355.001-21.212zm-356.607 251.606c0-57.897 47.103-105 105-105 23.551 0 45.315 7.794 62.85 20.938l-21.52 21.52c-11.859-7.864-26.065-12.458-41.33-12.458-41.355 0-75 33.645-75 75 0 15.264 4.594 29.47 12.458 41.33l-21.52 21.52c-13.144-17.535-20.938-39.299-20.938-62.85z"
                  fill="#ff9357"
                  />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <button @click="login">Login</button>
    <p style="margin-right: auto; font-family: Inter, sans-serif">
      New? <a @click="goToSignUp" style="color: #ff9357">Sign up</a>
    </p>
  </div>
</template>

<script>
import AuthenticationService from '../services/Authservice/Authservice.js'

export default {
  name: 'LoginComp',
  data() {
    return {
      username: '',
      password: '',
      showPassword: false
    }
  },
  methods: {
    async login() {
      try {
        const response = await AuthenticationService.login({
          username: this.username,
          password: this.password
        })

        console.log(response.data)
        //if (response.data.user) {
        //this.$store.commit('setLoggedIn', false)
        //this.$emit('login-status-updated', this.isLoggedIn)
        console.log('Login successful.')
        console.log(document.cookie)
        this.$store.commit('setLoggedIn', true)
        this.$store.commit('setToken', response.data.token);
        this.$router.push({ name: 'home' })
        // set logged in state to true
        //this.$store.commit('setLoggedIn', true)

        // Navigate to home screen
        //if (this.$store.state.isLoggedIn) {
        // this.$router.push({ name: 'home' })
        //}
        //}
      } catch (error) {
        //this.$store.commit('setLoggedIn', false)
        console.error('Login failed:', error)
      }
    },
    goToSignUp() {
      this.$router.push({ name: 'register' })
    },
    onEnterPress() {
    this.login();
  }  
  }
}
</script>

<style scoped>
.logins {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  justify-content: center;
  width: 100%;
}
input {
  width: 100%;
  height: 40px;
  font-size: 16px;
  background-color: #d9d9d9;
  border: none;
  border-radius: 5px;
  font-family: 'Inter', sans-serif;
}
input:focus {
  outline: none;
}

input[type='text'] {
  padding-left: 10px;
}
input[type='password'] {
  padding-left: 10px;
}

button {
  width: 100%;
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
.userNames {
  width: 100%;
  user-select: none;
}
.userNames span {
  color: #ff9357;
}

.password-container {
  position: relative;
  width: 100%;
}

.eye-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  transform: translateY(-50%);
}
</style>
