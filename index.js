var config = require('config');
var AgentKeepAlive = require('agentkeepalive');
var express = require('express');
var sprintf = require("sprintf-js").sprintf;
var bodyParser = require('body-parser');
var OAuth = require('oauth');
var exphbs  = require('express-handlebars');
var fs = require('fs');

var OAuth2 = OAuth.OAuth2;    
var oauth2 = new OAuth2(config.slack.client_id,
    config.slack.client_secret,
    'https://slack.com/', 
    'oauth/authorize',
    'api/oauth.access', 
    null);

const { Client } = require('@elastic/elasticsearch')
const client = new Client({
    node: config.elasticsearch.node,
    auth: {
        apiKey: config.elasticsearch.api_key_encoded,
    },
    tls: {
        ca: fs.readFileSync('./certs/http_ca.crt'),
        rejectUnauthorized: false
    }
})

var app = express();

app.engine('hb', exphbs({
    defaultLayout: 'main',
    extname: 'hb'
}));

app.set('view engine', 'hb');

app.enable('view cache');

app.use(express.static('static'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/complete', function (req, res) {
    res.render('complete', {complete: true});
});

app.get('/oauth', function (req, res) {

    oauth2.getOAuthAccessToken(
        req.query.code,
        {'grant_type':'client_credentials'},
        function (e, access_token, refresh_token, results) {
            res.redirect('/complete');
        }
    );

});

app.post('/search', async function (req, res) {

    if (!(req.body && typeof req.body.text !== 'undefined')) {

        return res.status(500).json({
            ok: false,
            error: "query_missing"
        });

    }

    var searchQuery = req.body.text;

    try {

        response = await client.search({
            index: config.elasticsearch.index,
            query: {
                match: {
                    text: searchQuery
                }
            },
            size: 5
        });

        var output = {};

        if (response && response.hits && response.hits.hits) {

            var clips = [];

            response.hits.hits.forEach(function(hit) {

                var url = config.imageBaseUrl +
                    'S' + sprintf("%02f", hit._source.season) +
                    'E' + sprintf("%02f", hit._source.episode) +
                    '/' + hit._source.frame + '.gif';

                var clip = {
                    id: hit._id,
                    season: hit._source.season,
                    episode: hit._source.episode,
                    url: url,
                    text: hit._source.text
                };

                clips.push(clip);

            });

            if (clips.length === 0) {
                return res.json({
                    "response_type": "ephemeral",
                    "attachments": [{
                        "text": 'Could not match ' + searchQuery,
                    }]
                });
            }

            var clip = clips[Math.floor(Math.random() * (clips.length))];
            
            var text = clip.text.replace("\n",' ');

            res.json({
                "response_type": "in_channel",
                "attachments": [{
                    "text": 'Season ' + clip.season + ', ' + 'Episode: ' + clip.episode,
                    "image_url": clip.url
                }]
            });

        }        

    } catch (error) {

        res.json({
            "response_type": "ephemeral",
            "attachments": [{
                "text": 'Oops, there was an error searching for ' + searchQuery,
            }]
        });

    }

});


async function main() {
    try {
        const result = await client.info();
        console.log('Elasticsearch v' + result.version.number + ' is running...');

        app.listen(config.port, function () {
            console.log('Server started on port ' + config.port + '.');
        });

    } catch (error) {
        console.error('Elasticsearch is not available at ' + config.elasticsearch.host);
        process.exit(1);
        return;
    }
}
  
main();