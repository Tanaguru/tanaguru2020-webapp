import Vue from 'vue'
import Moment from "moment";
import VueMeta from "vue-meta";
import axios from "../axios";
import UserService from "../services/user.service";
import ContractService from "../services/contract.service";
import ProjectService from "../services/project.service";
import AuditService from "../services/audit.service";
import PageService from "../services/page.service";
import AuditLogService from "../services/auditLog.service";
import AuditParametersService from "../services/auditParameters.service";
import ScenarioService from "../services/scenario.service";
import ResourceService from "../services/resource.service";
import PageContentService from "../services/pageContent.service";
import TestHierarchyService from "../services/testHierarchy.service";
import TestHierarchyResultService from "../services/testHierarchyResult.service";
import TestResultService from "../services/testResult.service";
import ElementResultService from "../services/elementResult.service";
import TanaguruTestService from "../services/tanaguruTest.service";
import StatusResultService from "../services/statusResult.service";
import ConfigService from "../services/config.service";
import 'prismjs'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-scss.min'
import Prism from 'vue-prism-component'
import Icon from "vue-awesome/components/Icon";

Vue.use(VueMeta)
Vue.component('v-icon', Icon)
Vue.component('prism', Prism)

Vue.prototype.bus = new Vue();
Vue.prototype.$moment = Moment;
Vue.prototype.window = window;
Vue.prototype.$http = axios;
Vue.config.productionTip = false
Vue.prototype.NAVBAR_LINKS = NAVBAR_LINKS;

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

const token = localStorage.getItem('token')
if (token) {
    Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

export default Vue
