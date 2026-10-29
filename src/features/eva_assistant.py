# EVA (EVision Assistant) - Intelligent Natural Language Assistant
import re

KNOWLEDGE_BASE = {
    "gap": "EVision's Infrastructure Gap Score (0–100) measures charger deficits. It is calculated using: Gap Score = 0.30 × Deficit + 0.30 × Ratio Pressure + 0.20 × Growth Velocity + 0.20 × Urbanization. Scores >= 75 indicate Critical Gap status.",
    "formula": "The signature Infrastructure Gap Index formula is: Gap Score = 0.30 × Deficit + 0.30 × Ratio Pressure + 0.20 × Growth Velocity + 0.20 × Urbanization.",
    "tier": "Regions are categorized into 4 Gap Tiers: Critical (Score >= 75), High (55-75), Moderate (35-55), and Low (< 35).",
    "book": "To book a charging slot: Go to 'Find Charging', select your station, pick your preferred date & start time, enter your vehicle class and UPI ID, and click 'Submit UPI Reservation'.",
    "model": "EVision uses two ML models: (1) A Random Forest Regressor trained on demographic indicators to forecast 2026–2030 public station demand, and (2) A Random Forest Classifier pipeline (94% accuracy) to evaluate UPI transaction fraud security.",
    "eda": "The Exploratory Data Analysis (EDA) reveals that national EV registrations grew +42.8% YoY in 2025, while public charging station expansion lagged at +18.4% YoY, creating an average pressure ratio of 171.4 EVs per charger across 12 high-deficit states.",
    "map": "The Geographical Analysis module features interactive Pydeck spatial maps. You can toggle between State Overview Level and Granular District/City Level to locate local charging hubs in Mumbai, Bengaluru, Delhi NCR, Pune, Noida, and Hyderabad.",
    "marketplace": "The EV Buy & Sell Marketplace allows you to inspect new EV models (Tata Nexon EV, MG ZS, BYD Seal, Ola S1 Pro), view used pre-owned EVs with certified battery SOH %, and calculate fair used EV resale market prices using our ML depreciation algorithm.",
    "pickup": "Doorstep EV Pickup Concierge is a service where an authorized driver picks up your vehicle, charges it at a high-speed hub, and returns it to your address. Select 'Doorstep EV Pickup' under the Doorstep & UPI module.",
    "dataset": "The EVision master dataset synthesizes 192 longitudinal records (2020–2025) across 32 Indian States and Union Territories sourced from official VAHAN analytics, Bureau of Energy Efficiency (BEE), and Census demographic snapshots."
}

def get_eva_response(user_query):
    query = user_query.lower()
    
    if any(k in query for k in ["gap", "deficit", "pressure", "score"]):
        return KNOWLEDGE_BASE["gap"]
    elif any(k in query for k in ["formula", "calculation", "equation"]):
        return KNOWLEDGE_BASE["formula"]
    elif any(k in query for k in ["tier", "critical", "level"]):
        return KNOWLEDGE_BASE["tier"]
    elif any(k in query for k in ["book", "reserve", "slot", "how to book"]):
        return KNOWLEDGE_BASE["book"]
    elif any(k in query for k in ["model", "ml", "forecast", "random forest", "accuracy"]):
        return KNOWLEDGE_BASE["model"]
    elif any(k in query for k in ["eda", "growth", "yoy", "mismatch", "insight", "chart"]):
        return KNOWLEDGE_BASE["eda"]
    elif any(k in query for k in ["map", "geography", "district", "city", "location"]):
        return KNOWLEDGE_BASE["map"]
    elif any(k in query for k in ["market", "buy", "sell", "used", "resale", "price", "emi"]):
        return KNOWLEDGE_BASE["marketplace"]
    elif any(k in query for k in ["pickup", "doorstep", "concierge", "van"]):
        return KNOWLEDGE_BASE["pickup"]
    elif any(k in query for k in ["data", "dataset", "source", "vahan", "bee"]):
        return KNOWLEDGE_BASE["dataset"]
    elif any(k in query for k in ["hi", "hello", "hey", "who are you"]):
        return "Hello! I am EVA (EVision Assistant). I can help you find charging stations, explain gap calculations, assist with slot bookings, or summarize project EDA insights."
    else:
        return "I don't have reliable information for that specific query right now. You can ask me about finding charging stations, slot bookings, Infrastructure Gap calculations, or project ML models."
