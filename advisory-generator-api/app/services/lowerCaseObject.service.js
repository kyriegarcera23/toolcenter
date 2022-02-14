module.exports = (data) => {
    return Object.keys(data).forEach(key => {
        const value = data[key];
        delete data[key];
        data[key.toLowerCase()] = value;
    });
}