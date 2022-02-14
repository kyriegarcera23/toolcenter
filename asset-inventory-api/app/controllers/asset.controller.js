const jwt = require("jsonwebtoken");
const path = require("path");
const db = require("../models");
const { Asset,AssetApplication,AssetCriticality,AssetHardware,AssetMaintenance,
AssetNetwork,AssetOwner,AssetVirtual,AssetWarranty,AssetSoftware,AssetGizmo,AssetApproval,Client,Recipient } = db;
const Op = db.Sequelize.Op;
const nodemail = require("../services/mail.service");
const event = require("../services/event.service");
const asset_create_validation = require("../services/asset_create_validation.service");
const asset_update_validation = require("../services/asset_update_validation.service");
const user = require("../services/user.service");
const users = require("../services/user_all.service");
const moment = require("moment");

exports.fetchAssets = async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 1000000;
    const offset = req.query.page ? parseInt(req.query.page) : 0;
    const asset_type = req.query.asset_type ? req.query.asset_type : '';
    const search = req.query.search ? req.query.search : '';
    const sortField = req.query.sortField ? req.query.sortField : 'createdAt';
    const sortOrder = req.query.sortOrder ? req.query.sortOrder : 'desc';

    //get the client ids of user requestor for filtering items
    const decoded = res.locals.decoded;
    const requestor = await user(decoded.id);
    const client_ids = []
    requestor.User.UserClients.map((user_client) => {
        client_ids.push(user_client.client_id);
    });
    //end


    Asset.findAndCountAll({
        where: {
            [Op.and]: [{status: 2}, {asset_type: {[Op.like]: `%${asset_type}%`}}],
            [Op.or]: [
                {
                    hostname: {[Op.like]: `%${search}%`}    
                },{
                    model: {[Op.like]: `%${search}%`},    
                },
                {
                    manufacturer: {[Op.like]: `%${search}%`},  
                },
                {
                    service_tag: {[Op.like]: `%${search}%`},  
                },
                {
                    location: {[Op.like]: `%${search}%`}
                },
                {
                    ip_address: {[Op.like]: `%${search}%`}
                },
                 
            ]            
        },
        include: [
            {model: AssetApplication},
            {model: AssetCriticality},
            {model: AssetHardware},
            {model: AssetMaintenance},
            {model: AssetNetwork},
            {model: AssetOwner},
            {model: AssetVirtual},
            {model: AssetWarranty},
            {
                model: Client,
                where : {
                    id: {[Op.in]: client_ids}
                }
            }
        ],
        offset: offset,
        limit: limit,
        order: [[sortField, sortOrder]]
    })
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
            message: err.message || "Some error occurred while fetching the Roles."
        });
    });
}

exports.fetchSpecAsset = async (req, res) => {
    Asset.findOne(
        {
            where: {
                id: req.params.id,                
                status: {[Op.not]: 0}
            },
            include: [
                {model: AssetApplication},
                {model: AssetCriticality},
                {model: AssetHardware},
                {model: AssetMaintenance},
                {model: AssetNetwork},
                {model: AssetOwner},
                {model: AssetVirtual},
                {model: AssetWarranty},
                {model: Client, include: [{model: Recipient}]}
            ]
        }
    )
    .then(async data => {
        
        if(data){data = JSON.stringify(data);data = JSON.parse(data);data.User = await user(data.created_by);}
        res.status(200).send(data || {});
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while fetching the Roles."
        });
    });
}

