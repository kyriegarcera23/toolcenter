const {http_event} = require("../config/axios.config");

module.exports = async (data) => {
    if(data !== {} && data !== null)
    {
        return await http_event.post('/', data)
        .then(response => {
            return response.data;
        })
        .catch(err => {
            return {message: err.message || 'Ops. Something went wrong.', status_code: 500, data: {}};
        });
    }
    else
    {
        return {message: 'Invalid Input.', status_code: 400, data: {}};
    }
}