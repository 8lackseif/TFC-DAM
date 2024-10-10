<template>
  <div>
    <TheHeader />
    <form id="registerPage">
      <div class="logoContainer">
        <img :src="logoPath" />
      </div>
      <div class="container">
        <b-form-group class="flex-item " id="fieldset-1" label="Username:" label-for="input-1">
          <b-form-input maxlength="30" id="input-1" v-model="username" trim />
        </b-form-group>
        <b-form-group class="flex-item" id="fieldset-1" label="Password:" label-for="input-1">
          <b-form-input id="input-1" v-model="pwd" type="password" trim />
        </b-form-group>
        <b-form-group class="flex-item" id="fieldset-1" label="Repeat Password:" label-for="input-1">
          <b-form-input id="input-1" v-model="pwd2" type="password" trim />
        </b-form-group>
        <b-form-group class="flex-item" id="fieldset-1" label="Role" label-for="input-1">
          <b-form-select class="w-100" v-model="selected" :options="options" trim />
        </b-form-group>
        <b-button pill variant="outline-primary" class="flex-item" @click="register">Register</b-button>
      </div>
    </form>
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader';
import TheFooter from '@/components/TheFooter';

export default {
  name: 'Register_page',
  data() {
    return {
      username: '',
      pwd: '',
      pwd2: '',
      logoPath: require('@/assets/logo.png'),
      selected: null,
      options: [
        { value: "user", text: "user" },
        { value: "guest", text: "guest" }
      ]
    }
  },
  created() {
    this.init();
  },
  methods: {
    init: async function () {
      const payload = await this.$store.dispatch('getClaims');
      if ('administrator'.localeCompare(payload.role) != 0) {
        this.$router.push("/home");
      }
    },
    register: async function () {
      if (this.pwd2 == this.pwd) {
        const token = await this.$store.dispatch("getToken");
        const response = await this.$store.dispatch("register", {
          "username": this.username,
          "pwd": this.pwd,
          "rol": this.selected,
          "token": token
        });
        if (response.status == 200) {
          this.$router.push('/');
        }
        else {
          this.$bvToast.toast(response.data, {
            title: 'error ' + response.status,
            autoHideDelay: 5000,
            appendToast: true,
            variant: "danger",
            solid: true,
            toaster: "b-toaster-bottom-right"
          })
        }

      }
      else {
        alert("not same password");
      }

    },
  },
  components: {
    TheFooter,
    TheHeader
  }
}
</script>

<style>
#registerPage {
  margin: auto;
  margin-top: 3vh;
  margin-bottom: 3vh;
  border: 3px solid #f1f1f1;
  min-height: 100vh;
  width: 35vw;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>