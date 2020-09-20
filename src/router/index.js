import Vue from "vue";
import Router from "vue-router";
import Cookies from "js-cookie";

Vue.use(Router);

const router = new Router({
  mode: "history",
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: "/",
      name: "Index",
      component: () => import("../views/index.vue"),
      meta: { title: "网站首页" },
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/login.vue"),
      meta: { title: "登录页面" },
    },
    {
      path: "/404",
      name: "Error",
      component: () => import("../components/404"),
      meta: { title: "404页面" },
    },
    {
      path: "*",
      redirect: "/404",
    },
  ],
});

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

export default router;
