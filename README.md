# vandelayindustries-slack-server

Post gifs from Seinfeld to Slack. An introduction to this and a technical writeup of the GIF processing is available here.

## installation

Install the library dependencies with:

`npm install`

Copy `config/default.json5` to `config/local.json5` and put in your Slack API client ID and client secret.

You'll need to have an instance of Elasticsearch running with the Seinfeld subtitle data. The generation of this data will be available in another repo, but I need to clean up the code a bit (coming soon!).

## license

ISC