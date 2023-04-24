import Home from "@/views/Home";
import Login from "@/views/Login";
import Logout from "@/views/Logout";
import Forbidden from "@/views/Errors/Forbidden";
import UserDetail from "@/views/User/UserDetail";
import ContractDetail from "@/views/Contract/ContractDetail";
import ProjectDetail from "@/views/Project/ProjectDetail";
import AuditLaunch from "@/views/AuditLaunch/AuditLaunch";
import AuditDetail from "@/views/AuditDetail/AuditDetail";
import AuditHistory from "@/views/AuditHistory";
import PageDetail from "@/views/PageDetail/PageDetail";
import Admin from "@/views/Admin/Admin";
import Archives from "@/views/Archives/Archives";
import ResetPassword from "@/views/ResetPassword";
import ForgotPassword from "@/views/ForgotPassword";
import NotFound from "@/views/Errors/NotFound";
import ExternalModule from "@/views/ExternalModule";

import SourceCodePage from "@/views/PageDetail/SourceCodePage";

export default [
    {
        path: '/',
        name: 'Home',
        component: Home
    },{
        path: '/login',
        name: 'Login',
        component: Login
    },{
        path: '/logout',
        name: 'Logout',
        component: Logout,
        meta :{
            requireAuthentication : true
        }
    },{
        path: '/forbidden',
        name: 'Forbidden',
        component: Forbidden
    },{
        path: '/users/:id',
        name: 'UserDetail',
        component: UserDetail,
        meta :{
            requireAuthentication : true,
            requirePaidAccount : true
        }
    },{
        path: '/contracts/:id',
        name: 'ContractDetail',
        component: ContractDetail,
        meta :{
            requireAuthentication : true,
            requirePaidAccount : true
        }
    },{
        path: '/projects/:id',
        name: 'ProjectDetail',
        component: ProjectDetail,
        meta :{
            requireAuthentication : true,
            requirePaidAccount : true
        }
    },{
        path: '/projects/:id/audit',
        name: 'AuditLaunch',
        component: AuditLaunch,
        meta :{
            requireAuthentication : true
        }
    },{
        path: '/audits/:id/:sharecode?',
        name: 'AuditDetail',
        component: AuditDetail,
        meta :{
            requireAuthentication : false
        }
    },{
        path: '/audits/:auditId/pages/:pageId/history',
        name: 'AuditHistory',
        component: AuditHistory,
        meta :{
            requireAuthentication : true
        }
    },{
        path: '/audits/:auditId/pages/:pageId/:sharecode?',
        name: 'PageDetail',
        component: PageDetail,
    },
    
    {
        path: '/audits/:auditId/sourceCode/pages/:pageId/:sharecode?',
        name: 'SourceCodePage',
        component: SourceCodePage,
    },
    
    {
        path: '/administration',
        name: 'Admin',
        component: Admin,
        meta :{
            requireAuthentication : true,
            requirePaidAccount : true
        }
    },{
        path: '/projects/:id/archives',
        name: 'Archives',
        component: Archives,
        meta :{
            requireAuthentication : true,
        }
    },{
        path: '/reset-password/:userId/:token',
        name: 'ResetPassword',
        component: ResetPassword,
    },{
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
    },{
        path: '/external-module/:name',
        name: 'ExternalModule',
        component: ExternalModule,
    },{
        path: "/404",
        name: 'NotFound',
        component: NotFound
    },{
        // catch all 404 - define at the very end
        path: '*',
        redirect: '/404'
    }
]
