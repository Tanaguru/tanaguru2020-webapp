import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import AuditUploadForm from "@/views/AuditLaunch/form/AuditUploadForm";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue();

describe('AuditUploadForm', () => {
    it('should emit signal on type change', async ()=>{
        const wrapper = shallowMount(AuditUploadForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 'page',
                types: ['page', 'site']
            }
        })

        const typeInput = wrapper.find('#type-site');
        await typeInput.setChecked(true)

        expect(wrapper.emitted()).toHaveProperty('input')

    })
})
