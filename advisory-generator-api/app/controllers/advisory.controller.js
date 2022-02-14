const db = require("../models");
const { Advisory,AdvisoryBatch,Client,Recipient,Location,Site,Area } = db;
const Op = db.Sequelize.Op;
const nodemail = require("../services/mail.service");
const event = require("../services/event.service");
const user = require("../services/user.service");
const advisoryValidation = require("../services/advisoryValidation.service");
const objectKeystoLowerCase = require("../services/lowerCaseObject.service");

exports.fetchCompletedAdvisories = async (req, res) => {
    const category = req.params.category ? req.params.category : '';
    
    //get the client ids of user requestor for filtering items
    const decoded = res.locals.decoded;
    const requestor = await user(decoded.id);
    const client_ids = []
    requestor.User.UserClients.map((user_client) => {
        client_ids.push(user_client.client_id);
    });
    //end

    AdvisoryBatch.findAll({
        where: {
           is_completed: 1,
           category: {[Op.like]: `%${category}%`}
        },
        include: [
            {
                model: Advisory,
                include: [{model: Location},{model: Site}],
                where: {
                    status: {[Op.not]: 0}
                }
            },
            {
                model: Client,
                include: [{model: Recipient}],
                where : {
                    [Op.or]: [
                        {
                            id: {[Op.in]: client_ids}
                        }
                    ]
                }
            }
        ]
    })
    .then(async data => {
        data = JSON.stringify(data);data = JSON.parse(data); // this line help us to make real JSON object
        for(let i in data) //rearrange the objects
        {
            data[i].User = await user(data[i].created_by);
            data[i].User = data[i].User.User;
            data[i].created_by = data[i].User.name;
            data[i].Advisory.advisory_data = JSON.parse(data[i].Advisory.advisory_data);
            data[i].Advisory.header = JSON.parse(data[i].Advisory.header);
            data[i].Advisory.areas = JSON.parse(data[i].Advisory.areas);
            data[i].Advisory.location = data[i].Advisory.Locations;
            data[i].Advisory.site = data[i].Advisory.Sites;
            objectKeystoLowerCase(data[i].Advisory);
            objectKeystoLowerCase(data[i]);
        }

        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while fetching the Roles."
        });
    });
}

exports.fetchAdvisories = async (req, res) => {
    const category = req.params.category ? req.params.category : '';
    
    //get the client ids of user requestor for filtering items
    const decoded = res.locals.decoded;
    const requestor = await user(decoded.id);
    const client_ids = []
    requestor.User.UserClients.map((user_client) => {
        client_ids.push(user_client.client_id);
    });
    //end

    Advisory.findAll(
        {
            where: {
                status: {[Op.not]: 0}
            },
            include: [
                {model:Location},
                {model:Site},
                {
                    model: AdvisoryBatch,
                    where: {
                        status: {[Op.not]: 0},
                        category: {[Op.like]: `%${category}%`},
                        is_completed: 0
                    },
                    include: [
                        {
                            model: Client,
                            include: [{model: Recipient}],
                            where : {
                                [Op.or]: [
                                    {
                                        id: {[Op.in]: client_ids}
                                    }
                                ]
                            }
                        }
                    ]
                }
            ]
        }
    )
    .then(async data => {
        data = JSON.stringify(data);data = JSON.parse(data); // this line help us to make real JSON object
        const result = [];
        for(let i in data) //rearrange the objects
        {
            result[i] = data[i].AdvisoryBatch;
            delete data[i].AdvisoryBatch;
            result[i].advisory = data[i];
            result[i].advisory.header = JSON.parse(result[i].advisory.header);
            result[i].advisory.areas = JSON.parse(result[i].advisory.areas);
            result[i].advisory.advisory_data = JSON.parse(result[i].advisory.advisory_data);
            result[i].advisory.location = data[i].Location;
            result[i].advisory.site = data[i].Site;
            delete data[i].Location;
            delete data[i].Site;
            objectKeystoLowerCase(result[i]);
        }

        res.status(200).send(result);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while fetching the Roles."
        });
    });
}

