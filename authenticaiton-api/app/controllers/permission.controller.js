const jwt = require("jsonwebtoken");
const db = require("../models");
const {Permission,RolePermission,Role} = db;
const Op = db.Sequelize.Op;

exports.fetchPermissions = (req, res) => {
    Permission.findAll(
        {
            include: [
                {
                    model: RolePermission,
                    include: [{model: Role}]
                }
            ]
        }
    )
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    });
};

exports.fetchSpecPermission = (req, res) => {
    Permission.findOne(
        {
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: RolePermission,
                    include: [{model: Role}]
                }
            ]
        }
    )
    .then(data => {
        res.status(200).send(data || {});
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    });
};

exports.addPermission = (req, res) => {
    const validation = {
        is_error: false,
        errors: [],
        status_code: 400,
    };

    if (!req.body.name) {
        validation.is_error = true;
        validation.errors.push({name: 'Invalid Input'})
    }

    if (!req.body.description) {
        validation.is_error = true;
        validation.errors.push({description: 'Invalid Input'})
    }

    if (validation.is_error == false)
    {
        const permission = {
            role_id: req.body.role_id,
            name: req.body.name,
            description: req.body.description
        }
    
        // Save User in the database
        Permission.create(permission)
        .then(data => {
            RolePermission.create({role_id:req.body.role_id,permission_id:data.id})
            .then(result => {
                res.status(201).send(result);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the User."
                });
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
        });
    }
    else
    {
        res.status(validation.status_code).send(validation.errors);
    }
    
};

exports.updatePermission = (req, res) => {
    const validation = {
        is_error: false,
        errors: [],
        status_code: 400,
    };

    if (!req.body.name) {
        validation.is_error = true;
        validation.errors.push({name: 'Invalid Input'})
    }

    if (!req.body.description) {
        validation.is_error = true;
        validation.errors.push({description: 'Invalid Input'})
    }

    const permission = {
        name: req.body.name,
        description: req.body.description
    };

    if (validation.is_error == false)
    {
        Permission.update(permission,
            {
                where: {
                    id: req.params.id
                }
            }
        )
        .then(data => {
            if(data[0] !== 0)
            {
                Permission.findOne({
                    where: {
                        id: req.params.id
                    }
                })
                .then(result => {
                    res.status(200).send(result);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the User."
                    });
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
        });
    }
    else
    {
        res.status(validation.status_code).send(validation.errors);
    }
};

exports.deletePermission = (req, res) => {

    Permission.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(result => {
        
        RolePermission.destroy({where:{permission_id: req.params.id}})
        .catch(err => {
            res.status(500).send({
                message: err.message
            });    
        })

        res.send({message: 'Permission successfully deleted.'});
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

