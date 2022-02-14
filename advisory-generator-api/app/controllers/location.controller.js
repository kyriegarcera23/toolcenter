const db = require("../models");
const { Location,Client,Site } = db;
const Op = db.Sequelize.Op;
const event = require("../services/event.service");
const objectKeystoLowerCase = require("../services/lowerCaseObject.service");

exports.fetchLocations = (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 1000000;
    const offset = req.query.page ? parseInt(req.query.page) : 0;
    const search = req.query.search ? req.query.search : '';

    Location.findAndCountAll(
        {
            where: {
                [Op.or]: [
                    {
                        name: {[Op.like]: `%${search}%`}    
                    },
                    {
                        description: {[Op.like]: `%${search}%`}
                    } 
                ]            
            },
            include: [
                {model: Client},
                {model: Site}
            ],
            offset: offset,
            limit: limit
        }
    )
    .then(async data => {
        data = JSON.stringify(data);data = JSON.parse(data); // this line help us to make real JSON object
        for(let i in data.rows) //rearrange the objects
        {
            data.rows[i].site = data.rows[i].Sites;
            delete data.rows[i].Sites
            objectKeystoLowerCase(data.rows[i]);
        }
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
}

exports.fetchSpecLocation = async (req, res) => {
    const location = await Location.findOne(
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
        res.status(200).send(data || {});
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
}

exports.addLocation = (req, res) => {
    Location.create(req.body)
    .then(result => {
        res.status(201).send(result);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    })
}

exports.updateLocation = (req, res) => {
    Location.update(req.body, {where: {id: req.params.id}})
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

exports.deleteLocations = (req, res) => {
    const ids = req.body.ids ? req.body.ids : []; //will accept arrays
    console.log(ids);
    Location.destroy({where: {id: {[Op.in]:ids}}})
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
    res.status(200).send({message: 'Data(s) has been deleted now'});
}

exports.deleteSpecLocation = (req, res) => {
    Location.destroy({where: {id: req.params.id}})
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
    res.status(200).send({message: 'Data has been deleted now'});
}