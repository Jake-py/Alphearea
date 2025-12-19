// simpleAuth.js
const users = [{ username: "test", password: "1234" }];

function authenticate(username, password) {
  return users.some(u => u.username === username && u.password === password);
}

module.exports = authenticate;