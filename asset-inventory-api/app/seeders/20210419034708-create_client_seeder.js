
'use strict';

const client_createdAt = '2020-01-27 09:07:15';
const client_updatedAt = '2020-01-27 09:07:15';
const clients = [
  {
    id: 1,
    name: 'SAP',
    description: 'System and Platform',
    status: 1,
    createdAt: client_createdAt,
    updatedAt: client_updatedAt
  },
  {
    id: 2,
    name: 'Trends MICTS',
    description: 'Trends MICTS',
    status: 1,
    createdAt: client_createdAt,
    updatedAt: client_updatedAt
  },
  {
    id: 3,
    name: 'NOC',
    description: 'Trends Operation',
    status: 1,
    createdAt: client_createdAt,
    updatedAt: client_updatedAt
  },
  {
    id: 4,
    name: 'SOC',
    description: 'Trends Operation',
    status: 1,
    createdAt: client_createdAt,
    updatedAt: client_updatedAt
  },
  {
    id: 5,
    name: 'FPH',
    description: 'External',
    status: 1,
    createdAt: client_createdAt,
    updatedAt: client_updatedAt
  },
  {
    id: 6,
    name: 'Unilab',
    description: 'Unilab Laboratories Inc.',
    status: 1,
    createdAt: client_createdAt,
    updatedAt: client_updatedAt
  },
  {
    id: 7,
    name: 'EDC',
    description: 'Energy Development Corporation.',
    status: 1,
    createdAt: client_createdAt,
    updatedAt: client_updatedAt
  }
];


const recipient_createdAt = '2020-01-28 09:07:15';
const recipient_updatedAt = '2020-01-28 09:07:15';
const recipients = [
  {
    id: 1,
    client_id: 1,
    name: 'System and Platform',
    description: 'Internal',
    email: 'micts-systems@test_trends.com.ph',
    created_by: 1,
    createdAt: recipient_createdAt,
    updatedAt: recipient_updatedAt
  },
  {
    id: 2,
    client_id: 2,
    name: 'MICT SYSTEMS',
    description: 'SAP Team',
    email: 'micts-systems@test_trends.com.ph',
    created_by: 1,
    createdAt: recipient_createdAt,
    updatedAt: recipient_updatedAt
  },
  {
    id: 3,
    client_id: 6,
    name: 'Unilab On Site',
    description: 'Unilab Onsite Support',
    email: 'UL_onsitesupport@test_trends.com.ph',
    created_by: 1,
    createdAt: recipient_createdAt,
    updatedAt: recipient_updatedAt
  },
  {
    id: 4,
    client_id: 6,
    name: 'SAP',
    description: 'SAP Team',
    email: 'micts-systems@test_trends.com.ph',
    created_by: 1,
    createdAt: recipient_createdAt,
    updatedAt: recipient_updatedAt
  },
  {
    id: 5,
    client_id: 6,
    name: 'Vic Mendoza',
    description: 'Unilab Manager for Network',
    email: 'vic@test_unilab.com.ph',
    created_by: 1,
    createdAt: recipient_createdAt,
    updatedAt: recipient_updatedAt
  },
  {
    id: 6,
    client_id: 6,
    name: 'Erwin Salcedo',
    description: 'SDM',
    email: 'elsalcedo@test_trends.com.ph',
    created_by: 1,
    createdAt: recipient_createdAt,
    updatedAt: recipient_updatedAt
  },
  {
    id: 7,
    client_id: 6,
    name: 'SOC',
    description: 'MICTS SOC',
    email: 'soc@test_trends.com.ph',
    created_by: 1,
    createdAt: recipient_createdAt,
    updatedAt: recipient_updatedAt
  }
];

