const app = require('./app');
const port = process.env.PORT || 8090;

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app}
