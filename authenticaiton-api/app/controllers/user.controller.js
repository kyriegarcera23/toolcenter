const jwt = require("jsonwebtoken");
const path = require("path");
const db = require("../models");
const {User,Role,Permission,UserRole,RolePermission,UserPermission,UserClient} = db;
const Op = db.Sequelize.Op;
const Encrypter = require("../services/password_hash.service");
const generetedPass = require("../services/password_generate.service");
const nodemail = require("../services/mail.service");
const event = require("../services/event.service");
const ldap_auth = require("../services/ldap_auth.service");
const encrypter = new Encrypter(process.env.SECRET_KEY);
const moment = require("moment");

exports.register = async (req, res) => {
    const validation = {
        is_error: false,
        errors: [],
        status_code: 400,
    };

    const client_ids = req.body.client_ids ? req.body.client_ids : [];
    const user_permission_ids = req.body.user_permission_ids ? req.body.user_permission_ids : [];

    if (!(typeof req.body === 'object' && req.body !== null))
    {
        res.status(400).send({message: 'Invalid Request'});
    }

    // Validate request
    if (!req.body.name) {
        validation.is_error = true;
        validation.errors.push({name: 'Invalid Input'})
    }

    if (!req.body.email) {
        validation.is_error = true;
        validation.errors.push({email: 'Invalid Input'})
    }
    else
    {
        if (!validateEmail(req.body.email))
        {
            validation.is_error = true;
            validation.errors.push({email: 'Email is invalid.'});
        }
    }

    if (!req.body.role_id) {
        validation.is_error = true;
        validation.errors.push({role_id: 'Invalid Input'})
    }

    if (client_ids.length == 0) {
        validation.is_error = true;
        validation.errors.push({client_id: 'Invalid Input'})
    }

    const user = await User.findOne({
        where : {email: req.body.email}
    })
    .then(data => {
        // console.log(data);
        return data
    });

    if(validation.is_error == false && user !== null && user.status == 1)
    {
        validation.is_error = true;
        validation.errors.push({email: 'Email is already existing.'})
    }

    if (validation.is_error == false)
    {
        // Create a User
        const clearText = generetedPass(10);
        const encrypted = encrypter.encrypt(clearText);

        if (user !== null)
        {
            if (user.status == 0)
            {
                // Update User
                User.update({status: 1, password:encrypted, name: user.name},
                    {
                        where: {
                            id: user.id
                        }
                    }
                )
                .then(result => {
                    //Send Email email_to_address, email_subject, '', email_html, email_attach
                    const email_data = {
                        name: user.name,
                        password: clearText,
                        change_password_link: `https://${process.env.SERVER_NAME}/change-password`
                    }
                    nodemail(user.email, 'Welcome to MICTS Tool Center', '', 'register.email', email_data);

                    res.status(200).send({
                        id: user.id,
                        name: user.name,
                        email: user.email
                    })
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while updating the User."
                    });
                });
            }
        }
        else
        {
            const user = {
                name: req.body.name,
                email: req.body.email,
                password: encrypted,
                email_verify_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                status: 1            
            };
        
            // Save User in the database
            User.create(user)
            .then(data => {

                // save role id
                const user_role = {
                    user_id: data.id,
                    role_id: req.body.role_id
                };

                UserRole.create(user_role)
                .catch(err => {
                    res.status(500).send({
                        message:
                        err.message || "Some error occurred while creating the User."
                    });
                });

                // save multiple or single client id
                for (i in client_ids)
                {
                    const user_client = {
                        user_id: data.id,
                        client_id: client_ids[i]
                    };
    
                    UserClient.create(user_client)
                    .catch(err => {
                        console.log(err.message);
                    });   
                }

                // save multiple or single permission id
                for (i in user_permission_ids)
                {
                    const user_permission = {
                        user_id: data.id,
                        permission_id: user_permission_ids[i]
                    };
    
                    UserPermission.create(user_permission)
                    .catch(err => {
                        console.log(err.message);
                    });   
                }

                 //Send Email email_to_address, email_subject, '', email_html, email_attach
                 const email_data = {
                    name: data.name,
                    password: clearText,
                    change_password_link: `https://${process.env.SERVER_NAME}/change-password`
                }
                nodemail(data.email, 'Welcome to MICTS Tool Center', '', 'register.email', email_data);

                let response = {
                    id: data.id,
                    name: data.name,
                    email: data.email
                };

                res.status(200).send(response);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while creating the User."
                });
            });
        }
    }
    else
    {
        res.status(validation.status_code).send(validation.errors);
    }
};

