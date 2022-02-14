const db = require("../models");
const { Asset,AssetApplication,AssetCriticality,AssetHardware,AssetMaintenance,
AssetNetwork,AssetOwner,AssetVirtual,AssetWarranty,AssetSoftware,AssetGizmo,AssetApproval,Client,Recipient } = db;
const Op = db.Sequelize.Op;
const sequelize = db.Sequelize;

module.exports = (from_date, to_date, option = 'normal') => {
  let whereClauseNormal = {
    status: 2,
    [Op.or]: [
      {priority: {[Op.like]: `%Valid%`}}
    ]
  };

  let whereClauseLow = {
    status: 2,
    [Op.or]: [
      {priority: {[Op.like]: `%Low%`}}
    ]
  };

  let whereClauseMedium = {
    status: 2,
    [Op.or]: [
      {priority: {[Op.like]: `%Medium%`}}
    ]
  };

  let whereClauseHigh = {
    status: 2,
    [Op.or]: [
      {priority: {[Op.like]: `%High%`}}
    ]
  };

  let whereClauseHardware = {}

  let whereClausePending = {
    status: 1
  }

  if(from_date != '' && to_date != '')
  {
    whereClauseNormal = {
      status: 2,
      [Op.or]: [
        {priority: {[Op.like]: `%Valid%`}}
      ],
      [Op.and]: [{
          createdAt: {
              [Op.between]: [from_date, to_date]
          }
      }]
    };

    whereClauseLow = {
      status: 2,
      [Op.or]: [
        {priority: {[Op.like]: `%Low%`}}
      ],
      [Op.and]: [{
          createdAt: {
              [Op.between]: [from_date, to_date]
          }
      }]
    };

    whereClauseMedium = {
      status: 2,
      [Op.or]: [
        {priority: {[Op.like]: `%Medium%`}}
      ],
      [Op.and]: [{
          createdAt: {
              [Op.between]: [from_date, to_date]
          }
      }]
    };

    whereClauseHigh = {
        status: 2,
        [Op.or]: [
          {priority: {[Op.like]: `%High%`}}
        ],
        [Op.and]: [{
            createdAt: {
                [Op.between]: [from_date, to_date]
            }
        }]
    };

    whereClauseHardware = {
        createdAt: {
            [Op.between]: [from_date, to_date]
        }
    };

    whereClausePending = {
      status: 1,
      createdAt: {
          [Op.between]: [from_date, to_date]
      }
    }
  }

  if(option == 'hardware')
  {
    return whereClauseHardware;
  }
  else if(option == 'pending')
  {
    return whereClausePending;
  }
  else if(option == 'normal')
  {
    return whereClauseNormal;
  }
  else if(option == 'low')
  {
    return whereClauseLow;
  }
  else if(option == 'medium')
  {
    return whereClauseMedium;
  }
  else
  {
    return whereClauseHigh;
  }
}