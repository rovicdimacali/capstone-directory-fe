import "./assets/style.scss";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";

import ToastService from "primevue/toastservice";

import Material from "@primevue/themes/material";
import { definePreset } from "@primevue/themes";
import * as components from "primevue";

import "primeicons/primeicons.css";

const app = createApp(App);

const MyPreset = definePreset(Material, {
  semantic: {
    primary: {
      50: "{red.50}",
      100: "{red.100}",
      200: "{red.200}",
      300: "{red.300}",
      400: "{red.400}",
      500: "{red.500}",
      600: "{red.600}",
      700: "{red.700}",
      800: "{red.800}",
      900: "{red.900}",
      950: "{red.950}",
    },
  },
});

app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
  },
});

app.use(ToastService);

Object.keys(components).forEach((componentName) => {
  if (components[componentName].name) {
    app.component(components[componentName].name, components[componentName]);
  }
});

app.use(router);

app.mount("#app");
