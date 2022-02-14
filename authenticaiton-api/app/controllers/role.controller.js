const jwt = require("jsonwebtoken");
const db = require("../models");
const {Permission,RolePermission,Role} = db;
const Op = db.Sequelize.Op;

exports.fetchRoles = (req, res) => {
    Role.findAll(
        {
            include: [
                {
                    model: RolePermission,
                    include: [{model: Permission}]
                }
            ]
        }
    )
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while fetching the Roles."
        });
    });
};

exports.fetchSpecRole = (req, res) => {
    Role.findOne(
        {
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: RolePermission,
                    include: [{model: Permission}]
                }
            ]
        }
    )
    .then(data => {
        res.status(200).send(data || {});
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while fetching the Role."
        });
    });
};

exports.addRole = (req, res) => {
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
        const role = {
            name: req.body.name,
            description: req.body.description
        }
    
        // Save User in the database
        Role.create(role)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Role."
            });
        });
    }
    else
    {
        res.status(validation.status_code).send(validation.errors);
    }
};

exports.updateRole = (req, res) => {
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
        const role = {
            name: req.body.name,
            description: req.body.description
        };
    
        Role.update(role,
            {
                where: {
                    id: req.params.id
                }
            }
        )
        .then(data => {
            if(data[0] !== 0)
            {
                Role.findOne({
                    where: {
                        id: req.params.id
                    }
                })
                .then(result => {
                    res.status(200).send(result);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while updating the Role."
                    });
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while updating the Role."
            });
        });
    }
    else
    {
        res.status(validation.status_code).send(validation.errors);
    }
};

exports.deleteRole = (req, res) => {
    Role.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(result => {
        res.send({message: 'Role successfully deleted.'});
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while deleting the role."
        });
    });
};

exports.updateRolePermission = async (req,res) => {
    const validation = {
        is_error: false,
        errors: [],
        status_code: 400,
    };

    const permission_ids = req.body.permission_ids ? req.body.permission_ids : [];

    if(!req.body.role_id)
    {
        validation.is_error = true;
        validation.errors.push({role_id: 'Invalid Input'});
    }

    if(validation.is_error == false)
    {
        await RolePermission.destroy({where: {role_id: req.body.role_id}})
        await permission_ids.map((permission_id) => {
            RolePermission.create({role_id: req.body.role_id, permission_id: permission_id})
        });
        
        res.status(200).send({message: 'Role has been updated.'});
    }
    else
    {
        res.status(validation.status_code).send(validation.errors);
    }
}