exports.login_backup = async (req, res) => {
    const clientIp = req.headers['x-original-forwarded-for'] || req.connection.remoteAddress;
    const validation = {
        is_error: false,
        errors: [],
        status_code: 400,
    };

    if (!req.body.email) {
        validation.is_error = true;
        validation.errors.push({email: 'Invalid Input'})
    }
    else
    {
        if (!validateEmail(req.body.email))
        {
            validation.is_error = true;
            validation.errors.push({email: 'Email is invalid.'});
        }
    }

    if (!req.body.password) {
        validation.is_error = true;
        validation.errors.push({password: 'Invalid Input'})
    }

    const user = await User.findOne({
        where : {email: req.body.email}
    })
    .then(data => {
        // console.log(data);
        return data
    });
    
    if(user !== null)
    {
        const dencrypted = encrypter.dencrypt(user.password);

        if (req.body.password !== dencrypted || user.status == 0)
        {
            validation.is_error = true;
            validation.errors.push({account: 'Invalid Credentials'});
        }
    }
    else
    {
        if(validation.is_error == false)
        {
            validation.is_error = true;
            validation.errors.push({account: 'Account does not exist'})
        }
    }

    //LOGIN PROCESS
    if (validation.is_error == false)
    {
        const response = {
            id: user.id,
            name: user.name,
            email: user.email
        }
    
        const token = jwt.sign(response, process.env.SECRET_KEY, {
            expiresIn: 86400 // expires in 24 hours
        });
    
        req.session.jwt = token;
    
        User.update({api_token: token, status: 1},
            {
                where: {
                    id: user.id
                }
            }
        )

        await event({
            subject: 'login:user:auth',
            metadata: {
                id: user.id,
                name: user.name,
                email: user.email,
                ip: clientIp
            },
            user_id: user.id
        })

        res.status(200).send({message: 'Successfully Login', authenticated: true, auth_token: token});
    }
    else
    {
        res.status(validation.status_code).send(validation.errors);
    }
};

exports.login = async (req, res) => {
    const clientIp = req.headers['x-forwared-for'] || req.connection.remoteAddress;
    // const clientIp = req.headers['x-original-forwarded-for'] || req.connection.remoteAddress;

    const validation = {
        is_error: false,
        errors: [],
        status_code: 400,
    };

    //check for input validations
    if (!req.body.email) {
        validation.is_error = true;
        validation.errors.push({email: 'Invalid Input'})
    }

    if (!req.body.password) {
        validation.is_error = true;
        validation.errors.push({password: 'Invalid Input'})
    }

    req.body.email = req.body.email.replace(/toc.local/gi, "trends.com.ph");
    const user = await User.findOne({
        where : {
            [Op.or]: [
                {email: req.body.email},
                {email: {[Op.like]: `%${req.body.email}%`}}
            ]
        }
    })
    .then(data => {
        // console.log(data);
        return data
    });

    //login process check first if toolcenter pre-users
    const pre_users = [`superadministrator@app.com`,`administrator@app.com`,`user1@app.com`,`user2@app.com`,'sedonasco_user@trends.com.ph'];
    
    if(pre_users.includes(req.body.email) === true)
    {        
        if(user !== null)
        {
            const dencrypted = encrypter.dencrypt(user.password);
    
            if (req.body.password !== dencrypted || user.status == 0)
            {
                validation.is_error = true;
                validation.errors.push({account: 'Invalid Credentials',login_count: user.login_count});
            }

            if(user.login_count > 0)
            {
                const login_count = user.login_count - 1;
                User.update({login_count: login_count}, {where: {id: user.id}})
                .catch(err => {
                    res.status(500).send({message: err.message})
                })
            }
        }
        else
        {
            if(validation.is_error == false)
            {
                validation.is_error = true;
                validation.errors.push({account: 'Account does not exist'})
            }
        }
    }
    else
    {
        if(user !== null)
        {

            req.body.email = req.body.email.split('@')[0];
            const ldap = await ldap_auth(req.body.email, req.body.password);
            if(ldap.authenticated === false)
            {
                validation.is_error = true;
                validation.errors.push({account: ldap.message,login_count: user.login_count})
            }

            if(user.login_count > 0)
            {
                const login_count = user.login_count - 1;
                User.update({login_count: login_count}, {where: {id: user.id}})
                .catch(err => {
                    res.status(500).send({message: err.message})
                })
            }
        }
        else
        {
            if(validation.is_error == false)
            {
                validation.is_error = true;
                validation.errors.push({account: 'Account does not exist!'})
            }
        }
    }

    //login process once authenticated or not
    if (validation.is_error == false)
    {
        const response = {
            id: user.id,
            name: user.name,
            email: user.email
        }

        User.update({login_count: 3}, {where: {id: user.id}})
        .catch(err => {
            res.status(500).send({message: err.message})
        })
    
        const token = jwt.sign(response, process.env.SECRET_KEY, {
            expiresIn: 86400 // expires in 24 hours
        });
    
        req.session.jwt = token;
    
        User.update({api_token: token, status: 1},
            {
                where: {
                    id: user.id
                }
            }
        )

        await event({
            subject: 'login:user:auth',
            metadata: {
                id: user.id,
                name: user.name,
                email: user.email,
                ip: clientIp
            },
            user_id: user.id
        })

        res.status(200).send({message: 'Successfully Login', authenticated: true, auth_token: token});
    }
    else
    {
        res.status(validation.status_code).send(validation.errors);
    }
}

