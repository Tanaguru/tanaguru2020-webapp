import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import AuditSiteCrawlerDurationForm from "@/views/AuditLaunch/form/AuditSiteCrawlerDurationForm";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue()

describe('AuditSiteCrawlerDurationForm', () => {
    it('should show error if duration is empty', async () => {
        const wrapper = shallowMount(AuditSiteCrawlerDurationForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 3600
            }
        })

        const maxDurInput = wrapper.find('#maxDuration');
        await maxDurInput.setValue('');
        await maxDurInput.trigger('blur');

        const emptyError = wrapper.find('#duration-error')
        expect(emptyError.exists()).toBe(true)
    })

    it('should show error if duration is invalid (0)', async () => {
        const wrapper = shallowMount(AuditSiteCrawlerDurationForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 3600
            }
        })

        const maxDurInput = wrapper.find('#maxDuration');
        await maxDurInput.setValue(0);
        await maxDurInput.trigger('blur')

        const validError = wrapper.find('#duration-error')
        expect(validError.exists()).toBe(true)
    })

    it('should show error if duration is invalid (3841)', async () => {
        const wrapper = shallowMount(AuditSiteCrawlerDurationForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 3600
            }
        })
        const maxDurInput = wrapper.find('#maxDuration');
        await maxDurInput.setValue(89000);
        await maxDurInput.trigger('blur')

        const validError = wrapper.find('#duration-error')
        expect(validError.exists()).toBe(true)
    })

    /* TO DO 
    it('should not show error if duration is valid', async () => {
        const wrapper = shallowMount(AuditSiteCrawlerDurationForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 3600
            }
        })
        const maxDurInput = wrapper.find('#maxDuration');
        //await maxDurInput.setValue(3600);
        await maxDurInput.trigger('blur')

        const validError = wrapper.find('#duration-error')
        expect(validError.exists()).toBe(false)
    })*/

    it('should emit input signal when field change', async () => {
        const wrapper = shallowMount(AuditSiteCrawlerDurationForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 3600
            }
        })
        const maxDurInput = wrapper.find('#maxDuration');
        await maxDurInput.setValue(6400);
        expect(wrapper.emitted()).toHaveProperty('input')
    })
})
