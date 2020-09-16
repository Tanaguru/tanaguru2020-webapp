// Here you can add different url that will be used to create button to external modulesz
/*
{
        name : 'default name',
        isInternal: true, // This decide if the application should use router-link or link tag
        i18n: {
            en: '',
            fr: '',
            es: ''
        }, // Optional if no i18n or local not found, the app will use the name attribute for the link's text
        url : 'http://url.com',
        showOffline: true,
        showOnline: true,
        requiredAuthorities: ['SHOW_USER'] // Optional
}

 */
const NAVBAR_LINKS = [
    {
        name: 'page.dashboard',
        isInternal: true,
        url: '/',
        showOffline: false,
        showOnline: true,
    },
    {
        name: 'title.administration',
        isInternal: true,
        url: '/administration',
        showOffline: false,
        showOnline: true,
    },
    {
        name: 'action.login',
        isInternal: true,
        url: '/login',
        showOffline: true,
        showOnline: false
    }
];