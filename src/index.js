const net = require('net');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  const headerData = data
    .split('\r\n')
    .find((chunk) => chunk.startsWith(header));

  return headerData.split(': ').pop();
};

const startOfResponse = 'HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n';
// inserting line breaks as required
const endOfResponse = '\r\n\r\n';
// how to inform end of requests

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');

    getLocationInfos(clientIP, (locationData) => {
      socket.write(startOfResponse);
      socket.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write('<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
      socket.write('</body></html>');
      socket.write(`<p data-testid="ip">${clientIP}</p>`);
      // format of locationData object thanks to console.log in location.js file
      // visible when putting node src/index.js in terminal
      socket.write(`<p data-testid="city">${locationData.city}</p>`);
      socket.write(`<p data-testid="postal_code">${locationData.postal_code}</p>`);
      socket.write(`<p data-testid="region">${locationData.region_name}</p>`);
      socket.write(`<p data-testid="country">${locationData.country_name}</p>`);
      socket.write(`<p data-testid="company">${locationData.company}</p>`);
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080);
