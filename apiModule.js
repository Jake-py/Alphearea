// apiModule.js
const api = process.env.NODE_ENV === 'production' ? require('./apiReal') : require('./apiMocks');

module.exports = api;