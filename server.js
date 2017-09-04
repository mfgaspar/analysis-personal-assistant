'use strict';

const APIAI_TOKEN = process.env.APIAI_TOKEN || '6c2c69937f094a7db39bb07f9a004d56';
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID || 'analysisassistant_YYETDGGDNC';
const SERVER_PORT = process.env.PORT || 8443;

const fs = require('fs');
const options = {
  key: fs.readFileSync(__dirname + '/ssl_keys/file.pem'),
  cert: fs.readFileSync(__dirname + '/ssl_keys/file.crt'),
  requestCert: false,
  rejectUnauthorized: false
};

const https = require('https');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images

var https_server = https.createServer(options, app);
const io = require('socket.io')(https_server); // (server, { origins: '*:*'});

const server = https_server.listen(SERVER_PORT, function() {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

io.on('connection', function(socket){
  console.log('a user connected');
});

const apiai = require('apiai')(APIAI_TOKEN);

// Web UI
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

io.on('connection', function(socket) {
  socket.on('chat message', (text) => {
    console.log('Message: ' + text);
    let apiaiReq = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    apiaiReq.on('response', (response) => {
      let aiText = response.result.fulfillment.speech;
      console.log('Bot reply: ' + aiText);
      socket.emit('bot reply', aiText);
    });

    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();

  });
});
