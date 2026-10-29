import os
import json
import math
import pandas as pd
from flask import Flask, render_template, request, jsonify, redirect, url_for, send_file

try:
    from sklearn.linear_model import LinearRegression
    import numpy as np
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

app = Flask(__name__)
app.secret_key = 'evision_enterprise_flask_secret_2026'

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, 'data', 'processed', 'master_ev_dataset.csv')

# Load and prepare dataset with Pandas
def load_data():
    if os.path.exists(DATA_PATH):
        df = pd.read_csv(DATA_PATH)
        return df
    return pd.DataFrame()

df_master = load_data()

# 12 Seed Stations across major Indian metropolitan corridors
STATIONS = [
    {
        "id": "st-mum-01",
        "name": "Tata Power EZ Charge - Bandra Kurla Complex (BKC)",
        "operator": "Tata Power EZ Charge",
        "address": "G-Block, Near NSE Building, BKC, Bandra East",
        "city": "Mumbai",
        "state": "Maharashtra",
        "latitude": 19.0657,
        "longitude": 72.8687,
        "totalConnectors": 6,
        "availableConnectors": 4,
        "powerKW": 60.0,
        "pricePerKWh": 18.5,
        "connectorType": "CCS2",
        "status": "ACTIVE",
        "amenities": "24/7 Security, Restroom, Coffee Shop Nearby, CCTV"
    },
    {
        "id": "st-mum-02",
        "name": "Statiq Charging Hub - Lower Parel High Street",
        "operator": "Statiq Networks",
        "address": "High Street Phoenix Mall Parking Level P2, Lower Parel",
        "city": "Mumbai",
        "state": "Maharashtra",
        "latitude": 18.9950,
        "longitude": 72.8258,
        "totalConnectors": 4,
        "availableConnectors": 2,
        "powerKW": 120.0,
        "pricePerKWh": 19.5,
        "connectorType": "CCS2",
        "status": "ACTIVE",
        "amenities": "Shopping Mall, Covered Parking, Food Court, Restroom"
    },
    {
        "id": "st-del-01",
        "name": "Tata Power Supercharger - Connaught Place (CP)",
        "operator": "Tata Power EZ Charge",
        "address": "Outer Circle, Near Rajiv Chowk Metro Gate 7, Connaught Place",
        "city": "New Delhi",
        "state": "Delhi",
        "latitude": 28.6328,
        "longitude": 77.2197,
        "totalConnectors": 8,
        "availableConnectors": 6,
        "powerKW": 120.0,
        "pricePerKWh": 19.0,
        "connectorType": "CCS2",
        "status": "ACTIVE",
        "amenities": "Central Metro Hub, Restaurants, Banks, 24/7 Security"
    },
    {
        "id": "st-blr-01",
        "name": "Ather Grid & Statiq Supercharger - Indiranagar 100ft Rd",
        "operator": "Statiq Networks",
        "address": "100 Feet Road, Near HAL 2nd Stage, Indiranagar",
        "city": "Bengaluru",
        "state": "Karnataka",
        "latitude": 12.9784,
        "longitude": 77.6408,
        "totalConnectors": 6,
        "availableConnectors": 5,
        "powerKW": 60.0,
        "pricePerKWh": 18.0,
        "connectorType": "CCS2",
        "status": "ACTIVE",
        "amenities": "Cafes, Dedicated 2W Fast Bay, CCTV"
    },
    {
        "id": "st-pune-01",
        "name": "Zeon Fast Charging Hub - Baner Highway",
        "operator": "Zeon Charging",
        "address": "Mumbai-Bengaluru Highway, Near Cummins Campus, Baner",
        "city": "Pune",
        "state": "Maharashtra",
        "latitude": 18.5590,
        "longitude": 73.7868,
        "totalConnectors": 4,
        "availableConnectors": 3,
        "powerKW": 150.0,
        "pricePerKWh": 20.0,
        "connectorType": "CCS2",
        "status": "ACTIVE",
        "amenities": "Highway Diner, Restroom, Tyre Pressure Station"
    },
    {
        "id": "st-hyd-01",
        "name": "ChargeZone DC Fast Supercharger - HITEC City",
        "operator": "ChargeZone",
        "address": "Opposite Cyber Towers, Madhapur, HITEC City",
        "city": "Hyderabad",
        "state": "Telangana",
        "latitude": 17.4483,
        "longitude": 78.3748,
        "totalConnectors": 6,
        "availableConnectors": 4,
        "powerKW": 120.0,
        "pricePerKWh": 19.5,
        "connectorType": "CCS2",
        "status": "ACTIVE",
        "amenities": "Tech Park, Food Court, EV Lounge, 24/7 Security"
    },
    {
        "id": "st-chn-01",
        "name": "Jio-bp pulse EV Hub - OMR IT Expressway",
        "operator": "Jio-bp pulse",
        "address": "Old Mahabalipuram Road (OMR), Perungudi",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "latitude": 12.9654,
        "longitude": 80.2461,
        "totalConnectors": 6,
        "availableConnectors": 4,
        "powerKW": 60.0,
        "pricePerKWh": 18.0,
        "connectorType": "CCS2",
        "status": "ACTIVE",
        "amenities": "Wild Bean Cafe, Convenience Store, Fast Air Fill"
    },
    {
        "id": "st-lko-01",
        "name": "Tata Power EV Charging Station - Gomti Nagar",
        "operator": "Tata Power EZ Charge",
        "address": "Vibhuti Khand, Near High Court Bench, Gomti Nagar",
        "city": "Lucknow",
        "state": "Uttar Pradesh",
        "latitude": 26.8584,
        "longitude": 81.0039,
        "totalConnectors": 4,
        "availableConnectors": 2,
        "powerKW": 60.0,
        "pricePerKWh": 18.0,
        "connectorType": "CCS2",
        "status": "ACTIVE",
        "amenities": "24/7 Security, Restrooms, Parking"
    }
]

