import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set style
sns.set_theme(style="whitegrid")
plt.rcParams['figure.figsize'] = (10, 6)

def main():
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    processed_path = os.path.join(BASE_DIR, 'data', 'processed', 'master_ev_dataset.csv')
    figures_dir = os.path.join(BASE_DIR, 'reports', 'figures')
    
    os.makedirs(figures_dir, exist_ok=True)
    
    if not os.path.exists(processed_path):
        print(f"Error: Processed dataset not found at {processed_path}")
        return
        
    df = pd.read_csv(processed_path)
    
    # --- 1. National EV Adoption Trend ---
    plt.figure()
    national_trends = df.groupby('Year')['Total_EV_Registrations'].sum().reset_index()
    sns.lineplot(data=national_trends, x='Year', y='Total_EV_Registrations', marker='o', color='#E63946', linewidth=2.5)
    plt.title('India National EV Registrations Growth (2020-2025)', fontsize=14, fontweight='bold', pad=15)
    plt.xlabel('Year', fontsize=12)
    plt.ylabel('Total EV Registrations (Millions)', fontsize=12)
    plt.tight_layout()
    
    plt.savefig(os.path.join(figures_dir, 'ev_growth_trends.png'), dpi=150)
    plt.close()
    
    # --- 2. Bivariate Scatter Plot: Charging Stations vs. EV Registrations (2025) ---
    plt.figure()
    df_2025 = df[df['Year'] == 2025]
    sns.regplot(data=df_2025, x='Public_Charging_Stations', y='Total_EV_Registrations', 
                scatter_kws={'alpha':0.7, 'color':'#457B9D', 's':80}, line_kws={'color':'#E63946', 'linewidth':2})
    plt.title('Public Charging Stations vs. EV Registrations (State-wise 2025)', fontsize=14, fontweight='bold', pad=15)
    plt.xlabel('Public Charging Stations', fontsize=12)
    plt.ylabel('Total EV Registrations', fontsize=12)
    plt.tight_layout()
    plt.savefig(os.path.join(figures_dir, 'charging_vs_ev_scatter.png'), dpi=150)
    plt.close()
    
    # --- 3. Top 15 States by Infrastructure Gap Score in 2025 ---
    plt.figure(figsize=(12, 6))
    df_top_gaps = df_2025.sort_values(by='Gap_Score', ascending=False).head(15)
    sns.barplot(data=df_top_gaps, x='Gap_Score', y='State', palette='Reds_r')
    plt.title('Top 15 States/UTs by EV Infrastructure Gap Score (2025)', fontsize=14, fontweight='bold', pad=15)
    plt.xlabel('Gap Score (Higher = Greater Pressure)', fontsize=12)
    plt.ylabel('State', fontsize=12)
    plt.tight_layout()
    plt.savefig(os.path.join(figures_dir, 'state_gap_ranking_2025.png'), dpi=150)
    plt.close()
    
    # --- 4. Charger Type Distribution (Slow vs. Fast) over Years ---
    plt.figure()
    charger_types = df.groupby('Year')[['Slow_Chargers', 'Fast_Chargers']].sum().reset_index()
    charger_melted = pd.melt(charger_types, id_vars=['Year'], value_vars=['Slow_Chargers', 'Fast_Chargers'],
                             var_name='Charger_Type', value_name='Count')
    charger_melted['Charger_Type'] = charger_melted['Charger_Type'].replace({
        'Slow_Chargers': 'Slow / AC Chargers',
        'Fast_Chargers': 'Fast / DC Chargers'
    })
    sns.barplot(data=charger_melted, x='Year', y='Count', hue='Charger_Type', palette='viridis')
    plt.title('India Charging Infrastructure Growth by Charger Type (2020-2025)', fontsize=14, fontweight='bold', pad=15)
    plt.xlabel('Year', fontsize=12)
    plt.ylabel('Number of Chargers', fontsize=12)
    plt.legend(title='Charger Type')
    plt.tight_layout()
    plt.savefig(os.path.join(figures_dir, 'charger_type_distribution.png'), dpi=150)
    plt.close()
    
    # --- 5. Mismatch Analysis (EV Growth YoY vs. Charger Growth YoY) ---
    plt.figure()
    # Filter for 2025 and states with substantial EV presence (e.g. > 10,000 registrations)
    df_sub = df_2025[df_2025['Total_EV_Registrations'] > 10000].copy()
    df_sub['Mismatch'] = df_sub['EV_Growth_YoY_Pct'] - df_sub['Charger_Growth_YoY_Pct']
    df_sub_sorted = df_sub.sort_values(by='Mismatch', ascending=False)
    
    sns.barplot(data=df_sub_sorted, x='Mismatch', y='State', color='#A8DADC')
    plt.axvline(x=0, color='red', linestyle='--', linewidth=1.5)
    plt.title('YoY Growth Mismatch (EV Growth % - Charger Growth %) in 2025', fontsize=14, fontweight='bold', pad=15)
    plt.xlabel('Mismatch Pct Points (Positive = EV Adoption Outpacing Infrastructure)', fontsize=12)
    plt.ylabel('State', fontsize=12)
    plt.tight_layout()
    plt.savefig(os.path.join(figures_dir, 'growth_mismatch_2025.png'), dpi=150)
    plt.close()
    
    print("EDA Visualizations generated successfully in reports/figures/")

if __name__ == '__main__':
    main()
