<template>
  <div class="full-page">
    <h1>Not Found</h1>
    <p>
      Oops we couldn't find that page. Try going
      <router-link :to="{ name: 'home'}">home</router-link>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.full-page {
  width: 100%;
  height: 100%;
  color: white;
}
</style>