const mongo = require('mongoose');
const client = require('socket.io').listen(4000).sockets;

const dbUrl = 'mongodb+srv://svg93:mongole@mongochat-ini1u.mongodb.net/chat?retryWrites=true&w=majority'


// Connection à mongo
mongo.connect(dbUrl, {useNewUrlParser: true})

let db = mongo.connection

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',() => {
    
    

    console.log('MongoDB connected...')

    // Connection à Socket.io
    client.on('connection', socket => {
        let chat = db.collection('mongo_chat')

        // Création fonction pour envoyer le status
        const sendStatus = s => {
            socket.emit('status', s);
        }

        // Obtenir les chats depuis mongo
        chat.find().limit(100).sort({_id:1}).toArray((err, res) => {
            if (err) throw err;

            // Emettre les messages
            socket.emit('output', res);
        });

        // Gérer les événements d'entrée
        socket.on('input', data => {
            let name = data.name;
            let message = data.message;

            // Vérification du nom et message
            if (name == '' || message == ''){
                // Envoie de status d'erreur
                sendStatus('Veuillez entrer un nom et un message')
            } else {
                chat.insert({name: name, message: message}, () => {
                    client.emit('output', [data])

                    // Envoie de l'objet status
                    sendStatus({
                        message: 'Message envoyée',
                        clear: true
                    })
                })
            }
        })

        // Gestion clear
        socket.on('clear', data => {
            // Suppression de tout le chat
            chat.remove({}, () => {
                // Emit clear
                socket.emit('cleared')
            })
        })
    })
});