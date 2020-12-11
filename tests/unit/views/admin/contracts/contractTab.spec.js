import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../../helper/localVueHelper";
import ContractTab from "@/views/Admin/Contract/ContractTab";
import i18n from "@/i18n";
import Vuex from "vuex";
import ContractCreationForm from "@/components/contracts/ContractCreationForm";
import ContractTable from "@/components/contracts/ContractTable";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue()
const NO_AUTHORITY_STORE = new Vuex.Store({
    state : {
        auth : {
            user : {
                appRole: {
                    name: 'TEST'
                }
            }
        }
    }
})

const CREATE_CONTRACT_STORE = new Vuex.Store({
    state : {
        auth : {
            authorities : {
                CREATE_CONTRACT: true
            },
            user : {
                appRole: {
                    name: 'TEST'
                }
            }
        }
    }
})

const EMPTY_CONTRACT_LIST = []
const NOT_EMPTY_CONTRACT_LIST = [
    {
        name: 'test1'
    },
    {
        name: 'test2'
    }
]

describe('ContractTab', () => {
    describe('Contract creation form', () => {
        it('should hide if user does not have authority to create contract', () => {
            const wrapper = shallowMount(ContractTab, {
                i18n,
                localVue,
                store: NO_AUTHORITY_STORE,
                stubs: ['router-link', 'router-view']
            })

            expect(wrapper.findComponent(ContractCreationForm).exists()).toBe(false);
        })

        it('should show if user has authority to create contract', () => {
            const wrapper = shallowMount(ContractTab, {
                i18n,
                localVue,
                store: CREATE_CONTRACT_STORE,
                stubs: ['router-link', 'router-view'],
                mocks: {
                    contractService: {
                        findAll(then, error){
                            then(EMPTY_CONTRACT_LIST)
                        }
                    }
                }
            })
            expect(wrapper.findComponent(ContractCreationForm).exists()).toBe(true);
        })
    })

    describe('contracts list', () => {
        it('should show message when no contracts found', () => {
            const wrapper = shallowMount(ContractTab, {
                i18n,
                localVue,
                store: NO_AUTHORITY_STORE,
                stubs: ['router-link', 'router-view'],
                mocks: {
                    contractService: {
                        findAll(then, error){
                            then(EMPTY_CONTRACT_LIST)
                        }
                    }
                }
            })

            let contractListSection = wrapper.find('#my-contracts');
            expect(contractListSection.text().includes(i18n.t('contracts.noContract'))).toBe(true);
            expect(wrapper.findComponent(ContractTable).exists()).toBe(false)
        })

        it('should show table if contracts found', () => {
            const wrapper = shallowMount(ContractTab, {
                i18n,
                localVue,
                store: NO_AUTHORITY_STORE,
                stubs: ['router-link', 'router-view'],
                mocks: {
                    contractService: {
                        findAll(then, error){
                            then(NOT_EMPTY_CONTRACT_LIST)
                        }
                    }
                }
            })
            expect(wrapper.findComponent(ContractTable).exists()).toBe(true)
        })
    })
})
