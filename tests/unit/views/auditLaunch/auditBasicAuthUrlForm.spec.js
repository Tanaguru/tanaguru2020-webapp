import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import AuditBasicAuthUrlForm from "@/views/AuditLaunch/form/BasicAuthUrlForm";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue()

describe('AuditBasicAuthUrlForm', () => {
    it('should show error if url is invalid', async () => {
        const wrapper = shallowMount(AuditBasicAuthUrlForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: ''
            }
        })

        const urlInput = wrapper.find('#url');
        await urlInput.setValue('test');
        await urlInput.trigger('blur')

        const urlError = wrapper.find('#url-error')
        expect(urlError.exists()).toBe(true)
    })

    it('should not show error if url is empty', async () => {
        const wrapper = shallowMount(AuditBasicAuthUrlForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: ''
            }
        })

        const urlInput = wrapper.find('#url');

        const urlError = wrapper.find('#url-error')
        expect(urlError.exists()).toBe(false)
    })

    it('should not show error if url is valid', async () => {
        const wrapper = shallowMount(AuditBasicAuthUrlForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: ''
            }
        })

        const urlInput = wrapper.find('#url');
        await urlInput.setValue('https://docs.python.org');

        const urlError = wrapper.find('#url-error')
        expect(urlError.exists()).toBe(false)
    })

    it('should emit input signal when field change', async () => {
        const wrapper = shallowMount(AuditBasicAuthUrlForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: ''
            }
        })

        const urlInput = wrapper.find('#url');
        await urlInput.setValue('https://docs.python.org');
        await urlInput.trigger('blur')
        
        expect(wrapper.emitted()).toHaveProperty('input')
    })
})
