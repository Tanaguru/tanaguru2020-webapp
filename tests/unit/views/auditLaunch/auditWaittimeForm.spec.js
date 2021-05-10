import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import AuditWaitTimeForm from "@/views/AuditLaunch/form/AuditWaitTimeForm";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue()

describe('AuditWaitTimeForm', () => {
    it('should show error if waittime is empty', async () => {
        const wrapper = shallowMount(AuditWaitTimeForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 500,

            }
        })
        const waitTimeInput = wrapper.find('#waitTime');
        await waitTimeInput.setValue(null);
        await waitTimeInput.trigger('blur');

        expect(wrapper.find('#waittime-error').isVisible()).toBe(true);
    })

    it('should show error if wait time is invalid (0)', async () => {
        const wrapper = shallowMount(AuditWaitTimeForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 500,

            }
        })
        const waitTimeInput = wrapper.find('#waitTime');
        await waitTimeInput.setValue(0);
        await waitTimeInput.trigger('blur');

        expect(wrapper.find('#waittime-error').isVisible()).toBe(true);
    })

    it('should show error if wait time is invalid (11 000)', async () => {
        const wrapper = shallowMount(AuditWaitTimeForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 500,

            }
        })
        const waitTimeInput = wrapper.find('#waitTime');
        await waitTimeInput.setValue(11000);
        await waitTimeInput.trigger('blur');

        expect(wrapper.find('#waittime-error').isVisible()).toBe(true);
    })

    /* TO DO
    it('should not show error if wait time is valid', async () => {
        const wrapper = shallowMount(AuditWaitTimeForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 500,

            }
        })
        const waitTimeInput = wrapper.find('#waitTime');
        await waitTimeInput.setValue(501);
        await waitTimeInput.trigger('blur');

        //expect(wrapper.find('.info-error').exists()).toBe(false);
        console.log(waitTimeInput.element.value)
    })*/

    it('should emit input signal when field change', async () => {
        const wrapper = shallowMount(AuditWaitTimeForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 500,
            }
        })
        const waitTimeInput = wrapper.find('#waitTime');
        await waitTimeInput.setValue(1920);
        expect(wrapper.emitted()).toHaveProperty('input')
    })
})
