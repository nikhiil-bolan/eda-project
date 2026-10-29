/**
 * EVision Enterprise - Standalone Node.js Runner for Flask HTML/CSS/JS App
 * Provides 100% parity with Flask routes on port 8000 without requiring Python setup.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const BASE_DIR = __dirname;
const FLASK_DIR = path.join(BASE_DIR, 'flask_app');
const TEMPLATES_DIR = path.join(FLASK_DIR, 'templates');
const STATIC_DIR = path.join(FLASK_DIR, 'static');

// 12 Seed Stations across major Indian metropolitan corridors
const STATIONS = [
  {
    id: "st-mum-01",
    name: "Tata Power EZ Charge - Bandra Kurla Complex (BKC)",
    operator: "Tata Power EZ Charge",
    address: "G-Block, Near NSE Building, BKC, Bandra East",
    city: "Mumbai",
    state: "Maharashtra",
    latitude: 19.0657,
    longitude: 72.8687,
    totalConnectors: 6,
    availableConnectors: 4,
    powerKW: 60.0,
    pricePerKWh: 18.5,
    connectorType: "CCS2",
    status: "ACTIVE",
    amenities: "24/7 Security, Restroom, Coffee Shop Nearby, CCTV"
  },
  {
    id: "st-mum-02",
    name: "Statiq Charging Hub - Lower Parel High Street",
    operator: "Statiq Networks",
    address: "High Street Phoenix Mall Parking Level P2, Lower Parel",
    city: "Mumbai",
    state: "Maharashtra",
    latitude: 18.9950,
    longitude: 72.8258,
    totalConnectors: 4,
    availableConnectors: 2,
    powerKW: 120.0,
    pricePerKWh: 19.5,
    connectorType: "CCS2",
    status: "ACTIVE",
    amenities: "Shopping Mall, Covered Parking, Food Court, Restroom"
  },
  {
    id: "st-del-01",
    name: "Tata Power Supercharger - Connaught Place (CP)",
    operator: "Tata Power EZ Charge",
    address: "Outer Circle, Near Rajiv Chowk Metro Gate 7, Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    latitude: 28.6328,
    longitude: 77.2197,
    totalConnectors: 8,
    availableConnectors: 6,
    powerKW: 120.0,
    pricePerKWh: 19.0,
    connectorType: "CCS2",
    status: "ACTIVE",
    amenities: "Central Metro Hub, Restaurants, Banks, 24/7 Security"
  },
  {
    id: "st-blr-01",
    name: "Ather Grid & Statiq Supercharger - Indiranagar 100ft Rd",
    operator: "Statiq Networks",
    address: "100 Feet Road, Near HAL 2nd Stage, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    latitude: 12.9784,
    longitude: 77.6408,
    totalConnectors: 6,
    availableConnectors: 5,
    powerKW: 60.0,
    pricePerKWh: 18.0,
    connectorType: "CCS2",
    status: "ACTIVE",
    amenities: "Cafes, Dedicated 2W Fast Bay, CCTV"
  },
  {
    id: "st-pune-01",
    name: "Zeon Fast Charging Hub - Baner Highway",
    operator: "Zeon Charging",
    address: "Mumbai-Bengaluru Highway, Near Cummins Campus, Baner",
    city: "Pune",
    state: "Maharashtra",
    latitude: 18.5590,
    longitude: 73.7868,
    totalConnectors: 4,
    availableConnectors: 3,
    powerKW: 150.0,
    pricePerKWh: 20.0,
    connectorType: "CCS2",
    status: "ACTIVE",
    amenities: "Highway Diner, Restroom, Tyre Pressure Station"
  },
  {
    id: "st-hyd-01",
    name: "ChargeZone DC Fast Supercharger - HITEC City",
    operator: "ChargeZone",
    address: "Opposite Cyber Towers, Madhapur, HITEC City",
    city: "Hyderabad",
    state: "Telangana",
    latitude: 17.4483,
    longitude: 78.3748,
    totalConnectors: 6,
    availableConnectors: 4,
    powerKW: 120.0,
    pricePerKWh: 19.5,
    connectorType: "CCS2",
    status: "ACTIVE",
    amenities: "Tech Park, Food Court, EV Lounge, 24/7 Security"
  },
  {
    id: "st-chn-01",
    name: "Jio-bp pulse EV Hub - OMR IT Expressway",
    operator: "Jio-bp pulse",
    address: "Old Mahabalipuram Road (OMR), Perungudi",
    city: "Chennai",
    state: "Tamil Nadu",
    latitude: 12.9654,
    longitude: 80.2461,
    totalConnectors: 6,
    availableConnectors: 4,
    powerKW: 60.0,
    pricePerKWh: 18.0,
    connectorType: "CCS2",
    status: "ACTIVE",
    amenities: "Wild Bean Cafe, Convenience Store, Fast Air Fill"
  },
  {
    id: "st-lko-01",
    name: "Tata Power EV Charging Station - Gomti Nagar",
    operator: "Tata Power EZ Charge",
    address: "Vibhuti Khand, Near High Court Bench, Gomti Nagar",
    city: "Lucknow",
    state: "Uttar Pradesh",
    latitude: 26.8584,
    longitude: 81.0039,
    totalConnectors: 4,
    availableConnectors: 2,
    powerKW: 60.0,
    pricePerKWh: 18.0,
    connectorType: "CCS2",
    status: "ACTIVE",
    amenities: "24/7 Security, Restrooms, Parking"
  }
];

const BOOKINGS = [
  {
    bookingReference: "EVN-2026-849201",
    stationName: "Tata Power EZ Charge - Bandra Kurla Complex (BKC)",
    address: "G-Block, BKC, Bandra East, Mumbai",
    date: "2026-10-28",
    time: "15:00 - 16:00",
    connectorType: "CCS2 (60 kW)",
    amount: 370.0,
    status: "CONFIRMED"
  }
];

function renderTemplate(templateName, data = {}) {
  const baseHtml = fs.readFileSync(path.join(TEMPLATES_DIR, 'base.html'), 'utf-8');
  let contentHtml = fs.readFileSync(path.join(TEMPLATES_DIR, templateName), 'utf-8');

  contentHtml = contentHtml.replace(/\{%\s*extends\s+[^%]+%\}/g, '');
  contentHtml = contentHtml.replace(/\{%\s*block\s+content\s*%\}/g, '');
  contentHtml = contentHtml.replace(/\{%\s*endblock\s*%\}/g, '');
  contentHtml = contentHtml.replace(/\{%\s*block\s+title\s*%\}[^%]*\{%\s*endblock\s*%\}/g, '');

  let fullHtml = baseHtml.replace(/\{%\s*block\s+content\s*%\}[^%]*\{%\s*endblock\s*%\}/, contentHtml);
  fullHtml = fullHtml.replace(/\{\{\s*url_for\('static',\s*filename='([^']+)'\)\s*\}\}/g, '/static/$1');

  if (data.total_evs) fullHtml = fullHtml.replace(/\{\{\s*"\{:,\}"\.format\(total_evs\)\s*\}\}/g, Number(data.total_evs).toLocaleString());
  if (data.total_chargers) fullHtml = fullHtml.replace(/\{\{\s*"\{:,\}"\.format\(total_chargers\)\s*\}\}/g, Number(data.total_chargers).toLocaleString());
  if (data.ratio) fullHtml = fullHtml.replace(/\{\{\s*ratio\s*\}\}/g, data.ratio);
  if (data.crit_count) fullHtml = fullHtml.replace(/\{\{\s*crit_count\s*\}\}/g, data.crit_count);
  if (data.stations) fullHtml = fullHtml.replace(/\{\{\s*stations\s*\|\s*tojson\s*\}\}/g, JSON.stringify(data.stations));

  // Render station cards in index.html
  if (fullHtml.includes('{% for st in stations %}')) {
    const cardTemplate = `
      <div class="station-card">
        <div>
          <span class="station-badge">__OPERATOR__</span>
          <h3 class="station-name">__NAME__</h3>
          <p class="station-address">__ADDRESS__</p>
          <div class="station-meta">
            <div>
              <span class="text-muted block text-xs">Connector</span>
              <span class="font-bold">__CONN__ (__POWER__ kW)</span>
            </div>
            <div class="text-right">
              <span class="text-muted block text-xs">Available</span>
              <span class="font-bold text-green">__AVAIL__ / __TOTAL__ Bays</span>
            </div>
          </div>
        </div>
        <div class="station-footer">
          <div class="tariff-tag">₹__PRICE__/kWh</div>
          <a href="/booking/__ID__" class="btn-book">Reserve Bay</a>
        </div>
      </div>
    `;
    const stationsHtml = STATIONS.slice(0, 4).map(st => {
      return cardTemplate
        .replace(/__OPERATOR__/g, st.operator)
        .replace(/__NAME__/g, st.name)
        .replace(/__ADDRESS__/g, st.address)
        .replace(/__CONN__/g, st.connectorType)
        .replace(/__POWER__/g, st.powerKW)
        .replace(/__AVAIL__/g, st.availableConnectors)
        .replace(/__TOTAL__/g, st.totalConnectors)
        .replace(/__PRICE__/g, st.pricePerKWh)
        .replace(/__ID__/g, st.id);
    }).join('\n');

    fullHtml = fullHtml.replace(/\{%\s*for\s+st\s+in\s+stations\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g, stationsHtml);
  }

  // Render stations in stations.html
  if (fullHtml.includes('{% for st in stations %}') || fullHtml.includes('class="station-card"')) {
    const listCardTemplate = `
      <div class="station-card">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <span class="station-badge">__OPERATOR__</span>
            <span class="status-pill status-active">● Active</span>
          </div>
          <h3 class="station-name">__NAME__</h3>
          <p class="station-address">📍 __ADDRESS__</p>
          <div class="amenities-tag">Amenities: __AMENITIES__</div>
          <div class="station-meta">
            <div>
              <span class="text-muted block text-xs">Connector</span>
              <span class="font-bold">__CONN__ (__POWER__ kW)</span>
            </div>
            <div class="text-right">
              <span class="text-muted block text-xs">Live Bays</span>
              <span class="font-bold text-green">__AVAIL__ / __TOTAL__ Free</span>
            </div>
          </div>
        </div>
        <div class="station-footer">
          <div>
            <span class="text-muted block text-xs">Official BEE Tariff</span>
            <div class="tariff-tag">₹__PRICE__/kWh</div>
          </div>
          <a href="/booking/__ID__" class="btn-book">Reserve Bay →</a>
        </div>
      </div>
    `;
    const fullStationsHtml = STATIONS.map(st => {
      return listCardTemplate
        .replace(/__OPERATOR__/g, st.operator)
        .replace(/__NAME__/g, st.name)
        .replace(/__ADDRESS__/g, st.address)
        .replace(/__AMENITIES__/g, st.amenities)
        .replace(/__CONN__/g, st.connectorType)
        .replace(/__POWER__/g, st.powerKW)
        .replace(/__AVAIL__/g, st.availableConnectors)
        .replace(/__TOTAL__/g, st.totalConnectors)
        .replace(/__PRICE__/g, st.pricePerKWh)
        .replace(/__ID__/g, st.id);
    }).join('\n');

    fullHtml = fullHtml.replace(/\{%\s*for\s+st\s+in\s+stations\s*%\}([\s\S]*?)\{%\s*else\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g, fullStationsHtml);
  }

  // Render map list
  if (fullHtml.includes('{% for st in stations %}') && fullHtml.includes('focusStation')) {
    const mapItems = STATIONS.map(st => `
      <div class="map-station-item" onclick="focusStation(${st.latitude}, ${st.longitude}, '${st.name}')" style="background: var(--bg-subtle); padding: 0.75rem; border-radius: 10px; cursor: pointer; border: 1px solid var(--border-color); margin-bottom: 0.5rem;">
        <span class="station-badge">${st.operator}</span>
        <h4 style="font-size: 0.8rem; font-weight: 800; margin-top: 0.15rem;">${st.name}</h4>
        <p style="font-size: 0.7rem; color: var(--text-muted); margin: 0.25rem 0;">${st.city}, ${st.state}</p>
        <div style="display: flex; justify-content: space-between; font-size: 0.7rem; font-weight: 700;">
          <span class="text-green">${st.availableConnectors} bays free</span>
          <span class="text-blue">${st.powerKW} kW CCS2</span>
        </div>
      </div>
    `).join('\n');
    fullHtml = fullHtml.replace(/\{%\s*for\s+st\s+in\s+stations\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g, mapItems);
  }

  // Render bookings in my_bookings.html
  if (fullHtml.includes('{% for b in bookings %}')) {
    const bookingHtml = BOOKINGS.map(b => `
      <div class="card" style="padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid var(--primary-color); margin-bottom: 1rem;">
        <div style="flex: 2;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <span class="status-pill status-active">● ${b.status}</span>
            <span style="font-size: 0.75rem; font-family: monospace; font-weight: 700; color: var(--primary-color);">${b.bookingReference}</span>
          </div>
          <h3 style="font-size: 1.1rem; font-weight: 800; margin-top: 0.25rem;">${b.stationName}</h3>
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">📍 ${b.address}</p>
          <div style="display: flex; gap: 1.5rem; margin-top: 0.75rem; font-size: 0.75rem;">
            <div><span class="text-muted block text-xs">Slot Schedule</span><span class="font-bold">${b.date} | ${b.time}</span></div>
            <div><span class="text-muted block text-xs">Connector</span><span class="font-bold">${b.connectorType}</span></div>
            <div><span class="text-muted block text-xs">Amount Paid</span><span class="font-bold text-green">₹${b.amount}0</span></div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end;">
          <button onclick="window.print()" class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.75rem;">🖨️ Print Pass</button>
          <a href="/map" class="btn-outline" style="padding: 0.5rem 1rem; font-size: 0.75rem; text-decoration: none;">🗺️ Navigate</a>
        </div>
      </div>
    `).join('\n');
    fullHtml = fullHtml.replace(/\{%\s*for\s+b\s+in\s+bookings\s*%\}([\s\S]*?)\{%\s*else\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g, bookingHtml);
  }

  fullHtml = fullHtml.replace(/\{%[\s\S]*?%\}/g, '');
  return fullHtml;
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  // PWA manifest and service worker
  if (url === '/manifest.json') {
    const manifestPath = path.join(STATIC_DIR, 'manifest.json');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return fs.createReadStream(manifestPath).pipe(res);
  }
  if (url === '/sw.js') {
    const swPath = path.join(STATIC_DIR, 'sw.js');
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    return fs.createReadStream(swPath).pipe(res);
  }

  // Static files
  if (url.startsWith('/static/')) {
    const relPath = url.replace('/static/', '');
    const filePath = path.join(STATIC_DIR, relPath);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath);
      const mimeTypes = {
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml'
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
      return fs.createReadStream(filePath).pipe(res);
    }
  }

  // API Endpoints
  if (url === '/api/stations') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, stations: STATIONS }));
  }

  if (url === '/api/assistant/ask' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      let q = '';
      try { q = JSON.parse(body).question.toLowerCase(); } catch (e) {}
      let answer = "Hello! I am EVA (EVision Assistant). I can help you locate high-speed charging hubs, understand regional Infrastructure Gap metrics, or reserve a charging bay.";
      if (q.includes('gap') || q.includes('formula')) {
        answer = "The Infrastructure Gap Score is calculated as: 0.30 * Deficit + 0.30 * Ratio Pressure + 0.20 * Growth Velocity + 0.20 * Urbanization. Scores >= 75 represent critical deficit corridors.";
      } else if (q.includes('book') || q.includes('slot')) {
        answer = "To reserve a bay, select your desired charging station, choose your connector type (CCS2/Type 2), choose your time slot, and confirm through our secure digital payment gateway.";
      } else if (q.includes('fast') || q.includes('time')) {
        answer = "DC Fast chargers (60kW to 150kW CCS2) deliver 20% to 80% state of charge in approximately 35-50 minutes for typical 40kWh electric SUVs.";
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, answer: answer }));
    });
    return;
  }

  // Booking Form POST Handler
  if (url.startsWith('/booking/') && req.method === 'POST') {
    const stId = url.replace('/booking/', '');
    const st = STATIONS.find(s => s.id === stId) || STATIONS[0];
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const ref = `EVN-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const newBooking = {
        bookingReference: ref,
        stationName: st.name,
        address: st.address,
        date: "2026-10-29",
        time: "14:00 - 15:00",
        connectorType: "CCS2 (60 kW Fast)",
        amount: 370.0,
        status: "CONFIRMED"
      };
      BOOKINGS.unshift(newBooking);

      let confHtml = renderTemplate('booking_confirmation.html');
      confHtml = confHtml.replace(/\{\{\s*booking\.bookingReference\s*\}\}/g, newBooking.bookingReference);
      confHtml = confHtml.replace(/\{\{\s*booking\.stationName\s*\}\}/g, newBooking.stationName);
      confHtml = confHtml.replace(/\{\{\s*booking\.address\s*\}\}/g, newBooking.address);
      confHtml = confHtml.replace(/\{\{\s*booking\.date\s*\}\}/g, newBooking.date);
      confHtml = confHtml.replace(/\{\{\s*booking\.time\s*\}\}/g, newBooking.time);
      confHtml = confHtml.replace(/\{\{\s*booking\.connectorType\s*\}\}/g, newBooking.connectorType);
      confHtml = confHtml.replace(/\{\{\s*booking\.amount\s*\}\}/g, newBooking.amount);
      confHtml = confHtml.replace(/\{\{\s*booking\.bookingReference\|replace\('-', ''\)\s*\}\}/g, newBooking.bookingReference.replace(/-/g, ''));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(confHtml);
    });
    return;
  }

  // Routes
  let html = '';
  try {
    if (url === '/' || url === '/index') {
      html = renderTemplate('index.html', {
        total_evs: 3099920,
        total_chargers: 25867,
        ratio: 119.8,
        crit_count: 5
      });
    } else if (url === '/stations') {
      html = renderTemplate('stations.html');
    } else if (url === '/map') {
      html = renderTemplate('map.html', { stations: STATIONS });
    } else if (url === '/bi-dashboard' || url === '/tableau') {
      html = renderTemplate('bi_dashboard.html');
    } else if (url === '/eda') {
      html = renderTemplate('eda.html');
    } else if (url === '/gap-analysis') {
      html = renderTemplate('gap.html');
    } else if (url === '/forecasting') {
      html = renderTemplate('forecasting.html');
    } else if (url === '/calculator') {
      html = renderTemplate('calculator.html');
    } else if (url.startsWith('/booking/')) {
      const stId = url.replace('/booking/', '');
      const st = STATIONS.find(s => s.id === stId) || STATIONS[0];
      html = renderTemplate('booking.html');
      html = html.replace(/\{\{\s*station\.id\s*\}\}/g, st.id);
      html = html.replace(/\{\{\s*station\.name\s*\}\}/g, st.name);
      html = html.replace(/\{\{\s*station\.operator\s*\}\}/g, st.operator);
      html = html.replace(/\{\{\s*station\.address\s*\}\}/g, st.address);
      html = html.replace(/\{\{\s*station\.pricePerKWh\s*\}\}/g, st.pricePerKWh);
      html = html.replace(/\{\{\s*station\.powerKW\s*\}\}/g, st.powerKW);
      html = html.replace(/\{\{\s*station\.connectorType\s*\}\}/g, st.connectorType);
      html = html.replace(/\{\{\s*station\.availableConnectors\s*\}\}/g, st.availableConnectors);
      html = html.replace(/\{\{\s*station\.totalConnectors\s*\}\}/g, st.totalConnectors);
      html = html.replace(/\{\{\s*station\.amenities\s*\}\}/g, st.amenities);
    } else if (url === '/my-bookings') {
      html = renderTemplate('my_bookings.html');
    } else if (url === '/doorstep') {
      html = renderTemplate('doorstep.html');
    } else if (url === '/assistant') {
      html = renderTemplate('assistant.html');
    } else if (url === '/trip-planner') {
      html = renderTemplate('trip_planner.html');
    } else if (url === '/fleet') {
      html = renderTemplate('fleet.html');
    } else {
      res.writeHead(302, { 'Location': '/' });
      return res.end();
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(html);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    return res.end(`Server Error: ${err.message}`);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡ EVision Enterprise Portal live on http://localhost:${PORT}`);
});

