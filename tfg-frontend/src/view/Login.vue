<template>
  <div class="background">
    <form id="loginPage">
      <div class="logoContainer">
        <img :src="logoPath" />
      </div>
      <div class="container">
        <b-form-group class="flex-item " id="fieldset-1" label="Username:" label-for="input-1">
          <b-form-input id="input-1" v-model="username" trim />
        </b-form-group>
        <b-form-group class="flex-item" id="fieldset-1" label="Password:" label-for="input-1">
          <b-form-input id="input-1" v-model="pwd" type="password" trim />
        </b-form-group>
        <b-button pill variant="outline-primary" class="flex-item" @click="login">Log in</b-button>
        <b-alert class="flex-item text-center" v-model="error" variant="danger">{{ message }}</b-alert>
      </div>
    </form>
  </div>

</template>

<script>
export default {
  name: 'Login_page',
  data() {
    return {
      username: '',
      pwd: '',
      logoPath: require('@/assets/logo.png'),
      error: false,
      message: ''
    }
  },
  created() {
    this.init();
  },
  methods: {
    init: async function () {
      const token = await this.$store.dispatch('getToken');
      if (token !== null) {
        this.$router.push('/home');
      }
    },
    login: async function () {
      console.log("hola2");
      const response = await this.$store.dispatch("login", {
        "username": this.username,
        "pwd": this.pwd,
      });

      if (response.status != 200) {
        this.error = true;
        this.message = response.data;
      }
      else {
        this.$router.push('/home');
      }
    },

  },
}
</script>

<style>
.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  background: fixed linear-gradient(rgba(82, 81, 81, 0.603), rgba(88, 88, 88, 0.863)), url(../assets/fondo.jpeg);
  background-size: 500px;
}

#loginPage {
  margin: auto;
  border: 3px solid #f1f1f1;
  width: 30vw;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  min-height: 80vh;
  margin-top: 7vh;
}

.container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  font-size: 2vh;
}

.flex-item {
  margin: auto;
  margin-top: 3vh;
  width: 80%;
  font-weight: bold;
  text-align: start;
}

.logoContainer {
  height: 30vh;
  width: 40vh;
  margin: auto;
}

.logoContainer img {
  width: 100%;
  height: auto;
  display: block;
}
</style>