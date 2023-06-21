import "./assets/main.css"

import { createApp } from "vue"
import App from "./App.vue"
import { Quasar } from "quasar"
import quasarLang from "quasar/lang/de"
createApp(App)
  .use(Quasar, {
    plugins: {}, // import Quasar plugins and add here
    lang: quasarLang,
  })
  .mount("#app")
