const promClient = require('prom-client');
const Gauge = promClient.Gauge;

// Define a custom metric for counting active users
const activeUsers = new Gauge({
  name: 'active_users_count',
  help: 'The number of active users currently using the app'
});

// Update active users count
function updateActiveUsers(count) {
  activeUsers.set(count); // Set the value for active users
}

module.exports = {
  activeUsers,
  updateActiveUsers
};