exports.logout = async (req, res) => {
    const clientIp = req.headers['x-original-forwarded-for'] || req.connection.remoteAddress;
    let auth = res.locals.decoded;
    auth.ip = clientIp;
    
    const metadata = {
        message: 'Successfully Logout',
        data: {},
        status: 200,
        authenticated: false,
        auth_token: ''
    };

    await event({
        subject: 'logout:user:auth',
        metadata: auth,
        user_id: auth.id
    })

    req.session = null;
    res.status(200).send(metadata);
};

exports.profile = async (req, res) => {
    const decoded = res.locals.decoded;
    
    UserRole.findOne({
        include: [
            {
                model: User,
                where: {
                    id: decoded.id,
                    status: {[Op.not]: 0}           
                },
                include: [
                    {
                        model:UserPermission,
                        include: [
                            {
                                model: Permission
                            }
                        ]
                    },
                    {
                        model:UserClient
                    }
                ]
            },
            {
                model: Role,
                include: [
                    {
                        model:RolePermission,
                        include: [
                            {
                                model: Permission
                            }
                        ]
                    }
                ]
            }
        ],
    })
    .then(data => {
        if(data)
        {
            // rearrange object to meets frontend requirements
            data = JSON.stringify(data);data = JSON.parse(data); // this line help us to make real JSON object
            
            data.Role.Permissions = [];
            for(let i in data.Role.RolePermissions)
            {
                data.Role.Permissions.push(data.Role.RolePermissions[i].Permission);
            }
            delete data.Role.RolePermissions;

            data.User.Permissions = [];
            for(let i in data.User.UserPermissions)
            {
                data.User.Permissions.push(data.User.UserPermissions[i].Permission);
            }
            delete data.User.UserPermissions;
            // end

            res.status(200).send({message: 'Account Exist',account: data});
        }
        else
        {
            res.status(200).send({message: 'Account does not Exist'});
        }
    })
    .catch(err => {
        res.status(500).send({message: err.message});
    })
};

exports.emailVerification = async (req, res) => {
    const user = await User.findOne({
        where : {email: req.params.email}
    })
    .then(data => {
        // console.log(data);
        return data
    });

    if(user !== null)
    {
        const user_new_data = {
            email_verify_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            status: 1
        };

        //Update User
        User.update(user_new_data,
            {
                where: {
                    id: user.id
                }
            }
        )
        .then(data => {
            if(data[0] !== 0)
            {
                User.findOne({
                    where: {
                        id: user.id
                    }
                })
                .then(result => {
                    res.status(200).send({
                        message: 'Account exist.',
                        data: {
                            email: result.email,
                            email_verify_at: result.email_verify_at,
                            status: result.status,
                            updatedAt: result.updatedAt
                        }
                    });
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while updating the User."
                    });
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while updating the User."
            });
        });
    }
    else
    {
        res.status(401).send({
            message: "Account does not exist.",
            data: {}
        });
    }
};

