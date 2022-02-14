
'use strict';

const Encrypter = require("../services/password_hash.service");
const encrypter = new Encrypter('S3cr3t');
const default_password = 'password';
const encrypted = encrypter.encrypt(default_password);

// create roles
const roles = [
    {
      id: 1,
      name: 'superadministrator',
      description: 'superadministrator',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'administrator',
      description: 'administrator',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'user',
      description: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      name: 'dart',
      description: 'Data Analytics and Reporting Team',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      name: 'soc-analyst',
      description: 'Trends Operation',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 6,
      name: 'noc-analyst',
      description: 'Trends Operation',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 7,
      name: 'threat-hunting-team',
      description: 'Threat Hunting Team',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 8,
      name: 'sap',
      description: 'System and Platform',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 9,
      name: 'sap-lead',
      description: 'System and Platform Lead',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  // end
  
// create permissions
const initial_permissions = ['read', 'create', 'update', 'delete', 'export'];
let permissions = [];

initial_permissions.map((initial_permission) => {
    permissions.push({
        name: `${initial_permission}-users`,
        description: `${initial_permission} users`,
        createdAt: new Date(),
        updatedAt: new Date()
    })
});

initial_permissions.map((initial_permission) => {
    permissions.push({
        name: `${initial_permission}-roles`,
        description: `${initial_permission}-roles`,
        createdAt: new Date(),
        updatedAt: new Date()
    });
});

initial_permissions.map((initial_permission) => {
    permissions.push({
        name: `${initial_permission}-permissions`,
        description: `${initial_permission}-permissions`,
        createdAt: new Date(),
        updatedAt: new Date()
    })
});

initial_permissions.map((initial_permission) => {
    permissions.push({
        name: `${initial_permission}-assets`,
        description: `${initial_permission}-assets`,
        createdAt: new Date(),
        updatedAt: new Date()
    })
});

initial_permissions.map((initial_permission) => {
    permissions.push({
        name: `${initial_permission}-certificates`,
        description: `${initial_permission}-certificates`,
        createdAt: new Date(),
        updatedAt: new Date()
    })
});

initial_permissions.map((initial_permission) => {
    if (initial_permission == 'read')
    {
        permissions.push({
        name: `${initial_permission}-knowledgebase`,
        description: `${initial_permission}-knowledgebase`,
        createdAt: new Date(),
        updatedAt: new Date()
        })
    }
});

initial_permissions.map((initial_permission) => {
    permissions.push({
        name: `${initial_permission}-sharepoint-group`,
        description: `${initial_permission}-sharepoint-group`,
        createdAt: new Date(),
        updatedAt: new Date()
    })
});

initial_permissions.map((initial_permission) => {
    if (initial_permission == 'read' || initial_permission == 'export')
    {
        permissions.push({
        name: `${initial_permission}-logs`,
        description: `${initial_permission}-logs`,
        createdAt: new Date(),
        updatedAt: new Date()
        })
    }
});

initial_permissions.map((initial_permission) => {
    permissions.push({
        name: `${initial_permission}-client-management`,
        description: `${initial_permission}-client-management`,
        createdAt: new Date(),
        updatedAt: new Date()
    })
});

initial_permissions.map((initial_permission) => {
    if (initial_permission == 'read' || initial_permission == 'create')
    {
        permissions.push({
        name: `${initial_permission}-daily-digest`,
        description: `${initial_permission}-daily-digest`,
        createdAt: new Date(),
        updatedAt: new Date()
        })
    }
});

initial_permissions.map((initial_permission) => {
if (initial_permission == 'read' || initial_permission == 'create')
    {
        permissions.push({
            name: `${initial_permission}-advisory-generator`,
            description: `${initial_permission}-advisory-generator`,
            createdAt: new Date(),
            updatedAt: new Date()
        })
    }
});
permissions.push({
    name: `view-daily-digest-soc`,
    description: `view-daily-digest-soc`,
    createdAt: new Date(),
    updatedAt: new Date()
})
permissions.push({
    name: `view-daily-digest-noc`,
    description: `view-daily-digest-noc`,
    createdAt: new Date(),
    updatedAt: new Date()
})
permissions.push({
    name: `update-sharepoint-group-directories`,
    description: `update-sharepoint-group-directories`,
    createdAt: new Date(),
    updatedAt: new Date()
})
permissions.push({
    name: `approve-assets`,
    description: `approve-assets`,
    createdAt: new Date(),
    updatedAt: new Date()
})
permissions.push({
    name: `approve-certificates`,
    description: `approve-certificates`,
    createdAt: new Date(),
    updatedAt: new Date()
})
permissions.push({
    name: `approve-advisory-generator`,
    description: `approve-advisory-generator`,
    createdAt: new Date(),
    updatedAt: new Date()
})
permissions.push({
    name: `view-sharepoint-all-group`,
    description: `view-sharepoint-all-group`,
    createdAt: new Date(),
    updatedAt: new Date()
})
permissions.push({
    name: `view-knowledgebase-all-folder`,
    description: `view-knowledgebase-all-folder`,
    createdAt: new Date(),
    updatedAt: new Date()
})
let sharepoint_groups = ['compliance improvement',
                        'multi cloud',
                        'systems and platforms',
                        'on site support',
                        'threat hunting',
                        'contact center operations',
                        'network operations',
                        'security operations',
                        'management team',
                        'service management'];
sharepoint_groups.map((group_name,index) => {
    group_name = group_name.replace(/ /g,'-');
    permissions.push({
        name: `view-sharepoint-group-${group_name}`,
        description: `view-sharepoint-group-${group_name}`,
        createdAt: new Date(),
        updatedAt: new Date()
    })
});
sharepoint_groups.map((group_name,index) => {
    group_name = group_name.replace(/ /g,'-');
    permissions.push({
        name: `view-knowledgebase-folder-${group_name}`,
        description: `view-knowledgebase-folder-${group_name}`,
        createdAt: new Date(),
        updatedAt: new Date()
    })
});

let permissions_with_ids = []
permissions.map((permission, index) => {
    permission.id = parseInt(index+1);
    permissions_with_ids.push(permission);
});
permissions = permissions_with_ids;
// end

// create role_permissions
let role_permissions = []
let role_permission_id = 1;

for (let i in roles)
{
    for (let j in permissions)
    {
        if (roles[i].name == 'superadministrator')
        {
            role_permissions.push({
                role_id: roles[i].id,
                permission_id: permissions[j].id,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        }

        if(roles[i].name == 'administrator')
        {
            if(permissions[j].name.search("permissions") == -1 && permissions[j].name.search("roles") == -1)
            {
                role_permissions.push({
                    role_id: roles[i].id,
                    permission_id: permissions[j].id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
            }
        }
    }
}

let role_permissions_with_ids = []
role_permissions.map((role_permission, index) => {
    role_permission.id = parseInt(index+1);
    role_permissions_with_ids.push(role_permission);
});
role_permissions = role_permissions_with_ids;
// end

//   console.log(permissions);

// create users
const users = [
    {
        id: 1,
        name: 'Superadministrator',
        email: 'superadministrator@app.com',
        password: encrypted,
        remember_token: null,
        api_token: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        name: 'Administrator',
        email: 'administrator@app.com',
        password: encrypted,
        remember_token: null,
        api_token: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    }
]
// end

// create users role
const user_roles = [
    {
        id: 1,
        user_id: 1,
        role_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        user_id: 2,
        role_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
    }
]
// end

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Roles', roles);
    await queryInterface.bulkInsert('Permissions', permissions);
    await queryInterface.bulkInsert('RolePermissions', role_permissions);
    await queryInterface.bulkInsert('Users', users);
    await queryInterface.bulkInsert('UserRoles', user_roles);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', null, {});
    await queryInterface.bulkDelete('Permissions', null, {});
    await queryInterface.bulkDelete('RolePermissions', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('UserRoles', null, {});
  }
};
