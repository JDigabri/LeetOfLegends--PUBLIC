<template>
  <div class="card">
    <div class="profPic"></div>
    <p>{{ tagline }}</p>
    <p>{{ userName }}</p>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 270px;
  height: 400px;
  box-shadow: 0px 4px 12px 2px rgba(0, 0, 0, 0.25);
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  background-color: var(--color-background);
}

.profPic {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #d9d9d9;
}
</style>

<script>
export default {
  name: 'PlayerCard',
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
