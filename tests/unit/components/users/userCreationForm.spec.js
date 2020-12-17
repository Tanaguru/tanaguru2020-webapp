import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import userCreationForm from "../../../../src/components/users/UserCreationForm"

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue()

describe('UserCreationForm', () => {
    describe('name input', () => {
        it('should show error if empty when sending form', async () => {
            const wrapper = shallowMount(userCreationForm, {
                i18n,
                localVue,
                stubs: ['router-link', 'router-view']

            })

            await wrapper.find('#name').setValue('');
            await wrapper.find('form').trigger('submit.prevent');

            const nameError = wrapper.find('#name-error');
            expect(nameError.text()).not.toBe('');
        })

        it('should show error if contains more than 50 characters when sending form', async () => {
            const wrapper = shallowMount(userCreationForm, {
                i18n,
                localVue,
                stubs: ['router-link', 'router-view'],
            })

            await wrapper.find('#name').setValue('012345678901234567890123456789012345678901234567890');
            await wrapper.find('form').trigger('submit.prevent');

            const nameError = wrapper.find('#name-error');
            expect(nameError.exists()).toBe(true);
        })
    })

    describe('date input', () => {
        it('should show error if date is empty when sending form', async () => {
            const wrapper = shallowMount(userCreationForm, {
                i18n,
                localVue,
                stubs: ['router-link', 'router-view'],
            })

            await wrapper.find('#name').setValue('test');
            await wrapper.find('#dateEnd').setValue(null);
            await wrapper.find('form').trigger('submit.prevent');

            const dateError = wrapper.find('#date-error');
            expect(dateError.exists()).toBe(true);
        })
    })

    describe('owner input', () => {
        it('should show error if owner is empty when sending form', async () => {
            const wrapper = shallowMount(userCreationForm, {
                i18n,
                localVue,
                stubs: ['router-link', 'router-view'],
            })

            await wrapper.find('#name').setValue('test');
            await wrapper.find('#dateEnd').setValue('2020-12-15');
            await wrapper.find('#owner-select').setValue(null);
            await wrapper.find('form').trigger('submit.prevent');

            const ownerError = wrapper.find('#owner-error');
            expect(ownerError.exists()).toBe(true);
        })
    })

    describe('form', () => {
        it('shouldn\'t show error if valid and should show success message ans emit createUser event', async () => {
            const wrapper = shallowMount(userCreationForm, {
                i18n,
                localVue,
                stubs: ['router-link', 'router-view'],
                propsData: {
                    users: [
                        {id: 0},
                    ]
                },
                mocks: {
                    userService : {
                        create(name, date, ownerId, then, error) {
                            then({
                                // user
                            })
                        }
                    }
                }
            })

            await wrapper.find('#owner-select').setValue(0);
            await wrapper.find('#dateEnd').setValue('2020-12-15');
            await wrapper.find('#name').setValue('test');
            await wrapper.find('form').trigger('submit.prevent');

            const nameError = wrapper.find('#name-error');
            const dateError = wrapper.find('#date-error');
            const ownerError = wrapper.find('#owner-error');

            expect(nameError.exists()).toBe(false);
            expect(dateError.exists()).toBe(false);
            expect(ownerError.exists()).toBe(false);

            expect(wrapper.find('#form-error').exists()).toBe(false);
            expect(wrapper.find('#form-success').exists()).toBe(true);
            expect(wrapper.emitted()).toHaveProperty('createUser')
        })

        it('should show error server response is error', async () => {
            const wrapper = shallowMount(userCreationForm, {
                i18n,
                localVue,
                stubs: ['router-link', 'router-view'],
                propsData: {
                    users: [
                        {id: 0},
                    ]
                },
                mocks: {
                    userService : {
                        create(name, date, ownerId, then, error) {
                            error({
                                // error
                            })
                        }
                    }
                }
            })

            await wrapper.find('#owner-select').setValue(0);
            await wrapper.find('#dateEnd').setValue('2020-12-15');
            await wrapper.find('#name').setValue('test');
            await wrapper.find('form').trigger('submit.prevent');

            const nameError = wrapper.find('#name-error');
            const dateError = wrapper.find('#date-error');
            const ownerError = wrapper.find('#owner-error');

            expect(nameError.exists()).toBe(false);
            expect(dateError.exists()).toBe(false);
            expect(ownerError.exists()).toBe(false);

            expect(wrapper.find('#form-error').exists()).toBe(true);
            expect(wrapper.find('#form-success').exists()).toBe(false);
        })
    })
})
