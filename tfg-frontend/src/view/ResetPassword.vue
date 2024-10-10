<template>
  <div>
    <TheHeader />
    <form id="pwdPage">
      <div class="logoContainer">
        <img :src="logoPath" />
      </div>
      <div class="container">
        <h3 class="mt-5">Reset Password</h3>
        <b-form-group class="flex-item" id="fieldset-1" label="Password:" label-for="input-1">
          <b-form-input id="input-1" v-model="pwd" type="password" trim />
        </b-form-group>
        <b-form-group class="flex-item" id="fieldset-1" label="Repeat Password:" label-for="input-1">
          <b-form-input id="input-1" v-model="pwdRepeat" type="password" trim />
        </b-form-group>
        <b-button pill variant="outline-primary" class="flex-item" @click="changePwd">Change Password</b-button>
        <b-alert class="flex-item text-center" v-model="error" variant="danger">{{ message }}</b-alert>
      </div>

    </form>
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader';
import TheFooter from '@/components/TheFooter';

export default {
  name: 'Reset_page',
  data() {
    return {
      pwd: '',
      pwdRepeat: '',
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
      if (token === null) {
        this.$router.push('/');
      }
    },
    changePwd: async function () {
      if (this.pwdRepeat == this.pwd) {
        const token = await this.$store.dispatch("getToken");
        const payload = await this.$store.dispatch("getClaims");
        const response = await this.$store.dispatch("resetPassword", {
          "username": payload.username,
          "pwd": this.pwd,
          "token": token
        });
        if (response.status == 200) {
          await this.$store.dispatch('logout');
          this.$router.push('/');
        }
        else {
          this.error = true;
          this.message = response.data;
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
#pwdPage {
  margin: auto;
  margin-top: 3vh;
  margin-bottom: 3vh;
  border: 3px solid #f1f1f1;
  min-height: 90vh;
  width: 35vw;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>