var config = require('config');
var fs = require('fs');

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

async function main() {
    try {
        const result = await client.info();
        console.log('Elasticsearch v' + result.version.number + ' is running...');

        var searchQuery = "moops";

        searchResults = await client.search({
            index: config.elasticsearch.index,
            query: {
                match: {
                    text: searchQuery
                }
            },
            size: 5
        });

        console.log(searchResults.hits.hits)

    } catch (error) {
        console.error(error);
    }
}
  
main();