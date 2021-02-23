import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../helper/localVueHelper";
import Breadcrumbs from "@/components/Breadcrumbs";
import i18n from "@/i18n";
import router from 'vue-router'

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue()
describe('Breadcrumbs', () => {
    it('should have a nav tag and navigation role', () => {
        const wrapper = shallowMount(Breadcrumbs, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view']
        })

        const nav = wrapper.find('nav')
        expect(nav).not.toBe(null)
        expect(nav.attributes('role')).toBe('navigation')
    })

    it('must show one non link item when 1 item is given', () => {
        const wrapper = shallowMount(Breadcrumbs, {
            i18n,
            localVue,
            propsData : {
                'breadcrumbsItems': [
                    {
                        name: 'test1',
                        path: 'path test 1'
                    }
                ]
            }
        })

        const items = wrapper.findAll('li')
        expect(items).toHaveLength(1)

        const item = items.at(0)
        expect(item.find('router-link-stub').exists()).toBe(false)
    })

    it('must show link items except for last', () => {
        const wrapper = shallowMount(Breadcrumbs, {
            i18n,
            localVue,
            propsData : {
                'breadcrumbsItems': [
                    {
                        name: 'test1',
                        path: 'path test 1'
                    },
                    {
                        name: 'test2',
                        path: 'path test 2'
                    },
                    {
                        name: 'test3',
                        path: 'path test 3'
                    }
                ]
            }
        })

        const items = wrapper.findAll('li')
        expect(items).toHaveLength(3)

        const item1 = items.at(0)
        expect(item1.find('router-link-stub').exists()).toBe(true)

        const item2 = items.at(1)
        expect(item2.find('router-link-stub').exists()).toBe(true)

        const item3 = items.at(2)
        expect(item3.find('router-link-stub').exists()).toBe(false)
    })
})
