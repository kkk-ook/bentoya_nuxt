export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate:
      "%s | 千成アプリ |",
    htmlAttrs: {
      lang: "ja",
    },
    meta: [
      { charset: "UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.svg" },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Noto+Sans+JP:wght@100..900&family=Shippori+Mincho:wght@400..800&family=Montserrat:wght@100..900' },
    ],
  },


  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    { src: '~/assets/common.scss' },
    { src: '~/assets/destyle.css' },
    { src: '~/assets/animation.scss' },
    { src: '~/assets/parts.scss' },
  ],
  styleResources: {
    scss: ["~/assets/mixin.scss", "~/assets/variables.scss"],
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~plugins/constants.js',
    '~plugins/api/adminApi.js',
    '~plugins/api/frontApi.js',
    '~/plugins/api/commonApi.js',
    '~/plugins/day.js',
    '~/plugins/vueQrcode.js',
    '~/plugins/util.js',
    '~/plugins/successMessage.js',
    '~/plugins/vue-multiselect.js',
    '~/plugins/date.js',
    { src: '~/plugins/swiper.js', mode: 'client' },
    { src: '~/plugins/paginate.js', mode: 'client' },
    { src: '~/plugins/vue-toggles.js', mode: 'client' },
    { src: '~/plugins/vue-draggable.js', mode: 'client' },
    { src: "~/plugins/modal.js", mode: "client" },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "@nuxtjs/proxy",
    "@nuxtjs/style-resources",
    "nuxt-fontawesome",
    "nuxt-stripe-module",
  ],

  fontawesome: {
    component: "fa",
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    proxy: true,
  },

  proxy: {
    "/zipApi/": {
      target: "https://zipcloud.ibsnet.co.jp",
      pathRewrite: { "^/zipApi/": "" },
    },
    '/api': {
      target: process.env.BASE_URL || "http://localhost:3000"
    }
  },
  server: {
    port: process.env.PORT || 3001,
    host: "0.0.0.0", // デフォルト: localhost
  },
  serverMiddleware: [
    "~/middleware/redirect",
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: /@fullcalendar.*/
  },
  stripe: {
    version: "2020-08-27", // versionは固定にしておいた方が無難です。
    publishableKey: process.env.STRIPE_KEY,
    locale: "ja"
  }
};