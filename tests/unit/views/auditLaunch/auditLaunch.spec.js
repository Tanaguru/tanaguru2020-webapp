import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import AuditLaunch from "../../../../src/views/AuditLaunch/AuditLaunch"
import VueRouter from 'vue-router'

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue()
const router = new VueRouter();

const testHierarchyService = {
    findAllReferencesNotDeleted(then, error){
        then([])
    }
}

const projectService = {
    findById(id, then, error){
        then({
            id: 0,
            name: 'test',
            domain: 'http://test.fr',
            contract: {
                name: 'testCotnract'
            }
        })
    }
}

const configService = {
    getActiveBrowsers(then, error){
        then(['chrome', 'firefox'])
    }
}

describe('AuditLaunch', () => {
    describe('Page section', () => {
        it('should appear if selected type is page', async () => {
            const wrapper = shallowMount(AuditLaunch, {
                i18n,
                localVue,
                router,
                stubs: ['router-link', 'router-view'],
                mocks: {
                    projectService : projectService,
                    testHierarchyService : testHierarchyService,
                    configService : configService
                }
            })

            await wrapper.setData({
                auditConfigurationForm : {
                    common: {
                        type: 'page'
                    }
                }
            })
            const section = await wrapper.find('#section-page')
            expect(section.exists()).toBe(true);
        })

        it('should not appear if selected type is not page', async () => {
            const wrapper = shallowMount(AuditLaunch, {
                i18n,
                localVue,
                router,
                stubs: ['router-link', 'router-view'],
                mocks: {
                    projectService : projectService,
                    testHierarchyService : testHierarchyService,
                    configService : configService
                }
            })

            await wrapper.setData({
                auditConfigurationForm : {
                    common: {
                        type: 'test'
                    }
                }
            })
            const section = await wrapper.find('#section-page')
            expect(section.exists()).toBe(false);
        })
    })

    describe('Site section', () => {
        it('should appear if selected type is site', async () => {
            const wrapper = shallowMount(AuditLaunch, {
                i18n,
                router,
                localVue,
                stubs: ['router-link', 'router-view'],
                mocks: {
                    projectService : projectService,
                    testHierarchyService : testHierarchyService,
                    configService : configService
                }
            })

            await wrapper.setData({
                auditConfigurationForm : {
                    common: {
                        type: 'site'
                    }
                }
            })
            const section = await wrapper.find('#section-site')
            expect(section.exists()).toBe(true);
        })

        it('should not appear if selected type is not site', async () => {
            const wrapper = shallowMount(AuditLaunch, {
                i18n,
                router,
                localVue,
                stubs: ['router-link', 'router-view'],
                mocks: {
                    projectService : projectService,
                    testHierarchyService : testHierarchyService,
                    configService : configService
                }
            })

            await wrapper.setData({
                auditConfigurationForm : {
                    common: {
                        type: 'test'
                    }
                }
            })
            const section = await wrapper.find('#section-site')
            expect(section.exists()).toBe(false);
        })
    })

    describe('Scenario section', () => {
        it('should appear if selected type is scenario', async () => {
            const wrapper = shallowMount(AuditLaunch, {
                i18n,
                router,
                localVue,
                stubs: ['router-link', 'router-view'],
                mocks: {
                    projectService : projectService,
                    testHierarchyService : testHierarchyService,
                    configService : configService
                }
            })

            await wrapper.setData({
                auditConfigurationForm : {
                    common: {
                        type: 'scenario'
                    }
                }
            })
            const section = await wrapper.find('#section-scenario')
            expect(section.exists()).toBe(true);
        })

        it('should not appear if selected type is not site', async () => {
            const wrapper = shallowMount(AuditLaunch, {
                i18n,
                router,
                localVue,
                stubs: ['router-link', 'router-view'],
                mocks: {
                    projectService : projectService,
                    testHierarchyService : testHierarchyService,
                    configService : configService
                }
            })

            await wrapper.setData({
                auditConfigurationForm : {
                    common: {
                        type: 'test'
                    }
                }
            })
            const section = await wrapper.find('#section-scenario')
            expect(section.exists()).toBe(false);
        })
    })

    describe('Upload section', () => {
        it('should appear if selected type is upload', async () => {
            const wrapper = shallowMount(AuditLaunch, {
                i18n,
                router,
                localVue,
                stubs: ['router-link', 'router-view'],
                mocks: {
                    projectService : projectService,
                    testHierarchyService : testHierarchyService,
                    configService : configService
                }
            })

            await wrapper.setData({
                auditConfigurationForm : {
                    common: {
                        type: 'upload'
                    }
                }
            })
            const section = await wrapper.find('#section-upload')
            expect(section.exists()).toBe(true);
        })

        it('should not appear if selected type is not upload', async () => {
            const wrapper = shallowMount(AuditLaunch, {
                i18n,
                router,
                localVue,
                stubs: ['router-link', 'router-view'],
                mocks: {
                    projectService : projectService,
                    testHierarchyService : testHierarchyService,
                    configService : configService
                }
            })

            await wrapper.setData({
                auditConfigurationForm : {
                    common: {
                        type: 'test'
                    }
                }
            })
            const section = await wrapper.find('#section-upload')
            expect(section.exists()).toBe(false);
        })
    })
})