exports.fetchAssetSoftwares = async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 1000000;
    const offset = req.query.page ? parseInt(req.query.page) : 0;
    const search = req.query.search ? req.query.search : '';
    const sortField = req.query.sortField ? req.query.sortField : 'createdAt';
    const sortOrder = req.query.sortOrder ? req.query.sortOrder : 'desc';

    //get the client ids of user requestor for filtering items
    const decoded = res.locals.decoded;
    const requestor = await user(decoded.id);
    const client_ids = []
    requestor.User.UserClients.map((user_client) => {
        client_ids.push(user_client.client_id);
    });
    //end

    AssetSoftware.findAndCountAll(
        {
            where: {
                status: 2,
                name: {[Op.like]: `%${search}%`}
            },
            include: [
                {
                    model: Client,
                    where : {
                        id: {[Op.in]: client_ids}
                    }
                }
            ],
            offset: offset,
            limit: limit,
            order: [[sortField, sortOrder]]
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
            message: err.message || "Some error occurred while fetching the Roles."
        });
    });
}

exports.fetchSpecAssetSoftware = async (req, res) => {
    AssetSoftware.findOne(
        {
            where: {
                id: req.params.id,                
                status: {[Op.not]: 0}
            },
            include: [
                {model: Client, include: [{model: Recipient}]}
            ]
        }
    )
    .then(async data => {
        if(data){data = JSON.stringify(data);data = JSON.parse(data);data.User = await user(data.created_by);}
        res.status(200).send(data || {});
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while fetching the Roles."
        });
    });
};

exports.fetchAssetGizmos = async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 1000000;
    const offset = req.query.page ? parseInt(req.query.page) : 0;
    const search = req.query.search ? req.query.search : '';
    const sortField = req.query.sortField ? req.query.sortField : 'createdAt';
    const sortOrder = req.query.sortOrder ? req.query.sortOrder : 'desc';

    AssetGizmo.findAndCountAll(
        {
            where: {
                [Op.or]: [
                    {
                        vendor: {[Op.like]: `%${search}%`}    
                    },{
                        model_number: {[Op.like]: `%${search}%`},    
                    },
                    {
                        description: {[Op.like]: `%${search}%`},  
                    },
                    {
                        serial_number: {[Op.like]: `%${search}%`},  
                    },
                    {
                        warranty_type: {[Op.like]: `%${search}%`}
                    }  
                ]
            },
            offset: offset,
            limit: limit,
            order: [[sortField, sortOrder]]
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
}

exports.fetchSpecAssetGizmo = async (req, res) => {
    AssetGizmo.findOne(
        {
            where: {
                id: req.params.id,                
            }
        }
    )
    .then(data => {
        res.status(200).send(data || {});
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while fetching the Roles."
        });
    });
};

exports.fetchAssetApprovals = async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 1000000;
    const offset = req.query.page ? parseInt(req.query.page) : 0;
    const search = req.query.search ? req.query.search : '';
    const sortField = req.query.sortField ? req.query.sortField : 'createdAt';
    const sortOrder = req.query.sortOrder ? req.query.sortOrder : 'desc';

    //get the client ids of user requestor for filtering items
    const decoded = res.locals.decoded;
    const requestor = await user(decoded.id);
    const client_ids = []
    requestor.User.UserClients.map((user_client) => {
        client_ids.push(user_client.client_id);
    });
    //end

    AssetApproval.findAndCountAll(
        {
            where: {
                status:1,
                client_id: {[Op.in]: client_ids}
            },
            include: [{
                model: Client
            }],
            offset: offset,
            limit: limit,
            order: [[sortField, sortOrder]]
        }
    )
    .then(async data => {
        data = JSON.stringify(data);data = JSON.parse(data); // this line help us to make real JSON object
        for(let i in data.rows)
        {
            data.rows[i].Asset = JSON.parse(data.rows[i].asset);
            data.rows[i].Users = await user(JSON.parse(data.rows[i].asset).created_by);
            delete data.rows[i].asset;
        }
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while fetching the Roles."
        });
    });
}

