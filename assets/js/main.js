(() => {
    // getElementsById shortcut
    const elem = (id) => {return document.getElementById(id)};

    // get elements
    let status = elem('status')
    let messages = elem('messages')
    let textarea = elem('textarea')
    let username = elem('username')
    let cleatBtn = elem('clear')

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
    let socket = io.connect('http://localhost:4000')

    // Vérification de la connection
    if(socket !== undefined){
        console.log('Connected to socket...');

        socket.on('output', data => {
            console.log(data)
        })
    }
})()