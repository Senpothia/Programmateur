const http = require('http');

const app = require('./app');

app.set('port', process.env.PORT || 3000);
const server = http.createServer(app);

var io = require('socket.io')(server);

var usbserial = 'COM3';

// -- SerialPort --

var SerialPort = require('serialport');
var arduino = new SerialPort(usbserial, { autoOpen: false });


// Requetes: traitement communication entre HTML et Server

io.sockets.on('connection', function (socket) {

          // Message à la connection
          console.log('Connexion socket : Ok');

          socket.emit('message', 'Connexion : Ok\n');   // envoi vers html
          // Le serveur reçoit un message du navigateur    

          socket.on('message', function (msg) {
                console.log('reçu de html: ' + msg);        // impression message reçu de html
                socket.emit('message', 'commande envoyé au serveur: ' + msg);

                arduino.write(msg, function (err) {   // envoi vers arduino
                      if (err) {
                        io.sockets.emit('message', err.message);
                        return console.log('Error: ', err.message);
                      }
                });
          });

          socket.on('port', function (port) {   // TODO
                usbserial = port;
                console.log("port sélectionné: " + usbserial);

                // Overture du port serie
                arduino.open(function (err) {
                      if (err) {
                        return console.log('Error opening port: ', err.message);
                      }
                      else {
                        console.log("Communication serie Arduino 9600 bauds : Ok")
                      }
                });


          })
});

// Communication entre Arduino et Serveur

arduino.on('data', function (data) {
  //const firstBuf = Buffer.alloc(1024);
  console.log(data.toString('utf8'));
  io.sockets.emit('message', data.toString('utf8'));   // transmet une string pure vers HTML

});


server.listen(process.env.PORT || 3000);

var date = new Date();
result = date.toUTCString();
console.log('Serveur démarré! - ' + result);

