# Show Ping In Chat

Basic module for tera-proxy (https://github.com/meishuu/tera-proxy)

Ping the server in fixed interval and log it to chat

**Usage:**

Turn on by typing `!ping on`

Turn it off with `!ping off`

Or simply use `!ping` to toggle between on / off

Modify `index.js` to configure the following:
```
const INTERVAL = 3000; // Sets the frequency to ping in milliseconds (ms)
const CHAT_CHANNEL = 24; // Sets which channel to display the ping message
```
