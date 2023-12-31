<template>
  <div class="card">
    <div class="profPic"></div>
    <div class="username">
      <p>{{ userName }}</p>
      <p>{{ tagline }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userName: {
      type: String,
      required: true
    },
    tagline: {
      type: String,
      required: false
    }
  }
}
</script>


<style scoped>
.card {
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: start;
  color: #d9d9d9;
  transition: all 0.3s ease;
}
.card:hover {
  background-color: #d9d9d965;
  color: #000000;
  cursor: pointer;
}

.profPic {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #d9d9d9;
  transition: all 0.3s ease;
  margin-left: 5px;
}
.username {
  max-height: 50px;
  margin-left: 10px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  font-weight: 100;
}
</style>