const location_createdAt = '2020-01-28 09:07:15';
const location_updatedAt = '2020-01-28 09:07:15';
const location = {
  "sap": [
      "Vitro DC",
      "Clark DC",
      "TP DC"
  ],
  "default": [
      "Vitro DC",
      "Clark DC",
      "TP DC"
  ],
  "unilab": [
      "Not Specified",
      "UL Network Room",
      "MK2 Data Center",
      "FPDI Data Center",
      "Amherst Data Center",
      "RiteMed",
      "Bocaue",
      "Butuan",
      "Cebu",
      "Bacolod",
      "Davao_Depot",
      "Gensan",
      "Ozamis",
      "CDO",
      "Zamboanga",
      "San-Pablo",
      "Cauayan",
      "Amherst-Parenterals",
      "LIIP-EFSG",
      "SARI-PAMPANGA",
      "PHFMI",
      "Sari-Cebu",
      "SFL",
      "Pampanga-Depot",
      "RLG",
      "Naga",
      "Iloilo",
      "Unahco_Bicol",
      "Distribution Office",
      "Executive Office",
      "Treasury",
      "Old International Office",
      "Service Building Ground Floor",
      "Service Building 2nd Floor",
      "OLD Bayanihan Ground Floor",
      "OLD Bayanihan 2nd Floor",
      "OLD Bayanihan 3rd Floor",
      "BAYANIHAN CENTER",
      "CROMAGEN",
      "ULCC1 Ground Floor",
      "ULCC1 3rd Floor",
      "ULCC2 Ground Floor",
      "ULCC2 2nd Floor",
      "ULCC2 3rd Floor",
      "ULCC2 4th Floor",
      "ULCC2 5th Floor",
      "ULCC3 2nd Floor",
      "ULCC3 3rd Floor",
      "UNAHCO",
      "Main",
      "Research",
      "UMMO",
      "AAI",
      "ULCC1-GF",
      "Distribution",
      "Internatinal",
      "OLD Bayanihan GF",
      "OLD Bayanihan 2F",
      "OLD Bayanihan 3F",
      "Innovitelle and Bayanihan Annex",
      "Research 2nd Floor - Manufacturing",
      "Research Ground Floor - UMED",
      "Research Ground Floor - ORA",
      "Research 3rd Floor - ARD",
      "Research 3rd Floor - QC",
      "Research 2nd Floor - Medical Affairs",
      "Research 2nd Floor - SPA",
      "Research Ground Floor - Security",
      "Research 3rd Floor - MSD",
      "Research 2nd Floor - Canteen",
      "Research 3rd Floor - BSD",
      "PR&D and McWarehouse",
      "ULCC1 4th Floor",
      "ULCC2 Basement",
      "ULCC3 Ground Floor",
      "LVP,  AAI, Dumez and Data Center",
      "ULCC Data Center",
      "Admin Building - Ground Floor",
      "Admin Building - Second Floor",
      "Services Building - Ground Floor",
      "Services Building - Second Floor",
      "OLD BAYANIHAN BUILDING -Ground Floor",
      "OLD BAYANIHAN BUILDING -Second Floor",
      "OLD BAYANIHAN BUILDING -Third Floor",
      "BAYANIHAN CENTER -Ground Floor",
      "ULCC1 BUILDING - Canteen",
      "EXECUTIVE DINING -Second Floor",
      "CROMAGEN -Second Floor",
      "ULCC PHASE 1 BUILDING -Ground Floor",
      "ULCC PHASE 1 BUILDING -Second Floor",
      "ULCC PHASE 1 BUILDING -Third Floor",
      "ULCC PHASE 1 BUILDING -Fourth Floor",
      "ULCC PHASE 1 BUILDING -Roof Deck",
      "ULCC PHASE 2 BUILDING -Ground Floor",
      "ULCC PHASE 2 BUILDING -Second Floor",
      "ULCC PHASE 2 BUILDING -Third Floor",
      "ULCC PHASE 2 BUILDING -Fourth Floor",
      "ULCC PHASE 2 BUILDING -Fifth Floor",
      "ULCC PHASE 3 BUILDING -Second Floor",
      "ULCC PHASE 3 BUILDING -Third Floor",
      "UNAHCO SHERIDAN BUILDING -Ground Floor",
      "UNAHCO SHERIDAN BUILDING -Second Floor",
      "UNAHCO SHERIDAN BUILDING -Third Floor",
      "RESEARCH Ground Floor",
      "RESEARCH 2nd Floor",
      "RESEARCH 3rd Floor",
      "UMMO - Ground Floor",
      "UMMO - Second Floor",
      "AAI COMPOUND - Ground Floor",
      "LVP COMPOUND -Ground Floor",
      "LVP COMPOUND -Second Floor",
      "BASEMENT PARKING",
      "Ortigas Office",
      "HDSI",
      "AMHERST DELTA -Ground Floor",
      "OUTDOOR  -Rooftop",
      "FPDI",
      "LVP",
      "BESLI",
      "ULV",
      "STTI",
      "ULSSI",
      "SEVICES BUILDING - 2nd Floor",
      "UNAHCO SHERIDAN BUILDING - 2nd Floor",
      "LVP COMPOUND",
      "UlSSI New Wing",
      "AMHERST - Admin",
      "Tess Area",
      "X-Trail",
      "Ulcc - Parking",
      "LVP - Dent",
      "PHAREX",
      "ANI"
  ],
  "edc": [
    'OCC',
    'RBC',
    'SAMDI',
    'PETRO-LAB',
    'OCO',
    'DCO',
    'LCO',
    'KCO',
    'CDO',
    'NIGBU',
    'MAGBU',
    'BacMan',
    'LGBU',
    'WINBU'
  ]
}
let locations = [];

location.sap.map((data,index) => {
  locations.push({
      client_id: 1,
      name: data,
      description: data,
      createdAt: location_createdAt,
      updatedAt: location_updatedAt
  })
});

location.unilab.map((data,index) => {
  locations.push({
      client_id: 6,
      name: data,
      description: data,
      createdAt: location_createdAt,
      updatedAt: location_updatedAt
  })
});

location.edc.map((data,index) => {
  locations.push({
      client_id: 7,
      name: data,
      description: data,
      createdAt: location_createdAt,
      updatedAt: location_updatedAt
  })
});

let locations_with_ids = []
locations.map((data, index) => {
    data.id = parseInt(index+1);
    locations_with_ids.push(data);
});
locations = locations_with_ids;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Clients', clients);
    await queryInterface.bulkInsert('Recipients', recipients);
    await queryInterface.bulkInsert('Locations', locations);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Clients', null, {});
    await queryInterface.bulkDelete('Recipients', null, {});
    await queryInterface.bulkDelete('Locations', null, {});
  }
};