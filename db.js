const { MongoClient } = require('mongodb');

let dbConnection;

module.exports = {
  connectToDb: (callBack) => {
    MongoClient.connect(
      'mongoUri',
      {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
      .then((client) => {
        dbConnection = client.db();
        return callBack;
        // console.log('connected');
        // client.close();
      })
      .catch((err) => {
        console.log(err);
        return callBack(err);
      });
  },
  getDb: () => dbConnection,
};
