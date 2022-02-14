const jwt = require("jsonwebtoken");
const path = require("path");
const db = require("../models");
const { Asset,AssetApplication,AssetCriticality,AssetHardware,AssetMaintenance,
AssetNetwork,AssetOwner,AssetVirtual,AssetWarranty,AssetSoftware,AssetGizmo,AssetApproval,Client,Recipient } = db;
const Op = db.Sequelize.Op;
const sequelize = db.Sequelize;
const event = require("../services/event.service");
const assetCustomWhereClause = require("../services/asset_custom_where_clause.service");
const moment = require("moment");

exports.fetchAssetReport = async (req, res) => {
    const from_date = req.body.from_date ? new Date(req.body.from_date) : '';
    const to_date = req.body.to_date ? new Date(req.body.to_date) : '';
    const auth = res.locals.decoded;

    const asset_normal = await Asset.findAll({
      attributes: ['asset_type', [sequelize.fn('COUNT', sequelize.col('id')), 'asset_count']],
      group: ['asset_type'],
      where: assetCustomWhereClause(from_date,to_date,'normal')
    })
    .then(data => {
      data = JSON.stringify(data); data = JSON.parse(data); // this line help us to make real JSON object
      return data;
    })
    .catch(err => {        
      res.status(500).send(err.message);
    });

    const asset_low = await Asset.findAll({
      attributes: ['asset_type', [sequelize.fn('COUNT', sequelize.col('id')), 'asset_count']],
      group: ['asset_type'],
      where: assetCustomWhereClause(from_date,to_date,'low')
    })
    .then(data => {
      data = JSON.stringify(data); data = JSON.parse(data); // this line help us to make real JSON object
      return data;
    })
    .catch(err => {        
      res.status(500).send(err.message);
    });

    const asset_medium = await Asset.findAll({
      attributes: ['asset_type', [sequelize.fn('COUNT', sequelize.col('id')), 'asset_count']],
      group: ['asset_type'],
      where: assetCustomWhereClause(from_date,to_date,'medium')
    })
    .then(data => {
      data = JSON.stringify(data); data = JSON.parse(data); // this line help us to make real JSON object
      return data;
    })
    .catch(err => {        
      res.status(500).send(err.message);
    });

    const asset_high = await Asset.findAll({
      attributes: ['asset_type', [sequelize.fn('COUNT', sequelize.col('id')), 'asset_count']],
      group: ['asset_type'],
      where: assetCustomWhereClause(from_date,to_date,'high')
    })
    .then(data => {
      data = JSON.stringify(data); data = JSON.parse(data); // this line help us to make real JSON object
      return data;
    })
    .catch(err => {        
      res.status(500).send(err.message);
    });

    const asset_normal_software = await AssetSoftware.findAndCountAll({
      where: assetCustomWhereClause(from_date,to_date,'normal')
    })
    .then(data => {
      data = JSON.stringify(data); data = JSON.parse(data); // this line help us to make real JSON object
      return data;
    })
    .catch(err => {        
      res.status(500).send(err.message);
    });

    const asset_low_software = await AssetSoftware.findAndCountAll({
      where: assetCustomWhereClause(from_date,to_date,'low')
    })
    .then(data => {
      data = JSON.stringify(data); data = JSON.parse(data); // this line help us to make real JSON object
      return data;
    })
    .catch(err => {        
      res.status(500).send(err.message);
    });

    const asset_medium_software = await AssetSoftware.findAndCountAll({
      where: assetCustomWhereClause(from_date,to_date,'medium')
    })
    .then(data => {
      data = JSON.stringify(data); data = JSON.parse(data); // this line help us to make real JSON object
      return data;
    })
    .catch(err => {        
      res.status(500).send(err.message);
    });

    const asset_high_software = await AssetSoftware.findAndCountAll({
      where: assetCustomWhereClause(from_date,to_date,'high')
    })
    .then(data => {
      data = JSON.stringify(data); data = JSON.parse(data); // this line help us to make real JSON object
      return data;
    })
    .catch(err => {        
      res.status(500).send(err.message);
    });

    const asset_normal_hardware = await AssetGizmo.findAndCountAll({
      where: assetCustomWhereClause(from_date,to_date,'hardware')
    })
    .then(data => {
      data = JSON.stringify(data); data = JSON.parse(data); // this line help us to make real JSON object
      return data;
    })
    .catch(err => {        
      res.status(500).send(err.message);
    });


    const asset_pending = await Asset.findAll({
      attributes: ['asset_type', [sequelize.fn('COUNT', sequelize.col('id')), 'asset_count']],
      group: ['asset_type'],
      where: assetCustomWhereClause(from_date,to_date,'pending')
    })
    .then(data => {
      data = JSON.stringify(data); data = JSON.parse(data); // this line help us to make real JSON object
      return data;
    })
    .catch(err => {        
      res.status(500).send(err.message);
    });

    const asset_software_pending = await AssetSoftware.findAndCountAll({
      where: assetCustomWhereClause(from_date,to_date,'pending')
    })
    .then(data => {
      data = JSON.stringify(data); data = JSON.parse(data); // this line help us to make real JSON object
      return data;
    })
    .catch(err => {        
      res.status(500).send(err.message);
    });

    const asset_user_request = await Asset.findAndCountAll({
      where: {
        created_by: auth.id,
        status: 1
      }
    })
    .then(data => {
      data = JSON.stringify(data); data = JSON.parse(data); // this line help us to make real JSON object
      return data;
    })
    .catch(err => {        
      res.status(500).send(err.message);
    });

    const asset_software_user_request = await AssetSoftware.findAndCountAll({
      where: {
        created_by: auth.id,
        status: 1
      }
    })
    .then(data => {
      data = JSON.stringify(data); data = JSON.parse(data); // this line help us to make real JSON object
      return data;
    })
    .catch(err => {        
      res.status(500).send(err.message);
    });

    const exp_from_date = new Date(moment().startOf('month').format('YYYY-MM-DD'));
    const exp_to_date =  new Date(moment().endOf('month').format('YYYY-MM-DD'));

    const asset_expiring_month_now = await Asset.findAndCountAll(
      {
        include: [
          {model: AssetApplication},
          {model: AssetCriticality},
          {model: AssetHardware},
          {model: AssetMaintenance},
          {model: AssetNetwork},
          {model: AssetOwner},
          {model: AssetVirtual},
          {
            model: AssetWarranty,
            where: {
              amc_warranty: {
                  [Op.between]: [exp_from_date, exp_to_date]
              }
            }
          },
          {model: Client, include: [{model: Recipient}]}
        ],
        where: {
          status: 2
        }
      }
    )
    .then(data => {
      data = JSON.stringify(data); data = JSON.parse(data); // this line help us to make real JSON object
      return data;
    })
    .catch(err => {        
      res.status(500).send(err.message);
    });

    const asset_software_expiring_month_now = await AssetSoftware.findAndCountAll(
      {
        where: {
          status: 2,
          warranty_date: {
              [Op.between]: [exp_from_date, exp_to_date]
          }
        }
      }
    )
    .then(data => {
      data = JSON.stringify(data); data = JSON.parse(data); // this line help us to make real JSON object
      return data;
    })
    .catch(err => {        
      res.status(500).send(err.message);
    });

    //end of fetching from DB

    const asset_normal_software_r = {
      'asset_type': 'software',
      'asset_count': asset_normal_software.count
    }

    const asset_low_software_r = {
      'asset_type': 'software',
      'asset_count': asset_low_software.count
    }

    const asset_medium_software_r = {
      'asset_type': 'software',
      'asset_count': asset_medium_software.count
    }

    const asset_high_software_r = {
      'asset_type': 'software',
      'asset_count': asset_high_software.count
    }

    const asset_normal_hardware_r = {
      'asset_type': 'hardware',
      'asset_count': asset_normal_hardware.count
    }

    const asset_software_pending_r = {
      asset_type: 'software',
      asset_count: asset_software_pending.count
    }

    asset_normal.push(asset_normal_software_r);
    asset_low.push(asset_low_software_r);
    asset_medium.push(asset_medium_software_r);
    asset_high.push(asset_high_software_r);
    asset_normal.push(asset_normal_hardware_r);
    asset_pending.push(asset_software_pending_r);

    //checking of reports by types
    const asset_types = ['physical','software','virtual','network','hardware'];
    for (i in asset_types)
    {
      if(isAssetTypeExisting(asset_types[i],'normal') == false)
      {
        asset_normal.push({asset_type:asset_types[i],asset_count:0})
      }

      if(isAssetTypeExisting(asset_types[i],'low') == false)
      {
        asset_low.push({asset_type:asset_types[i],asset_count:0})
      }

      if(isAssetTypeExisting(asset_types[i],'medium') == false)
      {
        asset_medium.push({asset_type:asset_types[i],asset_count:0})
      }

      if(isAssetTypeExisting(asset_types[i],'high') == false)
      {
        asset_high.push({asset_type:asset_types[i],asset_count:0})
      }

      if(isAssetTypeExisting(asset_types[i],'pending') == false)
      {
        asset_pending.push({asset_type:asset_types[i],asset_count:0})
      }
    }

    let total_number_asset_normal = 0;
    asset_normal.map(obj => {
      total_number_asset_normal += obj.asset_count;
    });

    let total_number_asset_low = 0;
    asset_low.map(obj => {
      total_number_asset_low += obj.asset_count;
    });

    let total_number_asset_medium = 0;
    asset_medium.map(obj => {
      total_number_asset_medium += obj.asset_count;
    });

    let total_number_asset_high = 0;
    asset_high.map(obj => {
      total_number_asset_high += obj.asset_count;
    });

    let total_number_asset_pending = 0;
    asset_pending.map(obj => {
      total_number_asset_pending += obj.asset_count;
    });

    let response = {
      asset_normal: asset_normal,
      asset_low: asset_low,
      asset_medium: asset_medium,
      asset_high: asset_high,
      asset_pending: asset_pending,
      total_number_of_asset_normal: total_number_asset_normal,
      total_number_of_asset_low: total_number_asset_low,
      total_number_of_asset_medium: total_number_asset_medium,
      total_number_of_asset_high: total_number_asset_high,
      total_number_of_asset_pending: total_number_asset_pending,
      total_number_of_asset_approved: parseInt(total_number_asset_normal) + parseInt(total_number_asset_low) + parseInt(total_number_asset_medium) + parseInt(total_number_asset_high),
      total_number_of_asset_request: parseInt(asset_user_request.count) + parseInt(asset_software_user_request.count),
      expiring_assets_this_month: asset_expiring_month_now,
      expiring_assets_software_this_month: asset_software_expiring_month_now
    }

    res.status(200).send(response);

    //custom functions
    function isAssetTypeExisting(asset_type,option)
    {
      var status = false;
      var asset;
      
      if(option == 'pending')
      {
        asset = asset_pending;
      }
      else if (option == 'normal')
      {
        asset = asset_normal;
      }
      else if (option == 'low')
      {
        asset = asset_low;
      }
      else if (option == 'medium')
      {
        asset = asset_medium;
      }
      else
      {
        asset = asset_high;
      }

      for (j in asset)
      {
        if(asset_type == asset[j].asset_type)
        {
          status = true;
          break;
        }
      }
      return status;
    }
}