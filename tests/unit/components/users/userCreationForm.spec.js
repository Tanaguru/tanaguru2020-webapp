import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import Vuex from "vuex";
import UserCreationForm from "../../../../src/components/users/UserCreationForm"

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue()

const CREATE_CONTRACT_STORE = new Vuex.Store({
    state : {
        auth : {
            authorities : {
                CREATE_CONTRACT: true
            },
            user : {
                appRole: {
                    name: 'TEST'
                }
            }
        }
    }
})

describe('UserCreationForm', () => {
    describe('name input', () => {
        it('should show error if empty when sending form', async () => {
            const wrapper = shallowMount(UserCreationForm, {
                i18n,
                localVue,
                store: CREATE_CONTRACT_STORE,
                stubs: ['router-link', 'router-view']

            })

            await wrapper.find('#username').setValue('');
            await wrapper.find('form').trigger('submit.prevent');

            const nameError = wrapper.find('#username-error');
            expect(nameError.text()).not.toBe('');
        })

        it('should show error if contains more than 30 characters when sending form', async () => {
            const wrapper = shallowMount(UserCreationForm, {
                i18n,
                localVue,
                store: CREATE_CONTRACT_STORE,
                stubs: ['router-link', 'router-view'],
            })

            await wrapper.find('#username').setValue('0123456789012345678901234567890');
            await wrapper.find('form').trigger('submit.prevent');

            const nameError = wrapper.find('#username-error');
            expect(nameError.exists()).toBe(true);
        })

        it('should show error if contains less than 4 characters when sending form', async () => {
            const wrapper = shallowMount(UserCreationForm, {
                i18n,
                localVue,
                store: CREATE_CONTRACT_STORE,
                stubs: ['router-link', 'router-view'],
            })

            await wrapper.find('#username').setValue('01');
            await wrapper.find('form').trigger('submit.prevent');

            const nameError = wrapper.find('#username-error');
            expect(nameError.exists()).toBe(true);
        })
    })

    describe('email input', () => {
        it('should show error if email is empty when sending form', async () => {
            const wrapper = shallowMount(UserCreationForm, {
                i18n,
                localVue,
                store: CREATE_CONTRACT_STORE,
                stubs: ['router-link', 'router-view'],
            })

            await wrapper.find('#username').setValue('test');
            await wrapper.find('#email').setValue(null);
            await wrapper.find('form').trigger('submit.prevent');

            const emailError = wrapper.find('#email-error');
            expect(emailError.exists()).toBe(true);
        })

        it('should show error if email is invalid when sending form', async () => {
            const wrapper = shallowMount(UserCreationForm, {
                i18n,
                localVue,
                store: CREATE_CONTRACT_STORE,
                stubs: ['router-link', 'router-view'],
            })

            await wrapper.find('#username').setValue('test');
            await wrapper.find('#email').setValue('test');
            await wrapper.find('form').trigger('submit.prevent');

            const emailError = wrapper.find('#email-error');
            expect(emailError.exists()).toBe(true);
        })
    })

    describe('password input', () => {
        it('should show error if password is invalid when sending form', async () => {
            const wrapper = shallowMount(UserCreationForm, {
                i18n,
                localVue,
                store: CREATE_CONTRACT_STORE,
                stubs: ['router-link', 'router-view'],
            })

            await wrapper.find('#username').setValue('test');
            await wrapper.find('#email').setValue('test@test.fr');
            let emailError = null

            //empty password
            await wrapper.find('#password').setValue('');
            await wrapper.find('form').trigger('submit.prevent');
            emailError = wrapper.find('#password-error');
            expect(emailError.exists()).toBe(true);

            //no upper password
            await wrapper.find('#password').setValue('sqdfgre8_');
            await wrapper.find('form').trigger('submit.prevent');
            emailError = wrapper.find('#password-error');
            expect(emailError.exists()).toBe(true);

            //less than 8 char password
            await wrapper.find('#password').setValue('Aqdf8_');
            await wrapper.find('form').trigger('submit.prevent');
            emailError = wrapper.find('#password-error');
            expect(emailError.exists()).toBe(true);

            //no special char password
            await wrapper.find('#password').setValue('Sqdfgre844');
            await wrapper.find('form').trigger('submit.prevent');
            emailError = wrapper.find('#password-error');
            expect(emailError.exists()).toBe(true);
        })
    })

    describe('form', () => {
        it('shouldn\'t show error if valid and should show success message and emit createUser event', async () => {
            const wrapper = shallowMount(UserCreationForm, {
                i18n,
                localVue,
                store: CREATE_CONTRACT_STORE,
                stubs: ['router-link', 'router-view'],
                propsData: {
                    users: [
                        {id: 0},
                    ]
                },
                mocks: {
                    userService : {
                        create(name, email, password, appRole, enabled, createContract, then, error) {
                            then({
                                // user
                            })
                        }
                    }
                }
            })

            await wrapper.find('#username').setValue('test');
            await wrapper.find('#email').setValue('test@test.fr');
            await wrapper.find('#password').setValue('Sqdfg_re844');
            await wrapper.find('#role-select').setValue('USER');
            await wrapper.find('form').trigger('submit.prevent');

            const nameError = wrapper.find('#username-error');
            const passwordError = wrapper.find('#password-error');
            const emailError = wrapper.find('#email-error');
            const statusError = wrapper.find('#status-error');

            expect(nameError.exists()).toBe(false);
            expect(passwordError.exists()).toBe(false);
            expect(statusError.exists()).toBe(false);
            expect(emailError.exists()).toBe(false);

            expect(wrapper.find('#form-error').exists()).toBe(false);
            expect(wrapper.find('#form-success').exists()).toBe(true);
            expect(wrapper.emitted()).toHaveProperty('createUser')
        })

        it('should show error server response is error', async () => {
            const wrapper = shallowMount(UserCreationForm, {
                i18n,
                localVue,
                store: CREATE_CONTRACT_STORE,
                stubs: ['router-link', 'router-view'],
                propsData: {
                    users: [
                        {id: 0},
                    ]
                },
                mocks: {
                    userService : {
                        create(name, email, password, appRole, enabled, createContract, then, error) {
                            error({
                                response: {
                                    data: {
                                        //error
                                    }
                                }
                            })
                        }
                    }
                }
            })

            await wrapper.find('#username').setValue('test');
            await wrapper.find('#email').setValue('test@test.fr');
            await wrapper.find('#password').setValue('Sqdfg_re844');
            await wrapper.find('#role-select').setValue('USER');
            await wrapper.find('form').trigger('submit.prevent');

            const nameError = wrapper.find('#username-error');
            const passwordError = wrapper.find('#password-error');
            const emailError = wrapper.find('#email-error');
            const statusError = wrapper.find('#status-error');

            expect(nameError.exists()).toBe(false);
            expect(passwordError.exists()).toBe(false);
            expect(statusError.exists()).toBe(false);
            expect(emailError.exists()).toBe(false);

            expect(wrapper.find('#form-error').exists()).toBe(true);
            expect(wrapper.find('#form-success').exists()).toBe(false);
        })
    })
})
