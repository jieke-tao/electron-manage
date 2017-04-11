import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './components/App/App.vue'
import router from './router'
import vuePlugin from './plugin'
import store from './store'

Vue.use(vuePlugin);
sync(store, router);
const app = new Vue({
    ...App,
    router,
    store
});

export { app, router, store }
