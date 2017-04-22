// Show ping in chat

// Configs
const INTERVAL = 3000; // Sets the frequency to ping in milliseconds (ms)
const CHAT_CHANNEL = 24; // Sets which channel to display the ping message

module.exports = function ShowPingInChat(dispatch) {
    let enabled = false;
    let pending = false;
    let pingStart = Date.now();

    const timeout = setInterval(() => {
        if (enabled) {
            requestPing();
        }
    }, INTERVAL);

    const requestPing = () => {
        if (pending) {
            return false;
        }
        pingStart = Date.now();
        pending = true;
        dispatch.toServer('C_REQUEST_GAMESTAT_PING', 1);
    };

    const toggle = (enable) => {
        enabled = enable;
        if (enabled) {
            const frequency = INTERVAL / 1000;
            printMessage('Ping : Requesting ping every ' + frequency + 'second(s)', CHAT_CHANNEL);
        } else {
            printMessage('Ping : Auto ping is now off', CHAT_CHANNEL);
        }
    }

    const printMessage = (message, channel) => {
		dispatch.toClient('S_CHAT', 1, {
			channel: channel,
			authorID: 0,
			unk1: 0,
			gm: 0,
			unk2: 0,
			authorName: '',
			message: message,
		});
	};

    dispatch.hook('S_RESPONSE_GAMESTAT_PONG', 1, (event) => {
        if (enabled && pending) {
            ping = Date.now() - pingStart;
            pending = false;
            let message= 'Ping : ' + ping + 'ms';
            printMessage(message, CHAT_CHANNEL);
        }
    });

    dispatch.hook('C_CHAT', 1, (event) => {
        if (event.message.includes('!ping on')) {
            toggle(true);
        } else if (event.message.includes('!ping off')) {
            toggle(false);
        } else if (event.message.includes('!ping')) {
            toggle(!enabled);
        }
    });
}
