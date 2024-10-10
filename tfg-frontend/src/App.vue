<template>
  <main id="app">
    <router-view></router-view>
  </main>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      colors: {
        baseColor: '#CBE1EE',
        highlightColor: '#A3C4D9',
        accentColor: '#D9E6F2',
        neutralDark: '#748A9D',
        neutralLight: '#F2F7FA'
      }
    };
  }
}
</script>

<style>
*,::after,::before {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --base-color: #CBE1EE;
  --highlight-color: #A3C4D9;
  --accent-color: #D9E6F2;
  --neutral-dark: #748A9D;
  --neutral-light: #F2F7FA;
}

main, html {
  height: 100%;
  background-color: var(--neutral-light);
  padding-top: 4vh;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
