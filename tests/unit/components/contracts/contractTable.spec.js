import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import Vuex from "vuex";
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

const DELETE_CONTRACT_STORE = new Vuex.Store({
    state : {
        auth : {
            authorities : {
                DELETE_CONTRACT: true
            },
            user : {
                appRole: {
                    name: 'TEST'
                }
            }
        }
    }
})

const NOT_EMPTY_CONTRACT_LIST = [
    {
        name: 'test1'
    },
    {
        name: 'test2'
    }
]

describe('ContractTable', () => {
    it('should hide delete contract button if user does not have authority', () => {
        const wrapper = shallowMount(ContractTable, {
            i18n,
            localVue,
            store: NO_AUTHORITY_STORE,
            stubs: ['router-link', 'router-view']
        })

        const deleteButton = wrapper.find('.actions-list__item .btn-delete ')
        expect(deleteButton.exists()).toBe(false);
    })

    it('should show delete contract button if user has authority', () => {
        const wrapper = shallowMount(ContractTable, {
            i18n,
            localVue,
            store: DELETE_CONTRACT_STORE,
            stubs: ['router-link', 'router-view'],
            propsData: {
                contracts: NOT_EMPTY_CONTRACT_LIST
            }
        })

        const deleteButton = wrapper.find('.actions-list__item .btn-delete ')
        expect(deleteButton.exists()).toBe(true);
    })
})

