const websockets_api = "wss://node.somenano.com/repeater"

/* Nano websockets */
function new_websocket(url, ready_callback, message_callback) {
    let socket = new WebSocket(url);
    socket.onopen = function () {
        console.log('WebSocket is now open');
        if (ready_callback !== undefined) ready_callback(this);
    }
    socket.onerror = function (e) {
        console.error('WebSocket error');
        console.error(e);
    }
    socket.onmessage = function (response) {
        console.log('New message from: ' + url);
        if (message_callback !== undefined) message_callback(response);
    }

    return socket;
}

function start_websockets(callback) {
    new_websocket(websockets_api, function (socket) {
        // onopen
        let params = {
            action: 'subscribe',
            topic: 'confirmation'
        }
        socket.send(JSON.stringify(params));
    }, function (response) {
        // onmessage
        let data = JSON.parse(response.data);
        if (data.topic != 'confirmation') return;
        handle_block_dump(data, callback);
    });
}


function handle_block_dump(data, callback) {
    let dtg, cps, blocks, duration = undefined;
    try {
        dtg = new Date(data.dtg);
        cps = data.cps;
        blocks = data.blocks;
        duration = data.duration;
    } catch (e) {
        console.error('In index.handle_block_dump: error parsing received WebSocket data.');
        console.error(data);
        console.error(e);
        return;
    }

    // Iterate over each block and "handle" spread over the given duration
    let spread = duration / blocks.length;
    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];
        setTimeout(function () { callback(block); }, spread * i);
    }

}