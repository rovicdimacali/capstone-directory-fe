import { createRouter, createWebHistory } from "vue-router";
import login from "@/views/login.vue";
import forgotpassword from "@/views/forgotpassword.vue";
import register from "@/views/register.vue";
import resetpassword from "@/views/resetpassword.vue";
import home from "@/views/applayouts/home.vue";
import applayout from "@/views/applayout.vue";
import upload from "@/views/applayouts/upload.vue";

import { adminroutes } from "./adminroutes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/capstone-directory",
    },
    {
      path: "/capstone-directory",
      name: "applayout",
      component: applayout,
      children: [
        {
          path: "/capstone-directory",
          name: "home",
          component: home,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/upload",
          name: "upload",
          component: upload,
          meta: {
            requiresAuth: true,
          },
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
      path: "/forgot-password",
      name: "forgotpassword",
      component: forgotpassword,
    },
    {
      path: "/register",
      name: "register",
      component: register,
    },
    {
      path: "/reset-password",
      name: "resetpassword",
      component: resetpassword,
      beforeEnter: (to, from, next) => {
        // Check if the query parameter 'token' exists
        console.log(to);

        if (!to.query.token) {
          // Redirect to the login page if the token is missing
          next({ name: "login" }); // Adjust 'login' to the name of your login route
        } else {
          // Proceed to the reset password page if the token exists
          next();
        }
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth || false; // Default to false if meta is undefined
  const token = localStorage.getItem("token"); // Auth token
  const role = localStorage.getItem("role"); // User role

  if (requiresAuth && !token) {
    // Redirect unauthenticated users to the login page
    return next({ name: "login" });
  }

  if (!requiresAuth && token) {
    return next("/capstone-directory?page=0&is_approved=true");
  }

  // Handle role-based redirection for authenticated users
  if (token && role) {
    if (role === "student") {
      if (
        to.path !== "/capstone-directory" &&
        to.path !== "/upload" &&
        to.path !== "/ip-registered" &&
        to.path !== "/approvals"
      ) {
        return next("/capstone-directory?page=0&is_approved=true"); // Redirect students to their home
      }
    } else if (role === "faculty") {
      if (
        to.path === "/capstone-directory" &&
        (to.query.is_approved === "pending" || to.query.is_approved === "false")
      ) {
        return next("/capstone-directory?page=0&is_approved=true"); // Redirect to the allowed page
      }

      if (to.path !== "/capstone-directory" && to.path !== "/ip-registered") {
        return next("/capstone-directory?page=0&is_approved=true"); // Redirect students to their home
      }
    } else if (role === "capstone coordinator") {
      if (
        to.path === "/capstone-directory" &&
        (to.query.is_approved === "pending" || to.query.is_approved === "false")
      ) {
        return next("/capstone-directory?page=0&is_approved=true"); // Redirect to the allowed page
      }

      if (
        to.path !== "/capstone-directory" &&
        to.path !== "/ip-registered" &&
        to.path !== "/groups" &&
        to.path !== "/users"
      ) {
        return next("/capstone-directory?page=0&is_approved=true"); // Redirect coordinators to their home
      }
    } else if (role === "administrator") {
      return next();
    } else {
      // If the role is unrecognized, clear storage and redirect to login
      // localStorage.clear();
      // return next({ name: "login" });
    }
  }

  // Default fallback to proceed with navigation
  next();
});

export default router;
