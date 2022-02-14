const db = require("../models");
const { Site,Location } = db;
const Op = db.Sequelize.Op;
const event = require("../services/event.service");

exports.fetchSites = (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 1000000;
    const offset = req.query.page ? parseInt(req.query.page) : 0;
    const search = req.query.search ? req.query.search : '';

    Site.findAndCountAll(
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
                {model: Location}
            ],
            offset: offset,
            limit: limit
        }
    )
    .then(async data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
}

exports.fetchSpecSite = async (req, res) => {
    const site = await Site.findOne(
        {
            where: {
               id: req.params.id           
            },
            include: [
                {model: Location}
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

exports.addSite = (req, res) => {
    Site.create(req.body)
    .then(result => {
        res.status(201).send(result);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    })
}

exports.updateSite = (req, res) => {
    Site.update(req.body, {where: {id: req.params.id}})
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

exports.deleteSites = (req, res) => {
    const ids = req.body.ids ? req.body.ids : []; //will accept arrays
    console.log(ids);
    Site.destroy({where: {id: {[Op.in]:ids}}})
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
    res.status(200).send({message: 'Data(s) has been deleted now'});
}

exports.deleteSpecSite = (req, res) => {
    Site.destroy({where: {id: req.params.id}})
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
    res.status(200).send({message: 'Data has been deleted now'});
}