const db = require("../models");
const { Client, Recipient } = db;
const Op = db.Sequelize.Op;
const event = require("../services/event.service");

exports.fetchRecipients = (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = req.query.page ? parseInt(req.query.page) : 0;
    const search = req.query.search ? req.query.search : '';

    Recipient.findAndCountAll(
        {
            where: {
                [Op.or]: [
                    {
                        email: {[Op.like]: `%${search}%`}    
                    },
                    {
                        name: {[Op.like]: `%${search}%`}    
                    },
                    {
                        description: {[Op.like]: `%${search}%`}
                    } 
                ]            
            },
            include: [
                {model: Client}
            ],
            offset: offset,
            limit: limit
        }
    )
    .then(async data => {
        data = JSON.stringify(data);data = JSON.parse(data); // this line help us to make real JSON object
        for(let i in data.rows)
        {
            data.rows[i].Users = await user(data.rows[i].created_by);
        }
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
}

exports.fetchSpecRecipient = async (req, res) => {
    const recipient = await Recipient.findOne(
        {
            where: {
               id: req.params.id           
            },
            include: [
                {model: Client}
            ]
        }
    )
    .then(async data => {
        if(data){data = JSON.stringify(data);data = JSON.parse(data);data.User = await user(data.created_by);}
        res.status(200).send(data || {});
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
}

exports.addRecipient = (req, res) => {
    Recipient.create(req.body)
    .then(result => {
        res.status(201).send(result);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    })
}

exports.updateRecipient = (req, res) => {
    Recipient.update(req.body, {where: {id: req.params.id}})
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

exports.deleteRecipients = (req, res) => {
    const ids = req.body.ids ? req.body.ids : []; //will accept arrays
    console.log(ids);
    Recipient.destroy({where: {id: {[Op.in]:ids}}})
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Role."
        });
    });
    res.status(200).send({message: 'Data(s) has been deleted now'});
}

exports.deleteSpecRecipient = (req, res) => {
    Recipient.destroy({where: {id: req.params.id}})
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Role."
        });
    });
    res.status(200).send({message: 'Data has been deleted now'});
}