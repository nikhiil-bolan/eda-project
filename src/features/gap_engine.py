import os
import pandas as pd
import numpy as np

def calculate_gap_score(df):
    """
    Calculates the normalized EV Charging Infrastructure Gap Score (0-100)
    and classifies states into gap severity tiers.
    
    Formula components:
    1. Charger Deficit (30% weight): Difference between actual stations and a target baseline of 25 EVs per station.
    2. EV-to-Charger Ratio pressure (30% weight): Log-scaled ratio of EVs to stations.
    3. EV Growth pressure (20% weight): YoY percentage growth rate of EVs.
    4. Urbanization/Density pressure (20% weight): Urbanization rate representing high density and lack of home charging space.
    """
    df = df.copy()
    
    # 1. Charger Deficit Score
    # Target: 1 public station per 25 EVs (4% target)
    target_stations = df['Total_EV_Registrations'] * 0.04
    deficit = (target_stations - df['Public_Charging_Stations']) / (target_stations + 1)
    deficit_score = np.clip(deficit * 100, 0, 100)
    
    # 2. EV-to-Charger Ratio Pressure Score
    # Log-scaling handles huge outliers cleanly. An EV-to-charger ratio of 100 is high pressure.
    # We clip the score at 100. Let's normalize so a ratio of 50+ corresponds to a score of 100.
    ratio_score = np.clip(np.log1p(df['EV_to_Charger_Ratio']) / np.log1p(50) * 100, 0, 100)
    
    # 3. EV Growth Score
    # Standardize growth: YoY growth of 100%+ is capped at 100.
    growth_score = np.clip(df['EV_Growth_YoY_Pct'], 0, 100)
    
    # 4. Urbanization/Density Score
    # Highly urbanized areas have higher pressure due to high concentration and multi-story housing limits.
    urban_score = df['Urbanization_Percentage']
    
    # Weighted calculation
    raw_gap_score = (
        0.30 * deficit_score +
        0.30 * ratio_score +
        0.20 * growth_score +
        0.20 * urban_score
    )
    
    df['Gap_Score'] = raw_gap_score.round(2)
    
    # Define Tiers based on score thresholds
    # 0 - 35: Low Gap
    # 35 - 55: Moderate Gap
    # 55 - 75: High Gap
    # 75 - 100: Critical Gap
    def get_tier(score):
        if score < 35:
            return 'Low'
        elif score < 55:
            return 'Moderate'
        elif score < 75:
            return 'High'
        else:
            return 'Critical'
            
    df['Gap_Tier'] = df['Gap_Score'].apply(get_tier)
    
    return df

def main():
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    processed_path = os.path.join(BASE_DIR, 'data', 'processed', 'master_ev_dataset.csv')
    
    if os.path.exists(processed_path):
        df = pd.read_csv(processed_path)
        df_gap = calculate_gap_score(df)
        df_gap.to_csv(processed_path, index=False)
        print(f"Gap scores computed and updated in master dataset: {processed_path}")
        print("Gap tier distributions:")
        print(df_gap['Gap_Tier'].value_counts())
    else:
        print(f"Error: Processed master dataset not found at {processed_path}")

if __name__ == '__main__':
    main()
