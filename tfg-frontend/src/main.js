import Vue from 'vue'
import App from './App.vue'

import router from './router'

import apiServices from './common/api.service'
import VueCookie from './common/cookies'
import store from "./store"

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
Vue.component("v-select", vSelect);

import { RouterLink } from 'vue-router';
Vue.use(RouterLink);

Vue.use(router);

VueCookie.init;
apiServices.init;

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