# Haversine distance calculator
def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

# In-memory booking store
BOOKINGS = [
    {
        "bookingReference": "EVN-2026-849201",
        "stationName": "Tata Power EZ Charge - Bandra Kurla Complex (BKC)",
        "address": "G-Block, BKC, Bandra East, Mumbai",
        "date": "2026-10-28",
        "time": "15:00 - 16:00",
        "connectorType": "CCS2 (60 kW)",
        "amount": 370.0,
        "status": "CONFIRMED"
    }
]

@app.route('/')
def home():
    df_2025 = df_master[df_master['Year'] == 2025] if not df_master.empty else pd.DataFrame()
    total_evs = int(df_2025['Total_EV_Registrations'].sum()) if not df_2025.empty else 3099920
    total_chargers = int(df_2025['Public_Charging_Stations'].sum()) if not df_2025.empty else 25867
    ratio = round(total_evs / total_chargers, 1) if total_chargers > 0 else 119.8
    crit_count = len(df_2025[df_2025['Gap_Tier'] == 'Critical']) if not df_2025.empty else 5

    return render_template('index.html',
                           total_evs=total_evs,
                           total_chargers=total_chargers,
                           ratio=ratio,
                           crit_count=crit_count,
                           stations=STATIONS[:4])

@app.route('/stations')
def stations():
    city = request.args.get('city', 'All')
    search = request.args.get('search', '').lower()

    filtered = STATIONS
    if city != 'All':
        filtered = [s for s in filtered if s['city'].lower() == city.lower()]
    if search:
        filtered = [s for s in filtered if search in s['name'].lower() or search in s['operator'].lower() or search in s['address'].lower()]

    return render_template('stations.html', stations=filtered, selected_city=city, search=search)

@app.route('/map')
def map_view():
    return render_template('map.html', stations=STATIONS)

@app.route('/bi-dashboard')
@app.route('/tableau')
def bi_dashboard():
    df_2025 = df_master[df_master['Year'] == 2025] if not df_master.empty else pd.DataFrame()
    top_10 = df_2025.sort_values(by='Gap_Score', ascending=False).head(10).to_dict(orient='records') if not df_2025.empty else []
    return render_template('bi_dashboard.html', top_10=top_10)

@app.route('/eda')
def eda():
    df_2025 = df_master[df_master['Year'] == 2025] if not df_master.empty else pd.DataFrame()
    two_w = int(df_2025['Registrations_2W'].sum()) if not df_2025.empty else 1711156
    three_w = int(df_2025['Registrations_3W'].sum()) if not df_2025.empty else 985775
    four_w = int(df_2025['Registrations_4W'].sum()) if not df_2025.empty else 359591
    bus = int(df_2025['Registrations_Bus'].sum()) if not df_2025.empty else 43398
    return render_template('eda.html', two_w=two_w, three_w=three_w, four_w=four_w, bus=bus)

@app.route('/gap-analysis')
def gap_analysis():
    df_2025 = df_master[df_master['Year'] == 2025].sort_values(by='Gap_Score', ascending=False) if not df_master.empty else pd.DataFrame()
    records = df_2025.to_dict(orient='records') if not df_2025.empty else []
    return render_template('gap.html', states=records)

