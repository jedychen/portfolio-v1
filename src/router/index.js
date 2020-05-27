import Vue from "vue";
import VueRouter from "vue-router";
import FeaturedWork from "../views/FeaturedWork.vue";
import store from "@/store/index.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: FeaturedWork,
    props: true,
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutPage.vue"),
  },
  {
    path: "/404",
    alias: "*",
    name: "notFound",
    component: () =>
      import(/* webpackChunkName: "notFound" */ "../views/NotFound.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  linkExactActiveClass: "vue-school-active-class",
  // scrollBehavior(to, from, savedPosition){
  //   if (savedPosition) {
  //     return savedPosition;
  //   } else {
  //     const position = {};
  //     if (to.hash) {
  //       position.selector = to.hash;
  //       if (to.hash === '#experience') {
  //         position.offset = {y:140};
  //       }
  //       if (document.querySelector(to.hash)) {
  //         return position;
  //       }
  //       return false;
  //     }
  //   }
  // },
  routes,
});

router.beforeEach((to, from, next) => {
  if (from.name == "Home") {
    store.commit("flipCardTransitionAway");
    next();
  } else if (to.name == "Home" && from.name == "About") {
    store.commit("flipCardTransitionBack");
    next();
  } else next();
});

export default router;
