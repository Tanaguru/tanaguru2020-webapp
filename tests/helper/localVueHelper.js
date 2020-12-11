import {createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueI18n from "vue-i18n";
import VueRouter from 'vue-router'
import axios from "axios";
import Moment from "moment";
import VueMeta from "vue-meta";
import 'prismjs'

import UserService from "../../src/services/user.service";
import ContractService from "../../src/services/contract.service";
import ProjectService from "../../src/services/project.service";
import AuditService from "../../src/services/audit.service";
import PageService from "../../src/services/page.service";
import AuditLogService from "../../src/services/auditLog.service";
import AuditParametersService from "../../src/services/auditParameters.service";
import ScenarioService from "../../src/services/scenario.service";
import ResourceService from "../../src/services/resource.service";
import PageContentService from "../../src/services/pageContent.service";
import TestHierarchyService from "../../src/services/testHierarchy.service";
import TestHierarchyResultService from "../../src/services/testHierarchyResult.service";
import TestResultService from "../../src/services/testResult.service";
import ElementResultService from "../../src/services/elementResult.service";
import TanaguruTestService from "../../src/services/tanaguruTest.service";
import StatusResultService from "../../src/services/statusResult.service";
import ConfigService from "../../src/services/config.service";

import VueAccessibleModal from "vue-accessible-modal";

const options = {
    transition: 'fade',
}

const tanaguruLocalVueHelper = {
    getTanaguruLocalVue(){
        const localVue = createLocalVue()
        localVue.use(Vuex)
        localVue.use(VueI18n)
        localVue.use(VueRouter)
        localVue.use(VueMeta)
        localVue.use(VueAccessibleModal, options)

        localVue.prototype.$moment = Moment
        localVue.prototype.window = window;
        localVue.prototype.$http = axios;
        localVue.config.productionTip = false

        localVue.prototype.userService = new UserService(axios);
        localVue.prototype.contractService = new ContractService(axios);
        localVue.prototype.projectService = new ProjectService(axios);
        localVue.prototype.auditService = new AuditService(axios);
        localVue.prototype.pageService = new PageService(axios);
        localVue.prototype.auditLogService = new AuditLogService(axios);
        localVue.prototype.auditParametersService = new AuditParametersService(axios);
        localVue.prototype.scenarioService = new ScenarioService(axios);
        localVue.prototype.resourceService = new ResourceService(axios);
        localVue.prototype.pageContentService = new PageContentService(axios);
        localVue.prototype.testHierarchyService = new TestHierarchyService(axios);
        localVue.prototype.testHierarchyResultService = new TestHierarchyResultService(axios);
        localVue.prototype.testResultService = new TestResultService(axios);
        localVue.prototype.elementResultService = new ElementResultService(axios);
        localVue.prototype.tanaguruTestService = new TanaguruTestService(axios);
        localVue.prototype.statusResultService = new StatusResultService(axios);
        localVue.prototype.configService = new ConfigService(axios);

        return localVue
    }
}

export default tanaguruLocalVueHelper
