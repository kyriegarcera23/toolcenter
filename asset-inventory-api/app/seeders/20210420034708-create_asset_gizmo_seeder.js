
'use strict';

let asset_gizmos = [
  {
    "hardware_id": 2,
    "vendor": "Mcafee Siem",
    "model_number": "MSP-ETM3-OTA",
    "description": "MFE Ent Sec Mgr X6 Appl One Time MSP",
    "serial_number": "B070632408",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 3,
    "vendor": "Mcafee Siem",
    "model_number": "MSP-ETM3-OTA",
    "description": "MFE Ent Sec Mgr X6 Appl One Time MSP",
    "serial_number": "B070639464",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 4,
    "vendor": "Mcafee Siem",
    "model_number": "MSP-ACE1-OTA",
    "description": "MFE Adv Corr Eng 3450 Appl One Time MSP",
    "serial_number": "B070638451",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 5,
    "vendor": "Mcafee Siem",
    "model_number": "MSP-ETM3-OTA",
    "description": "MFE Ent Sec Mgr X6 Appl One Time MSP",
    "serial_number": "B070635421",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 6,
    "vendor": "Mcafee Siem",
    "model_number": "MSP-ELM1-OTA",
    "description": "MFE Ent Log Mgr 4600 Appl One Time MSP",
    "serial_number": "B070638455",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 7,
    "vendor": "Mcafee Siem",
    "model_number": "MSP-ERC10-OTA",
    "description": "MFE EventReceiver 1260 Appl One Time MSP",
    "serial_number": "B070622289",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 8,
    "vendor": "Mcafee Siem",
    "model_number": "MSP-ERC10-OTA",
    "description": "MFE EventReceiver 1260 Appl One Time MSP",
    "serial_number": " B070622290",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 9,
    "vendor": "Mcafee Siem",
    "model_number": "MSP-DAS3-OTA",
    "description": "MFE Dir Attached Storage 50 One Time MSP",
    "serial_number": "B070635428",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 10,
    "vendor": "Mcafee Siem",
    "model_number": "MSP-DAS3-OTA",
    "description": "MFE Dir Attached Storage 50 One Time MSP",
    "serial_number": "B070635429",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 11,
    "vendor": "Mcafee Siem",
    "model_number": "H3V20006472S",
    "description": "HDD SATA HGST",
    "serial_number": "P5J4448W",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 12,
    "vendor": "Mcafee Siem",
    "model_number": "H3V20006472S",
    "description": "HDD SATA HGST",
    "serial_number": "P5J4BL8X",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 13,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G7YWAY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 14,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8B42Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 15,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": " N4G7YWMY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 16,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8B72Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 17,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G828LY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 18,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8B9SY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 19,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8UDY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 20,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8BHOY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 21,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G82UGY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 22,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8BM1Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 23,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G82UPY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 24,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8BMRY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 25,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G82V1Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 26,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8BNJY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 27,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G82V5Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 28,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8BS6Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 29,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G82V8Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 30,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8D5SY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 31,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G83BBY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 32,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8D7XY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 33,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G86P2Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 34,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8D95Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 35,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8981Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 36,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8D9BY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 37,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8983Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 38,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8DMWY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 39,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8985Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 40,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8DVBY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 41,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8986Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 42,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8986Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 43,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8DWMY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 44,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8987Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 45,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8DZUY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 46,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G898EY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 47,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8DZZY,",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 48,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G89MNY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 49,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8E07Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 50,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G89SRY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 51,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8E09Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 52,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8AA5Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 53,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8E0BY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 54,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8AH6Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 55,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8E0EY,",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 56,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8AXVY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 57,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8E0JY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 58,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8B1HY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 59,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8E0YY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 60,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8E14Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 61,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8B2MY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 62,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8B2TY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 63,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8E3EY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 64,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8B3DY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 65,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8GP5Y",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 66,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8B3HY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 67,
    "vendor": "Mcafee Siem",
    "model_number": "HUS726020ALA610",
    "description": "HDD  3.5\" SATA Drives",
    "serial_number": "N4G8GSWY",
    "warranty_type": "Perpetual"
  },
  {
    "hardware_id": 68,
    "vendor": "Mcafee Siem",
    "model_number": "406-BBEK",
    "description": "Qlogic 2562, Dual Port 8GB Optical Fiber",
    "serial_number": "UFD1707P99469",
    "warranty_type": ""
  },
  {
    "hardware_id": 69,
    "vendor": "Mcafee Siem",
    "model_number": "406-BBEK",
    "description": "Qlogic 2562, Dual Port 8GB Optical Fiber",
    "serial_number": "UFD1707P99281",
    "warranty_type": ""
  },
  {
    "hardware_id": 70,
    "vendor": "Mcafee Siem",
    "model_number": "FTLF8528P3BCV-QL",
    "description": "SFP Transceiver 8G",
    "serial_number": "NWJ1VNM",
    "warranty_type": ""
  },
  {
    "hardware_id": 71,
    "vendor": "Mcafee Siem",
    "model_number": "FTLF8528P3BCV-QL",
    "description": "SFP Transceiver 8G",
    "serial_number": "NWJ2111",
    "warranty_type": ""
  },
  {
    "hardware_id": 72,
    "vendor": "Mcafee Siem",
    "model_number": "FTLF8528P3BCV-QL",
    "description": "SFP Transceiver 8G",
    "serial_number": "NWK2L3F",
    "warranty_type": ""
  },
  {
    "hardware_id": 73,
    "vendor": "Mcafee Siem",
    "model_number": "FTLF8528P3BCV-QL",
    "description": "SFP Transceiver 8G",
    "serial_number": "NWK2L37",
    "warranty_type": ""
  },
  {
    "hardware_id": 74,
    "vendor": "Forescout",
    "model_number": "CTR/A",
    "description": "CounterACT Appliance (up to 100 Devices)",
    "serial_number": "A16K7007A00420AA",
    "warranty_type": ""
  },
  {
    "hardware_id": 75,
    "vendor": "Verint",
    "model_number": "S5020FDW-DN",
    "description": "High Definition H.264 weather proof and vandal-resistant fixed dome camera.",
    "serial_number": "12VS126260563",
    "warranty_type": ""
  },
  {
    "hardware_id": 76,
    "vendor": "Verint",
    "model_number": "S5020FDW-DN",
    "description": "High Definition H.264 weather proof and vandal-resistant fixed dome camera.",
    "serial_number": "13VS036263385",
    "warranty_type": ""
  },
  {
    "hardware_id": 77,
    "vendor": "Verint",
    "model_number": "S5020FDW-DN",
    "description": "High Definition H.264 weather proof and vandal-resistant fixed dome camera.",
    "serial_number": "13VS036260783",
    "warranty_type": ""
  },
  {
    "hardware_id": 78,
    "vendor": "Verint",
    "model_number": "S5020FDW-DN",
    "description": "High Definition H.264 weather proof and vandal-resistant fixed dome camera.",
    "serial_number": "13VS036260782",
    "warranty_type": ""
  },
  {
    "hardware_id": 79,
    "vendor": "Verint",
    "model_number": "S5020FDW-DN",
    "description": "High Definition H.264 weather proof and vandal-resistant fixed dome camera.",
    "serial_number": "13VS036260781",
    "warranty_type": ""
  },
  {
    "hardware_id": 80,
    "vendor": "Verint",
    "model_number": "S5020FDW-DN",
    "description": "High Definition H.264 weather proof and vandal-resistant fixed dome camera.",
    "serial_number": "13VS036260785",
    "warranty_type": ""
  },
  {
    "hardware_id": 81,
    "vendor": "Verint",
    "model_number": "S5020FDW-DN",
    "description": "High Definition H.264 weather proof and vandal-resistant fixed dome camera.",
    "serial_number": "13VS036260784",
    "warranty_type": ""
  },
  {
    "hardware_id": 82,
    "vendor": "Verint",
    "model_number": "S5020FDW-DN",
    "description": "High Definition H.264 weather proof and vandal-resistant fixed dome camera.",
    "serial_number": "13VS036260678,",
    "warranty_type": ""
  },
  {
    "hardware_id": 83,
    "vendor": "Verint",
    "model_number": "S5020FDW-DN",
    "description": "High Definition H.264 weather proof and vandal-resistant fixed dome camera.",
    "serial_number": "13VS036260676",
    "warranty_type": ""
  },
  {
    "hardware_id": 84,
    "vendor": "Verint",
    "model_number": "S5020FDW-DN",
    "description": "High Definition H.264 weather proof and vandal-resistant fixed dome camera.",
    "serial_number": "13VS036260679",
    "warranty_type": ""
  },
  {
    "hardware_id": 85,
    "vendor": "Verint",
    "model_number": "S5020FDW-DN",
    "description": "High Definition H.264 weather proof and vandal-resistant fixed dome camera.",
    "serial_number": "13VS036260680",
    "warranty_type": ""
  },
  {
    "hardware_id": 86,
    "vendor": "Verint",
    "model_number": "S5020FDW-DN",
    "description": "High Definition H.264 weather proof and vandal-resistant fixed dome camera.",
    "serial_number": "12VS126260565",
    "warranty_type": ""
  },
  {
    "hardware_id": 87,
    "vendor": "Verint",
    "model_number": "S5020FDW-DN",
    "description": "High Definition H.264 weather proof and vandal-resistant fixed dome camera.",
    "serial_number": "12VS126260564",
    "warranty_type": ""
  },
  {
    "hardware_id": 88,
    "vendor": "Verint",
    "model_number": "S5020FDW-DN",
    "description": "High Definition H.264 weather proof and vandal-resistant fixed dome camera.",
    "serial_number": "12VS126260561",
    "warranty_type": ""
  },
  {
    "hardware_id": 89,
    "vendor": "Verint",
    "model_number": "S5020FDW-DN",
    "description": "High Definition H.264 weather proof and vandal-resistant fixed dome camera.",
    "serial_number": "12VS126260562",
    "warranty_type": ""
  },
  {
    "hardware_id": 90,
    "vendor": "Verint",
    "model_number": "E100-2000",
    "description": "Edge VR 100 supporting upto 16 IP Channel",
    "serial_number": "12VF127734381",
    "warranty_type": ""
  },
  {
      "hardware_id": 91,
      "vendor": "Dell Monitor",
      "model_number": "Dell E1916H 18.5\" Widescreen Flat Pane",
      "description": "",
      "serial_number": "YKH87728726A9DN0B, YKH877287269QA83B, YKH877287269QA7FB, YKH877287269QA7LB, YKH87728726A9DKEB, YKH87728726A9DMLB, YKH87728726A9DKMB, YKH877287269QA8RB, YKH877287269QA78B, YKH877287269QA77B, YKH877287269QA76B, YKH87728726A9DKHB, YKH877287269QA8TB, YKH87728726A9DMPB, YKH87728726A9DLFB, YKH87728726A9DL1B, YKH877287269QA8DB, YKH87728726A9DMDB, YKH87728726A9DL2B, YKH87728726A9DLDB, YKH87728726A9DLKB, YKH87728726A9DKJB, YKH87728726A9DMCB, YKH877287269QA6WB, YKH87728726A9DKDB, YKH877287269QA7CB, YKH877287269QA8LB, YKH87728726A9DMJB, YKH87728726A9DMAB, YKH87728726A9DKLB, YKH87728726A9DL3B, YKH87728726A9DMNB, YKH87728726A9DM9B, YKH87728726A9DMEB, YKH87728726A9DMTB, YKH877287269QA75B, YKH877287269QA85B, YKH87728726A9DLCB, YKH87728726A9DMUB, YKH87728726A9DKNB, YKH87728726A9DMMB, YKH87728726A9DLHB, YKH87728726A9DKFB, YKH877287269QA7VB, YKH87728726A9DMFB, YKH877287269QA84B, YKH87728726A9DKGB, YKH87728726A5AJFB, YKH87728726A5AK1B, YKH87728726A5AJKB, YKH87728726A5AHTB, YKH8772872683D9JU, YKH87728726A5AHCB, YKH877287269OF3EB, YKH8772872683D85U, YKH87728726A5AJ4B, YKH87728726A5AJMB, YKH87728726A5AK0B, YKH87728726A5AHEB, YKH8772872683D84U, YKH87728726A5AHGB, YKH87728726A5AJ2B, YKH8772872683D8HU, YKH87728726A5AJLB, YKH87728726A5AHVB, YKH87728726A5AKFB, YKH87728726A5AJPB, YKH87728726A5AK8B, YKH87728726A5AJYB, YKH87728726A5AJCB, YKH877287269OF2JB, YKH877287269OF3FB, YKH8772872683D9HU, YKH877287269OF3TB, YKH87728726A5AHJB, YKH87728726A5AHWB, YKH877287269OF3MB, YKH877287269OF3GB, YKH8772872683D8FU, YKH8772872683D89U, YKH8772872683D9GU, YKH8772872683D9FU, YKH87728726A5AJGB, YKH87728726A5AJ3B, YKH8772872683D8EU, YKH877287269OF2RB, YKH87728726A5AHYB, YKH87728726A5AHKB, YKH8772872683D6FU, YKH87728726A5AK6B",
      "warranty_type": ""
  }
];
let re_asset_gizmos = [];
asset_gizmos.map((asset_gizmo) => {
  asset_gizmo.id = asset_gizmo.hardware_id;
  asset_gizmo.createdAt = new Date();
  asset_gizmo.updatedAt = new Date();
  delete asset_gizmo.hardware_id;
  re_asset_gizmos.push(asset_gizmo);
});
asset_gizmos = re_asset_gizmos;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('AssetGizmos', asset_gizmos);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('AssetGizmos', null, {});
  }
};