exports.fetchPendingAdvisories = async (req, res) => {
    const category = req.params.category == 'all' ? '' : req.params.category;

    //get the client ids of user requestor for filtering items
    const decoded = res.locals.decoded;
    const requestor = await user(decoded.id);
    const client_ids = []
    requestor.User.UserClients.map((user_client) => {
        client_ids.push(user_client.client_id);
    });
    //end

    Advisory.findAll(
        {
            where: {
                status: 1
            },
            include: [
                {model: Location},
                {model: Site},
                {
                    model: AdvisoryBatch,
                    where: {
                        status: {[Op.not]: 0},
                        category: {[Op.like]: `%${category}%`},
                        is_completed: 0
                    },
                    include: [
                        {
                            model: Client,
                            include: [{model: Recipient}],
                            where : {
                                [Op.or]: [
                                    {
                                        id: {[Op.in]: client_ids}
                                    }
                                ]
                            }
                        }
                    ]
                }
            ]
        }
    )
    .then(async data => {
        data = JSON.stringify(data);data = JSON.parse(data); // this line help us to make real JSON object
        for(let i in data) //rearrange the objects
        {
            data[i].User = await user(data[i].created_by);
            data[i].User = data[i].User.User;
            data[i].created_by = data[i].User.name;
            data[i].advisory_data = JSON.parse(data[i].advisory_data);
            data[i].header = JSON.parse(data[i].header);
            data[i].areas = JSON.parse(data[i].areas);
            objectKeystoLowerCase(data[i]);
        }

        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while fetching the Roles."
        });
    });
}

exports.initialAdvisories = async (req, res) => {
    const auth = res.locals.decoded;
    req.body.header = JSON.stringify(req.body.header);
    req.body.advisory_data = JSON.stringify(req.body.advisory_data);
    req.body.areas = JSON.stringify(req.body.areas);
    req.body.status = 1;
    req.body.created_by = auth.id;

    const validation = advisoryValidation(req);

    if(validation.is_error == false)
    {
        const advisory = await Advisory.create(req.body)
        .then(data => {
            return data;
        })
        .catch(err => {
            res.status(500).send({message: err.message});
        })

        const input = {
            category: advisory.category,
            is_completed: 0,
            latest_advisory_id: advisory.id,
            created_by: auth.id,
            started_at: JSON.parse(advisory.advisory_data).schedule.start,
            status: 1,
            client_id: req.body.client_id
        }

        AdvisoryBatch.create(input)
        .then(data => {
            Advisory.update({batch_id: data.id}, {where: {id: advisory.id}})
            .catch(err => {
                res.status(500).send({message: err.message});    
            })

            event({
                subject: 'initial:advisory:advisory-generator',
                metadata: data,
                user_id: auth.id
            });

            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({message: err.message});
        })
    }
    else
    {
        res.status(validation.status_code).send({message: 'Please fill out the required fields.'});
    }
}

exports.completeAdvisories = async (req, res) => {
    const auth = res.locals.decoded;
    req.body.header = JSON.stringify(req.body.header);
    req.body.advisory_data = JSON.stringify(req.body.advisory_data);
    req.body.areas = JSON.stringify(req.body.areas);
    req.body.status = 1;
    req.body.created_by = auth.id;

    const validation = advisoryValidation(req);
    
    const advisory = await Advisory.create(req.body)
    .then(data => {
        event({
            subject: 'complete:advisory:advisory-generator',
            metadata: data,
            user_id: auth.id
        });
        return data;
    })
    .catch(err => {
        res.status(500).send({message: err.message});
    })

    AdvisoryBatch.update({latest_advisory_id: advisory.id, status: 1}, {where: {id: req.body.batch_id}})
    .catch(err => {
        res.status(500).send({message: err.message});
    })

    res.status(200).send({message: 'Completion Notification has been queued for approval'});
    
}

exports.cancelAdvisories = async (req, res) => {
    const auth = res.locals.decoded;
    req.body.header = JSON.stringify(req.body.header);
    req.body.advisory_data = JSON.stringify(req.body.advisory_data);
    req.body.areas = JSON.stringify(req.body.areas);
    req.body.status = 1;
    req.body.created_by = auth.id;

    const validation = advisoryValidation(req);

    if(validation.is_error == false)
    {
        const advisory = await Advisory.create(req.body)
        .then(data => {
            event({
                subject: 'cancel:advisory:advisory-generator',
                metadata: data,
                user_id: auth.id
            });
            return data;
        })
        .catch(err => {
            res.status(500).send({message: err.message});
        })

        AdvisoryBatch.update({latest_advisory_id: advisory.id, status: 1}, {where: {id: req.body.batch_id}})
        .catch(err => {
            res.status(500).send({message: err.message});
        })

        res.status(200).send({message: 'Advisory has been queued for approval'});
    }
    else
    {
        res.status(validation.status_code).send({message: 'Please fill out the required fields.'});
    }
}

