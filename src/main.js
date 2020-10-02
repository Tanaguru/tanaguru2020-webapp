import Vue from 'vue'
import App from './App.vue'
import i18n from './i18n'
import router from './router'
import store from './store'
import axios from 'axios'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import 'prismjs'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-scss.min'
import Prism from 'vue-prism-component'
import VueMeta from 'vue-meta'
import Moment from 'moment'
import VueAccessibleModal from 'vue-accessible-modal'

import UserService from './services/user.service'
import ContractService from './services/contract.service'
import ProjectService from './services/project.service'
import AuditService from './services/audit.service'
import PageService from './services/page.service'
import AuditLogService from './services/auditLog.service'
import AuditParametersService from './services/auditParameters.service'
import ScenarioService from './services/scenario.service'
import ResourceService from './services/resource.service'
import TestHierarchyService from './services/testHierarchy.service'
import TestHierarchyResultService from './services/testHierarchyResult.service'
import StatusResultService from './services/statusResult.service'
import TestResultService from './services/testResult.service'
import PageContentService from './services/pageContent.service'
import ElementResultService from './services/elementResult.service'
import TanaguruTestService from './services/tanaguruTest.service'
import ConfigService from './services/config.service'

// optional options
const options = {
    transition: 'fade',
}

Vue.use(VueAccessibleModal, options)
Vue.prototype.$moment = Moment
Vue.use(VueMeta)

Vue.prototype.window = window;
Vue.prototype.$http = axios;
Vue.config.productionTip = false
axios.defaults.baseURL = API_BASE_URL

const token = localStorage.getItem('token')
if (token) {
    Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

Vue.component('v-icon', Icon)
Vue.component('prism', Prism)

export const bus = new Vue();

Vue.prototype.userService = new UserService(axios);
Vue.prototype.contractService = new ContractService(axios);
Vue.prototype.projectService = new ProjectService(axios);
Vue.prototype.auditService = new AuditService(axios);
Vue.prototype.pageService = new PageService(axios);
Vue.prototype.auditLogService = new AuditLogService(axios);
Vue.prototype.auditParametersService = new AuditParametersService(axios);
Vue.prototype.scenarioService = new ScenarioService(axios);
Vue.prototype.resourceService = new ResourceService(axios);
Vue.prototype.pageContentService = new PageContentService(axios);
Vue.prototype.testHierarchyService = new TestHierarchyService(axios);
Vue.prototype.testHierarchyResultService = new TestHierarchyResultService(axios);
Vue.prototype.testResultService = new TestResultService(axios);
Vue.prototype.elementResultService = new ElementResultService(axios);
Vue.prototype.tanaguruTestService = new TanaguruTestService(axios);
Vue.prototype.statusResultService = new StatusResultService(axios);
Vue.prototype.configService = new ConfigService(axios);

Vue.prototype.NAVBAR_LINKS = NAVBAR_LINKS;
axios.interceptors.response.use(
    (res) => {
      return res;
    },
    (err)=>{
        if (err.response.status === 401) {
            store.dispatch('logout')
                .then(r => router.push('/'));
        } else if (err.response.status === 403) {
            router.push('/forbidden')
        }
    }
);

const app = new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')
