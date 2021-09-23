if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

const SESSION_KEY = 'user_session.key';

module.exports = {
    localStorage,
    SESSION_KEY
};