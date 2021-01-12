import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import AuditPageUrlsForm from "@/views/AuditLaunch/form/AuditPageUrlsForm";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue();

describe('AuditPageUrlsForm', () => {
    it('should switch input mode with radio buttons', async ()=>{
        const wrapper = shallowMount(AuditPageUrlsForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: []
            }
        })

        const plainTextInputRadio = wrapper.find('#plainText')
        await plainTextInputRadio.setChecked(true)

        const plainTextArea = wrapper.find('#urls')
        expect(plainTextArea.exists()).toBe(true)

        const arrayInputRadio = wrapper.find('#array')
        await arrayInputRadio.setChecked(true)

        const arrayBlock = wrapper.find('#array-input-block')
        expect(arrayBlock.exists()).toBe(true)
    })

    describe('plain text input', () => {
        it('should join props urls', async ()=>{
            const wrapper = shallowMount(AuditPageUrlsForm, {
                i18n,
                localVue,
                stubs: ['router-link', 'router-view'],
                propsData: {
                    value: ['test1', 'test2']
                }
            })

            const plainTextInputRadio = wrapper.find('#plainText')
            await plainTextInputRadio.setChecked(true)

            const plainTextArea = wrapper.find('#urls')
            expect(plainTextArea.element.value).toBe('test1;test2')
        })

        it('should split string by separate url with ;', async ()=>{
            const wrapper = shallowMount(AuditPageUrlsForm, {
                i18n,
                localVue,
                stubs: ['router-link', 'router-view'],
                propsData: {
                    value: ['test1', 'test2']
                }
            })

            const plainTextInputRadio = wrapper.find('#plainText')
            await plainTextInputRadio.setChecked(true)

            const plainTextArea = wrapper.find('#urls')
            await plainTextArea.setValue('test1;test2;test3')
            expect(wrapper.vm.inputArray.length).toBe(3)
        })
    })

    describe('array input', () => {
        it('should show multiple fields in array input mode', async ()=>{
            const wrapper = shallowMount(AuditPageUrlsForm, {
                i18n,
                localVue,
                stubs: ['router-link', 'router-view'],
                propsData: {
                    value: ['test1', 'test2']
                }
            })

            const inputRadio = wrapper.find('#array')
            await inputRadio.setChecked(true)

            const fields = wrapper.findAll('#array-input-block input')
            expect(fields.length).toBe(2)
        })

        it('should join strings for plain text mode', async ()=>{
            const wrapper = shallowMount(AuditPageUrlsForm, {
                i18n,
                localVue,
                stubs: ['router-link', 'router-view'],
                propsData: {
                    value: ['test1', 'test2']
                }
            })

            const inputRadio = wrapper.find('#array')
            await inputRadio.setChecked(true)

            const field = wrapper.find('#page-url-0')
            await field.setValue('test')
            expect(wrapper.vm.inputPlainText).toBe('test;test2')
        })

        describe('Add button', ()=>{
            it('should add a form field', async () => {
                const wrapper = shallowMount(AuditPageUrlsForm, {
                    i18n,
                    localVue,
                    stubs: ['router-link', 'router-view'],
                    propsData: {
                        value: ['test1']
                    }

                })

                const inputRadio = wrapper.find('#array')
                await inputRadio.setChecked(true)

                const addFieldButton = wrapper.find('button#add-field-button')
                await addFieldButton.trigger('click')
                await wrapper.vm.$nextTick()

                expect(wrapper.vm.inputArray.length).toBe(2)

            })
        })
    })
})
