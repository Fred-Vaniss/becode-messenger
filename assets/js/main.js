(() => {
    // getElementsById shortcut
    const elem = (id) => {return document.getElementById(id)};

    // get elements
    let status = elem('status')
    let messages = elem('messages')
    let textarea = elem('textarea')
    let username = elem('username')
    let clearBtn = elem('clear')

    // Status par défaut
    let statusDefault = status.textContent;

    const setStatus = s => {
        status.textContent = s;

        if (s !== statusDefault){
            let delay = setTimeout(()=>{
                setStatus(statusDefault);
            }, 4000)
        }
    }

    // Connection à socket.io
    let socket = io.connect('http://10.203.0.75:8080')

    // Vérification de la connection
    if(socket !== undefined){
        console.log('Connected to socket...');

        socket.on('output', data => {
            console.log(data)

            // Si il y a des messages à lister
            if(data.length){
                // On boucle les différents messages pour les afficher dans la fenêtre
                for(let i = 0; i < data.length; i++) {
                    let message = document.createElement("div");
                    message.className = 'chat-message'
                    message.textContent = `${data[i].name}: ${data[i].message}`
                    messages.appendChild(message)
                    // messages.insertBefore(message, messages.firstChild)
                }
            }
        });

        socket.on('status', (data) => {
            // Obtenir le message de status
            setStatus((typeof data === 'object') ? data.message : data);

            // Si le status est clear, on nettoie le teste
            if(data.clear){
                textarea.value = ''
            }
        });

        // Gestion input
        textarea.addEventListener('keydown', event => {
            // Si on appuie sur la touche "entrer" et qu'on n'appuie pas sur "majuscule"
            if(event.which === 13 && event.shiftKey == false){
                socket.emit('input', {
                    name: username.value,
                    message: textarea.value
                });

                event.preventDefault();
            }
        })

        // Gestion chat clear
        clearBtn.addEventListener('click', () => {
            socket.emit('clear');
        });

        socket.on('cleared', () => {
            messages.textContent = '';
        })
    }
})()