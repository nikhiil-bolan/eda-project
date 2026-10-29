import os
import pandas as pd
import numpy as np

# Set random seed for reproducibility
np.random.seed(42)

# Define project directories
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RAW_DATA_DIR = os.path.join(BASE_DIR, 'data', 'raw')
PROCESSED_DATA_DIR = os.path.join(BASE_DIR, 'data', 'processed')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
REPORTS_DIR = os.path.join(BASE_DIR, 'reports', 'figures')

# Create directories if they do not exist
for path in [RAW_DATA_DIR, PROCESSED_DATA_DIR, MODELS_DIR, REPORTS_DIR]:
    os.makedirs(path, exist_ok=True)

# List of major Indian States & UTs
states_info = {
    'Uttar Pradesh': {'pop_million': 238.2, 'area_sq_km': 240928, 'urban_pct': 22.3, 'gdp_tier': 'Medium', 'baseline_ev_share': 0.18},
    'Maharashtra': {'pop_million': 126.4, 'area_sq_km': 307713, 'urban_pct': 45.2, 'gdp_tier': 'High', 'baseline_ev_share': 0.12},
    'Karnataka': {'pop_million': 67.8, 'area_sq_km': 191791, 'urban_pct': 38.7, 'gdp_tier': 'High', 'baseline_ev_share': 0.09},
    'Tamil Nadu': {'pop_million': 76.9, 'area_sq_km': 130058, 'urban_pct': 48.4, 'gdp_tier': 'High', 'baseline_ev_share': 0.08},
    'Delhi': {'pop_million': 20.3, 'area_sq_km': 1484, 'urban_pct': 97.5, 'gdp_tier': 'High', 'baseline_ev_share': 0.07},
    'Gujarat': {'pop_million': 63.8, 'area_sq_km': 196024, 'urban_pct': 42.6, 'gdp_tier': 'High', 'baseline_ev_share': 0.06},
    'Rajasthan': {'pop_million': 81.2, 'area_sq_km': 342239, 'urban_pct': 24.9, 'gdp_tier': 'Medium', 'baseline_ev_share': 0.05},
    'West Bengal': {'pop_million': 99.1, 'area_sq_km': 88752, 'urban_pct': 31.9, 'gdp_tier': 'Medium', 'baseline_ev_share': 0.04},
    'Andhra Pradesh': {'pop_million': 53.2, 'area_sq_km': 162970, 'urban_pct': 29.6, 'gdp_tier': 'Medium', 'baseline_ev_share': 0.04},
    'Madhya Pradesh': {'pop_million': 85.4, 'area_sq_km': 308252, 'urban_pct': 27.6, 'gdp_tier': 'Low', 'baseline_ev_share': 0.04},
    'Bihar': {'pop_million': 127.3, 'area_sq_km': 94163, 'urban_pct': 11.3, 'gdp_tier': 'Low', 'baseline_ev_share': 0.03},
    'Kerala': {'pop_million': 35.8, 'area_sq_km': 38863, 'urban_pct': 47.7, 'gdp_tier': 'High', 'baseline_ev_share': 0.03},
    'Punjab': {'pop_million': 30.2, 'area_sq_km': 50362, 'urban_pct': 37.5, 'gdp_tier': 'High', 'baseline_ev_share': 0.02},
    'Haryana': {'pop_million': 28.9, 'area_sq_km': 44212, 'urban_pct': 34.8, 'gdp_tier': 'High', 'baseline_ev_share': 0.02},
    'Telangana': {'pop_million': 38.5, 'area_sq_km': 112077, 'urban_pct': 38.9, 'gdp_tier': 'High', 'baseline_ev_share': 0.02},
    'Odisha': {'pop_million': 46.3, 'area_sq_km': 155707, 'urban_pct': 16.7, 'gdp_tier': 'Low', 'baseline_ev_share': 0.01},
    'Assam': {'pop_million': 35.6, 'area_sq_km': 78438, 'urban_pct': 14.1, 'gdp_tier': 'Low', 'baseline_ev_share': 0.01},
    'Chhattisgarh': {'pop_million': 30.1, 'area_sq_km': 135191, 'urban_pct': 23.2, 'gdp_tier': 'Low', 'baseline_ev_share': 0.01},
    'Jharkhand': {'pop_million': 38.8, 'area_sq_km': 79714, 'urban_pct': 24.0, 'gdp_tier': 'Low', 'baseline_ev_share': 0.01},
    'Uttarakhand': {'pop_million': 11.4, 'area_sq_km': 53483, 'urban_pct': 30.2, 'gdp_tier': 'Medium', 'baseline_ev_share': 0.005},
    'Himachal Pradesh': {'pop_million': 7.5, 'area_sq_km': 55673, 'urban_pct': 10.0, 'gdp_tier': 'Medium', 'baseline_ev_share': 0.003},
    'Goa': {'pop_million': 1.6, 'area_sq_km': 3702, 'urban_pct': 62.2, 'gdp_tier': 'High', 'baseline_ev_share': 0.002},
    'Chandigarh': {'pop_million': 1.2, 'area_sq_km': 114, 'urban_pct': 97.2, 'gdp_tier': 'High', 'baseline_ev_share': 0.002},
    'Puducherry': {'pop_million': 1.4, 'area_sq_km': 479, 'urban_pct': 68.3, 'gdp_tier': 'Medium', 'baseline_ev_share': 0.001},
    'Jammu and Kashmir': {'pop_million': 13.6, 'area_sq_km': 42241, 'urban_pct': 27.4, 'gdp_tier': 'Low', 'baseline_ev_share': 0.001},
    'Tripura': {'pop_million': 4.1, 'area_sq_km': 10491, 'urban_pct': 26.2, 'gdp_tier': 'Low', 'baseline_ev_share': 0.0005},
    'Meghalaya': {'pop_million': 3.3, 'area_sq_km': 22429, 'urban_pct': 20.1, 'gdp_tier': 'Low', 'baseline_ev_share': 0.0002},
    'Manipur': {'pop_million': 3.1, 'area_sq_km': 22327, 'urban_pct': 29.2, 'gdp_tier': 'Low', 'baseline_ev_share': 0.0002},
    'Nagaland': {'pop_million': 2.2, 'area_sq_km': 16579, 'urban_pct': 29.0, 'gdp_tier': 'Low', 'baseline_ev_share': 0.0001},
    'Arunachal Pradesh': {'pop_million': 1.6, 'area_sq_km': 83743, 'urban_pct': 22.9, 'gdp_tier': 'Low', 'baseline_ev_share': 0.0001},
    'Mizoram': {'pop_million': 1.2, 'area_sq_km': 21081, 'urban_pct': 52.1, 'gdp_tier': 'Low', 'baseline_ev_share': 0.0001},
    'Sikkim': {'pop_million': 0.7, 'area_sq_km': 7096, 'urban_pct': 25.2, 'gdp_tier': 'Medium', 'baseline_ev_share': 0.0001}
}

