// Show ping in chat

// Configs
const INTERVAL = 2000; // Sets the frequency to ping in milliseconds (ms)
const CHAT_CHANNEL = 12; // Sets which channel to display the ping message (Hint: 10 + n where n = private channel number)
const DEFAULT_WARN_THRESHOLD = 280; // Default threshold for warning when the module loads, you can change this value in game

module.exports = function ShowPingInChat(dispatch) {
    let enabled = false;
    let pending = false;
    let warn = true;
    let threshold = DEFAULT_WARN_THRESHOLD;
    let pingStart = Date.now();

    const timeout = setInterval(() => {
        if (enabled || warn) {
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
            printMessage('Ping : Requesting ping every ' + frequency + ' second(s)', CHAT_CHANNEL);
        } else {
            printMessage('Ping : Auto ping is now off', CHAT_CHANNEL);
        }
    };

    const toggleWarning = (enable) => {
        warn = enable;
        if (warn) {
            printMessage('Ping : Show warning when latency exceeds ' + threshold + 'ms', CHAT_CHANNEL);
        } else {
            printMessage('Ping : Warning is now off', CHAT_CHANNEL);
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
        ping = Date.now() - pingStart;
        if (enabled && pending) {
            let message = 'Ping : ' + ping + 'ms';
            if (warn && ping >= threshold) {
                message = 'Ping : <FONT COLOR="#FF0000">' + ping + 'ms</FONT>';
            }
            printMessage(message, CHAT_CHANNEL);
        } else if (warn && pending && ping >= threshold) {
            let message = 'Ping : <FONT COLOR="#FF0000">' + ping + 'ms</FONT>';
            printMessage(message, CHAT_CHANNEL);
        }
        pending = false;
    });

    dispatch.hook('C_CHAT', 1, (event) => {
        // Sets the threshold for warning
        const thresholdRegex = /!ping warn ([0-9]+)/;
        const match = thresholdRegex.exec(event.message);
        const newThreshold = match ? match[1] : null;
        if (newThreshold) {
            threshold = newThreshold;
            toggleWarning(true);
        } else if (event.message.includes('!ping warn on')) {
            toggleWarning(true);
        } else if (event.message.includes('!ping warn off')) {
            toggleWarning(false);
        } else if (event.message.includes('!ping warn')) {
            toggleWarning(!warn);
        } else if (event.message.includes('!ping on')) {
            toggle(true);
        } else if (event.message.includes('!ping off')) {
            toggle(false);
        } else if (event.message.includes('!ping')) {
            toggle(!enabled);
        } else {
            return;
        }
        return false;
    });
}
