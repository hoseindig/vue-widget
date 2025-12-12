import { createApp, watch } from "vue";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import { createI18n } from "vue-i18n";
import { useSettingsStore } from "./stores/settings";
import App from "./App.vue";
import router from "./router";
import en from "../locales/en.json";
import fa from "../locales/fa.json";

import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.min.css";

import "./styles/rtl.css";
import "./styles/font-custom.css";

import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";


// Local storage defaults
const savedLocale = localStorage.getItem("locale") || "fa";
const savedDirection = localStorage.getItem("dir") || "rtl";

// Apply DOM attributes
document.documentElement.setAttribute("dir", savedDirection);
document.documentElement.setAttribute("lang", savedLocale);
document.body.style.direction = savedDirection;
document.body.classList.add(savedDirection);

// Create base app
const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: "light",
  },
  locale: {
    locale: savedLocale,
    rtl: {
      fa: true,
      en: false,
    },
  },
});

app.use(router);
app.use(vuetify);

// ✅ Wait for widget language, then init i18n and mount
setTimeout(() => {
  const language = (window as any).widgetLanguage || savedLocale || "en";
  console.log("Widget language:", language);

  const i18n = createI18n({
    legacy: false,
    locale: language,     // active language from widget
    fallbackLocale: "en", // fallback
    messages: { en, fa },
  });

  // --- connect Pinia store
  const settings = useSettingsStore();

  // sync store -> i18n
  watch(
    () => settings.locale,
    (newLang) => {
      console.log("Store locale changed:", newLang);
      i18n.global.locale.value = newLang;
    }
  );

  // sync widget -> store
  window.addEventListener("widget-language", (e: any) => {
    const newLang = e.detail.language;
    console.log("Switching Vue i18n to:", newLang);
    settings.setLocale(newLang); // update store, watcher updates i18n
  });

  app.use(i18n);
  app.mount("my-app");
}, 2000);
