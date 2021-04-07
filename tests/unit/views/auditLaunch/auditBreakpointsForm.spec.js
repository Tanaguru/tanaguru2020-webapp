import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import AuditBreakpointsForm from "@/views/AuditLaunch/form/AuditBreakpointsForm";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue()

describe('AuditBreakpointsForm', () => {
    it('should show error if breakpoint is empty', async () => {
        const wrapper = shallowMount(AuditBreakpointsForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: [1920]
            }
        })

        const breakpointInput = wrapper.find('#breakpoint-length-0');
        await breakpointInput.setValue('');
        await breakpointInput.trigger('blur');

        const emptyError = wrapper.find('#empty-error-0')
        expect(emptyError.isVisible()).toBe(true)
    })

    it('should show error if breakpoint is invalid (0)', async () => {
        const wrapper = shallowMount(AuditBreakpointsForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: [1920]
            }
        })

        const breakpointInput = wrapper.find('#breakpoint-length-0');
        await breakpointInput.setValue('0');
        await breakpointInput.trigger('blur');

        const validError = wrapper.find('#valid-error-0')
        expect(validError.exists()).toBe(true)
    })

    it('should show error if breakpoint is invalid (3841)', async () => {
        const wrapper = shallowMount(AuditBreakpointsForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: [1920]
            }
        })
        const breakpointInput = wrapper.find('#breakpoint-length-0');
        await breakpointInput.setValue('3841');
        await breakpointInput.trigger('blur');

        const validError = wrapper.find('#valid-error-0')
        expect(validError.exists()).toBe(true)
    })

    it('should not show error if breakpoint is valid', async () => {
        const wrapper = shallowMount(AuditBreakpointsForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: [1920]
            }
        })
        const breakpointInput = wrapper.find('#breakpoint-length-0');
        await breakpointInput.setValue('1920');

        const validError = wrapper.find('#valid-error-0')
        const emptyError = wrapper.find('#empty-error-0')
        expect(emptyError.exists()).toBe(false)
        expect(validError.exists()).toBe(false)
    })

    it('should emit input signal when field change', async () => {
        const wrapper = shallowMount(AuditBreakpointsForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: [1920]
            }
        })
        const breakpointInput = wrapper.find('#breakpoint-length-0');
        await breakpointInput.setValue('1920');
        expect(wrapper.emitted()).toHaveProperty('input')
    })
})