exports.updateAdvisories = async (req, res) => {
    const auth = res.locals.decoded;
    req.body.header = JSON.stringify(req.body.header);
    req.body.advisory_data = JSON.stringify(req.body.advisory_data);
    req.body.areas = JSON.stringify(req.body.areas);
    req.body.status = 1;
    req.body.created_by = auth.id;
    req.body.batch_id = req.params.batch_id;

    const validation = advisoryValidation(req);

    const advisory = await Advisory.create(req.body)
    .then(data => {
        event({
            subject: 'update:advisory:advisory-generator',
            metadata: data,
            user_id: auth.id
        });
        return data;
    })
    .catch(err => {
        res.status(500).send({message: err.message});
    })

    AdvisoryBatch.update({latest_advisory_id: advisory.id, status: 1}, {where: {id: req.body.batch_id}})
    .catch(err => {
        res.status(500).send({message: err.message});
    })

    res.status(200).send({message: 'Advisory has been queued for approval'});
}

exports.approveAdvisories = async (req, res) => {
    const validation = {
        is_error: false,
        errors: [],
        status_code: 400,
    };

    const auth = res.locals.decoded;

    if(!req.body.base64_string_image)
    {
        validation.is_error = true;
        validation.errors.push({base64_string_image:'Invalid Input.'});
    }

    if(!req.body.id)
    {
        validation.is_error = true;
        validation.errors.push({id:'Invalid Input.'});
    }

    if(!req.body.action)
    {
        validation.is_error = true;
        validation.errors.push({action:'Invalid Input.'});
    }

    if(validation.is_error == false)
    {   
        const input = {
            status: req.body.action == 'approved' ? 2 : 0,
            [`${req.body.action}_by`]: auth.id,
            [`${req.body.action}_at`]: new Date()
        }

        Advisory.update(input,{where: {id: req.body.id}})
        .catch(err => {
            res.status(500).send({message: err.message});
        });

        const advisory = await Advisory.findOne(
            {
                where: {id: req.body.id},
                include: [
                    {
                        model: AdvisoryBatch,
                        include: [
                            {
                                model: Client,
                                include: [{model: Recipient}]
                            }
                        ]
                    }
                ]
            }
        )
        .then(async data => {
            data = JSON.stringify(data);data = JSON.parse(data); // this line help us to make real JSON object
            data.header = JSON.parse(data.header);
            data.user = await user(data.AdvisoryBatch.created_by);
            data.user = data.user.User;
            return data;
        })
        .catch(err => {
            res.status(500).send({message: err.message});
        });

        //send email/or reject and update some object and fields
        const input_advisory_batch = {};
        if(req.body.action != 'rejected')
        {
            if(advisory.type == 'completion')
            {
                input_advisory_batch.status = 2;
                input_advisory_batch.is_completed = 1;
                input_advisory_batch.completed_at = new Date();
            }
            else
            {
                input_advisory_batch.status = 2;
            }
            
            const email_subject = `[MICTS][${advisory.AdvisoryBatch.Client.name}][${advisory.header.a}] ${advisory.header.b}`;
            const email_data = {
                remarks: email_subject,
                base64_string_image: req.body.base64_string_image
            };

            nodemail(advisory.user.email, email_subject, '', 'advisory.email', email_data);
        }
        else
        {
            input_advisory_batch.status = 3;

            const email_subject = `**REJECTED - [MICTS][${advisory.AdvisoryBatch.Client.name}][${advisory.header.a}] ${advisory.header.b}`;
            const email_data = {
                recipient_name: advisory.user.name,
                remarks: email_subject,
                base64_string_image: req.body.base64_string_image
            };

            nodemail(advisory.user.email, email_subject, '', 'advisory-rejected.email', email_data);
        }

        //lastly updated the Advisory Batch
        AdvisoryBatch.update(input_advisory_batch,{where: {latest_advisory_id: req.body.id}})       
        .catch(err => {
            res.status(500).send({message: err.message});
        });

        res.status(200).send({message: `Advisory has been ${req.body.action} now.`});

        event({
            subject: 'approve:advisory:advisory-generator',
            metadata: {
                action: req.body.action,
                id: req.body.id
            },
            user_id: auth.id
        });
    }
    else
    {
        res.status(validation.status_code).send(validation.errors);
    }
}