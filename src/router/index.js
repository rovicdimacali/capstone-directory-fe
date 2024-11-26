import { createRouter, createWebHistory } from "vue-router";
import login from "@/views/login.vue";
import forgotpassword from "@/views/forgotpassword.vue";
import resetpassword from "@/views/resetpassword.vue";
import home from "@/views/applayouts/home.vue";
import applayout from "@/views/applayout.vue";

import adminlogin from "@/views/adminlogin.vue";

import { adminroutes } from "./adminroutes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "applayout",
      component: applayout,
      children: [
        {
          path: "/capstone-directory",
          name: "home",
          component: home,
        },
        ...adminroutes,
      ],
    },
    {
      path: "/login",
      name: "login",
      component: login,
    },
    {
      path: "/cics-admin",
      name: "adminlogin",
      component: adminlogin,
    },
    {
      path: "/forgot-password",
      name: "forgotpassword",
      component: forgotpassword,
    },
    {
      path: "/reset-password/:code",
      name: "resetpassword",
      component: resetpassword,
    },
  ],
});

export default router;
