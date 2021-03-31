import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../../helper/localVueHelper";
import ContractTab from "@/views/Admin/Contract/ContractTab";
import i18n from "@/i18n";
import Vuex from "vuex";
import ContractCreationForm from "@/components/contracts/ContractCreationForm";
import ContractTable from "@/components/contracts/ContractTable";
import Pagination from "@/components/Pagination";

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
const NOT_EMPTY_CONTRACT_LIST = {
    content:[
        {
            name: 'test1'
        },
        {
            name: 'test2'
        }
    ],
    totalPages:1,
    totalElements:2
}

const FILTER_CONTRACT_LIST = {
    content:[
        {
            name: 'test1'
        }
    ],
    totalPages:1,
    totalElements:1
}

const PAGE0_CONTRACT_LIST = {
    content:[
        {
            name: 'test1'
        },
        {
            name: 'test2'
        },
        {
            name: 'test3'
        },
        {
            name: 'test4'
        },
        {
            name: 'test5'
        }
    ],
    totalPages:2,
    totalElements:6
}

describe('ContractTab', () => {
    describe('Contract creation form', () => {
        it('should hide if user does not have authority to create contract', () => {
            const wrapper = shallowMount(ContractTab, {
                i18n,
                localVue,
                store: NO_AUTHORITY_STORE,
                stubs: ['router-link', 'router-view'],
                mocks: {
                    contractService: {
                        findAll(page, size, filter, then, error){
                            then(EMPTY_CONTRACT_LIST)
                        }
                    },
                    userService: {
                        findAll(then, error){
                            then()
                        }
                    }
                }
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
                        findAll(page, size, filter, then, error){
                            then(EMPTY_CONTRACT_LIST)
                        }
                    },
                    userService: {
                        findAll(then, error){
                            then()
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
                        findAll(page, size, filter, then, error){
                            then(EMPTY_CONTRACT_LIST)
                        }
                    },
                    userService: {
                        findAll(then, error){
                            then()
                        }
                    }
                }
            })

            let contractListSection = wrapper.find('#my-contracts');
            expect(contractListSection.text().includes(i18n.t('contracts.noContract'))).toBe(true);
            expect(wrapper.findComponent(ContractTable).exists()).toBe(false)
        })

        it('should show table if contracts found', async () => {
            const wrapper = shallowMount(ContractTab, {
                i18n,
                localVue,
                store: NO_AUTHORITY_STORE,
                stubs: ['router-link', 'router-view'],
                data() {
                    return {
                      initWithContracts: 'true'
                    }
                },
                mocks: {
                    contractService: {
                        findAll(page, size, filter, then, error){
                            then(NOT_EMPTY_CONTRACT_LIST)
                        }
                    },
                    userService: {
                        findAll(then, error){
                            then()
                        }
                    }
                }
            })
            expect(wrapper.findComponent(ContractTable).exists()).toBe(true)
        })

        it('should filter contracts with filter input string', async () => {
            const wrapper = shallowMount(ContractTab, {
                i18n,
                localVue,
                data() {
                    return {
                      initWithContracts: 'true',
                      searchContract: 'test1'
                    }
                },
                store: NO_AUTHORITY_STORE,
                stubs: ['router-link', 'router-view'],
                mocks: {
                    contractService: {
                        findAll(page, size, filter, then, error){
                            if(filter == 'test1'){
                                then(FILTER_CONTRACT_LIST)
                            }else{
                                then(NOT_EMPTY_CONTRACT_LIST)
                            }
                        }
                    },
                    userService: {
                        findAll(then, error){
                            then()
                        }
                    }
                }
            })
            
            expect(wrapper.vm.contracts.length).toBe(1);
            
        })

        it('should show pagination elements if totalPages > 1', async () => {
            const wrapper = shallowMount(ContractTab, {
                i18n,
                localVue,
                store: NO_AUTHORITY_STORE,
                stubs: ['router-link', 'router-view'],
                data() {
                    return {
                      initWithContracts: 'true'
                    }
                },
                mocks: {
                    contractService: {
                        findAll(page, size, filter, then, error){
                            then(PAGE0_CONTRACT_LIST)
                        }
                    },
                    userService: {
                        findAll(then, error){
                            then()
                        }
                    }
                }
            })
            expect(wrapper.findComponent(ContractTable).exists()).toBe(true)
            
            const wrapperPagination = shallowMount(Pagination, {
                i18n,
                localVue,
                stubs: ['router-link', 'router-view'],
                propsData: {
                    totalPages : PAGE0_CONTRACT_LIST.totalPages,
                    currentPage : 0
                }
                
            })

            expect(wrapperPagination.find('ul.pagination').isVisible()).toBe(true)
        })

        it('should not show pagination elements if totalPages <= 1', async () => {
            const wrapper = shallowMount(ContractTab, {
                i18n,
                localVue,
                store: NO_AUTHORITY_STORE,
                stubs: ['router-link', 'router-view'],
                data() {
                    return {
                      initWithContracts: 'true'
                    }
                },
                mocks: {
                    contractService: {
                        findAll(page, size, filter, then, error){
                            then(NOT_EMPTY_CONTRACT_LIST)
                        }
                    },
                    userService: {
                        findAll(then, error){
                            then()
                        }
                    }
                }
            })
            expect(wrapper.findComponent(ContractTable).exists()).toBe(true)

            const wrapperPagination = shallowMount(Pagination, {
                i18n,
                localVue,
                stubs: ['router-link', 'router-view'],
                propsData: {
                    totalPages : NOT_EMPTY_CONTRACT_LIST.totalPages,
                    currentPage : 0
                }
                
            })

            expect(wrapperPagination.find('ul.pagination').isVisible()).toBe(false)
        })
    })

    it('should add contract to list when a new contract is created', async () => {
        const wrapper = shallowMount(ContractTab, {
            i18n,
            localVue,
            store: CREATE_CONTRACT_STORE,
            stubs: ['router-link', 'router-view'],
            data() {
                return {
                  initWithContracts: 'true'
                }
            },
            mocks: {
                contractService: {
                    findAll(page, size, filter, then, error){
                        then(NOT_EMPTY_CONTRACT_LIST)
                    }
                },
                userService: {
                    findAll(then, error){
                        then()
                    }
                }
            }
        })

        const contractForm = wrapper.findComponent(ContractCreationForm)
        contractForm.vm.$emit('createContract', {name: 'test'})
        expect(wrapper.vm.contracts.length).toBe(3)
    })
})
