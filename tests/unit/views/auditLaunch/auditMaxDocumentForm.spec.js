import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import AuditSiteCrawlerDocumentForm from "@/views/AuditLaunch/form/AuditSiteCrawlerDocumentForm";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue()

describe('AuditSiteCrawlerDocumentForm', () => {
    it('should show error if document is empty', async () => {
        const wrapper = shallowMount(AuditSiteCrawlerDocumentForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 100
            }
        })

        const maxDocumentInput = wrapper.find('#maxDocument');
        await maxDocumentInput.setValue('');
        await maxDocumentInput.trigger('blur');

        const emptyError = wrapper.find('#document-error')
        expect(emptyError.exists()).toBe(true)
    })

    it('should show error if document is invalid (0)', async () => {
        const wrapper = shallowMount(AuditSiteCrawlerDocumentForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 100
            }
        })

        const maxDocumentInput = wrapper.find('#maxDocument');
        await maxDocumentInput.setValue(0);
        await maxDocumentInput.trigger('blur')

        const validError = wrapper.find('#document-error')
        expect(validError.exists()).toBe(true)
    })

    it('should show error if document is invalid (3841)', async () => {
        const wrapper = shallowMount(AuditSiteCrawlerDocumentForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 100
            }
        })
        const maxDocumentInput = wrapper.find('#maxDocument');
        await maxDocumentInput.setValue(12);
        await maxDocumentInput.trigger('blur')

        const validError = wrapper.find('#document-error')
        expect(validError.exists()).toBe(true)
    })

    /* TO DO 
    it('should not show error if document is valid', async () => {
        const wrapper = shallowMount(AuditSiteCrawlerDocumentForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 100
            }
        })
        const maxDocumentInput = wrapper.find('#maxDocument');
        await maxDocumentInput.setValue(100);
        await maxDocumentInput.trigger('blur')

        const validError = wrapper.find('#document-error')
        expect(validError.exists()).toBe(false)
    })*/

    it('should emit input signal when field change', async () => {
        const wrapper = shallowMount(AuditSiteCrawlerDocumentForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 100
            }
        })
        const maxDocumentInput = wrapper.find('#maxDocument');
        await maxDocumentInput.setValue(8);
        expect(wrapper.emitted()).toHaveProperty('input')
    })
})
