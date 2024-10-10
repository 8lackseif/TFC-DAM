import Vue from "vue"
import VueCookie from "vue-cookie"
const cookies = {
      init(){
      Vue.use(VueCookie)
      },
      async setJWTToken(token) {
        VueCookie.set("token", token,{expires:"8h"});
      },
      async getJWTToken() {
        return VueCookie.get("token");
      },
      async logOut(){
        VueCookie.delete("token");
      }
}

export default cookies;