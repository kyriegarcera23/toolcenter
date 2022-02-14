module.exports = {
    devServer: {
        proxy: {
            '^/api/users': {
                target: 'http://localhost:8001',
                changeOrigin: true,
                secure:true,
                pathRewrite: {'^/api/users': '/api/users'},
                logLevel: 'debug'
            },
            '^/api/roles': {
                target: 'http://localhost:8001',
                changeOrigin: true,
                secure:true,
                pathRewrite: {'^/api/roles': '/api/roles'},
                logLevel: 'debug'
            },
            '^/api/permissions': {
                target: 'http://localhost:8001',
                changeOrigin: true,
                secure:true,
                pathRewrite: {'^/api/permissions': '/api/permissions'},
                logLevel: 'debug'
            },
            '^/api/assets': {
                target: 'http://localhost:8004',
                changeOrigin: true,
                secure:true,
                pathRewrite: {'^/api/assets': '/api/assets'},
                logLevel: 'debug'
            },
            '^/api/certificates': {
                target: 'http://localhost:8005',
                changeOrigin: true,
                secure:true,
                pathRewrite: {'^/api/certificates': '/api/certificates'},
                logLevel: 'debug'
            },
            '^/api/client-management': {
                target: 'http://localhost:8010',
                changeOrigin: true,
                secure:true,
                pathRewrite: {'^/api/client-management': '/api/client-management'},
                logLevel: 'debug'
            },
            '^/api/dailydigests': {
                target: 'http://localhost:8008',
                changeOrigin: true,
                secure:true,
                pathRewrite: {'^/api/dailydigests': '/api/dailydigests'},
                logLevel: 'debug'
            },
            '^/api/advisories': {
                target: 'http://localhost:8009',
                changeOrigin: true,
                secure:true,
                pathRewrite: {'^/api/advisories': '/api/advisories'},
                logLevel: 'debug'
            },
            '^/api/sharepoint': {
                target: 'http://localhost:8007',
                changeOrigin: true,
                secure:true,
                pathRewrite: {'^/api/sharepoint': '/api/sharepoint'},
                logLevel: 'debug'
            },
            '^/api/knowledgebase': {
                target: 'http://localhost:8006',
                changeOrigin: true,
                secure:true,
                pathRewrite: {'^/api/knowledgebase': '/api/knowledgebase'},
                logLevel: 'debug'
            },
            '^/api/events': {
                target: 'http://localhost:8002',
                changeOrigin: true,
                secure:true,
                pathRewrite: {'^/api/events': '/api/events'},
                logLevel: 'debug'
            }
        }
    }
}