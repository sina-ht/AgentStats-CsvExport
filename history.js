// SPDX-License-Identifier: GPL-2.0-only
// history.js -- retrieve your history from agent-stats and write in csv file.
// Copyright(C) 2025 by Hiroshi Takekawa
//
// Tested with:
//  node: v22.13.0
//  got: 14.4.5
//
// Original source is: https://github.com/Suburbanno/AgentStats-CsvExport

import got from 'got';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the path of myself
const __dirname = path.dirname(__filename); // get the name of the directory

const filename = path.join(__dirname, 'history.csv');

var options = {
	headers: {
		"AS-Key": "key-here"
	},
	responseType: 'json'
};

var arr = await got('https://api.agent-stats.com/history', options).json();
var csv_arr = [];

var keys = [];

for (var i = 0; i < arr.length; i++) {
	var k = Object.keys(arr[i]);
	
	for (var j = 0; j < k.length; j++) {
		if (keys.indexOf(k[j]) == -1)
			keys.push(k[j]);
	}
}

var line_header = [];

for (var j = 0; j < keys.length; j++) {
	var el = ''+keys[j];
	
	if (!el)
		line_header.push('');
	else if (el.indexOf(';') != -1 || el.indexOf('"') != -1)
		line_header.push('"' + el + '"');
	else
		line_header.push(el);
}

//csv_arr.push(line_header.join(';'));
//csv_arr.push(line_header.join(','));
csv_arr.push(line_header.join('\t'));

for (var i = 0; i < arr.length; i++) {
	var o = arr[i];
	var line = [];
	
	for (var j = 0; j < keys.length; j++) {
		var el = ''+o[keys[j]];
		
		if (!el)
			line.push('');
		else if (el.indexOf(';') != -1 || el.indexOf('"') != -1)
			line.push('"' + el + '"');
		else
			line.push(el);
	}
	
	//csv_arr.push(line.join(';'));
	//csv_arr.push(line.join(','));
	csv_arr.push(line.join('\t'));
}

fs.writeFileSync(filename, csv_arr.join('\n'));
