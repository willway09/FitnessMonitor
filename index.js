let http = require('http');
let {URL} = require('url');
let fs = require('fs');

const options = new URL("http://connect2concepts.com/connect2/?type=circle&key=8E2C21D2-6F5D-45C1-AF9E-C23AEBFDA68B");
options.method = 'GET';

function getData() {
	let req = http.request(options, (res) => {
		let html = '';
		let time = new Date();
		res.on('data', (chunk) => {
			html += chunk;
		})
		res.on('end', () => {
			const lines = html.split('\n');
			lines.forEach( (line) => {
				if(line.includes("SRFC Strength")) {
					let find = "Last Count: ";

					let idx = line.search(find);

					let rtn = "";
					let offset = 0;
					let temp = line.charAt(idx + find.length);

					while(temp != "<") {
						rtn += temp;
						offset++;
						temp = line.charAt(idx + find.length + offset);
					}

					fs.appendFile("log.csv", time.getTime() + ", " + rtn + "\n", err => {
						if(err) {
							console.error(err);
						}
					});
				}
			})
		})
	});

	req.end();

	setTimeout(getData, 60000);
}

getData();
