# Show Ping In Chat

Basic module for tera-proxy (https://github.com/meishuu/tera-proxy)

Ping the server in fixed interval and log it to chat

![screen cap](http://i.imgur.com/AXmnie8.png)

----

## Usage

**Commands for displaying ping:**

`!ping on` Ping the server in fixed intervals

`!ping off` Stop pinging the server

`!ping` Shortcut toggle between `!ping on` / `!ping off`

**Commands for displaying warnings:**

`!ping warn 300` Display warning when ping exceeds 300ms

`!ping warn on` Turn on warnings (show ping in red)

`!ping warn off` Turn off warnings

`!ping warn` Shortcut toggle for `!ping warn on` / `!ping warn off`

Modify the numbers in `index.js` to configure:
```
const INTERVAL = 2000; // Sets the frequency to ping in milliseconds (ms)
const CHAT_CHANNEL = 12; // Sets which channel to display the ping message (Hint: 10 + n where n = private channel number)
const DEFAULT_WARN_THRESHOLD = 250; // Default threshold for warning when the module loads, you can change this value in game
```
