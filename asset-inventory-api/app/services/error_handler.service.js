const db = require("../models");
const { ErrorJob } = db;

module.exports = (error = `Something went wrong.`, metadata = {}) => {
    const input = {
        metadata: JSON.stringify(metadata),
        error: error.toString()
    };
    ErrorJob.create(input)
    .catch(err => {
        console.log({message: err.message || "Some error occured."});
    });
}