# 1. Generate EV Registrations Data (2020 - 2025)
years = [2020, 2021, 2022, 2023, 2024, 2025]
national_evs = {2020: 120000, 2021: 320000, 2022: 1000000, 2023: 1500000, 2024: 2100000, 2025: 3100000}

registration_records = []

for year in years:
    total_y = national_evs[year]
    shares = {state: info['baseline_ev_share'] * (1 + np.random.uniform(-0.15, 0.15)) for state, info in states_info.items()}
    norm_factor = sum(shares.values())
    shares = {s: v / norm_factor for s, v in shares.items()}
    
    for state, info in states_info.items():
        state_evs = int(total_y * shares[state])
        
        if state == 'Delhi':
            w2_pct, w3_pct, w4_pct, bus_pct = 0.40, 0.35, 0.23, 0.02
        elif info['urban_pct'] > 40:
            w2_pct, w3_pct, w4_pct, bus_pct = 0.50, 0.30, 0.18, 0.02
        else:
            w2_pct, w3_pct, w4_pct, bus_pct = 0.60, 0.33, 0.065, 0.005
            
        r_2w = int(state_evs * w2_pct)
        r_3w = int(state_evs * w3_pct)
        r_4w = int(state_evs * w4_pct)
        r_bus = int(state_evs * (1 - (w2_pct + w3_pct + w4_pct)))
        if r_bus < 0: r_bus = 0
        
        registration_records.append({
            'State': state,
            'Year': year,
            'Registrations_2W': r_2w,
            'Registrations_3W': r_3w,
            'Registrations_4W': r_4w,
            'Registrations_Bus': r_bus,
            'Total_EV_Registrations': r_2w + r_3w + r_4w + r_bus
        })

df_registrations = pd.DataFrame(registration_records)
df_registrations.to_csv(os.path.join(RAW_DATA_DIR, 'ev_registrations.csv'), index=False)
print("Saved ev_registrations.csv")

# 2. Generate Charging Infrastructure Data (2020 - 2025)
real_2025_stations = {
    'Karnataka': 6096,
    'Maharashtra': 4166,
    'Uttar Pradesh': 2326,
    'Delhi': 1957,
    'Tamil Nadu': 1780,
    'Gujarat': 1450,
    'Rajasthan': 1120,
    'Kerala': 980,
    'West Bengal': 850,
    'Telangana': 1200,
    'Andhra Pradesh': 740,
    'Madhya Pradesh': 620,
    'Haryana': 580,
    'Punjab': 490,
    'Bihar': 320,
    'Odisha': 290,
    'Assam': 150,
    'Chhattisgarh': 180,
    'Jharkhand': 140,
    'Uttarakhand': 130,
    'Himachal Pradesh': 80,
    'Goa': 110,
    'Chandigarh': 90,
    'Puducherry': 45,
    'Jammu and Kashmir': 65,
    'Tripura': 25,
    'Meghalaya': 15,
    'Manipur': 12,
    'Nagaland': 8,
    'Arunachal Pradesh': 6,
    'Mizoram': 5,
    'Sikkim': 10
}

