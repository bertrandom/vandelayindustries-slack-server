# vandelayindustries-slack-server

Post gifs from Seinfeld to Slack. An introduction to this and a technical writeup of the GIF processing is available [here](https://medium.com/@bertrandom/unfundable-slack-bots-9369a75fdd).

## installation

Install the library dependencies with:

`npm install`

Copy `config/default.json5` to `config/local.json5` and put in your Slack API client ID and client secret.

You'll need to have an instance of Elasticsearch running with the Seinfeld subtitle data. The generation of this data will be available in another repo, but I need to clean up the code a bit (coming soon!).

## usage

Run the server with:

`node index`

This will open up the port specified in the config. If you want to run on port 80, you'll likely have to run it as root:

`sudo node index`

## license

ISC