@app.route('/forecasting')
def forecasting():
    df_2025 = df_master[df_master['Year'] == 2025] if not df_master.empty else pd.DataFrame()
    records = []
    if not df_2025.empty:
        for _, row in df_2025.iterrows():
            st_name = row['State']
            current_evs = int(row['Total_EV_Registrations'])
            
            # Scikit-Learn Linear Regression model per state across 2020-2025
            if SKLEARN_AVAILABLE and not df_master.empty:
                st_history = df_master[df_master['State'] == st_name].sort_values(by='Year')
                if len(st_history) >= 3:
                    X = st_history[['Year']].values
                    y = st_history['Total_EV_Registrations'].values
                    reg = LinearRegression().fit(X, y)
                    pred = reg.predict([[2028]])[0]
                    forecast_evs = max(current_evs, int(pred))
                else:
                    forecast_evs = int(current_evs * (1.34 ** 3))
            else:
                forecast_evs = int(current_evs * (1.34 ** 3)) # 2028 projection
            
            req_stations = max(int(row['Public_Charging_Stations']), int(forecast_evs * 0.04))
            shortage = max(0, req_stations - int(row['Public_Charging_Stations']))
            records.append({
                "state": st_name,
                "current_evs": current_evs,
                "forecast_evs": forecast_evs,
                "current_stations": int(row['Public_Charging_Stations']),
                "req_stations": req_stations,
                "shortage": shortage
            })
        records.sort(key=lambda x: x['shortage'], reverse=True)
    return render_template('forecasting.html', forecasts=records)

@app.route('/calculator')
def calculator():
    return render_template('calculator.html')

@app.route('/booking/<station_id>', methods=['GET', 'POST'])
def booking(station_id):
    station = next((s for s in STATIONS if s['id'] == station_id), STATIONS[0])
    if request.method == 'POST':
        date = request.form.get('date', '2026-10-28')
        time = request.form.get('time', '14:00 - 15:00')
        ref = f"EVN-2026-{int(os.urandom(3).hex(), 16) % 900000 + 100000}"
        amount = float(request.form.get('amount', 370.0))
        new_booking = {
            "bookingReference": ref,
            "stationName": station['name'],
            "address": station['address'],
            "date": date,
            "time": time,
            "connectorType": "CCS2 (60 kW Fast)",
            "amount": amount,
            "status": "CONFIRMED"
        }
        BOOKINGS.insert(0, new_booking)
        return render_template('booking_confirmation.html', booking=new_booking)
    return render_template('booking.html', station=station)

@app.route('/my-bookings')
def my_bookings():
    return render_template('my_bookings.html', bookings=BOOKINGS)

@app.route('/doorstep')
def doorstep():
    return render_template('doorstep.html')

@app.route('/assistant')
def assistant():
    return render_template('assistant.html')

@app.route('/trip-planner')
def trip_planner():
    return render_template('trip_planner.html')

@app.route('/fleet')
def fleet():
    return render_template('fleet.html')

@app.route('/manifest.json')
def pwa_manifest():
    return send_file(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'manifest.json'), mimetype='application/json')

@app.route('/sw.js')
def pwa_sw():
    return send_file(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'sw.js'), mimetype='application/javascript')

# API Endpoints
@app.route('/api/stations')
def api_stations():
    return jsonify({"success": True, "stations": STATIONS})

@app.route('/api/assistant/ask', methods=['POST'])
def api_assistant():
    data = request.get_json() or {}
    q = data.get('question', '').lower()
    answer = "Hello! I am EVA (EVision Assistant). I can help you locate high-speed charging hubs, understand regional Infrastructure Gap metrics, or reserve a charging bay."
    if 'gap' in q or 'formula' in q:
        answer = "The Infrastructure Gap Score is calculated as: 0.30 * Deficit + 0.30 * Ratio Pressure + 0.20 * Growth Velocity + 0.20 * Urbanization. Scores >= 75 represent critical deficit corridors."
    elif 'book' in q or 'slot' in q:
        answer = "To reserve a bay, select your desired charging station, choose your connector type (CCS2/Type 2), choose your time slot, and confirm through our secure digital payment gateway."
    elif 'fast' in q or 'time' in q:
        answer = "DC Fast chargers (60kW to 150kW CCS2) deliver 20% to 80% state of charge in approximately 35-50 minutes for typical 40kWh electric SUVs."
    return jsonify({"success": True, "answer": answer})

if __name__ == '__main__':
    print("⚡ Starting EVision Flask Enterprise Server on http://localhost:8000")
    app.run(host='0.0.0.0', port=8000, debug=True)
