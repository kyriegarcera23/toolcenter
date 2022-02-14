const axios = require('axios');
let baseURLEvent,baseURLUser = ``;

if(process.env.NODE_ENV != 'production')
{
    baseURLEvent = `http://${process.env.SERVER_NAME}:8002/api/events`;
}
else
{
    baseURLEvent = `http://${process.env.SERVER_NAME}/api/events`;
}

if(process.env.NODE_ENV != 'production')
{
    baseURLUser = `http://${process.env.SERVER_NAME}:8001/api/users`;
}
else
{
    baseURLUser = `http://${process.env.SERVER_NAME}/api/users`;
}

const http_event = axios.create({
    baseURL: baseURLEvent,
    headers: {
        "Content-type": "application/json"
    }
});

const http_user = axios.create({
    baseURL: baseURLUser,
    headers: {
        "Content-type": "application/json"
    }
});
  
module.exports = {http_event, http_user};