exports.addAsset = async (req, res) => {
    // input validation
    const validation = asset_create_validation(req);
    if (validation.is_error == false)
    {
        // add record to database
        let asset = req.body.asset;
        if(asset.asset_type == 'physical' || asset.asset_type == 'virtual' || asset.asset_type == 'network')
        {
            

            let new_asset = await Asset.create(asset)
            .then(result => {
                return result
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });

            let asset_criticality = req.body.asset_criticality;
            asset_criticality.asset_id = new_asset.id;            
            AssetCriticality.create(asset_criticality)
            .catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });

            let asset_owner = req.body.asset_owner;
            asset_owner.asset_id = new_asset.id;            
            AssetOwner.create(asset_owner)
            .catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });

            let asset_maintenance = req.body.asset_maintenance;
            asset_maintenance.asset_id = new_asset.id;            
            AssetMaintenance.create(asset_maintenance)
            .catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });

            if(asset.asset_type == 'physical' || asset.asset_type == 'network')
            {
                if(req.body.asset_warranty.warranty_type == 'Perpetual')
                {
                    req.body.asset_warranty.amc_warranty = 'N/A';
                    req.body.asset_warranty.renewal_date = 'N/A';
                }

                let asset_warranty = req.body.asset_warranty;
                asset_warranty.asset_id = new_asset.id;            
                AssetWarranty.create(asset_warranty)
                .catch(err => {
                    res.status(500).send({
                        message: err.message
                    });
                });
            }
            if(asset.asset_type == 'physical')
            {
                let asset_application = req.body.asset_application;
                asset_application.asset_id = new_asset.id;            
                AssetApplication.create(asset_application)
                .catch(err => {
                    res.status(500).send({
                        message: err.message
                    });
                });

                let asset_hardware = req.body.asset_hardware;
                asset_hardware.asset_id = new_asset.id;            
                AssetHardware.create(asset_hardware)
                .catch(err => {
                    res.status(500).send({
                        message: err.message
                    });
                });

                let asset_network = req.body.asset_network;
                asset_network.asset_id = new_asset.id;            
                AssetNetwork.create(asset_network)
                .catch(err => {
                    res.status(500).send({
                        message: err.message
                    });
                });
            }
            if(asset.asset_type == 'virtual')
            {
                let asset_virtual = req.body.asset_virtual;
                asset_virtual.asset_id = new_asset.id;            
                AssetVirtual.create(asset_virtual)
                .catch(err => {
                    res.status(500).send({
                        message: err.message
                    });
                });
            }

            const asset_approval = {
                client_id: new_asset.client_id,
                asset: JSON.stringify(new_asset),
                status: 1 // Status Pending 1 Approve 2 Denied 3 Deleted 0
            };
            AssetApproval.create(asset_approval)
            .catch(err => {
                console.log(err.message);
                res.status(500).send({
                    message: err.message
                });
            });

            event({
                subject: 'add:asset:asset-inventory',
                metadata: new_asset,
                user_id: res.locals.decoded.id
            });
        }
        
        if(asset.asset_type == 'software')
        {
            if(req.body.asset_software.warranty_type == 'Perpetual')
            {
                req.body.asset_software.warranty_date = 'N/A';
            }

            let asset_software = req.body.asset_software;             
            let new_asset_software = await AssetSoftware.create(asset_software)
            .then(result => {
                return result;
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });

            event({
                subject: 'add:asset:asset-inventory',
                metadata: asset_software,
                user_id: res.locals.decoded.id
            });

            const asset_approval = {
                client_id: new_asset_software.client_id,
                asset: JSON.stringify(new_asset_software),
                status: 1 // Status Pending 1 Approve 2 Denied 3 Deleted 0
            };
            AssetApproval.create(asset_approval)
            .catch(err => {
                console.log(err.message);
                res.status(500).send({
                    message: err.message
                });
            });
        }
        if(asset.asset_type == 'hardware')
        {

            let asset_gizmo = req.body.asset_gizmo;                        
            let data_gizmo = await AssetGizmo.create(asset_gizmo)
            .then(result => {
                return result;
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });

            event({
                subject: 'add:asset:asset-inventory',
                metadata: asset_gizmo,
                user_id: res.locals.decoded.id
            });


            //pending in ui is required fields like serial #
            // console.log(data_gizmo)
            // const asset_approval = {
            //     client_id: 1,
            //     asset: JSON.stringify(data_gizmo),
            //     status: 1 // Status Pending 1 Approve 2 Denied 3 Deleted 0
            // };
            // AssetApproval.create(asset_approval)
            // .catch(err => {
            //     console.log(err.message);
            //     res.status(500).send({
            //         message: err.message
            //     });
            // });


        }
        // end
        console.log('email')
        const recipients = recipientsForApproval(await users());
        const email_data = {
            view_asset_request_link: `https://${process.env.SERVER_NAME}/assets/pending`
        };
        nodemail(recipients, '[MICTS][REQUEST][Asset] - New Asset Request', '', 'asset-request.email', email_data);
        res.status(201).send({message: 'Asset has been created now and waiting for approval.'});
    }
    else
    {
        res.status(validation.status_code).send(validation.errors);
    }
};

