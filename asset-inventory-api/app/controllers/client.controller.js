const db = require("../models");
const { Client, Recipient } = db;
const Op = db.Sequelize.Op;
const event = require("../services/event.service");

exports.fetchClients = (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 1000000;
    const offset = req.query.page ? parseInt(req.query.page) : 0;
    const search = req.query.search ? req.query.search : '';

    Client.findAndCountAll(
        {
            where: {
                status: {[Op.not]: 0},
                [Op.or]: [
                    {
                        name: {[Op.like]: `%${search}%`}    
                    },{
                        description: {[Op.like]: `%${search}%`}
                    } 
                ]            
            },
            include: [
                {model: Recipient}
            ],
            offset: offset,
            limit: limit
        }
    )
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
}

exports.fetchSpecClient = (req, res) => {
    Client.findOne(
        {
            where: {
                status: {[Op.not]: 0},
                id: req.params.id
            },
            include: [
                {model: Recipient}
            ]
        }
    )
    .then(data => {
        res.status(200).send(data || {});
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
}

exports.addClient = (req, res) => {
    Client.create(req.body)
    .then(result => {
        res.status(201).send(result);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    })
}

exports.updateClient = (req, res) => {
    Client.update(req.body, {where: {id: req.params.id}})
    .then(data => {
        if(data[0] !== 0)
        {
            res.status(200).send({message: 'Data has been updated.'});
        }
        else
        {
            res.status(200).send({message: 'Data has not been found.'});
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    })
}

exports.deleteClients = (req, res) => {
    const ids = req.body.ids ? req.body.ids : []; //will accept arrays

    Client.update({status:0},{where: {id: {[Op.in]:ids}}})
    .then(data => {
        if(data[0] !== 0)
        {
            res.status(200).send({message: 'Data(s) has been deleted now'});
        }
        else
        {
            res.status(200).send({message: 'Data(s) has not been found.'});
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Role."
        });
    });
}

exports.deleteSpecClient = (req, res) => {
    Client.update({status:0},{where: {id: req.params.id}})
    .then(data => {
        if(data[0] !== 0)
        {
            res.status(200).send({message: 'Data has been deleted now'});
        }
        else
        {
            res.status(200).send({message: 'Data has not been found.'});
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Role."
        });
    });
}