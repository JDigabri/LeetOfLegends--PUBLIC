<template>
  
    <div class="bg"></div>
  
    <div class="login">
      <div class="dialog">
          <h1>Sign Up</h1>
        <SignUpComp />
      </div>
    </div>
  </template>
  
  
  <script>
    import SignUpComp from '../components/SignUpComp.vue';
    export default {
      name: 'SignUpView',
      components: {
        SignUpComp
      }
    }
  </script>
  
  <style scoped>
  .login {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    justify-content: center;
    width: 100vw;
    height: 100vh;
  
  }
  
  .bg{
      width: 100vw;
      height: 100vh;
      background-image: url(../assets/league.jpg);
      background-size: cover;
      position: absolute;
      z-index: 2;
  
  }
  
  .dialog {
    background-color: var(--color-background);
    border-radius: 5px;
    padding: 20px;
    width: 450px;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    justify-content: center;
    position: absolute;
    z-index: 2;
    box-shadow:  0 0 15px 0 rgba(0,0,0,0.35);
  
  }
  </style>
  