import os
import pandas as pd
import numpy as np

# Define directories
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RAW_DATA_DIR = os.path.join(BASE_DIR, 'data', 'raw')
PROCESSED_DATA_DIR = os.path.join(BASE_DIR, 'data', 'processed')

def main():
    # Load raw datasets
    df_reg = pd.read_csv(os.path.join(RAW_DATA_DIR, 'ev_registrations.csv'))
    df_char = pd.read_csv(os.path.join(RAW_DATA_DIR, 'charging_stations_growth.csv'))
    df_demo = pd.read_csv(os.path.join(RAW_DATA_DIR, 'state_demographics.csv'))
    
    # 1. Merge Registrations and Charging Stations on State & Year
    df_master = pd.merge(df_reg, df_char, on=['State', 'Year'], how='left')
    
    # Fill missing values for states that might not have station data in raw (if any)
    df_master['Public_Charging_Stations'] = df_master['Public_Charging_Stations'].fillna(0).astype(int)
    df_master['Slow_Chargers'] = df_master['Slow_Chargers'].fillna(0).astype(int)
    df_master['Fast_Chargers'] = df_master['Fast_Chargers'].fillna(0).astype(int)
    
    # 2. Merge Demographics on State
    df_master = pd.merge(df_master, df_demo, on='State', how='left')
    
    # 3. Calculate YoY Growth Rates
    df_master = df_master.sort_values(by=['State', 'Year']).reset_index(drop=True)
    
    df_master['EV_Growth_YoY_Pct'] = 0.0
    df_master['Charger_Growth_YoY_Pct'] = 0.0
    
    for state in df_master['State'].unique():
        state_indices = df_master[df_master['State'] == state].index
        
        # Calculate EV growth YoY
        ev_prev = df_master.loc[state_indices, 'Total_EV_Registrations'].shift(1)
        ev_curr = df_master.loc[state_indices, 'Total_EV_Registrations']
        # If previous is 0, growth is 0
        ev_growth = ((ev_curr - ev_prev) / ev_prev * 100).fillna(0.0)
        df_master.loc[state_indices, 'EV_Growth_YoY_Pct'] = ev_growth
        
        # Calculate Charger growth YoY
        ch_prev = df_master.loc[state_indices, 'Public_Charging_Stations'].shift(1)
        ch_curr = df_master.loc[state_indices, 'Public_Charging_Stations']
        ch_growth = ((ch_curr - ch_prev) / ch_prev * 100).fillna(0.0)
        # Handle division by zero where previous chargers was 0 and current > 0 (set to 100% or current * 100)
        ch_growth = ch_growth.replace([np.inf, -np.inf], 100.0)
        df_master.loc[state_indices, 'Charger_Growth_YoY_Pct'] = ch_growth
        
    # 4. Calculate Key Derived Indicators
    # EV-to-charger pressure: EVs / Charger. If 0 chargers, set ratio to the number of EVs (as if they share 1 virtual charger, or simply set it to EV count)
    df_master['EV_to_Charger_Ratio'] = np.where(
        df_master['Public_Charging_Stations'] > 0,
        df_master['Total_EV_Registrations'] / df_master['Public_Charging_Stations'],
        df_master['Total_EV_Registrations']
    ).round(2)
    
    # EV density (EVs per sq km)
    df_master['EV_Density_per_SqKm'] = (df_master['Total_EV_Registrations'] / df_master['Area_Sq_Km']).round(4)
    
    # Chargers per million population
    df_master['Chargers_per_Million_Pop'] = (df_master['Public_Charging_Stations'] / df_master['Population_Million']).round(2)
    
    # Save the processed master dataset
    output_path = os.path.join(PROCESSED_DATA_DIR, 'master_ev_dataset.csv')
    df_master.to_csv(output_path, index=False)
    print(f"Preprocessed and saved master dataset containing {df_master.shape[0]} records to {output_path}")

if __name__ == '__main__':
    main()
