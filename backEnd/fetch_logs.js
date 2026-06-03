const http = require('https');

const options = {
  hostname: 'e-teck-projects.click',
  port: 443,
  path: '/api/tasks/debug-logs',
  method: 'GET',
  rejectUnauthorized: false // equivalent to curl -k
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.success) {
        console.log('--- Matching Nginx Log Lines ---');
        json.lines.forEach((line) => {
          if (line.includes('/uploads') || line.toLowerCase().includes('office') || line.toLowerCase().includes('microsoft') || line.includes('404') || line.includes('403')) {
            console.log(line);
          }
        });
      } else {
        console.error('API Error:', json.error);
      }
    } catch (e) {
      console.error('Parse Error:', e.message);
      console.log('Raw response:', data.slice(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('Request Error:', e.message);
});
req.end();
