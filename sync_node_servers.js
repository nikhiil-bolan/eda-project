const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '..', 'run_server.js'), 'utf-8');
fs.writeFileSync(path.join(__dirname, 'run_node_server.js'), content);

