
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


const site_createdAt = '2020-01-28 09:07:15';
const site_updatedAt = '2020-01-28 09:07:15';
const site = [
    {
        "location_id": 1,
        "name": "41st Floor"
    },
    {
        "location_id": 1,
        "name": "40th Floor"
    },
    {
        "location_id": 1,
        "name": "39th Floor"
    },
    {
        "location_id": 2,
        "name": "9th Floor"
    },
    {
        "location_id": 3,
        "name": "SAMDI City Office Warehouse"
    },
    {
        "location_id": 4,
        "name": "PETRO-LAB City Office"
    },
    {
        "location_id": 5,
        "name": "Ormoc City Office"
    },
    {
        "location_id": 6,
        "name": "2nd Floor Dumaguete City Office"
    },
    {
        "location_id": 7,
        "name": "Legazpi City Office"
    },
    {
        "location_id": 8,
        "name": "Kidapawan City Office"
    },
    {
        "location_id": 9,
        "name": "Cebu Dispatch Office"
    },
    {
        "location_id": 10,
        "name": "Ticala Admin Complex"
    },
    {
        "location_id": 10,
        "name": "Pal1 Admin Complex"
    },
    {
        "location_id": 10,
        "name": "Pal1 FCRS Complex"
    },
    {
        "location_id": 10,
        "name": "Okoy4"
    },
    {
        "location_id": 10,
        "name": "Site-P"
    },
    {
        "location_id": 10,
        "name": "Okoy5"
    },
    {
        "location_id": 10,
        "name": "Nasuji Field"
    },
    {
        "location_id": 10,
        "name": "NN Complex"
    },
    {
        "location_id": 10,
        "name": "Sogongon"
    },
    {
        "location_id": 11,
        "name": "Admin Compound"
    },
    {
        "location_id": 11,
        "name": "UB1 Compound"
    },
    {
        "location_id": 11,
        "name": "Plant Compound"
    },
    {
        "location_id": 11,
        "name": "Accomodation Compound"
    },
    {
        "location_id": 11,
        "name": "Temfacil Compound"
    },
    {
        "location_id": 11,
        "name": "Nursery Compound"
    },
    {
        "location_id": 12,
        "name": "BGI-Palayan"
    },
    {
        "location_id": 12,
        "name": "Admin"
    },
    {
        "location_id": 12,
        "name": "ILS"
    },
    {
        "location_id": 12,
        "name": "Maintenance"
    },
    {
        "location_id": 12,
        "name": "Admin Warehouse"
    },
    {
        "location_id": 12,
        "name": "Nursery"
    },
    {
        "location_id": 12,
        "name": "FCRS"
    },
    {
        "location_id": 12,
        "name": "BGI-Cawayan"
    },
    {
        "location_id": 12,
        "name": "Basecamp"
    },
    {
        "location_id": 13,
        "name": "Tongonan Admin Complex (TAC)"
    },
    {
        "location_id": 13,
        "name": "GCGI"
    },
    {
        "location_id": 13,
        "name": "Guesthouse"
    },
    {
        "location_id": 13,
        "name": "MBPP"
    },
    {
        "location_id": 13,
        "name": "MGPP-A"
    },
    {
        "location_id": 13,
        "name": "MGPP-B"
    },
    {
        "location_id": 13,
        "name": "UMPP"
    },
    {
        "location_id": 13,
        "name": "TND"
    },
    {
        "location_id": 13,
        "name": "Remote Area"
    },
    {
        "location_id": 14,
        "name": "Temfacil"
    },
    {
        "location_id": 14,
        "name": "Sub-Solar"
    },
    {
        "location_id": 14,
        "name": "Substation"
    }
];
let sites = [];

site.map((site) => {
    sites.push({
        location_id: parseInt(site.location_id + 136),
        name: site.name,
        description: site.name,
        createdAt: site_createdAt,
        updatedAt: site_updatedAt
    })    
})

let sites_with_ids = []
sites.map((data, index) => {
    data.id = parseInt(index+1);
    sites_with_ids.push(data);
});
sites = sites_with_ids;

