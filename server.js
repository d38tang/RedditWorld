const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors')
const databseUrl = ""; //url to connect to database

MongoClient.connect(databaseUrl, function(err, database){

  if (err) return console.log(err);

  app.use(bodyParser.json());
  app.use(cors());

  var db = database;

  io.on('connection', function(socket){

    console.log('user connected');

    socket.on('chat message', function(data){

        db.collection(data.subreddit).save(data, function(err, result){
          db.collection(data.subreddit).find().toArray(function(err, chatHistory){
            if (err) console.log(err);
            io.emit('chat message', chatHistory);
          })
        })
    })

    socket.on('disconnect', function(){
      console.log('user disconnected');
    })
  })

  http.listen(3001, function(){
    console.log('App listening on port 3001');
  })

  app.post('/subreddits', function(req, res, next){
    let subreddit = req.body.subreddit;

    db.listCollections({name: subreddit}).toArray(function(err, collections){
      if (err){
        console.log(err);
      }
      // if the collection exists
      if (collections.length > 0){
        db.collection(subreddit, function(err, collection){
          if (err) console.log(err);
          else{

            collection.find().toArray(function(err, results){
              if (err) return err;
              res.send(JSON.stringify({
                result: "success",
                subreddit: subreddit,
                chat: results
              }))
            });
          }
        })
      }
      else {
        res.send(JSON.stringify({result: "error"}));
      }
    })
  });

});
