const db = require("../models");
const { Area,Site } = db;
const Op = db.Sequelize.Op;
const event = require("../services/event.service");

exports.fetchAreas = (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 1000000;
    const offset = req.query.page ? parseInt(req.query.page) : 0;
    const search = req.query.search ? req.query.search : '';

    Area.findAndCountAll(
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
                {model: Site}
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

exports.fetchSpecArea = async (req, res) => {
    const area = await Area.findOne(
        {
            where: {
               id: req.params.id           
            },
            include: [
                {model: Site}
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

exports.addArea = (req, res) => {
    Area.create(req.body)
    .then(result => {
        res.status(201).send(result);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    })
}

exports.updateArea = (req, res) => {
    Area.update(req.body, {where: {id: req.params.id}})
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

exports.deleteAreas = (req, res) => {
    const ids = req.body.ids ? req.body.ids : []; //will accept arrays
    console.log(ids);
    Area.destroy({where: {id: {[Op.in]:ids}}})
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
    res.status(200).send({message: 'Data(s) has been deleted now'});
}

exports.deleteSpecArea = (req, res) => {
    Area.destroy({where: {id: req.params.id}})
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
    res.status(200).send({message: 'Data has been deleted now'});
}