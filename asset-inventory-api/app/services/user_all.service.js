const {http_user} = require("../config/axios.config");

module.exports = async () => {
    return await http_user.get(``)
    .then(response => {
        return response.data;
    })
    .catch(err => {
        console.log({message: err.message});
        return {message: err.message || 'Ops. Something went wrong.', status_code: 500, data: {}};
    });
}