import Vue from "vue"
import VueAxios from "vue-axios"
import axios from "axios"


const apiServices = {
    init() {
        Vue.use(VueAxios, axios)
    },
    async myHttpRequest(userData, endpoint) {
        return axios.post("/api" + endpoint, userData)
            .then(result => {
                return result;
            })
            .catch(error => {
                return error.response;
            });
    }
}

export default apiServices;

