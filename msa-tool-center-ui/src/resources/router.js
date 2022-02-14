import Login from '../components/Login';
import ForgotPass from '../components/Forgotpass';
import PageNotFound from '../components/PageNotFound';


import Main from '../components/Main';

//Main Components
import Dashboard from '../components/content/Dashboard';
// import Dashboard2 from '../components/content/Dashboard2';
import Assets from '../components/content/Assets';

//Digest
import Digests from '../components/content/Digests';
import DigestsIndex from '../components/content/digests/index';
import DigestsSoc from '../components/content/digests/soc';
import DigestsNoc from '../components/content/digests/noc';

//Advisory
import showAdvisoryGenerator from '../components/content/AdvisoryGenerator.vue'
import AdvisoryOverview from '../components/content/advisory/index.vue'
import AdvisoryCompleted from '../components/content/advisory/completed.vue'
import AdvisoryPending from '../components/content/advisory/pending.vue'

//Certificate Management
import showCertificates from '../components/content/Certificates.vue'
import CertificatesOverview from '../components/content/certificates/index.vue'
import CertificatesPending from '../components/content/certificates/pending.vue'
// import ClientsRecipients from '../components/content/certificates/clientsrecipients.vue'

//User Permission
import showUsersManagement from '../components/content/UsersPermissions.vue'

//Client Management
import ClientManagement from '../components/content/ClientManagement.vue'
import ClientManagement_Clients from '../components/content/ClientManagement_Clients.vue'
import ClientManagement_Locations from '../components/content/ClientManagement_Locations.vue'
import ClientManagement_Sites from '../components/content/ClientManagement_Sites.vue'
import ClientManagement_Areas from '../components/content/ClientManagement_Areas.vue'
import ClientManagement_Recipients from '../components/content/ClientManagement_Recipients.vue'

//SharePoint
import Sharepoint from '../components/content/Sharepoint.vue'
import SharepointApp from '../components/content/SharepointApp.vue'

//Knowedlgebase
import Knowledgebase from '../components/content/Knowledgebase.vue'

//Logs
import Logs from '../components/content/Logs.vue'

export default [

    {
        path:'/login',
        name:'login',
        component: Login,
        meta: {
            authNotRequired: true
        }
    },
    {
        path:'/forgot-password',
        name:'forgotpass',
        component: ForgotPass,
        meta: {
            authNotRequired: true
        },
    },
    {
        path:'/',
        // name:'main',
        component: Main,
        meta: {
            requiresAuth: true
        },
        children:[
            {
                path:'dashboard',
                name:'dashboard',
                component: Dashboard,
                // children: [
                //     {
                //         path:'',
                //         //name:'dashboard_search',
                //         component: Dashboard2
                //     },
                // ]
            },

            // {
            //     path:'',
            //     name:'dashboard_search',
            //     component: Dashboard2
            // },
            {
                path:'assets',
                name:'assets',
                component: Assets
            },
            {
                path:'digests',
                //name:'digests',
                component: Digests,
                children: [
                    {
                        path:'',
                        name:'index',
                        component: DigestsIndex
                    },
                    {
                        path:'soc',
                        name:'soc',
                        component: DigestsSoc
                    },
                    {
                        path:'noc',
                        name:'noc',
                        component: DigestsNoc
                    }
                ]
            },
            {
                path: '/advisory-generator',
                name: 'advisory-generator',
                component: showAdvisoryGenerator,
                meta: {
                    title: 'Advisory Generator',
                    description: 'Generate automated email reports',
                    icon: 'flag'
                },
                redirect: '/advisory-generator',
                children: [
                    {
                        path: 'completed',
                        name: 'advisory.completed',
                        components: {
                            advisoryContent: AdvisoryCompleted
                        }
                    },
                    {
                        path: 'pending',
                        name: 'advisory.pending',
                        components: {
                            advisoryContent: AdvisoryPending
                        }
                    },
                    {
                        path: '',
                        name: 'advisory.overview',
                        components: {
                            advisoryContent: AdvisoryOverview
                        }
                    }
                ],
            },
            {
                path: '/certificates',
                components: {
                    default: showCertificates,
                    pageContent: CertificatesOverview
                },
                children: [
                    {
                        path: 'pending',
                        name: 'certificates.pending',
                        components: {
                            pageContent: CertificatesPending
                        }
                    },
                    // {
                    //     path: 'clients-recipients',
                    //     name: 'certificates.clients-recipients',
                    //     components: {
                    //         pageContent: ClientsRecipients
                    //     }
                    // },
                    {
                        path: '',
                        name: 'certificates.overview',
                        components: {
                            pageContent: CertificatesOverview
                        }
                    },
                ],
                meta: {
                    title: 'Certificates',
                    description: 'View all certificate status and pending approvals',
                    icon: 'award'
                }
            },
            {
                path: '/users-management',
                name: 'users-management',
                component: showUsersManagement,
                meta: {
                    title: 'Users Management',
                    description: 'View and manage users, roles and permissions',
                    icon: 'users'
                },
            
            },
            {
                path: '/client-management',
                name: 'client-management',
                component: ClientManagement,
                meta: {
                    title: 'Client management',
                    description: '',
                    icon: 'lock'
                },
                children: [
                    {
                        path: 'clients',
                        name: 'client-management.clients',
                        components: {
                            pageContent: ClientManagement_Clients
                        }
                    },
                    {
                        path: 'locations',
                        name: 'client-management.locations',
                        components: {
                            pageContent: ClientManagement_Locations
                        }
                    },
                    {
                        path: 'sites',
                        name: 'client-management.sites',
                        components: {
                            pageContent: ClientManagement_Sites
                        }
                    },
                    {
                        path: 'areas',
                        name: 'client-management.areas',
                        components: {
                            pageContent: ClientManagement_Areas
                        }
                    },
                    {
                        path: 'recipients',
                        name: 'client-management.recipients',
                        components: {
                            pageContent: ClientManagement_Recipients
                        }
                    }
                ]
            },
            {
                path: '/sharepoint',
                name: 'sharepoint',
                component: Sharepoint,
                meta: {
                    title: 'Sharepoint',
                    description: '',
                    icon: 'lock'
                }
            },
            {
                path: '/sharepoint/app/:id',
                name: 'sharepointapp',
                component: SharepointApp,
                meta: {
                    title: 'SharepointApp',
                    description: '',
                    icon: 'lock'
                }
            },
            {
                path: '/knowledgebase',
                name: 'knowledgebase',
                component: Knowledgebase,
                meta: {
                    title: 'Knowledgebase',
                    description: '',
                    icon: 'lock'
                }
            },
            {
                path: '/logs',
                name: 'logs',
                component: Logs,
                meta: {
                    title: 'Logs',
                    description: '',
                    icon: 'lock'
                }
            }
        ]
    },
    {
        path:'/dashboard',
        name:'dashboard',
        component: Dashboard,
        meta: {
            requiresAuth: true
        }
    },
    {
        path:'*',
        name:'pagenotfound',
        component: PageNotFound
    }
]