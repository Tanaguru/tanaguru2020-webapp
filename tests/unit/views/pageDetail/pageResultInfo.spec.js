import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import PageResultInfo from "@/views/PageDetail/PageResultInfo";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue();

describe('PageResultInfo', () => {
    it('Should not show screenshot block when no screenshot', async () => {
            const wrapper = shallowMount(PageResultInfo, {
                i18n,
                localVue,
                stubs: ['router-link', 'router-view'],
                propsData: {
                    audit: {
                        id: 0
                    },
                    displayMode: 'anomaly',
                    page: {
                        id: 0,
                        name: ""
                    },
                    totalPages: 0,
                    percentage: 0,
                    nbAnomaly: 0,
                    nbElementTested: 0,
                    pageContent: {
                        screenshot: null
                    },
                    reference: {}
                }
            })

            const screenshotBlock = wrapper.find('.audit-caps');
            expect(screenshotBlock.exists()).toBe(false)
        }
    )
})
