# District and City level data mapping for Indian States
DISTRICT_DATA = {
    'Maharashtra': [
        {'district': 'Mumbai City & Suburban', 'lat': 19.0760, 'lon': 72.8777, 'stations': 1240, 'ev_count': 145000},
        {'district': 'Pune', 'lat': 18.5204, 'lon': 73.8567, 'stations': 980, 'ev_count': 112000},
        {'district': 'Nagpur', 'lat': 21.1458, 'lon': 79.0882, 'stations': 420, 'ev_count': 45000},
        {'district': 'Thane', 'lat': 19.2183, 'lon': 72.9781, 'stations': 510, 'ev_count': 58000},
        {'district': 'Nashik', 'lat': 19.9975, 'lon': 73.7898, 'stations': 280, 'ev_count': 32000},
        {'district': 'Aurangabad (Chhatrapati Sambhajinagar)', 'lat': 19.8762, 'lon': 75.3433, 'stations': 210, 'ev_count': 24000}
    ],
    'Delhi': [
        {'district': 'South Delhi (Saket / Hauz Khas)', 'lat': 28.5244, 'lon': 77.2188, 'stations': 520, 'ev_count': 62000},
        {'district': 'Central Delhi (Connaught Place)', 'lat': 28.6315, 'lon': 77.2167, 'stations': 480, 'ev_count': 55000},
        {'district': 'West Delhi (Dwarka / Janakpuri)', 'lat': 28.5921, 'lon': 77.0460, 'stations': 390, 'ev_count': 48000},
        {'district': 'North Delhi (Rohini / Pitampura)', 'lat': 28.7041, 'lon': 77.1025, 'stations': 310, 'ev_count': 39000},
        {'district': 'East Delhi (Mayur Vihar)', 'lat': 28.6083, 'lon': 77.2965, 'stations': 257, 'ev_count': 31000}
    ],
    'Karnataka': [
        {'district': 'Bengaluru Urban (Indiranagar / Koramangala)', 'lat': 12.9716, 'lon': 77.5946, 'stations': 2850, 'ev_count': 230000},
        {'district': 'Bengaluru Rural / Whitefield Tech Corridor', 'lat': 12.9698, 'lon': 77.7499, 'stations': 1420, 'ev_count': 115000},
        {'district': 'Mysuru', 'lat': 12.2958, 'lon': 76.6394, 'stations': 580, 'ev_count': 42000},
        {'district': 'Hubballi-Dharwad', 'lat': 15.3647, 'lon': 75.1240, 'stations': 340, 'ev_count': 28000},
        {'district': 'Mangaluru', 'lat': 12.9141, 'lon': 74.8560, 'stations': 290, 'ev_count': 22000}
    ],
    'Uttar Pradesh': [
        {'district': 'Gautam Buddha Nagar (Noida / Greater Noida)', 'lat': 28.5355, 'lon': 77.3910, 'stations': 640, 'ev_count': 82000},
        {'district': 'Ghaziabad', 'lat': 28.6692, 'lon': 77.4538, 'stations': 480, 'ev_count': 69000},
        {'district': 'Lucknow', 'lat': 26.8467, 'lon': 80.9462, 'stations': 410, 'ev_count': 78000},
        {'district': 'Kanpur Urban', 'lat': 26.4499, 'lon': 80.3319, 'stations': 290, 'ev_count': 56000},
        {'district': 'Varanasi', 'lat': 25.3176, 'lon': 82.9739, 'stations': 220, 'ev_count': 45000},
        {'district': 'Agra', 'lat': 27.1767, 'lon': 78.0081, 'stations': 190, 'ev_count': 38000}
    ],
    'Tamil Nadu': [
        {'district': 'Chennai Metropolis', 'lat': 13.0827, 'lon': 80.2707, 'stations': 850, 'ev_count': 94000},
        {'district': 'Coimbatore', 'lat': 11.0168, 'lon': 76.9558, 'stations': 410, 'ev_count': 48000},
        {'district': 'Madurai', 'lat': 9.9252, 'lon': 78.1198, 'stations': 230, 'ev_count': 29000},
        {'district': 'Tiruchirappalli', 'lat': 10.7905, 'lon': 78.7047, 'stations': 170, 'ev_count': 21000}
    ],
    'Gujarat': [
        {'district': 'Ahmedabad Urban', 'lat': 23.0225, 'lon': 72.5714, 'stations': 580, 'ev_count': 72000},
        {'district': 'Surat', 'lat': 21.1702, 'lon': 72.8311, 'stations': 420, 'ev_count': 54000},
        {'district': 'Vadodara', 'lat': 22.3072, 'lon': 73.1812, 'stations': 260, 'ev_count': 31000},
        {'district': 'Rajkot', 'lat': 22.3039, 'lon': 70.8022, 'stations': 190, 'ev_count': 24000}
    ],
    'Telangana': [
        {'district': 'Hyderabad Urban (HITECH City / Gachibowli)', 'lat': 17.4401, 'lon': 78.3489, 'stations': 780, 'ev_count': 88000},
        {'district': 'Secunderabad', 'lat': 17.4399, 'lon': 78.4983, 'stations': 290, 'ev_count': 34000},
        {'district': 'Warangal', 'lat': 17.9689, 'lon': 79.5941, 'stations': 130, 'ev_count': 16000}
    ]
}

def get_districts_for_state(state_name):
    if state_name in DISTRICT_DATA:
        return DISTRICT_DATA[state_name]
    # Default fallback for states without specific district list
    return [
        {'district': f'{state_name} Central Hub', 'lat': 20.0, 'lon': 78.0, 'stations': 150, 'ev_count': 20000},
        {'district': f'{state_name} North District', 'lat': 20.5, 'lon': 78.5, 'stations': 80, 'ev_count': 10000}
    ]
