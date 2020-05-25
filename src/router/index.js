import Vue from "vue";
import VueRouter from "vue-router";
import FeaturedWork from "../views/FeaturedWork.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: FeaturedWork,
    props: true
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
  routes
});

export default router;
