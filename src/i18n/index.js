import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
    en : require('./locales/en.json'),
    fr : require('./locales/fr.json'),
}

const i18n = new VueI18n({
    locale: 'en',
    silentFallbackWarn: true,
    silentTranslationWarn: true,
    messages
})

export default i18n;