exports.updateAsset = async (req, res) => {
    // const validation = asset_update_validation(req);
    // let is_updated = false;

    // update record to database
    if(req.body.info_category == 'information')
    {
        req.body.status = 2;
        req.body.priority = 'Valid';
        Asset.update(req.body,{where: {id: req.params.id}})
        .then(data => {
            if(data[0] !== 0)
            {
                event({
                    subject: 'update:asset:asset-inventory',
                    metadata: req.body,
                    user_id: res.locals.decoded.id
                });
                res.status(201).send({message: 'Asset has been updated now'});
            }
            else
            {
                res.status(200).send({message: 'Data has not been found'});
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    }

    if(req.body.info_category == 'criticality')
    {
        AssetCriticality.update(req.body,{where: {asset_id: req.params.id}})
        .then(data => {
            if(data[0] !== 0)
            {
                event({
                    subject: 'update:asset:asset-inventory',
                    metadata: req.body,
                    user_id: res.locals.decoded.id
                });
                res.status(201).send({message: 'Asset has been updated now'});
            }
            else
            {
                res.status(200).send({message: 'Data has not been found'});
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    }

    if(req.body.info_category == 'owner')
    {        
        AssetOwner.update(req.body,{where: {asset_id: req.params.id}})
        .then(data => {
            if(data[0] !== 0)
            {
                event({
                    subject: 'update:asset:asset-inventory',
                    metadata: req.body,
                    user_id: res.locals.decoded.id
                });
                res.status(201).send({message: 'Asset has been updated now'});
            }
            else
            {
                res.status(200).send({message: 'Data has not been found'});
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    }

    if(req.body.info_category == 'maintenance')
    {       
        AssetMaintenance.update(req.body,{where: {asset_id: req.params.id}})
        .then(data => {
            if(data[0] !== 0)
            {
                event({
                    subject: 'update:asset:asset-inventory',
                    metadata: req.body,
                    user_id: res.locals.decoded.id
                });
                res.status(201).send({message: 'Asset has been updated now'});
            }
            else
            {
                res.status(200).send({message: 'Data has not been found'});
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    }

    if(req.body.info_category == 'warranty')
    {
        if(req.body.warranty_type == 'Perpetual')
        {
            if(req.body.amc_warranty) {req.body.amc_warranty = 'N/A';}
            if(req.body.renewal_date) {req.body.renewal_date = 'N/A';}
        }
  
        AssetWarranty.update(req.body,{where: {asset_id: req.params.id}})
        .then(data => {
            if(data[0] !== 0)
            {
                event({
                    subject: 'update:asset:asset-inventory',
                    metadata: req.body,
                    user_id: res.locals.decoded.id
                });
                res.status(201).send({message: 'Asset has been updated now'});
            }
            else
            {
                res.status(200).send({message: 'Data has not been found'});
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    }

    if(req.body.info_category == 'application')
    {
        AssetApplication.update(req.body,{where: {asset_id: req.params.id}})
        .then(data => {
            if(data[0] !== 0)
            {
                event({
                    subject: 'update:asset:asset-inventory',
                    metadata: req.body,
                    user_id: res.locals.decoded.id
                });
                res.status(201).send({message: 'Asset has been updated now'});
            }
            else
            {
                res.status(200).send({message: 'Data has not been found'});
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    }

    if(req.body.info_category == 'hardware')
    {  
        AssetHardware.update(req.body,{where: {asset_id: req.params.id}})
        .then(data => {
            if(data[0] !== 0)
            {
                event({
                    subject: 'update:asset:asset-inventory',
                    metadata: req.body,
                    user_id: res.locals.decoded.id
                });
                res.status(201).send({message: 'Asset has been updated now'});
            }
            else
            {
                res.status(200).send({message: 'Data has not been found'});
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    }

    if(req.body.info_category == 'network')
    {
        AssetNetwork.update(req.body,{where: {asset_id: req.params.id}})
        .then(data => {
            if(data[0] !== 0)
            {
                event({
                    subject: 'update:asset:asset-inventory',
                    metadata: req.body,
                    user_id: res.locals.decoded.id
                });
                res.status(201).send({message: 'Asset has been updated now'});
            }
            else
            {
                res.status(200).send({message: 'Data has not been found'});
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    }
    
    if(req.body.info_category == 'virtual')
    {
        AssetVirtual.update(req.body,{where: {asset_id: req.params.id}})
        .then(data => {
            if(data[0] !== 0)
            {
                event({
                    subject: 'update:asset:asset-inventory',
                    metadata: req.body,
                    user_id: res.locals.decoded.id
                });
                res.status(201).send({message: 'Asset has been updated now'});
            }
            else
            {
                res.status(200).send({message: 'Data has not been found'});
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    }
    
    // separate table software
    if(req.body.info_category == 'software')
    {
        if(req.body.warranty_type == 'Perpetual')
        {
            req.body.warranty_date = 'N/A';
        }

        let asset_software = req.body;             
        AssetSoftware.update(asset_software,{where: {id: req.params.id}})
        .then(data => {
            if(data[0] !== 0)
            {
                event({
                    subject: 'update:asset:asset-inventory',
                    metadata: asset_software,
                    user_id: res.locals.decoded.id
                });
                res.status(201).send({message: 'Asset has been updated now'});
            }
            else
            {
                res.status(200).send({message: 'Data has not been found'});
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    }

    // separate table gizmos
    if(req.body.info_category == 'gizmo')
    {
        let asset_gizmo = req.body;
        console.log(asset_gizmo)                        
        AssetGizmo.update(asset_gizmo,{where: {id: req.params.id}})
        .then(data => {
            if(data[0] !== 0)
            {
                event({
                    subject: 'update:asset:asset-inventory',
                    metadata: asset_gizmo,
                    user_id: res.locals.decoded.id
                });
                res.status(201).send({message: 'Asset has been updated now'});
            }
            else
            {
                res.status(200).send({message: 'Data has not been found'});
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    }

    // end
};

exports.updateAssetApprovals = async (req, res) => {
    const validation = {
        is_error: false,
        errors: [],
        status_code: 400,
    };

    const ids = req.body.ids ? req.body.ids : [];

    if(!req.body.status)
    {
        validation.is_error = true;
        validation.errors.push({status: 'Invalid Input'});
    }

    if(validation.is_error == false)
    {
        const asset_approvals = await AssetApproval.findAndCountAll({where: {id: {[Op.in]:ids}}})
        .then(async data => {
            data = JSON.stringify(data);data = JSON.parse(data); // this line help us to make real JSON object
            for(let i in data.rows)
            {
                data.rows[i].asset = JSON.parse(data.rows[i].asset);
            }
            return data;
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });

        AssetApproval.update(req.body,{where: {id: {[Op.in]:ids}}})
        .then(async data => {
            if(data[0] !== 0)
            {
                event({
                    subject: 'update:approval-asset:asset-inventory',
                    metadata: req.body,
                    user_id: res.locals.decoded.id
                });
                res.status(201).send({message: 'Asset(s) Approval has been updated.'});
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
        });

        let recipient = {};
        asset_approvals.rows.map((row) => {
            if(row.asset.asset_type) // if asset_type is physical,network,software
            {
                Asset.update({status: req.body.status},{where: {id: row.asset.id}})
                .then(async data => {
                    if(data[0] !== 0)
                    {
                        Asset.findOne({where: {id: row.asset.id}})
                        .then(async result => {
                            recipient = await user(result.created_by);
                            const email_data = {
                                action_taken: req.body.status == 2 ? 'approved' : 'denied',
                                hostname: result.hostname,
                                ip_address: result.ip_address,
                                model: result.model,
                                manufacturer: result.manufacturer,
                                service_tag: result.service_tag,
                                role: result.role
                            };
                            nodemail(recipient.User.email, '[MICTS][REQUEST][Asset] - New Asset Request', '', 'asset-approval.email', email_data);
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: err.message
                            });
                        })
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message
                    });
                });
            }
            else // else asset_type is software
            {
                AssetSoftware.update({status: req.body.status},{where: {id: row.asset.id}})
                .then(data => {
                    if(data[0] !== 0)
                    {
                        AssetSoftware.findOne({where: {id: row.asset.id}})
                        .then(async result => {
                            recipient = await user(result.created_by);
                            const email_data = {
                                action_taken: req.body.status == 2 ? 'approved' : 'denied',
                                name: result.name,
                                description: result.description,
                                warranty_date: result.warranty_date
                            };
                            nodemail(recipient.User.email, '[MICTS][REQUEST][Asset] - New Asset Request', '', 'asset-software-approval.email', email_data);
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: err.message
                            });
                        })
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message
                    });
                });
            }
        });
    }
    else
    {
        res.status(validation.status_code).send(validation.errors);
    }
}

exports.deleteAssets = async (req, res) => {
    const ids = req.body.ids ? req.body.ids : []; //will accept arrays
    const user = res.locals.decoded;

    switch(req.params.asset_type)
    {
        case 'physicals':
            Asset.update({status:0},{where: {id: {[Op.in]:ids}}})
            .then(async data => {
                if(data[0] !== 0)
                {
                    event({
                        subject: 'delete:asset:asset-inventory',
                        metadata: {
                            user_id:user.id,
                            asset_ids: ids
                        },
                        user_id: res.locals.decoded.id
                    });
                    res.status(201).send({message: 'Asset(s) has been deleted now'});
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
            });
            break;
        case 'virtuals':
            Asset.update({status:0},{where: {id: {[Op.in]:ids}}})
            .then(async data => {
                if(data[0] !== 0)
                {
                    event({
                        subject: 'delete:asset:asset-inventory',
                        metadata: {
                            user_id:user.id,
                            asset_ids: ids
                        },
                        user_id: res.locals.decoded.id
                    });
                    res.status(201).send({message: 'Asset(s) has been deleted now'});
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
            });
            break;
        case 'networks':
            Asset.update({status:0},{where: {id: {[Op.in]:ids}}})
            .then(async data => {
                if(data[0] !== 0)
                {
                    event({
                        subject: 'delete:asset:asset-inventory',
                        metadata: {
                            user_id:user.id,
                            asset_ids: ids
                        },
                        user_id: res.locals.decoded.id
                    });
                    res.status(201).send({message: 'Asset(s) has been deleted now'});
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
            });
            break;
        case 'softwares':
            AssetSoftware.update({status:0},{where: {id: {[Op.in]:ids}}})
            .then(async data => {
                if(data[0] !== 0)
                {
                    event({
                        subject: 'delete:asset:asset-inventory',
                        metadata: {
                            user_id:user.id,
                            asset_ids: ids
                        },
                        user_id: res.locals.decoded.id
                    });
                    res.status(201).send({message: 'Asset(s) has been deleted now'});
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
            });
            break;
        case 'hardwares':
            AssetGizmo.destroy({where: {id: {[Op.in]:ids}}})
            .then(async data => {
                if(data[0] !== 0)
                {
                    event({
                        subject: 'delete:asset:asset-inventory',
                        metadata: {
                            user_id:user.id,
                            asset_ids: ids
                        },
                        user_id: res.locals.decoded.id
                    });
                    res.status(201).send({message: 'Asset(s) has been deleted now'});
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
            });
            break;
        default:
            break;
    }
};

exports.deleteSpecAsset = async (req, res) => {
    const user = res.locals.decoded;

    switch(req.params.asset_type)
    {
        case 'physicals':
            Asset.update({status:0},{where: {id: req.params.id}})
            .then(async data => {
                if(data[0] !== 0)
                {
                    event({
                        subject: 'delete:asset:asset-inventory',
                        metadata: {
                            user_id:user.id,
                            asset_id: req.params.id
                        },
                        user_id: res.locals.decoded.id
                    });
                    res.status(201).send({message: 'Asset has been deleted now'});
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
            });
            break;
        case 'virtuals':
            Asset.update({status:0},{where: {id: req.params.id}})
            .then(async data => {
                if(data[0] !== 0)
                {
                    event({
                        subject: 'delete:asset:asset-inventory',
                        metadata: {
                            user_id:user.id,
                            asset_id: req.params.id
                        },
                        user_id: res.locals.decoded.id
                    });
                    res.status(201).send({message: 'Asset has been deleted now'});
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
            });
            break;
        case 'networks':
            Asset.update({status:0},{where: {id: req.params.id}})
            .then(async data => {
                if(data[0] !== 0)
                {
                    event({
                        subject: 'delete:asset:asset-inventory',
                        metadata: {
                            user_id:user.id,
                            asset_id: req.params.id
                        },
                        user_id: res.locals.decoded.id
                    });
                    res.status(201).send({message: 'Asset has been deleted now'});
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
            });
            break;
        case 'softwares':
            AssetSoftware.update({status:0},{where: {id: req.params.id}})
            .then(async data => {
                if(data[0] !== 0)
                {
                    event({
                        subject: 'delete:asset:asset-inventory',
                        metadata: {
                            user_id:user.id,
                            asset_id: req.params.id
                        },
                        user_id: res.locals.decoded.id
                    });
                    res.status(201).send({message: 'Asset has been deleted now'});
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
            });
            break;
        case 'hardwares':
            AssetGizmo.destroy({where: {id: req.params.id}})
            .then(async data => {
                if(data[0] !== 0)
                {
                    event({
                        subject: 'delete:asset:asset-inventory',
                        metadata: {
                            user_id:user.id,
                            asset_id: req.params.id
                        },
                        user_id: res.locals.decoded.id
                    });
                    res.status(201).send({message: 'Asset has been deleted now'});
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
            });
            break;
        default:
            break;
    }
};

function canDo(concern_user, concern_permission) {
    const concern_permissions = [];
    concern_user.User.Permissions.map((permission) => {
        concern_permissions.push(permission.name);
    });

    concern_user.Role.Permissions.map((permission) => {
        concern_permissions.push(permission.name);
    });

    return concern_permissions.includes(concern_permission) == true ? true: false;
}

function recipientsForApproval(concern_users) {
    let concern_emails = '';
    concern_users.rows.map((user) => {
        if(canDo(user, 'approve-assets'))
        {
            concern_emails += `${user.User.email},`;
        }
    });
    return concern_emails.slice(0, -1);
}