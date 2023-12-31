<template>
    <div class="grid-container">
      <div class="box" v-for="n in 9" :key="n"></div>
    </div>
  </template>
  
  <style scoped>
  .grid-container {
    display: grid;
    grid-template-columns: repeat(3, 145px); /* Creates three columns */
    grid-template-rows: repeat(3, 145px); /* Creates three rows */
    gap: 10px; /* Space between the boxes */
    margin-top: 30px;
  }
  
  .box {
    width: 145px;
    height: 145px;
    background-color: #d9d9d9;
    border-radius: 5px;
    transition: all 0.3s ease;
  }
  </style>
  