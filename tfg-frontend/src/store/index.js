import Vue from "vue";
import Vuex from "vuex";
import apiServices from "@/common/api.service";
import cookies from "@/common/cookies";
import JWTDecoder from "vue-jwt-decode";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        products: [],
    },
    mutations: {
        setProducts(state, products) {
            Vue.set(state, 'products', products);
        }
    },
    getters: {
        getProducts(state) {
            return state.products;
        }
    },
    actions: {
        async login(_, userData) {
            console.log("hola");
            const response = await apiServices.myHttpRequest(userData, '/login');
            if (response.status == 200) {
                cookies.setJWTToken(response.data);
            }
            return response;
        },
        async logout() {
            return await cookies.logOut();
        },
        async register(_, userData) {
            return await apiServices.myHttpRequest(userData, '/register');
        },
        async getToken() {
            return await cookies.getJWTToken();
        },
        async getClaims() {
            const token = await cookies.getJWTToken();
            if (token !== null) {
                const payload = JWTDecoder.decode(token);
                return payload;
            }
            return null;
        },
        async loadProducts() {
            const token = await cookies.getJWTToken();
            const response = await apiServices.myHttpRequest(token, '/get_products');
            if (response.status === 200) {
                return response.data;
            }
            return response;
        },
        async addProduct(_, product) {
            return await apiServices.myHttpRequest(product, '/add_product');
        },
        async deleteProduct(_, product) {
            return await apiServices.myHttpRequest(product, '/delete_product');
        },
        async modifyProduct(_, product) {
            return await apiServices.myHttpRequest(product, '/modify_product');
        },
        async deleteProperty(_, property) {
            return await apiServices.myHttpRequest(property, '/delete_property');
        },
        async addProperty(_, property) {
            return await apiServices.myHttpRequest(property, '/add_property');
        },
        async getTags() {
            const token = await cookies.getJWTToken();
            const response = await apiServices.myHttpRequest(token, '/get_tags');
            if (response.status === 200) {
                return response.data;
            }
            return response;
        },
        async addTag(_, tag) {
            return await apiServices.myHttpRequest(tag, '/add_tag');
        },
        async deleteTag(_, tag) {
            return await apiServices.myHttpRequest(tag, '/delete_tag');
        },
        async bindTag(_, tag) {
            return await apiServices.myHttpRequest(tag, '/bind_tag');
        },
        async unbindTag(_, tag) {
            return await apiServices.myHttpRequest(tag, '/unbind_tag');
        },
        async changeStock(_, stocks) {
            return await apiServices.myHttpRequest(stocks, '/var_stock');
        },
        async getStocks() {
            const token = await cookies.getJWTToken();
            const response = await apiServices.myHttpRequest(token, '/get_stocks');
            if (response.status === 200) {
                return response.data;
            }
            return response;
        },
        async getChartData(_, query) {
            const response = await apiServices.myHttpRequest(query, '/get_stock_history');
            if (response.status === 200) {
                return response.data;
            }
            return response;
        },
        async getPopularTagsData() {
            const token = await cookies.getJWTToken();
            const response = await apiServices.myHttpRequest(token, '/get_popular_tags');
            if (response.status === 200) {
                return response.data;
            }
            return response;
        },
        async exportData() {
            const token = await cookies.getJWTToken();
            const response = await apiServices.myHttpRequest(token, '/export_data');
            if (response.status === 200) {
                return response.data;
            }
            return response;
        },
        async importData(_, data) {
            return await apiServices.myHttpRequest(data, '/import_data');
        },
        async resetPassword(_, data) {
            return await apiServices.myHttpRequest(data, '/reset_pwd');
        }
    }
});