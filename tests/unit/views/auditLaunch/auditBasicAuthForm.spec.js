import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import AuditBasicAuthPasswordForm from "@/views/AuditLaunch/form/BasicAuthPasswordForm";
import AuditBasicAuthUrlForm from "@/views/AuditLaunch/form/BasicAuthUrlForm";


const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue()

describe('AuditBasicAuthForm', () => {

    describe('AuditBasicAuthPassword', () => {

        it('should show error if password is invalid (4)', async () => {
            const wrapper = shallowMount(AuditBasicAuthPasswordForm, {
                i18n,
                localVue,
                stubs: ['router-link', 'router-view'],
                propsData: {
                    value: ''
                }
            })

            const passwordInput = wrapper.find('#password');
            await passwordInput.setValue('test');
            await passwordInput.trigger('blur')

            const passwordError = wrapper.find('#password-error')
            expect(passwordError.exists()).toBe(true)
        })

        it('should not show error if password is valid', async () => {
            const wrapper = shallowMount(AuditBasicAuthPasswordForm, {
                i18n,
                localVue,
                stubs: ['router-link', 'router-view'],
                propsData: {
                    value: ''
                }
            })

            const passwordInput = wrapper.find('#password');
            await passwordInput.setValue('validpassword');

            const passwordError = wrapper.find('#password-error')
            expect(passwordError.exists()).toBe(false)
        })

        it('should not show error if password is empty', async () => {
            const wrapper = shallowMount(AuditBasicAuthPasswordForm, {
                i18n,
                localVue,
                stubs: ['router-link', 'router-view'],
                propsData: {
                    value: ''
                }
            })

            const passwordError = wrapper.find('#password-error')
            expect(passwordError.exists()).toBe(false)
        })

        it('should emit input signal when field change', async () => {
            const wrapper = shallowMount(AuditBasicAuthPasswordForm, {
                i18n,
                localVue,
                stubs: ['router-link', 'router-view'],
                propsData: {
                    value: ''
                }
            })

            const passwordInput = wrapper.find('#password');
            await passwordInput.setValue('Password!5');
            await passwordInput.trigger('blur')

            expect(wrapper.emitted()).toHaveProperty('input')
        })
    })

    describe('AuditBasicAuthUrl', () => {

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
})
