import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './components/App/App.vue'
import router from './router'
import Filter from './filter'
import store from './store'

Filter(Vue);
sync(store, router);
const app = new Vue({
    ...App,
    router,
    store
});

export { app, router, store }
