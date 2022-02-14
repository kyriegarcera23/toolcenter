const {http_user} = require("../config/axios.config");

module.exports = async (id='') => {
    if(id != '')
    {
        return await http_user.get(`/${id}`)
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log({message: err.message});
            return {message: err.message || 'Ops. Something went wrong.', status_code: 500, data: {}};
        });
    }
    else
    {
        return {message: 'Invalid Input.', status_code: 400, data: {}};
    }
}