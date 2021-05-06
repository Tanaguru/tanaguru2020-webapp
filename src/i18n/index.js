import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
    en : {
        'action' : require('./locales/en/action.json'),
        'archives' : require('./locales/en/archives.json'),
        'audit' : require('./locales/en/audit.json'),
        'auditDetail' : require('./locales/en/auditDetail.json'),
        'chart' : require('./locales/en/chart.json'),
        'contract' : require('./locales/en/contract.json'),
        'contracts' : require('./locales/en/contracts.json'),
        'dashboard' : require('./locales/en/dashboard.json'),
        'deletionModal' : require('./locales/en/deletionModal.json'),
        'entity' : require('./locales/en/entity.json'),
        'error' : require('./locales/en/error.json'),
        'form' : require('./locales/en/form.json'),
        'global' : require('./locales/en/global.json'),
        'history' : require('./locales/en/history.json'),
        'home' : require('./locales/en/home.json'),
        'login' : require('./locales/en/login.json'),
        'menu' : require('./locales/en/menu.json'),
        'page' : require('./locales/en/page.json'),
        'pagination' : require('./locales/en/pagination.json'),
        'project' : require('./locales/en/project.json'),
        'references' : require('./locales/en/references.json'),
        'resultAudit' : require('./locales/en/resultAudit.json'),
        'title' : require('./locales/en/title.json'),
        'user' : require('./locales/en/user.json'),
        'users' : require('./locales/en/users.json'),
        'statistics' : require('./locales/en/statistics.json')
    },
    fr : {
        'action' : require('./locales/fr/action.json'),
        'archives' : require('./locales/fr/archives.json'),
        'audit' : require('./locales/fr/audit.json'),
        'auditDetail' : require('./locales/fr/auditDetail.json'),
        'chart' : require('./locales/fr/chart.json'),
        'contract' : require('./locales/fr/contract.json'),
        'contracts' : require('./locales/fr/contracts.json'),
        'dashboard' : require('./locales/fr/dashboard.json'),
        'deletionModal' : require('./locales/fr/deletionModal.json'),
        'entity' : require('./locales/fr/entity.json'),
        'error' : require('./locales/fr/error.json'),
        'form' : require('./locales/fr/form.json'),
        'global' : require('./locales/fr/global.json'),
        'history' : require('./locales/fr/history.json'),
        'home' : require('./locales/fr/home.json'),
        'login' : require('./locales/fr/login.json'),
        'menu' : require('./locales/fr/menu.json'),
        'page' : require('./locales/fr/page.json'),
        'pagination' : require('./locales/fr/pagination.json'),
        'project' : require('./locales/fr/project.json'),
        'references' : require('./locales/fr/references.json'),
        'resultAudit' : require('./locales/fr/resultAudit.json'),
        'title' : require('./locales/fr/title.json'),
        'user' : require('./locales/fr/user.json'),
        'users' : require('./locales/fr/users.json'),
        'statistics' : require('./locales/fr/statistics.json')

    }
}

const i18n = new VueI18n({
    locale: "en",
    silentFallbackWarn: true,
    silentTranslationWarn: true,
    messages
})

export default i18n;
