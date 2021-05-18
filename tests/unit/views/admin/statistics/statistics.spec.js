import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../../helper/localVueHelper";
import Stats from "@/views/Admin/Stats/Stats";
import i18n from "@/i18n";
import Vuex from "vuex";
import PieChart from "@/components/charts/PieChart";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue()
const NO_AUTHORITY_STORE = new Vuex.Store({
    state : {
        auth : {
            user : {
                appRole: {
                    name: 'SUPER_ADMIN'
                }
            }
        }
    }
})

const INIT_STATS = {
    nbProjects: 0,
    nbUsers: 0,
    nbAudits: 0,
    nbContracts: 0,
    meanNbErrorsPage: 0,
    meanNbErrorsProject: 0,
    meanNbErrorsAudit: 0,
    nbSITEAudit: 0,
    nbPAGEAudit: 0,
    nbSCENARIOAudit: 0,
    nbUPLOADAudit: 0,
    meanNbAuditsByProject: 0,
    meanNbUsersByProject: 0
}

describe('Statistics', () => {
    describe('Statistics pannel', () => {
        it('should show with init value', () => {
            const wrapper = shallowMount(Stats, {
                i18n,
                localVue,
                store: NO_AUTHORITY_STORE,
                stubs: ['router-link', 'router-view'],
                mocks: {
                    statsService: {
                        getStats(then, error){
                            then(INIT_STATS)
                        },
                        getNbPageAuditedByPeriod(dateStart, dateEnd, then, error){
                            then(0)
                        },
                        getNbSiteAuditedByPeriod(dateStart, dateEnd, then, error){
                            then(0)
                        },
                        getNbScenarioAuditedByPeriod(dateStart, dateEnd, then, error){
                            then(0)
                        },
                        getNbFilesAuditedByPeriod(dateStart, dateEnd, then, error){
                            then(0)
                        },
                        getAverageNbErrorsForPageByPeriod(dateStart, dateEnd, then, error){
                            then(0)
                        }
                    }
                }
            })

            expect(wrapper.findComponent(PieChart).exists()).toBe(true);
            expect(wrapper.find('#stats-table').exists()).toBe(true);
            expect(wrapper.find('#stats-table').isVisible()).toBe(true);
            expect(wrapper.find('#dateStart').isVisible()).toBe(true);
            expect(wrapper.find('#dateEnd').isVisible()).toBe(true);
            expect(wrapper.find('#table-stats-period').exists()).toBe(false);
        })

        it('should show error if date are invalid when click on search', async () => {
            const wrapper = shallowMount(Stats, {
                i18n,
                localVue,
                store: NO_AUTHORITY_STORE,
                stubs: ['router-link', 'router-view'],
                mocks: {
                    statsService: {
                        getStats(then, error){
                            then(INIT_STATS)
                        },
                        getNbPageAuditedByPeriod(dateStart, dateEnd, then, error){
                            then(0)
                        },
                        getNbSiteAuditedByPeriod(dateStart, dateEnd, then, error){
                            then(0)
                        },
                        getNbScenarioAuditedByPeriod(dateStart, dateEnd, then, error){
                            then(0)
                        },
                        getNbFilesAuditedByPeriod(dateStart, dateEnd, then, error){
                            then(0)
                        },
                        getAverageNbErrorsForPageByPeriod(dateStart, dateEnd, then, error){
                            then(0)
                        }
                    }
                }
            })

            await wrapper.find('#displayStatsButton').trigger('click');

            const dateError = wrapper.find('#date-error');
            expect(dateError.text()).not.toBe('');
            expect(dateError.exists()).toBe(true);

            await wrapper.find('#dateStart').setValue('03/1/2021');
            await wrapper.find('#dateEnd').setValue('08/1/2021');
            await wrapper.find('#displayStatsButton').trigger('click');

            const dateError2 = wrapper.find('#date-error');
            expect(dateError2.text()).not.toBe('');
            expect(dateError2.exists()).toBe(true);
        })

        it('should show error if one date is invalid when click on search', async () => {
            const wrapper = shallowMount(Stats, {
                i18n,
                localVue,
                store: NO_AUTHORITY_STORE,
                stubs: ['router-link', 'router-view'],
                mocks: {
                    statsService: {
                        getStats(then, error){
                            then(INIT_STATS)
                        },
                        getNbPageAuditedByPeriod(dateStart, dateEnd, then, error){
                            then(0)
                        },
                        getNbSiteAuditedByPeriod(dateStart, dateEnd, then, error){
                            then(0)
                        },
                        getNbScenarioAuditedByPeriod(dateStart, dateEnd, then, error){
                            then(0)
                        },
                        getNbFilesAuditedByPeriod(dateStart, dateEnd, then, error){
                            then(0)
                        },
                        getAverageNbErrorsForPageByPeriod(dateStart, dateEnd, then, error){
                            then(0)
                        }
                    }
                }
            })

            await wrapper.find('#dateStart').setValue('03/01/2021');
            await wrapper.find('#displayStatsButton').trigger('click');

            const dateError = wrapper.find('#date-error');
            expect(dateError.exists()).toBe(true);
        })

        it('should not show error if date are valid when click on search', async () => {
            const wrapper = shallowMount(Stats, {
                i18n,
                localVue,
                store: NO_AUTHORITY_STORE,
                stubs: ['router-link', 'router-view'],
                mocks: {
                    statsService: {
                        getStats(then, error){
                            then(INIT_STATS)
                        },
                        getNbPageAuditedByPeriod(dateStart, dateEnd, then, error){
                            then(0)
                        },
                        getNbSiteAuditedByPeriod(dateStart, dateEnd, then, error){
                            then(0)
                        },
                        getNbScenarioAuditedByPeriod(dateStart, dateEnd, then, error){
                            then(0)
                        },
                        getNbFilesAuditedByPeriod(dateStart, dateEnd, then, error){
                            then(0)
                        },
                        getAverageNbErrorsForPageByPeriod(dateStart, dateEnd, then, error){
                            then(0)
                        }
                    }
                }
            })

            await wrapper.find('#dateStart').setValue('03/01/2021');
            await wrapper.find('#dateEnd').setValue('08/01/2021');
            await wrapper.find('#displayStatsButton').trigger('click');

            const dateError = wrapper.find('#date-error');
            expect(dateError.text()).toBe('');

            expect(wrapper.find('#table-stats-period').exists()).toBe(true);
        })
        
    })
})