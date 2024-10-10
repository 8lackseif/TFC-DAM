import Vue from "vue";
import Router from "vue-router";
import Login from "@/view/Login";
import Register from "@/view/Register";
import Home from "@/view/Home";
import Stock from "@/view/Stock.vue";
import Tags from "@/view/Tags.vue";
import Migration from "@/view/Migration.vue";
import ResetPassword from "@/view/ResetPassword.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name:"Login",
      component: Login
    },
    {
      path: "/register",
      name: "Register",
      component : Register
    },
    {
      path: "/home",
      name: "Home",
      component: Home
    },
    {
      path: "/stock",
      name:"StockVar",
      component: Stock
    },
    {
      path: "/tags",
      name: "ProductTags",
      component: Tags
    },
    {
      path: "/migration",
      name: "Migration",
      component: Migration
    },
    {
      path:"/reset_pwd",
      name: "ResetPassword",
      component: ResetPassword
    }
]
});