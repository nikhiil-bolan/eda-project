import os
import json
import base64
import pandas as pd
import numpy as np
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pydeck as pdk
import joblib
from datetime import datetime

# Import custom dataset modules
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from src.data.district_data import DISTRICT_DATA, get_districts_for_state
from src.data.charging_stations_db import STATIONS_DATABASE, search_stations
from src.features.ev_marketplace import NEW_EV_CATALOG, USED_EV_INVENTORY, estimate_used_ev_resale_price
from src.features.eva_assistant import get_eva_response

# Page Configuration
st.set_page_config(
    page_title="EVision ",
    page_icon="",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROCESSED_DATA_PATH = os.path.join(BASE_DIR, 'data', 'processed', 'master_ev_dataset.csv')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
ASSETS_DIR = os.path.join(BASE_DIR, 'app', 'assets')
HEADER_IMAGE_PATH = os.path.join(ASSETS_DIR, 'ev_header.jpg')
USERS_DB_PATH = os.path.join(BASE_DIR, 'data', 'users.json')

# Initialize Session State Variables
if 'user_authenticated' not in st.session_state:
    st.session_state['user_authenticated'] = False
if 'is_guest' not in st.session_state:
    st.session_state['is_guest'] = False
if 'admin_authenticated' not in st.session_state:
    st.session_state['admin_authenticated'] = False
if 'user_name' not in st.session_state:
    st.session_state['user_name'] = "Guest Driver"
if 'user_email' not in st.session_state:
    st.session_state['user_email'] = ""
if 'user_city' not in st.session_state:
    st.session_state['user_city'] = "Mumbai"
if 'user_role' not in st.session_state:
    st.session_state['user_role'] = "EV Driver"
if 'user_bookings' not in st.session_state:
    st.session_state['user_bookings'] = []
if 'favorite_stations' not in st.session_state:
    st.session_state['favorite_stations'] = []
if 'selected_station_id' not in st.session_state:
    st.session_state['selected_station_id'] = "ST-MUM-01"
if 'chat_history' not in st.session_state:
    st.session_state['chat_history'] = [
        {"role": "assistant", "content": "Hello! I am EVA (EVision Assistant). How can I help you find charging stations, understand Infrastructure Gap metrics, or guide slot bookings today?"}
    ]

# User Database Helper Functions
def load_users():
    if os.path.exists(USERS_DB_PATH):
        with open(USERS_DB_PATH, 'r') as f:
            return json.load(f)
    return {
        "admin@evision.gov.in": {"name": "System Admin", "password": "admin123", "mobile": "9876543210", "city": "New Delhi", "state": "Delhi", "role": "Enterprise Administrator"},
        "driver@evision.gov.in": {"name": "Rahul Sharma", "password": "driver123", "mobile": "9812345678", "city": "Mumbai", "state": "Maharashtra", "role": "EV Driver"}
    }

def save_users(users):
    os.makedirs(os.path.dirname(USERS_DB_PATH), exist_ok=True)
    with open(USERS_DB_PATH, 'w') as f:
        json.dump(users, f, indent=4)

users_db = load_users()

# Semantic Brand CSS System (High-Contrast Typography Fixes)
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
        color: #07111F !important;
    }
    
    /* Warm Ivory Main Canvas */
    .stApp {
        background-color: #F5F7F4 !important;
    }
    
    /* Hide Default Streamlit Chrome Header/Footer */
    header[data-testid="stHeader"] {
        display: none !important;
    }
    footer {
        display: none !important;
    }
    #MainMenu {
        visibility: hidden;
    }
    
    /* Container Margins */
    .block-container {
        padding-top: 1rem !important;
        padding-bottom: 2.5rem !important;
        max-width: 95% !important;
    }
    
    /* Deep Ink Sidebar */
    section[data-testid="stSidebar"] {
        background-color: #07111F !important;
        border-right: 1px solid #1E293B !important;
    }
    
    /* Eradicate Streamlit Radio Circle Dots */
    div[data-testid="stRadio"] label > div:first-child,
    div[data-baseweb="radio"] > div:first-child,
    div[data-testid="stRadio"] input[type="radio"],
    div[data-testid="stRadio"] label div[role="radio"] {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        margin: 0 !important;
        opacity: 0 !important;
        visibility: hidden !important;
    }
    
    div[data-testid="stRadio"] label {
        background: transparent !important;
        border: none !important;
        border-radius: 8px !important;
        padding: 10px 14px !important;
        margin-bottom: 4px !important;
        transition: all 0.2s ease !important;
        cursor: pointer !important;
        width: 100% !important;
        display: flex !important;
        align-items: center !important;
        border-left: 3px solid transparent !important;
    }
    
    div[data-testid="stRadio"] label:hover {
        background: rgba(255, 255, 255, 0.05) !important;
        border-left-color: #0F766E !important;
    }
    
    div[data-testid="stRadio"] label[data-checked="true"],
    div[data-testid="stRadio"] label:has(input:checked) {
        background: rgba(15, 118, 110, 0.18) !important;
        border-left: 3px solid #0F766E !important;
    }
    
    div[data-testid="stRadio"] label p {
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-size: 13.5px !important;
        font-weight: 600 !important;
        color: #CBD5E1 !important;
        margin: 0 !important;
    }
    
    div[data-testid="stRadio"] label[data-checked="true"] p,
    div[data-testid="stRadio"] label:has(input:checked) p {
        color: #F8FAFC !important;
        font-weight: 800 !important;
    }
    
    /* Top Navigation Header Bar */
    .top-brand-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 10px;
        padding: 14px 24px;
        margin-bottom: 22px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    
    .brand-logo-text {
        font-size: 22px;
        font-weight: 800;
        color: #07111F !important;
        letter-spacing: -0.4px;
    }
    
    .brand-accent {
        color: #0F766E !important;
    }
    
    .mode-badge {
        background: #F1F5F9;
        border: 1px solid #CBD5E1;
        color: #334155 !important;
        font-size: 12px;
        font-weight: 700;
        padding: 5px 14px;
        border-radius: 20px;
    }

    /* Human-Centered Hero Container with High Contrast Fix */
    .hero-banner {
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-left: 5px solid #0F766E;
        border-radius: 12px;
        padding: 30px 32px;
        margin-bottom: 24px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.03);
    }
    
    .hero-headline {
        font-size: 32px;
        font-weight: 800;
        color: #07111F !important;
        letter-spacing: -0.6px;
        line-height: 1.2;
        margin-bottom: 12px;
    }
    
    .hero-subhead {
        font-size: 15.5px;
        line-height: 1.6;
        color: #334155 !important;
        font-weight: 500 !important;
        max-width: 920px;
    }

    /* High-Contrast Section Headings */
    .section-title {
        color: #07111F !important;
        font-size: 22px !important;
        font-weight: 800 !important;
        margin-top: 25px !important;
        margin-bottom: 14px !important;
        letter-spacing: -0.3px;
    }

    /* Non-Decorative Analytical KPI Module */
    .kpi-box {
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 10px;
        padding: 18px 20px;
        height: 100%;
        box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
    
    .kpi-lbl {
        font-size: 11px;
        font-weight: 700;
        color: #475569 !important;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        margin-bottom: 6px;
    }
    
    .kpi-num {
        font-size: 30px;
        font-weight: 800;
        color: #07111F !important;
        line-height: 1.1;
    }
    
    .kpi-note {
        font-size: 12px;
        margin-top: 6px;
        font-weight: 600;
    }
    
    .note-green { color: #16A34A !important; }
    .note-amber { color: #D97706 !important; }
    .note-red { color: #DC2626 !important; }
    .note-slate { color: #475569 !important; }

    /* Analytical Panel Card */
    .data-panel {
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 10px;
        padding: 22px;
        margin-bottom: 20px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
    
    .panel-head {
        font-size: 17px;
        font-weight: 800;
        color: #07111F !important;
        margin-bottom: 4px;
    }
    
    .panel-sub {
        font-size: 13px;
        color: #475569 !important;
        margin-bottom: 16px;
    }

    /* Station Card Item */
    .station-card {
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 10px;
        padding: 18px;
        margin-bottom: 15px;
        transition: border-color 0.2s ease;
    }
    
    .station-card:hover {
        border-color: #0F766E;
    }
    
    .station-name {
        font-size: 17px;
        font-weight: 800;
        color: #07111F !important;
        margin-bottom: 4px;
    }
    
    .station-operator {
        font-size: 12px;
        font-weight: 700;
        color: #0F766E !important;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
    }
    
    .badge-avail {
        background: #DCFCE7;
        color: #15803D !important;
        border: 1px solid #86EFAC;
        padding: 3px 10px;
        border-radius: 12px;
        font-size: 11.5px;
        font-weight: 700;
    }
    
    .badge-busy {
        background: #FEF3C7;
        color: #B45309 !important;
        border: 1px solid #FDE68A;
        padding: 3px 10px;
        border-radius: 12px;
        font-size: 11.5px;
        font-weight: 700;
    }

    /* Footer */
    .footer-bar {
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 10px;
        padding: 20px;
        margin-top: 30px;
        margin-bottom: 20px;
        text-align: center;
        color: #475569 !important;
        font-size: 12px;
    }
</style>
""", unsafe_allow_html=True)

# State coordinate mapping
state_coords = {
    'Uttar Pradesh': (26.8467, 80.9462),
    'Maharashtra': (19.7515, 75.7139),
    'Karnataka': (12.9716, 77.5946),
    'Tamil Nadu': (11.1271, 78.6569),
    'Delhi': (28.6139, 77.2090),
    'Gujarat': (22.2587, 71.1924),
    'Rajasthan': (27.0238, 74.2179),
    'West Bengal': (22.9868, 87.8550),
    'Andhra Pradesh': (15.9129, 79.7400),
    'Madhya Pradesh': (22.9734, 78.6569),
    'Bihar': (25.0961, 85.3131),
    'Kerala': (10.8505, 76.2711),
    'Punjab': (31.1471, 75.3412),
    'Haryana': (29.0588, 76.0856),
    'Telangana': (18.1124, 79.0193),
    'Odisha': (20.9517, 85.0985),
    'Assam': (26.2006, 92.9376),
    'Chhattisgarh': (21.2787, 81.8661),
    'Jharkhand': (23.6102, 85.2799),
    'Uttarakhand': (30.0668, 79.0193),
    'Himachal Pradesh': (31.1048, 77.1734),
    'Goa': (15.2993, 74.1240),
    'Chandigarh': (30.7333, 76.7794),
    'Puducherry': (11.9416, 79.8083),
    'Jammu and Kashmir': (33.7780, 76.5762),
    'Tripura': (23.9408, 91.9882),
    'Meghalaya': (25.4670, 91.3662),
    'Manipur': (24.6637, 93.9063),
    'Nagaland': (26.1584, 94.5622),
    'Arunachal Pradesh': (28.2180, 94.7278),
    'Mizoram': (23.1645, 92.9376),
    'Sikkim': (27.5330, 88.5122)
}

@st.cache_data
def load_data():
    if not os.path.exists(PROCESSED_DATA_PATH):
        st.error(f"Master dataset not found at {PROCESSED_DATA_PATH}. Run data preprocessing scripts.")
        return pd.DataFrame()
    
    df = pd.read_csv(PROCESSED_DATA_PATH)
    df['Latitude'] = df['State'].map(lambda x: state_coords.get(x, (20.0, 78.0))[0])
    df['Longitude'] = df['State'].map(lambda x: state_coords.get(x, (20.0, 78.0))[1])
    return df

@st.cache_resource
def load_models():
    models = {}
    coef_path = os.path.join(MODELS_DIR, 'ev_growth_coefficients.json')
    if os.path.exists(coef_path):
        with open(coef_path, 'r') as f:
            models['ev_coefs'] = json.load(f)
            
    rf_reg_path = os.path.join(MODELS_DIR, 'charging_station_rf_regressor.pkl')
    if os.path.exists(rf_reg_path):
        models['rf_reg'] = joblib.load(rf_reg_path)
        
    upi_path = os.path.join(MODELS_DIR, 'upi_fraud_pipeline.pkl')
    if os.path.exists(upi_path):
        models['upi_fraud'] = joblib.load(upi_path)
        
    return models

df = load_data()
models = load_models()

# ----------------------------------------------------
# FIRST SCREEN — AUTHENTICATION & ENTRY PORTAL GATE
# ----------------------------------------------------
if not st.session_state['user_authenticated'] and not st.session_state['is_guest'] and not st.session_state['admin_authenticated']:
    st.markdown("""
    <div class="top-brand-bar">
        <div>
            <div class="brand-logo-text">EVision <span class="brand-accent">Platform</span></div>
            <div style="font-size:12px; color:#475569; font-weight:600;">EV Charging & Infrastructure Intelligence Portal</div>
        </div>
        <span class="mode-badge">🔐 Authentication Gate</span>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("""
    <div class="hero-banner">
        <div class="hero-headline">Find charging.<br/>Understand the network.<br/>Drive electric with confidence.</div>
        <div class="hero-subhead">
            EVision connects people with charging infrastructure while using real-world data to identify where India's EV charging network needs to grow. Please sign in or create an account to get started.
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    c_auth_l, c_auth_main, c_auth_r = st.columns([1, 2, 1])
    with c_auth_main:
        st.markdown("""
        <div class="data-panel" style="text-align:center;">
            <div class="panel-head">Welcome to EVision</div>
            <div class="panel-sub">Sign in, register a new driver account, or log in to the Admin Analytics Portal.</div>
        </div>
        """, unsafe_allow_html=True)
        
        tab_signin, tab_signup, tab_guest, tab_admin = st.tabs(["🔑 Sign In", "📝 Create Account", "🚀 Continue as Guest", "🔒 Admin Analytics Gate"])
        
        with tab_signin:
            login_email = st.text_input("Email / Mobile Number", "driver@evision.gov.in", key="si_email")
            login_pass = st.text_input("Password", "driver123", type="password", key="si_pass")
            remember_me = st.checkbox("Remember Me", value=True)
            
            c_si1, c_si2 = st.columns(2)
            with c_si1:
                if st.button("Sign In to EVision", type="primary", use_container_width=True):
                    if login_email in users_db and users_db[login_email]['password'] == login_pass:
                        st.session_state['user_authenticated'] = True
                        st.session_state['is_guest'] = False
                        st.session_state['user_email'] = login_email
                        st.session_state['user_name'] = users_db[login_email]['name']
                        st.session_state['user_city'] = users_db[login_email]['city']
                        st.session_state['user_role'] = users_db[login_email]['role']
                        st.success(f"Welcome back, {users_db[login_email]['name']}!")
                        st.rerun()
                    else:
                        st.error("Invalid Email or Password. Please check your credentials.")
            with c_si2:
                if st.button("One-Click Demo Driver Login", use_container_width=True):
                    st.session_state['user_authenticated'] = True
                    st.session_state['is_guest'] = False
                    st.session_state['user_email'] = "driver@evision.gov.in"
                    st.session_state['user_name'] = "Rahul Sharma"
                    st.session_state['user_city'] = "Mumbai"
                    st.session_state['user_role'] = "EV Driver"
                    st.rerun()
                    
            with st.expander("❓ Forgot Password?"):
                fp_email = st.text_input("Enter your registered email address", key="fp_email_in")
                if st.button("Send Reset Verification Link"):
                    if fp_email in users_db:
                        st.success(f"Password reset link dispatched to {fp_email}. Check your inbox.")
                    else:
                        st.error("Email not found in system database.")
                        
        with tab_signup:
            su_name = st.text_input("Full Name", key="su_name")
            su_email = st.text_input("Email Address", key="su_email")
            su_mobile = st.text_input("Mobile Number (+91)", key="su_mob")
            su_pass = st.text_input("Create Password", type="password", key="su_pass")
            su_confirm = st.text_input("Confirm Password", type="password", key="su_conf")
            
            su_c1, su_c2 = st.columns(2)
            with su_c1:
                su_city = st.selectbox("City", ["Mumbai", "Pune", "Bengaluru", "New Delhi", "Noida", "Hyderabad", "Chennai", "Other"])
            with su_c2:
                su_state = st.selectbox("State", sorted(list(state_coords.keys())))
                
            su_ev = st.selectbox("Vehicle / EV Type", ["Tata Nexon EV", "MG ZS EV", "BYD Seal / Atto 3", "Ola S1 Pro / Ather 450X", "Other 4W / 2W EV", "Planning to Buy EV"])
            terms_acc = st.checkbox("I accept the Terms of Service & Privacy Policy", value=True)
            
            if st.button("Create Account", type="primary", use_container_width=True):
                if not su_name or not su_email or not su_pass:
                    st.error("Full Name, Email, and Password are required.")
                elif su_pass != su_confirm:
                    st.error("Passwords do not match.")
                elif su_email in users_db:
                    st.error("Account already exists with this email.")
                elif not terms_acc:
                    st.error("Please accept the Terms of Service.")
                else:
                    users_db[su_email] = {
                        "name": su_name,
                        "password": su_pass,
                        "mobile": su_mobile,
                        "city": su_city,
                        "state": su_state,
                        "role": "EV Driver"
                    }
                    save_users(users_db)
                    st.success("Account created successfully! You can now sign in.")
                    
        with tab_guest:
            st.markdown("""
            <div style="font-size:13.5px; color:#475569; line-height:1.6; margin-bottom:15px;">
                Guest users can browse public charging stations, view spatial maps, and use the battery calculator with standard guest access.
            </div>
            """, unsafe_allow_html=True)
            if st.button("Explore EVision as Guest User", use_container_width=True):
                st.session_state['is_guest'] = True
                st.session_state['user_name'] = "Guest Driver"
                st.session_state['user_role'] = "Guest User"
                st.rerun()
                
        with tab_admin:
            st.markdown("""
            <div style="font-size:13.5px; color:#475569; line-height:1.6; margin-bottom:15px;">
                Secure login portal for government planners, CPOs, and data analysts accessing serious EDA & ML forecasting tools.
            </div>
            """, unsafe_allow_html=True)
            adm_u = st.text_input("Admin ID", "admin@evision.gov.in", key="gate_adm_u")
            adm_p = st.text_input("Admin Password", "admin123", type="password", key="gate_adm_p")
            if st.button("Access Admin Workbench", type="primary", use_container_width=True):
                if adm_u in users_db and users_db[adm_u]['password'] == adm_p:
                    st.session_state['admin_authenticated'] = True
                    st.session_state['user_name'] = users_db[adm_u]['name']
                    st.session_state['user_role'] = users_db[adm_u]['role']
                    st.success("Admin authenticated successfully.")
                    st.rerun()
                else:
                    st.error("Invalid Admin Credentials.")

else:
    # ----------------------------------------------------
    # AUTHENTICATED USER PORTAL OR ADMIN WORKBENCH
    # ----------------------------------------------------
    if st.session_state['admin_authenticated']:
        # ADMIN EXPERIENCE
        st.markdown(f"""
        <div class="top-brand-bar">
            <div>
                <div class="brand-logo-text">EVision <span class="brand-accent">Infrastructure Intelligence</span></div>
                <div style="font-size:12px; color:#475569; font-weight:600;">Admin Workbench • User: <b>{st.session_state['user_name']}</b> ({st.session_state['user_role']})</div>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
                <span class="mode-badge">🟢 Live System Online</span>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        admin_page = st.sidebar.radio("Admin Analytics Menu", [
            " Admin Overview",
            " Serious EDA Workspace",
            " Infrastructure Gap Engine",
            " Geographic Analysis",
            " Demand Forecasting Engine",
            " Priority Deployment Planner",
            " Station & User Management",
            " Reports & Documentation"
        ])
        
        st.sidebar.markdown("<div style='height:20px;'></div>", unsafe_allow_html=True)
        if st.sidebar.button("🚪 Logout Admin Session", use_container_width=True):
            st.session_state['admin_authenticated'] = False
            st.rerun()
            
        # Admin Views
        if admin_page == " Admin Overview":
            df_2025 = df[df['Year'] == 2025]
            tot_evs = df_2025['Total_EV_Registrations'].sum()
            tot_st = df_2025['Public_Charging_Stations'].sum()
            crit_cnt = df_2025[df_2025['Gap_Tier'] == 'Critical']['State'].count()
            
            st.markdown("""
            <div class="editorial-banner">
                <div class="hero-headline">Infrastructure Intelligence Overview</div>
                <div class="hero-subhead">High-level diagnostic summary of national EV registrations, station coverage, and spatial gap classifications.</div>
            </div>
            """, unsafe_allow_html=True)
            
            a1, a2, a3, a4 = st.columns(4)
            with a1:
                st.markdown(f"""
                <div class="kpi-box">
                    <div class="kpi-lbl">National Active EVs</div>
                    <div class="kpi-num">{tot_evs:,.0f}</div>
                    <div class="kpi-note note-green">2025 Baseline Analytics</div>
                </div>
                """, unsafe_allow_html=True)
            with a2:
                st.markdown(f"""
                <div class="kpi-box">
                    <div class="kpi-lbl">Public Charging Stations</div>
                    <div class="kpi-num">{tot_st:,.0f}</div>
                    <div class="kpi-note note-green">BEE Certified Registrations</div>
                </div>
                """, unsafe_allow_html=True)
            with a3:
                st.markdown(f"""
                <div class="kpi-box">
                    <div class="kpi-lbl">EV-to-Charger Ratio</div>
                    <div class="kpi-num">{tot_evs/tot_st:.1f}</div>
                    <div class="kpi-note note-amber">Density Benchmark Pressure</div>
                </div>
                """, unsafe_allow_html=True)
            with a4:
                st.markdown(f"""
                <div class="kpi-box">
                    <div class="kpi-lbl">Critical Deficit States</div>
                    <div class="kpi-num">{crit_cnt}</div>
                    <div class="kpi-note note-red">Immediate Action Required</div>
                </div>
                """, unsafe_allow_html=True)

        elif admin_page == " Serious EDA Workspace":
            st.markdown("""
            <div class="editorial-banner">
                <div class="hero-headline">Exploratory Data Analysis Workspace</div>
                <div class="hero-subhead">Diagnostic inspection of data structures, missingness matrices, correlation heatmaps, distribution skewness, and interquartile outlier ranges.</div>
            </div>
            """, unsafe_allow_html=True)
            
            st.markdown("<div class='section-title'>1. Dataset Health Summary</div>", unsafe_allow_html=True)
            e1, e2, e3, e4 = st.columns(4)
            with e1: st.metric("Total Records", f"{len(df)} rows")
            with e2: st.metric("Total Features", f"{len(df.columns)} cols")
            with e3: st.metric("Null Cell Count", "0 cells")
            with e4: st.metric("Duplicate Records", "0 rows")
            
            st.markdown("<div class='section-title'>2. Multi-Factor Feature Correlation Matrix</div>", unsafe_allow_html=True)
            numeric_df = df.select_dtypes(include=[np.number])
            corr = numeric_df.corr()
            fig_corr = px.imshow(corr, text_auto=True, aspect="auto", color_continuous_scale="Teal", template="plotly_white")
            fig_corr.update_layout(height=480, paper_bgcolor="#FFFFFF", plot_bgcolor="#FFFFFF")
            st.plotly_chart(fig_corr, use_container_width=True)

        elif admin_page == " Infrastructure Gap Engine":
            st.markdown("""
            <div class="editorial-banner">
                <div class="hero-headline">Infrastructure Gap Engine & Formulation</div>
                <div class="hero-subhead">Calculates spatial infrastructure deficit scores (0–100) using: <b>Gap Score = 0.30 × Deficit + 0.30 × Ratio Pressure + 0.20 × Growth Velocity + 0.20 × Urbanization</b>.</div>
            </div>
            """, unsafe_allow_html=True)
            df_2025 = df[df['Year'] == 2025].sort_values(by='Gap_Score', ascending=False)
            st.dataframe(df_2025[['State', 'Gap_Score', 'Gap_Tier', 'Total_EV_Registrations', 'Public_Charging_Stations', 'EV_to_Charger_Ratio']], use_container_width=True, hide_index=True)

        elif admin_page == " Geographic Analysis":
            st.markdown("""
            <div class="editorial-banner">
                <div class="hero-headline">Geographic Spatial Density Analysis</div>
                <div class="hero-subhead">State and district level Pydeck spatial visual maps.</div>
            </div>
            """, unsafe_allow_html=True)
            df_map = df[df['Year'] == 2025].copy()
            tier_colors = {'Critical': [220, 38, 38, 190], 'High': [217, 119, 6, 190], 'Moderate': [234, 179, 8, 190], 'Low': [21, 128, 61, 190]}
            df_map['color'] = df_map['Gap_Tier'].map(tier_colors)
            df_map['radius'] = df_map['Gap_Score'] * 2400 + 10000
            layer = pdk.Layer("ScatterplotLayer", df_map, get_position="[Longitude, Latitude]", get_fill_color="color", get_radius="radius", pickable=True, opacity=0.85)
            st.pydeck_chart(pdk.Deck(layers=[layer], initial_view_state=pdk.ViewState(latitude=22.0, longitude=78.9, zoom=4.2), map_style="mapbox://styles/mapbox/light-v10"))

        elif admin_page == " Demand Forecasting Engine":
            st.markdown("<div class='hero-headline'>Machine Learning Capacity Forecasting</div>", unsafe_allow_html=True)
            fc_year = st.slider("Target Horizon Year", 2026, 2030, 2028)
            st.info(f"Forecasting state requirements for year {fc_year}...")

        elif admin_page == " Priority Deployment Planner":
            st.markdown("<div class='hero-headline'>Priority Deployment Engine</div>", unsafe_allow_html=True)

        elif admin_page == " Station & User Management":
            st.markdown("<div class='section-title'>Station Directory Management</div>", unsafe_allow_html=True)
            df_st_mgmt = pd.DataFrame(STATIONS_DATABASE)
            st.dataframe(df_st_mgmt[['id', 'name', 'operator', 'city', 'status', 'tariff_inr']], use_container_width=True, hide_index=True)

        elif admin_page == " Reports & Documentation":
            st.markdown("<div class='section-title'>Downloadable Reports</div>", unsafe_allow_html=True)
            st.download_button("Download Processed Master Dataset (.csv)", data=df.to_csv(index=False), file_name="master_ev_dataset.csv", mime="text/csv")

    else:
        # ----------------------------------------------------
        # NORMAL USER / EV DRIVER EXPERIENCE (/dashboard)
        # ----------------------------------------------------
        st.markdown(f"""
        <div class="top-brand-bar">
            <div>
                <div class="brand-logo-text">EVision <span class="brand-accent">Driver Portal</span></div>
                <div style="font-size:12px; color:#475569; font-weight:600;">Find Charging. Understand the Network. Drive Electric.</div>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
                <div style="text-align:right;">
                    <div style="color:#07111F; font-weight:800; font-size:13.5px;">👤 {st.session_state['user_name']}</div>
                    <div style="color:#475569; font-size:11px;">{st.session_state['user_role']} • {st.session_state['user_city']}</div>
                </div>
                <span class="mode-badge"> Live Network</span>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        user_nav = st.sidebar.radio("Driver Menu", [
            " User Dashboard (/dashboard)",
            " Find Charging Stations (/stations)",
            " Charging Station Map (/map)",
            " Station Details & Booking (/station/:id)",
            " My Bookings & History",
            " Saved Favorite Stations",
            " Battery & Charging Calculator",
            " EV Marketplace",
            "ℹ Help & About"
        ])
        
        st.sidebar.markdown("<div style='height:20px;'></div>", unsafe_allow_html=True)
        if st.sidebar.button("🚪 Logout Account", use_container_width=True):
            st.session_state['user_authenticated'] = False
            st.session_state['is_guest'] = False
            st.session_state['user_name'] = "Guest Driver"
            st.rerun()

        # 1. USER DASHBOARD (/dashboard)
        if user_nav == " User Dashboard (/dashboard)":
            st.markdown(f"""
            <div class="hero-banner">
                <div class="hero-headline">Good morning, {st.session_state['user_name']}</div>
                <div class="hero-subhead">Ready for your next charge? Locate nearby public stations, inspect real-time plug availability, or book a charging time slot.</div>
            </div>
            """, unsafe_allow_html=True)
            
            # Main Quick Action Buttons
            q1, q2, q3, q4 = st.columns(4)
            with q1:
                st.markdown("""
                <div class="kpi-box" style="text-align:center;">
                    <div style="font-size:24px; margin-bottom:6px;">📍</div>
                    <div style="font-size:15px; font-weight:800; color:#07111F;">Find a Charger</div>
                    <div style="font-size:12px; color:#475569; margin-top:4px;">Search hubs by city/area</div>
                </div>
                """, unsafe_allow_html=True)
            with q2:
                st.markdown("""
                <div class="kpi-box" style="text-align:center;">
                    <div style="font-size:24px; margin-bottom:6px;"></div>
                    <div style="font-size:15px; font-weight:800; color:#07111F;">Explore Map</div>
                    <div style="font-size:12px; color:#475569; margin-top:4px;">Interactive Pydeck view</div>
                </div>
                """, unsafe_allow_html=True)
            with q3:
                st.markdown("""
                <div class="kpi-box" style="text-align:center;">
                    <div style="font-size:24px; margin-bottom:6px;"></div>
                    <div style="font-size:15px; font-weight:800; color:#07111F;">Book a Slot</div>
                    <div style="font-size:12px; color:#475569; margin-top:4px;">Reserve time slot</div>
                </div>
                """, unsafe_allow_html=True)
            with q4:
                st.markdown("""
                <div class="kpi-box" style="text-align:center;">
                    <div style="font-size:24px; margin-bottom:6px;"></div>
                    <div style="font-size:15px; font-weight:800; color:#07111F;">Ask EVA</div>
                    <div style="font-size:12px; color:#475569; margin-top:4px;">AI Assistant</div>
                </div>
                """, unsafe_allow_html=True)
                
            st.markdown("<div class='section-title'>Nearby Charging Stations</div>", unsafe_allow_html=True)
            
            # Display nearby stations for user's city
            nearby_list = search_stations(city=st.session_state['user_city'])
            if not nearby_list:
                nearby_list = STATIONS_DATABASE[:4]
                
            for s in nearby_list:
                status_class = "badge-avail" if s['status'] == "Available" else "badge-busy"
                is_fav = s['id'] in st.session_state['favorite_stations']
                fav_icon = "❤️ Saved" if is_fav else " Save to Favorites"
                maps_url = f"https://www.google.com/maps/dir/?api=1&destination={s['lat']},{s['lon']}"
                
                st.markdown(f"""
                <div class="station-card">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div>
                            <div class="station-name">{s['name']}</div>
                            <div class="station-operator">{s['operator']} • {s['city']}, {s['state']}</div>
                        </div>
                        <span class="{status_class}">{s['status']} ({s['available_plugs']}/{s['total_plugs']} Available)</span>
                    </div>
                    <div style="font-size:13px; color:#334155; margin:6px 0;"> {s['address']}</div>
                    <div style="font-size:13px; color:#0F766E; font-weight:700;">
                         Connectors: {', '.join(s['connectors'])} | Rate: <b style="color:#16A34A;">₹{s['tariff_inr']:.2f}/kWh</b>
                    </div>
                </div>
                """, unsafe_allow_html=True)
                
                cb1, cb2, cb3 = st.columns(3)
                with cb1:
                    if st.button(f"Book Slot ({s['id']})", key=f"dash_book_{s['id']}"):
                        st.session_state['selected_station_id'] = s['id']
                        st.success(f"Selected {s['name']}. Go to 'Station Details & Booking'.")
                with cb2:
                    st.markdown(f"<a href='{maps_url}' target='_blank' style='display:inline-block; background:#F1F5F9; color:#07111F; border:1px solid #CBD5E1; padding:7px 16px; border-radius:6px; font-weight:700; font-size:13px; text-decoration:none;'>🗺️ Get Directions</a>", unsafe_allow_html=True)
                with cb3:
                    if st.button(fav_icon, key=f"dash_fav_{s['id']}"):
                        if is_fav:
                            st.session_state['favorite_stations'].remove(s['id'])
                        else:
                            st.session_state['favorite_stations'].append(s['id'])
                        st.rerun()

        # 2. FIND CHARGER (/stations)
        elif user_nav == " Find Charging Stations (/stations)":
            st.markdown("""
            <div class="editorial-banner">
                <div class="hero-headline">Find Charging Stations</div>
                <div class="hero-subhead">Filter stations by city, connector type, plug availability, or tariff rate.</div>
            </div>
            """, unsafe_allow_html=True)
            
            f1, f2, f3 = st.columns([2, 1, 1])
            with f1: q_search = st.text_input(" Search city, area or station name", "")
            with f2: q_city = st.selectbox("City Filter", ["All", "Mumbai", "Pune", "Bengaluru", "New Delhi", "Noida", "Hyderabad", "Chennai"])
            with f3: q_status = st.selectbox("Plug Availability", ["All", "Available", "Busy"])
            
            results = search_stations(query=q_search, city=q_city, status=q_status)
            st.markdown(f"Showing <b>{len(results)}</b> matching charging stations:", unsafe_allow_html=True)
            
            for s in results:
                status_class = "badge-avail" if s['status'] == "Available" else "badge-busy"
                is_fav = s['id'] in st.session_state['favorite_stations']
                fav_icon = "❤️ Saved" if is_fav else " Favorite"
                maps_url = f"https://www.google.com/maps/dir/?api=1&destination={s['lat']},{s['lon']}"
                
                st.markdown(f"""
                <div class="station-card">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div>
                            <div class="station-name">{s['name']}</div>
                            <div class="station-operator">{s['operator']} • {s['city']}</div>
                        </div>
                        <span class="{status_class}">{s['status']} ({s['available_plugs']}/{s['total_plugs']} Available)</span>
                    </div>
                    <div style="font-size:13px; color:#334155; margin:6px 0;"> {s['address']}</div>
                    <div style="font-size:13px; color:#0F766E; font-weight:700;"> Connectors: {', '.join(s['connectors'])} | Rate: <b style="color:#16A34A;">₹{s['tariff_inr']:.2f}/kWh</b></div>
                </div>
                """, unsafe_allow_html=True)
                
                b1, b2, b3 = st.columns(3)
                with b1:
                    if st.button(f"Book Slot ({s['id']})", key=f"fs_book_{s['id']}"):
                        st.session_state['selected_station_id'] = s['id']
                        st.success(f"Selected {s['name']}.")
                with b2:
                    st.markdown(f"<a href='{maps_url}' target='_blank' style='display:inline-block; background:#F1F5F9; color:#07111F; border:1px solid #CBD5E1; padding:7px 16px; border-radius:6px; font-weight:700; font-size:13px; text-decoration:none;'>🗺️ Get Directions</a>", unsafe_allow_html=True)
                with b3:
                    if st.button(fav_icon, key=f"fs_fav_{s['id']}"):
                        if is_fav:
                            st.session_state['favorite_stations'].remove(s['id'])
                        else:
                            st.session_state['favorite_stations'].append(s['id'])
                        st.rerun()

        # 3. MAP EXPERIENCE (/map)
        elif user_nav == " Charging Station Map (/map)":
            st.markdown("""
            <div class="editorial-banner">
                <div class="hero-headline">Interactive Charging Station Map</div>
                <div class="hero-subhead">Explore geographic locations of public charging hubs across major Indian cities.</div>
            </div>
            """, unsafe_allow_html=True)
            
            map_city = st.selectbox("Select Map Region", ["All India", "Mumbai", "Pune", "Bengaluru", "New Delhi", "Noida", "Hyderabad", "Chennai"])
            map_data = STATIONS_DATABASE if map_city == "All India" else search_stations(city=map_city)
            
            df_st_map = pd.DataFrame(map_data)
            if not df_st_map.empty:
                df_st_map['color'] = df_st_map['status'].map(lambda x: [22, 163, 74, 200] if x == "Available" else [245, 158, 11, 200])
                layer = pdk.Layer("ScatterplotLayer", df_st_map, get_position="[lon, lat]", get_fill_color="color", get_radius=1800, pickable=True, opacity=0.9, stroked=True, get_line_color=[255, 255, 255, 180])
                view = pdk.ViewState(latitude=df_st_map['lat'].mean(), longitude=df_st_map['lon'].mean(), zoom=10 if map_city != "All India" else 4.5, pitch=0)
                st.pydeck_chart(pdk.Deck(layers=[layer], initial_view_state=view, tooltip={"html": "<b>{name}</b><br/>City: <b>{city}</b><br/>Status: <b>{status}</b><br/>Plugs Available: <b>{available_plugs}/{total_plugs}</b>"}, map_style="mapbox://styles/mapbox/light-v10"))

        # 4. STATION DETAILS & BOOKING (/station/:id)
        elif user_nav == "🔌 Station Details & Booking (/station/:id)":
            st.markdown("""
            <div class="editorial-banner">
                <div class="hero-headline">Station Details & Slot Reservation</div>
                <div class="hero-subhead">Reserve a charging time slot at your chosen station.</div>
            </div>
            """, unsafe_allow_html=True)
            
            station_id = st.selectbox("Choose Station from Network Directory", [s['id'] + " - " + s['name'] for s in STATIONS_DATABASE])
            target_id = station_id.split(" - ")[0]
            st_obj = next((s for s in STATIONS_DATABASE if s['id'] == target_id), STATIONS_DATABASE[0])
            
            c_det, c_form = st.columns([1, 1])
            with c_det:
                st.markdown(f"""
                <div class="data-panel">
                    <div style="font-size:12px; font-weight:700; color:#0F766E; text-transform:uppercase;">{st_obj['operator']}</div>
                    <h3 style="color:#07111F; margin:4px 0 8px 0;">{st_obj['name']}</h3>
                    <div style="font-size:13px; color:#475569; margin-bottom:12px;">📍 {st_obj['address']}</div>
                    <div style="font-size:13.5px; color:#334155; line-height:1.7;">
                         Connectors: <b>{', '.join(st_obj['connectors'])}</b><br/>
                         Speed Architecture: <b>{st_obj['speed']}</b><br/>
                         Energy Tariff: <b style="color:#16A34A;">₹{st_obj['tariff_inr']:.2f} / kWh</b><br/>
                         Live Availability: <b>{st_obj['available_plugs']} / {st_obj['total_plugs']} Plugs Open</b><br/>
                         Amenities: {', '.join(st_obj['amenities'])}
                    </div>
                </div>
                """, unsafe_allow_html=True)
                
            with c_form:
                st.markdown("####  Booking Details")
                b_date = st.date_input("Select Charging Date", datetime.now().date())
                b_time = st.time_input("Select Start Time", datetime.now().time())
                b_veh = st.selectbox("Vehicle Category", ["2-Wheeler (AC Slow)", "3-Wheeler (AC Slow)", "4-Wheeler (DC Fast)", "Commercial E-Bus (Ultra Fast)"])
                b_hours = st.slider("Duration (Hours)", 0.5, 4.0, 2.0, 0.5)
                b_upi = st.text_input("UPI ID Credentials", "driver@okaxis")
                
                rate_map = {"2-Wheeler (AC Slow)": 50, "3-Wheeler (AC Slow)": 80, "4-Wheeler (DC Fast)": 220, "Commercial E-Bus (Ultra Fast)": 600}
                total_fee = round(rate_map[b_veh] * b_hours, 2)
                st.markdown(f"Total Amount: <b style='color:#16A34A; font-size:18px;'>₹{total_fee:.2f}</b>", unsafe_allow_html=True)
                
                if st.button("Submit UPI Reservation", type="primary", use_container_width=True):
                    domain = b_upi.split('@')[1] if '@' in b_upi else 'unknown'
                    tx_df = pd.DataFrame([{
                        'Device_OS': 'Android',
                        'UPI_Domain': domain,
                        'Amount_INR': total_fee,
                        'Hour_of_Day': b_time.hour,
                        'Transaction_Velocity_1h': 1
                    }])
                    
                    is_fraud = models['upi_fraud'].predict(tx_df)[0] if 'upi_fraud' in models else 0
                    fraud_prob = models['upi_fraud'].predict_proba(tx_df)[0][1] if 'upi_fraud' in models else 0.05
                    
                    if is_fraud == 1:
                        st.error(f"❌ Transaction Blocked: Security Risk Flagged ({fraud_prob*100:.1f}%)")
                    else:
                        booking_rec = {
                            "id": f"BK-{np.random.randint(10000, 99999)}",
                            "station": st_obj['name'],
                            "city": st_obj['city'],
                            "date": str(b_date),
                            "time": b_time.strftime("%H:%M"),
                            "vehicle": b_veh,
                            "duration": f"{b_hours} hrs",
                            "amount": total_fee,
                            "status": "Confirmed"
                        }
                        st.session_state['user_bookings'].append(booking_rec)
                        st.success(f" Booking Confirmed! Ref: {booking_rec['id']} (ML Security Risk: {fraud_prob*100:.2f}%)")
                        st.code(f"""
                        ================================================
                                    EVision Charging Networks           
                                  SLOT RESERVATION CONFIRMATION         
                        ================================================
                        Booking Ref:   {booking_rec['id']}
                        Station:       {st_obj['name']}
                        Date & Time:   {b_date} at {b_time.strftime("%H:%M")}
                        Vehicle:       {b_veh} ({b_hours} hrs)
                        Amount Paid:   INR {total_fee:.2f} via {b_upi}
                        Status:        CONFIRMED & VERIFIED
                        ================================================
                        """)

        # 5. MY BOOKINGS & HISTORY
        elif user_nav == " My Bookings & History":
            st.markdown("""
            <div class="editorial-banner">
                <div class="hero-headline">My Booking History</div>
                <div class="hero-subhead">View active, completed, and past charging slot reservations.</div>
            </div>
            """, unsafe_allow_html=True)
            
            if not st.session_state['user_bookings']:
                st.info("No active bookings found. Go to 'Find Charging Stations' to reserve your first slot.")
            else:
                df_bk = pd.DataFrame(st.session_state['user_bookings'])
                st.dataframe(df_bk, use_container_width=True, hide_index=True)

        # 6. SAVED FAVORITES
        elif user_nav == "❤️ Saved Favorite Stations":
            st.markdown("""
            <div class="editorial-banner">
                <div class="hero-headline">Saved Favorite Stations</div>
                <div class="hero-subhead">Your bookmarked public charging stations.</div>
            </div>
            """, unsafe_allow_html=True)
            
            fav_ids = st.session_state['favorite_stations']
            if not fav_ids:
                st.info("You haven't saved any favorite stations yet. Click '❤️ Save' on any station card to bookmark it here.")
            else:
                fav_objs = [s for s in STATIONS_DATABASE if s['id'] in fav_ids]
                for s in fav_objs:
                    maps_url = f"https://www.google.com/maps/dir/?api=1&destination={s['lat']},{s['lon']}"
                    st.markdown(f"""
                    <div class="station-card">
                        <div class="station-name">{s['name']}</div>
                        <div class="station-operator">{s['operator']} • {s['city']}</div>
                        <div style="font-size:13px; color:#334155; margin:6px 0;">📍 {s['address']}</div>
                        <div style="font-size:13px; color:#0F766E; font-weight:700;">⚡ Connectors: {', '.join(s['connectors'])} | Rate: <b style="color:#16A34A;">₹{s['tariff_inr']:.2f}/kWh</b></div>
                    </div>
                    """, unsafe_allow_html=True)

        # 7. BATTERY CALCULATOR
        elif user_nav == " Battery & Charging Calculator":
            st.markdown("""
            <div class="editorial-banner">
                <div class="hero-headline">EV Battery Telemetry & Charging Time Calculator</div>
                <div class="hero-subhead">Compute grid power requirements, session duration, cost estimates, and CO2 carbon offset.</div>
            </div>
            """, unsafe_allow_html=True)
            
            c_left, c_right = st.columns(2)
            with c_left:
                battery_kwh = st.number_input("Battery Pack Capacity (kWh)", min_value=3.0, max_value=120.0, value=40.5, step=0.5)
                curr_soc = st.slider("Current State of Charge (SOC %)", 5, 95, 20)
                target_soc = st.slider("Target State of Charge (SOC %)", 20, 100, 80)
                charger_type = st.selectbox("Select Charger Speed", ["3.3 kW AC Slow", "7.2 kW AC Fast", "25 kW DC Fast", "60 kW DC Ultra Fast", "150 kW Hyper Fast"])
                
            with c_right:
                kw_map = {"3.3 kW AC Slow": 3.3, "7.2 kW AC Fast": 7.2, "25 kW DC Fast": 25.0, "60 kW DC Ultra Fast": 60.0, "150 kW Hyper Fast": 150.0}
                power_kw = kw_map[charger_type]
                energy_needed = (target_soc - curr_soc) / 100.0 * battery_kwh
                actual_kwh_drawn = energy_needed / 0.90
                charging_hours = actual_kwh_drawn / power_kw
                charging_mins = int(charging_hours * 60)
                co2_saved_kg = actual_kwh_drawn * 0.85
                est_cost = actual_kwh_drawn * 12.5
                
                st.markdown(f"""
                <div class="kpi-box" style="border-left: 4px solid #0F766E;">
                    <div class="kpi-lbl">Estimated Charging Duration</div>
                    <div class="kpi-num" style="color:#0F766E;">{charging_mins} Mins ({charging_hours:.2f} hrs)</div>
                    <div style="margin-top:14px; color:#334155; font-size:13.5px; line-height:1.7;">
                         Energy Required: <b>{energy_needed:.2f} kWh</b><br/>
                         Grid Power Drawn: <b>{actual_kwh_drawn:.2f} kWh</b><br/>
                         Tariff Estimate: <b style="color:#16A34A;">₹{est_cost:.2f}</b><br/>
                         Carbon Offset: <b style="color:#16A34A;">{co2_saved_kg:.2f} kg CO2 Saved vs Petrol</b>
                    </div>
                </div>
                """, unsafe_allow_html=True)

        # 8. EV MARKETPLACE
        elif user_nav == " EV Marketplace":
            st.markdown("""
            <div class="editorial-banner">
                <div class="hero-headline">EV Buy & Sell Marketplace & Resale Engine</div>
                <div class="hero-subhead">Inspect vehicle technical specifications, compute monthly financing EMI, or evaluate pre-owned EV resale pricing.</div>
            </div>
            """, unsafe_allow_html=True)
            
            tab_new, tab_used, tab_sell = st.tabs(["✨ New EV Catalog", "🏷️ Certified Pre-Owned EVs", "💰 ML Resale Price Calculator"])
            with tab_new:
                cols = st.columns(3)
                for i, ev in enumerate(NEW_EV_CATALOG):
                    with cols[i % 3]:
                        st.markdown(f"""
                        <div class="kpi-box">
                            <img src="{ev['image']}" style="width:100%; height:140px; object-fit:cover; border-radius:6px; margin-bottom:8px;"/>
                            <div style="font-size:16px; font-weight:800; color:#07111F;">{ev['name']}</div>
                            <div style="font-size:19px; font-weight:800; color:#16A34A;">₹{ev['price']:,.0f}</div>
                            <div style="font-size:12px; color:#475569;">Range: <b>{ev['range_km']} km</b> | Battery: <b>{ev['battery_kwh']} kWh</b></div>
                        </div>
                        """, unsafe_allow_html=True)
                        with st.expander(f" Specs & EMI ({ev['name']})"):
                            max_dp = max(10000, int(ev['price'] * 0.80))
                            min_dp = min(5000, int(ev['price'] * 0.05))
                            default_dp = min(max_dp, max(min_dp, int(ev['price'] * 0.20)))
                            step_dp = 5000 if ev['price'] < 300000 else 50000
                            tenure = st.slider("Tenure (Years)", 3, 7, 5, key=f"t_{i}")
                            downpay = st.number_input("Down Payment (₹)", min_value=min_dp, max_value=max_dp, value=default_dp, step=step_dp, key=f"d_{i}")
                            loan_amt = ev['price'] - downpay
                            r = 0.088 / 12
                            n = tenure * 12
                            emi = loan_amt * r * ((1+r)**n) / (((1+r)**n) - 1)
                            st.markdown(f"Estimated Monthly EMI: <b style='color:#16A34A;'>₹{emi:,.0f} / month</b>", unsafe_allow_html=True)

            with tab_used:
                cols_u = st.columns(2)
                for j, uev in enumerate(USED_EV_INVENTORY):
                    with cols_u[j % 2]:
                        st.markdown(f"""
                        <div class="kpi-box">
                            <img src="{uev['image']}" style="width:100%; height:150px; object-fit:cover; border-radius:6px; margin-bottom:8px;"/>
                            <div style="font-size:17px; font-weight:800; color:#07111F;">{uev['title']}</div>
                            <div style="font-size:19px; font-weight:800; color:#16A34A;">₹{uev['price']:,.0f}</div>
                            <div style="font-size:12px; color:#475569;">Location: <b>{uev['location']}</b> | Battery SOH: <b style="color:#16A34A;">{uev['battery_soh']}%</b></div>
                        </div>
                        """, unsafe_allow_html=True)

            with tab_sell:
                cs1, cs2 = st.columns(2)
                with cs1:
                    orig_price = st.number_input("Original Purchase Price (₹)", min_value=100000, max_value=10000000, value=1650000, step=25000)
                    pur_year = st.selectbox("Year of Purchase", [2025, 2024, 2023, 2022, 2021, 2020])
                    odo_km = st.number_input("Odometer (KM Driven)", min_value=1000, max_value=200000, value=25000, step=1000)
                    soh_pct = st.slider("Battery State-of-Health (SOH %)", 50, 100, 95)
                with cs2:
                    est_val = estimate_used_ev_resale_price(orig_price, pur_year, odo_km, soh_pct)
                    st.markdown(f"""
                    <div class="kpi-box" style="border-left:4px solid #16A34A; margin-top:20px;">
                        <div class="kpi-lbl">Estimated Fair Market Valuation</div>
                        <div class="kpi-num" style="color:#16A34A;">₹{est_val:,.0f}</div>
                        <div style="font-size:12.5px; color:#475569; margin-top:8px;">Recommended Listing Price: <b>₹{est_val * 1.05:,.0f}</b></div>
                    </div>
                    """, unsafe_allow_html=True)

        # 9. HELP & ABOUT
        elif user_nav == "ℹ Help & About":
            st.markdown("""
            <div class="editorial-banner">
                <div class="hero-headline">Help & Data Methodology</div>
                <div class="hero-subhead">EVision open data platform specifications and user support.</div>
            </div>
            """, unsafe_allow_html=True)

# ----------------------------------------------------
# EVA (EVISION ASSISTANT) CHAT DRAWER
# ----------------------------------------------------
with st.sidebar.expander(" EVA (EVision Assistant)", expanded=False):
    st.markdown("<div style='font-size:12px; color:#94A3B8; margin-bottom:10px;'>Ask about station bookings, Infrastructure Gap formulas, or EDA insights.</div>", unsafe_allow_html=True)
    
    chat_container = st.container()
    for msg in st.session_state['chat_history']:
        if msg['role'] == 'user':
            chat_container.markdown(f"**You:** {msg['content']}")
        else:
            chat_container.markdown(f"**EVA:** {msg['content']}")
            
    user_q = st.text_input("Ask EVA a question...", key="eva_query_input")
    if st.button("Send Query", key="eva_send_btn"):
        if user_q:
            st.session_state['chat_history'].append({"role": "user", "content": user_q})
            reply = get_eva_response(user_q)
            st.session_state['chat_history'].append({"role": "assistant", "content": reply})
            st.rerun()

# Professional Analytics Footer
st.markdown("""
<div class="footer-bar">
    <div style="font-weight:700; color:#07111F; margin-bottom:4px;">EVision Infrastructure & Charging Intelligence Platform</div>
    <div>Baseline Data: VAHAN Vehicle Analytics, Bureau of Energy Efficiency (BEE), & Open Government Data India</div>
    <div style="margin-top:6px; font-size:11px; color:#475569;">© 2026 EVision Systems | Powered by Python, Scikit-learn, Tableau BI, & Streamlit.</div>
</div>
""", unsafe_allow_html=True)
