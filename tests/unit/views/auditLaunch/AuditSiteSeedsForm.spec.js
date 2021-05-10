import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import AuditSiteSeedsForm from "@/views/AuditLaunch/form/AuditSiteSeedsForm";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue();

describe('AuditSiteSeedsForm', () => {
    it('should join props urls', async ()=>{
        const wrapper = shallowMount(AuditSiteSeedsForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: ['test1', 'test2']
            }
        })

        const seedsInput = wrapper.find('#seeds')
        expect(seedsInput.element.value).toBe('test1;test2')
    })    

    it('should display error message if empty', async ()=>{
        const wrapper = shallowMount(AuditSiteSeedsForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: ['http://test.com', 'http://test.com/contact']
            }
        })

        const seedsInput = wrapper.find('#seeds')
        await seedsInput.setValue('');
        await seedsInput.trigger('blur');

        const emptyError = wrapper.find('#free-seed-error')

        expect(emptyError.exists()).toBe(true)
    })

    it('should display error message if doesn\'t match domain', async ()=>{
        const wrapper = shallowMount(AuditSiteSeedsForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: ['http://test.com', 'http://test.com/contact']
            }
        })

        const seedsInput = wrapper.find('#seeds')
        await seedsInput.setValue('http://wrong.com');
        await seedsInput.trigger('blur');

        const wrongError = wrapper.find('#free-seed-error')
        expect(wrongError.exists()).toBe(true)
    })

    /* TO DO
    it('should not display error message if input matches domain', async ()=>{
        const wrapper = shallowMount(AuditSiteSeedsForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: ['http://test.com', 'http://test.com/contact']
            }
        })

        const seedsInput = wrapper.find('#seeds')
        await seedsInput.setValue('http://test.com;http://test.com/contact;http://test.com/contact');
        await seedsInput.trigger('blur');

        const errorMsg = wrapper.find('#free-seed-error')
        expect(errorMsg.exists()).toBe(false)
    })*/
})