exports.changePassword = async (req, res) => {
    const clientIp = req.headers['x-original-forwarded-for'] || req.connection.remoteAddress;
    const validation = {
        is_error: false,
        errors: [],
        status_code: 400,
    };

    if (!req.body.email) {
        validation.is_error = true;
        validation.errors.push({email: 'Invalid Input'})
    }
    else
    {
        if (!validateEmail(req.body.email))
        {
            validation.is_error = true;
            validation.errors.push({email: 'Email is invalid.'});
        }
    }

    if (!req.body.password && req.body.force != true) {
        validation.is_error = true;
        validation.errors.push({password: 'Invalid Input'})
    }

    if (!req.body.new_password) {
        validation.is_error = true;
        validation.errors.push({new_password: 'Invalid Input'})
    }

    const user = await User.findOne({
        where : {email: req.body.email}
    })
    .then(data => {
        // console.log(data);
        return data
    });

    if(user !== null)
    {
        const dencrypted = encrypter.dencrypt(user.password);
        if (req.body.password !== dencrypted && req.body.force != true)
        {
            validation.is_error = true;
            validation.errors.push({account: 'Invalid Credentials'}); 
        }
    }
    else
    {
        validation.is_error = true;
        validation.errors.push({account: 'Account does not exist'});
    }


    if (validation.is_error == false)
    {
        const clearText = req.body.new_password;
        const encrypted = encrypter.encrypt(clearText);

        // Create Session
        const response = {
            id: user.id,
            name: user.name,
            email: user.email
        }

        const token = jwt.sign(response, process.env.SECRET_KEY, {
            expiresIn: 86400 // expires in 24 hours
        });

        req.session.jwt = token;

        User.update({password: encrypted, api_token: token},
            {
                where: {
                    id: user.id
                }
            }
        )
        .then(data => {
            if(data[0] !== 0)
            {
                User.findOne({
                    where: {
                        id: user.id
                    }
                })
                .then(async result => {
                    event({
                        subject: 'change-password:user:auth',
                        metadata: {
                            email: result.email,
                            status: result.status,
                            updatedAt: result.updatedAt,
                            api_token: result.api_token,
                            ip: clientIp
                        },
                        user_id: user.id
                    });

                    const email_data = {
                        name: result.name,
                        datetime: moment(result.updatedAt).utc().utcOffset(8).format('YYYY-MM-DD HH:mm:ss'),
                        ip_address: clientIp
                    }
                    nodemail(result.email, 'Password Changed - MICTS Tool Center', '', 'password-changed.email', email_data);

                    res.status(200).send({
                        message: "Password has been changed.",
                        data: {
                            email: result.email,
                            status: result.status,
                            updatedAt: result.updatedAt,
                            api_token: result.api_token
                        }
                    });
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while updating the User.",
                        data: {}
                    });
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while updating the User.",
                data: {}
            });
        });
    }
    else
    {
        res.status(validation.status_code).send(validation.errors);
    }   
};

exports.resetPassword = async (req, res) => {
    const validation = {
        is_error: false,
        errors: [],
        status_code: 400,
    };

    if (!req.body.email) {
        validation.is_error = true;
        validation.errors.push({email: 'Invalid Input'})
    }
    else
    {
        if (!validateEmail(req.body.email))
        {
            validation.is_error = true;
            validation.errors.push({email: 'Email is invalid.'});
        }
    }

    const user = await User.findOne({
        where : {email: req.body.email}
    })
    .then(data => {
        // console.log(data);
        return data
    });

    if (user === null && validation.is_error == false)
    {
        validation.is_error = true;
        validation.errors.push({account: 'Account does not exist'});
    }

    if (validation.is_error == false)
    {
        const response = {
            id: user.id,
            name: user.name,
            email: user.email
        }

        const token = jwt.sign(response, process.env.SECRET_KEY, {
            expiresIn: 60 * 60 // expires in 1 hour
        });
    
        req.session.jwt = token;
    
        User.update({api_token: token},
            {
                where: {
                    id: user.id
                }
            }
        )
    
        const email_data = {
            name: user.name,
            reset_password_link: `https://${process.env.SERVER_NAME}/reset-password/${user.email}/${token}`
        }
        nodemail(user.email, 'Reset Password Notification', '', 'reset-password.email', email_data);
    
        res.status(200).send({message:`Email has been sent now to ${user.email}.`, data: response});
    }
    else
    {
        res.status(validation.status_code).send(validation.errors);
    }
};

