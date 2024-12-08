import users from "@/views/applayouts/admin/users.vue";
import groups from "@/views/applayouts/admin/groups.vue";
import activitylogs from "@/views/applayouts/admin/activitylogs.vue";
export const adminroutes = [
  {
    path: "/users",
    name: "users",
    component: users,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/groups",
    name: "groups",
    component: groups,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/activity-logs",
    name: "activitylogs",
    component: activitylogs,
    meta: {
      requiresAuth: true,
    },
  },
];