charging_records = []
for state, target_2025 in real_2025_stations.items():
    growth_scale = {2020: 0.05, 2021: 0.12, 2022: 0.28, 2023: 0.50, 2024: 0.75, 2025: 1.0}
    for year in years:
        stations = int(target_2025 * growth_scale[year] * np.random.uniform(0.9, 1.1))
        if stations == 0 and target_2025 > 5:
            stations = 1
            
        slow_chargers = int(stations * np.random.uniform(0.70, 0.80))
        fast_chargers = stations - slow_chargers
        
        charging_records.append({
            'State': state,
            'Year': year,
            'Public_Charging_Stations': stations,
            'Slow_Chargers': slow_chargers,
            'Fast_Chargers': fast_chargers
        })

df_charging = pd.DataFrame(charging_records)
df_charging.to_csv(os.path.join(RAW_DATA_DIR, 'charging_stations_growth.csv'), index=False)
print("Saved charging_stations_growth.csv")

# 3. Generate State Demographics Data
demographics_records = []
for state, info in states_info.items():
    demographics_records.append({
        'State': state,
        'Population_Million': info['pop_million'],
        'Area_Sq_Km': info['area_sq_km'],
        'Urbanization_Percentage': info['urban_pct'],
        'GDP_Tier': info['gdp_tier']
    })
df_demographics = pd.DataFrame(demographics_records)
df_demographics.to_csv(os.path.join(RAW_DATA_DIR, 'state_demographics.csv'), index=False)
print("Saved state_demographics.csv")

# 4. Generate UPI Transaction Data for Charging Slot Reservations (Fraud Detection Model training)
n_tx = 5000
tx_id = [f"TXN{100000 + i}" for i in range(n_tx)]
upi_ids = []
amounts = []
hours = []
velocities = []
device_os = []
domains = ['okaxis', 'okicici', 'paytm', 'ybl', 'okhdfc', 'sbi', 'fraudupi_domain']

is_fraud_list = []

for i in range(n_tx):
    amt = float(np.random.choice([
        np.random.uniform(50, 300),
        np.random.uniform(300, 1000),
        np.random.uniform(1500, 5000)
    ], p=[0.70, 0.25, 0.05]))
    
    hour = int(np.random.choice(range(24), p=[
        0.01, 0.01, 0.01, 0.01, 0.01, 0.02,
        0.05, 0.06, 0.08, 0.08, 0.07, 0.06,
        0.05, 0.05, 0.05, 0.06, 0.06, 0.06,
        0.05, 0.05, 0.04, 0.03, 0.02, 0.01
    ]))
    
    velocity = int(np.random.choice([1, 2, 3, 4, 5, 8, 12, 18], p=[0.60, 0.20, 0.10, 0.05, 0.03, 0.01, 0.005, 0.005]))
    os_sys = str(np.random.choice(['Android', 'iOS', 'WebBrowser', 'Unknown_OS'], p=[0.75, 0.20, 0.04, 0.01]))
    domain = str(np.random.choice(domains, p=[0.25, 0.25, 0.20, 0.15, 0.08, 0.06, 0.01]))
    
    fraud_prob = 0.01
    
    if amt > 2000:
        fraud_prob += 0.20
    if hour in [1, 2, 3, 4]:
        fraud_prob += 0.15
    if velocity > 5:
        fraud_prob += 0.30
    if os_sys == 'Unknown_OS':
        fraud_prob += 0.25
    if domain == 'fraudupi_domain':
        fraud_prob += 0.80
        
    is_fraud = int(np.random.rand() < fraud_prob)
    is_fraud_list.append(is_fraud)
    
    user_name = f"user_{np.random.randint(100, 99999)}"
    if domain == 'fraudupi_domain' and is_fraud:
        user_name = "scammer_temp"
    upi_ids.append(f"{user_name}@{domain}")
    amounts.append(round(amt, 2))
    hours.append(hour)
    velocities.append(velocity)
    device_os.append(os_sys)

df_upi = pd.DataFrame({
    'Transaction_ID': tx_id,
    'UPI_ID': upi_ids,
    'Amount_INR': amounts,
    'Hour_of_Day': hours,
    'Transaction_Velocity_1h': velocities,
    'Device_OS': device_os,
    'Is_Fraudulent': is_fraud_list
})

df_upi.to_csv(os.path.join(RAW_DATA_DIR, 'upi_transactions.csv'), index=False)
print("Saved upi_transactions.csv")
print("Data synthesis complete! Created all raw datasets.")
