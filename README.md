# EVision ⚡
### EV Charging Demand Forecasting and Infrastructure Gap Analysis System

EVision is a Data Science decision-support system designed to analyze electric vehicle (EV) adoption and public charging station growth in India, evaluate geographic infrastructure gaps, forecast future demands to 2030, and prioritize station deployment locations.

It also features a **Smart Slot Reservation & Booking system with a Mock UPI payment gateway** backed by a Machine Learning transaction fraud classifier.

---

## 🏗️ Project Architecture

```
EVision/
│
├── data/
│   ├── raw/                  # Ingested datasets (EVs, Stations, Demographics, UPI Logs)
│   └── processed/            # Preprocessed master dataset
│
├── src/
│   ├── data/                 # Ingest & Preprocessing scripts
│   ├── eda/                  # Exploratory analysis plotting
│   ├── features/             # Gap Engine calculations
│   └── models/               # ML model training pipelines
│
├── models/                   # Serialized ML model binaries (.pkl, .json)
├── reports/
│   └── figures/              # Pre-generated EDA plots (png format)
│
├── app/
│   └── app.py                # User-facing Streamlit Web Dashboard
│
├── requirements.txt          # Third-party Python dependencies
└── README.md                 # Project README (this file)
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
Make sure you have **Python 3.10+** installed on your system.

### 2. Setup the Virtual Environment
Navigate to the project root directory and execute:
```powershell
# Create venv
python -m venv venv

# Activate venv (Windows)
venv\Scripts\activate
```

### 3. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 4. Run the Data & ML Pipeline
Run the ingestion, preprocessing, and training scripts in order to generate the master dataset, plots, and models:
```powershell
# Ingest raw data
python src/data/ingest_data.py

# Preprocess & merge
python src/data/process_data.py

# Run Gap calculations
python src/features/gap_engine.py

# Output EDA figures
python src/eda/eda_analysis.py

# Train ML models
python src/models/train_models.py
```

### 5. Launch the Web Application
Launch the interactive Streamlit dashboard:
```powershell
streamlit run app/app.py
```
Open [http://localhost:8501](http://localhost:8501) in your browser to view and interact with EVision!

---

## 💡 Key Features of the Web Dashboard

1. **⚡ Dashboard Overview:** Glassmorphic card metrics showing national registrations, charger growth rates, and critical gap counts.
2. **🗺️ Geospatial Gap Map:** Map visualizing state-wise charging station availability, EV registrations, and Gap scores (color-coded).
3. **📊 Exploratory Analytics:** Interactive graphs revealing category shares (2W, 3W, 4W, Buses) and YoY adoption vs. infrastructure growth mismatches.
4. **🔮 ML Demand Forecasting:** Leverages log-linear regressions and RandomForest regressors to forecast state-level EV counts and station counts up to 2030.
5. **🎯 Priority Deployment Planner:** Sliders to weight policy metrics (concentration vs growth rate vs capacity shortage) to dynamically allocate and rank new stations.
6. **💳 Smart Booking & UPI payment simulator:** A booking gateway where charging reservation cost is calculated and run through a trained RandomForest classifier to detect anomalous transactions. Generates dynamic mock UPI QR codes and reservation slips on success, or flags high-risk transactions.