const area_createdAt = '2020-01-28 09:07:15';
const area_updatedAt = '2020-01-28 09:07:15';
const area = [
    {
        "site_id": 12,
        "name": "ILS Building"
    },
    {
        "site_id": 12,
        "name": "Ticala Security Office"
    },
    {
        "site_id": 12,
        "name": "Ticala Conference Room"
    },
    {
        "site_id": 12,
        "name": "PMO and Warehouse Building"
    },
    {
        "site_id": 12,
        "name": "Ticala Admin Building"
    },
    {
        "site_id": 13,
        "name": "Pal1 Admin Building"
    },
    {
        "site_id": 13,
        "name": "Pal1 Instrumentation"
    },
    {
        "site_id": 13,
        "name": "Pal1 Mechanical Shop"
    },
    {
        "site_id": 14,
        "name": "Pal1 Maintenance"
    },
    {
        "site_id": 14,
        "name": "Pal1 Warehouse"
    },
    {
        "site_id": 14,
        "name": "Pal1 FCRS Ctrl Ctr"
    },
    {
        "site_id": 15,
        "name": "Okoy4 Building"
    },
    {
        "site_id": 16,
        "name": "Site-P"
    },
    {
        "site_id": 17,
        "name": "Okoy5 Admin Building"
    },
    {
        "site_id": 17,
        "name": "Okoy5 PP Ctrl Rm"
    },
    {
        "site_id": 18,
        "name": "Nasuji Field Office"
    },
    {
        "site_id": 19,
        "name": "Nasulo PP Building"
    },
    {
        "site_id": 19,
        "name": "Nasuji PP Ctrl Rm"
    },
    {
        "site_id": 19,
        "name": "Nasuji FCRS Ctrl Ctr"
    },
    {
        "site_id": 20,
        "name": "Sogongon Admin Building"
    },
    {
        "site_id": 20,
        "name": "Sogongon PP Ctrl Rm"
    },
    {
        "site_id": 21,
        "name": "Admin bldg."
    },
    {
        "site_id": 21,
        "name": "Geoscience"
    },
    {
        "site_id": 21,
        "name": "Warehouse"
    },
    {
        "site_id": 21,
        "name": "Icc"
    },
    {
        "site_id": 21,
        "name": "Civilworks 1st & 2nd floor Building"
    },
    {
        "site_id": 21,
        "name": "Fcrsm 1st & 2nd floor Building"
    },
    {
        "site_id": 22,
        "name": "Ub1 Building"
    },
    {
        "site_id": 23,
        "name": "M1pp"
    },
    {
        "site_id": 23,
        "name": "M2pp"
    },
    {
        "site_id": 23,
        "name": "Plant admin"
    },
    {
        "site_id": 23,
        "name": "Ei/Mub"
    },
    {
        "site_id": 24,
        "name": "Accomodation Bilding"
    },
    {
        "site_id": 25,
        "name": "Temfacil Guardhouse"
    },
    {
        "site_id": 25,
        "name": "Temfacil Staffhouse"
    },
    {
        "site_id": 26,
        "name": "Nursery bldg"
    },
    {
        "site_id": 27,
        "name": "BGI Palayan Floors - 1st Floor"
    },
    {
        "site_id": 27,
        "name": "BGI Palayan Floors - 2nd Floor"
    },
    {
        "site_id": 27,
        "name": "BGI Palayan Floors - 3rd Floor"
    },
    {
        "site_id": 27,
        "name": "BGI-Warehouse"
    },
    {
        "site_id": 27,
        "name": "BGI-CTR-Room"
    },
    {
        "site_id": 28,
        "name": "Admin Building"
    },
    {
        "site_id": 29,
        "name": "ILS Building"
    },
    {
        "site_id": 30,
        "name": "Maintenance Building"
    },
    {
        "site_id": 31,
        "name": "Admin warehouse Building"
    },
    {
        "site_id": 32,
        "name": "Nursery Building"
    },
    {
        "site_id": 33,
        "name": "FCRS Buidling"
    },
    {
        "site_id": 34,
        "name": "BGI Cawayan Building"
    },
    {
        "site_id": 35,
        "name": "Basecamp Building"
    },
    {
        "site_id": 36,
        "name": "Pneumatic Building"
    },
    {
        "site_id": 36,
        "name": "Civil Works Building"
    },
    {
        "site_id": 36,
        "name": "EI Building"
    },
    {
        "site_id": 36,
        "name": "Security Building"
    },
    {
        "site_id": 36,
        "name": "P2P Building"
    },
    {
        "site_id": 36,
        "name": "Maintenance Building"
    },
    {
        "site_id": 36,
        "name": "Clinic"
    },
    {
        "site_id": 36,
        "name": "WTM"
    },
    {
        "site_id": 36,
        "name": "Production Building"
    },
    {
        "site_id": 36,
        "name": "CD Building"
    },
    {
        "site_id": 37,
        "name": "Admin Building Floors- 1st,2nd,3rd,4th"
    },
    {
        "site_id": 37,
        "name": "Warehouse Building"
    },
    {
        "site_id": 37,
        "name": "Powelink Building"
    },
    {
        "site_id": 37,
        "name": "Switchyard Building"
    },
    {
        "site_id": 38,
        "name": "Guesthouse Main"
    },
    {
        "site_id": 38,
        "name": "Guesthouse Extension"
    },
    {
        "site_id": 38,
        "name": "ILS Building"
    },
    {
        "site_id": 39,
        "name": "Switchyard Building"
    },
    {
        "site_id": 39,
        "name": "LACC Building"
    },
    {
        "site_id": 39,
        "name": "Admin Building"
    },
    {
        "site_id": 39,
        "name": "Powerhouse Building"
    },
    {
        "site_id": 39,
        "name": "Maintenance Building"
    },
    {
        "site_id": 39,
        "name": "Bottoming Building"
    },
    {
        "site_id": 39,
        "name": "Bottoming Control Room Building"
    },
    {
        "site_id": 40,
        "name": "Admin Building 1st and 2nd Floor"
    },
    {
        "site_id": 40,
        "name": "Switchyard"
    },
    {
        "site_id": 40,
        "name": "Maintenance Building"
    },
    {
        "site_id": 40,
        "name": "Topping Building"
    },
    {
        "site_id": 40,
        "name": "Utilities Building"
    },
    {
        "site_id": 41,
        "name": "Control Room Building"
    },
    {
        "site_id": 41,
        "name": "SS3 Building"
    },
    {
        "site_id": 42,
        "name": "Admin Building"
    },
    {
        "site_id": 42,
        "name": "Switchyard Building"
    },
    {
        "site_id": 42,
        "name": "Control Room Building"
    },
    {
        "site_id": 42,
        "name": "Maintenance Building"
    },
    {
        "site_id": 42,
        "name": "Utilities Building"
    },
    {
        "site_id": 42,
        "name": "T1TCP Building"
    },
    {
        "site_id": 43,
        "name": "Control Room Building"
    },
    {
        "site_id": 43,
        "name": "Maintenance Building"
    },
    {
        "site_id": 43,
        "name": "Calibration Building"
    },
    {
        "site_id": 44,
        "name": "RIG12"
    },
    {
        "site_id": 44,
        "name": "Storage warehouse"
    },
    {
        "site_id": 44,
        "name": "Canedong"
    },
    {
        "site_id": 45,
        "name": "Temfacil Compound"
    },
    {
        "site_id": 46,
        "name": "Sub-Solar Compound"
    },
    {
        "site_id": 47,
        "name": "Control and Operation Building"
    },
    {
        "site_id": 47,
        "name": "Sub-Warehouse(VESTAS) Building"
    }
]
let areas = [];

area.map((area) => {
    areas.push({
        site_id: area.site_id,
        name: area.name,
        description: area.name,
        createdAt: area_createdAt,
        updatedAt: area_updatedAt
    })
});

let areas_with_ids = []
areas.map((data, index) => {
    data.id = parseInt(index+1);
    areas_with_ids.push(data);
});
areas = areas_with_ids;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Clients', clients);
    await queryInterface.bulkInsert('Recipients', recipients);
    await queryInterface.bulkInsert('Locations', locations);
    await queryInterface.bulkInsert('Sites', sites);
    await queryInterface.bulkInsert('Areas', areas);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Clients', null, {});
    await queryInterface.bulkDelete('Recipients', null, {});
    await queryInterface.bulkDelete('Locations', null, {});
    await queryInterface.bulkDelete('Sites', null, {});
    await queryInterface.bulkDelete('Areas', null, {});
  }
};