import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import AuditMainReferenceForm from "@/views/AuditLaunch/form/AuditMainReferenceForm";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue();

describe('AuditMainReferenceForm', () => {
    it('should show all selected references in select', async ()=>{
        const wrapper = shallowMount(AuditMainReferenceForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 'test1',
                selectedReferences: ['test1', 'test2']
            }
        })

        const mainReferenceSelector = wrapper.find('#main-reference-select');
        const mainReferenceOptions = mainReferenceSelector.findAll('option')
        expect(mainReferenceOptions.length).toBe(2)
    })
})
