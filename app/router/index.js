import Vue from 'vue'
import Router from 'vue-router'
import selectManage from '../views/SelectManage.vue'
import main from '../views/Main.vue'
import setting from '../views/Setting.vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

Vue.use(Router);
Vue.use(iView);

export default new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            component: selectManage
        },
        {
            path: '/main',
            component: main
        },
        {
            path: '/setting',
            component: setting
        },
    ]
})
