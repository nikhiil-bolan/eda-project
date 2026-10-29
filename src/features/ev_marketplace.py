import numpy as np

# Catalog of New EVs available in India
NEW_EV_CATALOG = [
    {
        'id': 'tata_nexon',
        'name': 'Tata Nexon EV Max',
        'category': '4-Wheeler SUV',
        'price': 1649000,
        'range_km': 453,
        'battery_kwh': 40.5,
        'top_speed': 140,
        'fast_charge_min': 56,
        'image': 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80',
        'badge': '🏆 Top Seller India'
    },
    {
        'id': 'mg_zs',
        'name': 'MG ZS EV Executive',
        'category': '4-Wheeler SUV',
        'price': 2288000,
        'range_km': 461,
        'battery_kwh': 50.3,
        'top_speed': 175,
        'fast_charge_min': 42,
        'image': 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800&q=80',
        'badge': '⭐ Premium Comfort'
    },
    {
        'id': 'byd_seal',
        'name': 'BYD Seal Performance AWD',
        'category': '4-Wheeler Luxury Sedan',
        'price': 5300000,
        'range_km': 570,
        'battery_kwh': 82.5,
        'top_speed': 180,
        'fast_charge_min': 37,
        'image': 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80',
        'badge': '🚀 0-100 in 3.8s'
    },
    {
        'id': 'ola_s1',
        'name': 'Ola S1 Pro Gen 2',
        'category': '2-Wheeler Scooter',
        'price': 147499,
        'range_km': 195,
        'battery_kwh': 4.0,
        'top_speed': 120,
        'fast_charge_min': 75,
        'image': 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80',
        'badge': '🛵 #1 EV Scooter'
    },
    {
        'id': 'ather_450x',
        'name': 'Ather 450X Apex',
        'category': '2-Wheeler Scooter',
        'price': 189000,
        'range_km': 157,
        'battery_kwh': 3.7,
        'top_speed': 100,
        'fast_charge_min': 45,
        'image': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80',
        'badge': '⚡ Warp Mode Performance'
    },
    {
        'id': 'mahindra_xuv',
        'name': 'Mahindra XUV400 EL Pro',
        'category': '4-Wheeler SUV',
        'price': 1599000,
        'range_km': 456,
        'battery_kwh': 39.4,
        'top_speed': 150,
        'fast_charge_min': 50,
        'image': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
        'badge': '🛡️ Dual-Zone Climate'
    }
]

# Pre-owned Used EV Inventory
USED_EV_INVENTORY = [
    {
        'title': '2022 Tata Nexon EV XZ+ Dark Edition',
        'model': 'Tata Nexon EV',
        'year': 2022,
        'odometer_km': 24500,
        'battery_soh': 96,
        'price': 1080000,
        'original_price': 1650000,
        'location': 'Mumbai, Maharashtra',
        'seller': 'Verified First Owner',
        'image': 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80'
    },
    {
        'title': '2023 MG ZS EV Exclusive LR',
        'model': 'MG ZS EV',
        'year': 2023,
        'odometer_km': 14200,
        'battery_soh': 98,
        'price': 1650000,
        'original_price': 2300000,
        'location': 'Bengaluru, Karnataka',
        'seller': 'Dealer Certified Warranty',
        'image': 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800&q=80'
    },
    {
        'title': '2022 Ola S1 Pro (Coral Glam)',
        'model': 'Ola S1 Pro',
        'year': 2022,
        'odometer_km': 11800,
        'battery_soh': 94,
        'price': 89000,
        'original_price': 140000,
        'location': 'Delhi NCR (South Delhi)',
        'seller': 'Direct Owner',
        'image': 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80'
    },
    {
        'title': '2021 Hyundai Kona Electric Premium',
        'model': 'Hyundai Kona EV',
        'year': 2021,
        'odometer_km': 36000,
        'battery_soh': 91,
        'price': 1290000,
        'original_price': 2400000,
        'location': 'Pune, Maharashtra',
        'seller': 'Company Maintained',
        'image': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'
    }
]

def estimate_used_ev_resale_price(original_price, purchase_year, odometer_km, battery_soh_pct):
    """
    ML-based evaluation model for calculating used EV resale price based on:
    - Age depreciation (15% 1st year, 10% subsequent years)
    - Mileage penalty (₹2.5 per km driven)
    - Battery SOH multiplier (battery is 40% of EV value)
    """
    current_year = 2026
    age_years = max(0, current_year - purchase_year)
    
    # Base depreciation
    if age_years == 0:
        deprec_factor = 0.95
    elif age_years == 1:
        deprec_factor = 0.82
    elif age_years == 2:
        deprec_factor = 0.72
    elif age_years == 3:
        deprec_factor = 0.63
    else:
        deprec_factor = max(0.35, 0.63 - (age_years - 3) * 0.08)
        
    base_value = original_price * deprec_factor
    
    # Mileage adjustments
    mileage_penalty = odometer_km * 1.8
    
    # Battery SOH adjustment (Battery makes up ~40% of residual value)
    soh_ratio = np.clip(battery_soh_pct / 100.0, 0.50, 1.0)
    battery_component = base_value * 0.40 * soh_ratio
    vehicle_component = (base_value * 0.60) - mileage_penalty
    
    estimated_price = max(original_price * 0.15, battery_component + vehicle_component)
    return float(round(estimated_price, -3))
