var fs = require('fs');

var program = require('commander');
var walk = require('walkdir');
var child = require('child_process');
var exec = require('child_process').execSync;
var dump = require('./lib/dump');
var _ = require('lodash');
var elasticsearch = require('elasticsearch');
var AgentKeepAlive = require('agentkeepalive');
var async = require('async');
var sprintf = require("sprintf-js").sprintf;
var exec = require('child_process').exec;

var query = '';

program
	.version('0.0.1')
	.arguments('[query]')
	.action(function(argQuery) {
		query = argQuery;
	});

program.parse(process.argv);





var imgcat = require('./lib/imgcat');
var ansi = require('ansi-escape-sequences');
var request = require('request');
var Box = require("cli-box");

var displayResult = function(url, text, season, episode, callback) {

	request({
		uri: url,
		encoding: null
	}, function (error, response, body) {

		var imgBase64 = body.toString('base64');

		var b1 = Box({
			w: 32,
			h: 7,
			marks: {
	            nw: "┌"
	          , n:  "─"
	          , ne: "┐"
	          , e:  "│"
	          , se: "┘"
	          , s:  "─"
	          , sw: "└"
	          , w:  "│"
	          , b: " "
	        }
		});
		console.log(b1.toString());	
		process.stdout.write(ansi.cursor.previousLine(8));

		process.stdout.write(ansi.cursor.horizontalAbsolute(2));

		process.stdout.write(imgcat(imgBase64));

		process.stdout.write(ansi.cursor.previousLine(8));

		process.stdout.write(ansi.cursor.nextLine());
		process.stdout.write(ansi.cursor.horizontalAbsolute(34));
		process.stdout.write('Season: ' + season);

		process.stdout.write(ansi.cursor.nextLine());
		process.stdout.write(ansi.cursor.horizontalAbsolute(34));
		process.stdout.write('Episode: ' + episode);

		process.stdout.write(ansi.cursor.nextLine(2));
		process.stdout.write(ansi.cursor.horizontalAbsolute(34));
		process.stdout.write(text);

		process.stdout.write(ansi.cursor.nextLine(2));
		process.stdout.write(ansi.cursor.horizontalAbsolute(34));
		process.stdout.write(url);

		process.stdout.write(ansi.cursor.nextLine(3));
		callback();

	});

};



var client = new elasticsearch.Client({
	host: 'localhost:9200',
	sniffOnStart: true,
	maxSockets: 10,
	log: 'error',
	createNodeAgent: function (connection, config) {
		return new AgentKeepAlive(connection.makeAgentConfig(config));
	}
});

var q = async.queue(function (hit, callback) {

	displayResult(hit.url, hit._source.text.replace("\n",' '), hit._source.season, hit._source.episode, callback);

}, 1);

client.search({
	index: 'vandelayindustries',
	body: {
		query: {
		 	"bool": {
		 	  	"must": {
					match: {
						text: query
					},
		 	  	},
				"must_not": [{
					"match": {
					  "seasonEpisode": "S06E14"
					}
				},{
					"match": {
					  "seasonEpisode": "S09E23"
					}
				}]
		    }
		}
	},
	size: 5
}, function (error, response) {

	if (response && response.hits && response.hits.hits) {

		response.hits.hits.forEach(function(hit) {

			// console.log(hit);

//			console.log(hit._id + ': ' + hit._source.text.replace("\n",''));

			var url = 'http://lt.rs/kramerica/' +
				'S' + sprintf("%02f", hit._source.season) +
				'E' + sprintf("%02f", hit._source.episode) +
				'/' + hit._source.frame + '.gif';

			hit.url = url;
			q.push(hit);

//			displayResult(url, hit._source.text.replace("\n",' '), hit._source.season, hit._source.episode);

//			console.log(url);


		});

	}

});