exports.resetPasswordVerfication = async (req, res) => {
    const user = await User.findOne({
        where : {email: req.params.email}
    })
    .then(data => {
        // console.log(data);
        return data
    });

    if (!req.params.api_token)
    {
        return res.status(401).send({ authenticated: false, message: 'Failed Reset Password Verification.' });
    }
    
    if (user === null)
    {
        res.status(401).send({ authenticated: false, message: 'Failed Reset Password Verification.' });
    }
    else
    {
        if (req.params.api_token != user.api_token)
        {
            return res.status(401).send({ authenticated: false, message: 'Failed Reset Password Verification.' });
        }
    }

    try {
        jwt.verify(req.params.api_token, process.env.SECRET_KEY, function(err, decoded) {
            if (err)
            {
                res.status(500).send({ authenticated: false, message: err.message || 'URL has been expired.' });
            }
        });
    } catch (err) {
        // No current action
    }

    res.status(200).send({ authentication: true, message: 'Successful reset password verification.', data: {id: user.id, name: user.name, email: user.email}});
};

exports.fetchUsers = (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 1000000;
    const offset = req.query.page ? parseInt(req.query.page) : 0;
    const search = req.query.search ? req.query.search : '';

    UserRole.findAndCountAll(
        {
            include: [
                {
                    model: User,
                    where: {
                        status: {[Op.not]: 0},
                        [Op.or]: [
                            {
                                name: {[Op.like]: `%${search}%`}    
                            },{
                                email: {[Op.like]: `%${search}%`}
                            } 
                        ]            
                    },
                    include: [
                        {
                            model:UserPermission,
                            include: [
                                {
                                    model: Permission
                                }
                            ]
                        },
                        {model:UserClient}
                    ]
                },
                {
                    model: Role,
                    include: [
                        {
                            model:RolePermission,
                            include: [
                                {
                                    model: Permission
                                }
                            ]
                        }
                    ]
                }
            ],
            offset: offset,
            limit: limit
        }
    )
    .then(data => {
        // rearrange object to meets frontend requirements
        data = JSON.stringify(data);data = JSON.parse(data); // this line help us to make real JSON object
        for(let i in data.rows)
        {
            data.rows[i].Role.Permissions = [];
            for (let j in data.rows[i].Role.RolePermissions)
            {
                data.rows[i].Role.Permissions.push(data.rows[i].Role.RolePermissions[j].Permission);
            }
            delete data.rows[i].Role.RolePermissions;

            data.rows[i].User.Permissions = [];
            for (let j in data.rows[i].User.UserPermissions)
            {
                data.rows[i].User.Permissions.push(data.rows[i].User.UserPermissions[j].Permission);
            }
            delete data.rows[i].User.UserPermissions;
        }
        // end
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

exports.fetchSpecUser = (req, res) => {
    UserRole.findOne(
        {
            include: [
                {
                    model: User,
                    where: {
                        id: req.params.id
                    },
                    include: [
                        {
                            model:UserPermission,
                            include: [
                                {
                                    model: Permission
                                }
                            ]
                        },
                        {
                            model:UserClient
                        }
                    ]
                },
                {
                    model: Role,
                    include: [
                        {
                            model:RolePermission,
                            include: [
                                {
                                    model: Permission
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    )
    .then(data => {
        if(data)
        {
            // rearrange object to meets frontend requirements
            data = JSON.stringify(data);data = JSON.parse(data); // this line help us to make real JSON object
            data.Role.Permissions = [];
            for(let i in data.Role.RolePermissions)
            {
                data.Role.Permissions.push(data.Role.RolePermissions[i].Permission);
            }
            delete data.Role.RolePermissions;

            data.User.Permissions = [];
            for(let i in data.User.UserPermissions)
            {
                data.User.Permissions.push(data.User.UserPermissions[i].Permission);
            }
            delete data.User.UserPermissions;
            // end

            res.status(200).send(data || {});
        }
        else
        {
            res.status(200).send({message: 'Account does not Exist'});
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

exports.updateUser = async (req, res) => {
    const input = {
        name: req.body.name,
        email: req.body.email
    }
    const permission_ids = req.body.permission_ids ? req.body.permission_ids : [];
    const client_ids = req.body.client_ids ? req.body.client_ids : [];


    User.update(input, {where: {id: req.params.id}})
    .then(async data => {
        if(data > 0)
        {
            //save user role
            await UserRole.update({user_id: req.params.id, role_id: req.body.role_id}, {where:{user_id:req.params.id}})

            //save user permissions
            await UserPermission.destroy({where: {user_id: req.params.id}})
            await permission_ids.map((permission_id) => {
                UserPermission.create({user_id: req.params.id, permission_id: permission_id})
            });

            //save user clients
            await UserClient.destroy({where: {user_id: req.params.id}})
            await client_ids.map((client_id) => {
                UserClient.create({user_id: req.params.id, client_id: client_id})
            });

            res.status(200).send({message:'User has been updated'});
        }
        else
        {
            res.status(400).send({message:'User not found.'});
        }
    })
    .catch(err => {
        res.status(500).send({message:err.message})
    })
};

exports.updateUserRole = (req, res) => {
    const validation = {
        is_error: false,
        errors: [],
        status_code: 400,
    };

    if(!req.body.user_id)
    {
        validation.is_error = true;
        validation.errors.push({user_id: 'Invalid Input'});
    }

    if(!req.body.role_id)
    {
        validation.is_error = true;
        validation.errors.push({role_id: 'Invalid Input'});
    }

    if(validation.is_error == false)
    {
        const input = {
            user_id: req.body.user_id,
            role_id: req.body.role_id
        }
        UserRole.update(input,{where:{user_id:req.body.user_id}})
        .then(data => {
            if(data[0] !== 0)
            {
                UserRole.findOne({
                    where:{user_id:req.body.user_id},
                    include: [
                        {model: User},
                        {model: Role},
                    ]
                })
                .then(result => {
                    res.status(200).send(result);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message
                    });
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        })
    }
    else
    {
        res.status(validation.status_code).send(validation.errors);
    }
};

exports.updateUserPermission = async (req,res) => {
    const validation = {
        is_error: false,
        errors: [],
        status_code: 400,
    };

    const permission_ids = req.body.permission_ids ? req.body.permission_ids : [];

    if(!req.body.user_id)
    {
        validation.is_error = true;
        validation.errors.push({user_id: 'Invalid Input'});
    }

    if(validation.is_error == false)
    {
        await UserPermission.destroy({where: {user_id: req.body.user_id}})
        await permission_ids.map((permission_id) => {
            UserPermission.create({user_id: req.body.user_id, permission_id: permission_id})
        });
        
        res.status(200).send({message: 'User Permissions has been updated.'});
    }
    else
    {
        res.status(validation.status_code).send(validation.errors);
    }
};

exports.updateUserClient = async (req, res) => {
    const validation = {
        is_error: false,
        errors: [],
        status_code: 400,
    };

    const client_ids = req.body.client_ids ? req.body.client_ids : [];

    if(!req.body.user_id)
    {
        validation.is_error = true;
        validation.errors.push({user_id: 'Invalid Input'});
    }

    if(validation.is_error == false)
    {
        await UserClient.destroy({where: {user_id: req.body.user_id}})
        await client_ids.map((client_id) => {
            UserClient.create({user_id: req.body.user_id, client_id: client_id})
        });
        
        res.status(200).send({message: 'User Clients has been updated.'});
    }
    else
    {
        res.status(validation.status_code).send(validation.errors);
    }
};

exports.deleteUser = (req, res) => {
    //Update User
    User.update({status: 0},
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(data => {
        res.status(200).send({
            message: `user id ${req.params.id} has been deactivated.`
        });
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while updating the User."
        });
    });
};

//CUSTOM FUNCTIONS
function validateEmail(email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}