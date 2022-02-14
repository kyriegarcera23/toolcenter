const db = require("../models");
const { Asset,AssetApplication,AssetCriticality,AssetHardware,AssetMaintenance,
AssetNetwork,AssetOwner,AssetVirtual,AssetWarranty,AssetSoftware,AssetGizmo } = db;

module.exports = (req) => {
    const validation = {
        is_error: false,
        errors: [],
        status_code: 400,
    };

    const asset = req.body.asset ? req.body.asset : {};
    const asset_application = req.body.asset_application ? req.body.asset_application : {};
    const asset_criticality = req.body.asset_criticality ? req.body.asset_criticality : {};
    const asset_owner = req.body.asset_owner ? req.body.asset_owner : {};
    const asset_hardware = req.body.asset_hardware ? req.body.asset_hardware : {};
    const asset_maintenance = req.body.asset_maintenance ? req.body.asset_maintenance : {};
    const asset_warranty = req.body.asset_warranty ? req.body.asset_warranty : {};
    const asset_network = req.body.asset_network ? req.body.asset_network : {};
    const asset_virtual = req.body.asset_virtual ? req.body.asset_virtual : {};
    const asset_software = req.body.asset_software ? req.body.asset_software : {};
    const asset_gizmo = req.body.asset_gizmo ? req.body.asset_gizmo : {};

    if(JSON.stringify(asset) === JSON.stringify({}) || JSON.stringify(req.body) === JSON.stringify({}))
    {
        validation.is_error = true;
        validation.errors.push({asset: 'Invalid Input'})
    }
    else
    {
        if(asset.asset_type)
        {
            if(asset.asset_type == 'physical' || asset.asset_type == 'virtual' || asset.asset_type == 'network')
            {
                for(let key in Asset.rawAttributes){
                    if(except(['id','createdAt','updatedAt'],key)) {
                        if(asset.asset_type == 'virtual' && except(['manufacturer','model','service_tag','hardware_type','vendor','rack_slot'],key))
                        {
                            if (!asset[`${key}`])
                            {
                                validation.is_error = true;
                                validation.errors.push({[`asset.${key}`]: 'Invalid Input'})
                            }
                        }
                        
                        if(asset.asset_type == 'physical')
                        {
                            if (!asset[`${key}`])
                            {
                                validation.is_error = true;
                                validation.errors.push({[`asset.${key}`]: 'Invalid Input'})
                            }
                        }

                        if(asset.asset_type == 'network' && except(['manufacturer','model','service_tag'],key))
                        {
                            if (!asset[`${key}`])
                            {
                                validation.is_error = true;
                                validation.errors.push({[`asset.${key}`]: 'Invalid Input'})
                            }
                        }
                    }
                }

                for(let key in AssetCriticality.rawAttributes){
                    if(except(['id','asset_id','createdAt','updatedAt'],key)) {
                        if (!asset_criticality[`${key}`])
                        {
                            validation.is_error = true;
                            validation.errors.push({[`asset_criticality.${key}`]: 'Invalid Input'})
                        }
                    }
                }

                for(let key in AssetOwner.rawAttributes){
                    if(except(['id','asset_id','createdAt','updatedAt'],key)) {
                        if (!asset_owner[`${key}`])
                        {
                            validation.is_error = true;
                            validation.errors.push({[`asset_owner.${key}`]: 'Invalid Input'})
                        }
                    }
                }

                for(let key in AssetMaintenance.rawAttributes){
                    if(except(['id','asset_id','createdAt','updatedAt'],key)) {
                        if (!asset_maintenance[`${key}`])
                        {
                            validation.is_error = true;
                            validation.errors.push({[`asset_maintenance.${key}`]: 'Invalid Input'})
                        }
                    }
                }
            }

            if(asset.asset_type == 'physical' || asset.asset_type == 'network')
            {
                for(let key in AssetWarranty.rawAttributes){
                    if(except(['id','asset_id','createdAt','updatedAt'],key)) {
                        if (!asset_warranty[`${key}`])
                        {
                            validation.is_error = true;
                            validation.errors.push({[`asset_warranty.${key}`]: 'Invalid Input'})
                        }
                    }
                }
            }

            if(asset.asset_type == 'physical')
            {
                for(let key in AssetApplication.rawAttributes){
                    if(except(['id','asset_id','createdAt','updatedAt'],key)) {
                        if (!asset_application[`${key}`])
                        {
                            validation.is_error = true;
                            validation.errors.push({[`asset_application.${key}`]: 'Invalid Input'})
                        }
                    }
                }

                for(let key in AssetHardware.rawAttributes){
                    if(except(['id','asset_id','createdAt','updatedAt'],key)) {
                        if (!asset_hardware[`${key}`])
                        {
                            validation.is_error = true;
                            validation.errors.push({[`asset_hardware.${key}`]: 'Invalid Input'})
                        }
                    }
                }

                for(let key in AssetNetwork.rawAttributes){
                    if(except(['id','asset_id','createdAt','updatedAt'],key)) {
                        if (!asset_network[`${key}`])
                        {
                            validation.is_error = true;
                            validation.errors.push({[`asset_network.${key}`]: 'Invalid Input'})
                        }
                    }
                }
            }

            if(asset.asset_type == 'virtual')
            {
                for(let key in AssetVirtual.rawAttributes){
                    if(except(['id','asset_id','createdAt','updatedAt'],key)) {
                        if (!asset_virtual[`${key}`])
                        {
                            validation.is_error = true;
                            validation.errors.push({[`asset_virtual.${key}`]: 'Invalid Input'})
                        }
                    }
                }
            }

            if(asset.asset_type == 'software')
            {
                for(let key in AssetSoftware.rawAttributes){
                    if(except(['id','createdAt','updatedAt'],key)) {
                        if (!asset_software[`${key}`])
                        {
                            validation.is_error = true;
                            validation.errors.push({[`asset_software.${key}`]: 'Invalid Input'})
                        }
                    }
                }
            }

            if(asset.asset_type == 'hardware') //synomym of hardware external
            {
                for(let key in AssetGizmo.rawAttributes){
                    if(except(['id','createdAt','updatedAt'],key)) {
                        if (!asset_gizmo[`${key}`])
                        {
                            validation.is_error = true;
                            validation.errors.push({[`asset_gizmo.${key}`]: 'Invalid Input'})
                        }
                    }
                }
            }
        }
        else
        {
            validation.is_error = true;
            validation.errors.push({[`asset.asset_type`]: 'Invalid Input'})
        }
    }

    return validation;
}

function except(fields,key)
{
    let status = true;
    for(let i=0;i<fields.length;i++)
    {
        if(fields[i] == key)
        {
            status = false;
        }
    }
    return status;
}