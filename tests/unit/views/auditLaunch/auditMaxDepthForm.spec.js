import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import AuditSiteCrawlerDepthForm from "@/views/AuditLaunch/form/AuditSiteCrawlerDepthForm";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue()

describe('AuditSiteCrawlerDepthForm', () => {
    it('should show error if depth is empty', async () => {
        const wrapper = shallowMount(AuditSiteCrawlerDepthForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 10
            }
        })

        const maxDepthInput = wrapper.find('#maxDepth');
        await maxDepthInput.setValue('');
        await maxDepthInput.trigger('blur');

        const emptyError = wrapper.find('#depth-error')
        expect(emptyError.exists()).toBe(true)
    })

    it('should show error if depth is invalid (0)', async () => {
        const wrapper = shallowMount(AuditSiteCrawlerDepthForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 10
            }
        })

        const maxDepthInput = wrapper.find('#maxDepth');
        await maxDepthInput.setValue(0);
        await maxDepthInput.trigger('blur')

        const validError = wrapper.find('#depth-error')
        expect(validError.exists()).toBe(true)
    })

    it('should show error if depth is invalid (3841)', async () => {
        const wrapper = shallowMount(AuditSiteCrawlerDepthForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 10
            }
        })
        const maxDepthInput = wrapper.find('#maxDepth');
        await maxDepthInput.setValue(12);
        await maxDepthInput.trigger('blur')

        const validError = wrapper.find('#depth-error')
        expect(validError.exists()).toBe(true)
    })

    /* TO DO 
    it('should not show error if depth is valid', async () => {
        const wrapper = shallowMount(AuditSiteCrawlerDepthForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 10
            }
        })
        const maxDepthInput = wrapper.find('#maxDepth');
        await maxDepthInput.setValue(10);
        await maxDepthInput.trigger('blur')

        const validError = wrapper.find('#depth-error')
        expect(validError.exists()).toBe(false)
    })*/

    it('should emit input signal when field change', async () => {
        const wrapper = shallowMount(AuditSiteCrawlerDepthForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 10
            }
        })
        const maxDepthInput = wrapper.find('#maxDepth');
        await maxDepthInput.setValue(8);
        expect(wrapper.emitted()).toHaveProperty('input')
    })
})
