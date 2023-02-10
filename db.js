const { MongoClient } = require('mongodb');

let dbConnection;

module.exports = {
  connectToDb: (callBack) => {
    MongoClient.connect(
      'mongodb+srv://vinitJain:t6zaKvYJh!t4263@cluster0.8bi136y.mongodb.net/brogrammersDB?retryWrites=true&w=majority',
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
