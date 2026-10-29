import os
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, mean_squared_error, r2_score
import joblib

def train_forecasting_models(df, models_dir):
    """
    Fits and saves forecasting models for EV Registrations and Charging Stations.
    1. Fits a Linear Regression on log(EV_Registrations) vs. Year for each state to capture exponential growth trends.
    2. Trains a RandomForestRegressor to predict the required public charging stations from EV population and demographics.
    """
    print("\n--- Training EV Demand & Infrastructure Forecasting Models ---")
    
    # 1. EV Registrations Growth Model (State-wise log-linear regression coefficients)
    state_coefficients = {}
    
    for state in df['State'].unique():
        state_df = df[df['State'] == state].copy()
        
        # Fit linear model on Year vs log(EV_Registrations + 1)
        X = state_df[['Year']].values
        y = np.log1p(state_df['Total_EV_Registrations'].values)
        
        model = LinearRegression()
        model.fit(X, y)
        
        state_coefficients[state] = {
            'slope': float(model.coef_[0]),
            'intercept': float(model.intercept_)
        }
        
    # Save coefficients to a JSON file
    with open(os.path.join(models_dir, 'ev_growth_coefficients.json'), 'w') as f:
        json.dump(state_coefficients, f, indent=4)
    print("Saved EV growth linear coefficients to models/ev_growth_coefficients.json")
    
    # 2. Charging Stations Predictor (RandomForestRegressor)
    # Features: Total_EV_Registrations, Population_Million, Urbanization_Percentage, Area_Sq_Km, GDP_Tier
    # Target: Public_Charging_Stations
    
    # Encode GDP_Tier manually
    df_reg = df.copy()
    gdp_mapping = {'Low': 0, 'Medium': 1, 'High': 2}
    df_reg['GDP_Tier_Code'] = df_reg['GDP_Tier'].map(gdp_mapping)
    
    features = ['Total_EV_Registrations', 'Population_Million', 'Urbanization_Percentage', 'Area_Sq_Km', 'GDP_Tier_Code']
    X_reg = df_reg[features]
    y_reg = df_reg['Public_Charging_Stations']
    
    X_train, X_test, y_train, y_test = train_test_split(X_reg, y_reg, test_size=0.2, random_state=42)
    
    rf_reg = RandomForestRegressor(n_estimators=100, random_state=42)
    rf_reg.fit(X_train, y_train)
    
    # Evaluate
    y_pred = rf_reg.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"Charging Stations Predictor (Random Forest Regressor) R2 Score: {r2:.4f}, MSE: {mse:.4f}")
    
    # Save charging station model
    joblib.dump(rf_reg, os.path.join(models_dir, 'charging_station_rf_regressor.pkl'))
    print("Saved Charging Stations RF model to models/charging_station_rf_regressor.pkl")

def train_upi_fraud_model(models_dir, raw_data_dir):
    """
    Trains and saves a RandomForestClassifier pipeline to detect UPI transaction fraud.
    """
    print("\n--- Training UPI Transaction Fraud Detection Model ---")
    
    upi_path = os.path.join(raw_data_dir, 'upi_transactions.csv')
    if not os.path.exists(upi_path):
        print(f"Error: UPI transactions dataset not found at {upi_path}")
        return
        
    df_upi = pd.read_csv(upi_path)
    
    # Feature engineering: extract UPI domain from UPI ID
    df_upi['UPI_Domain'] = df_upi['UPI_ID'].apply(lambda x: x.split('@')[1] if '@' in str(x) else 'unknown')
    
    # Define features and target
    categorical_features = ['Device_OS', 'UPI_Domain']
    numeric_features = ['Amount_INR', 'Hour_of_Day', 'Transaction_Velocity_1h']
    
    X = df_upi[categorical_features + numeric_features]
    y = df_upi['Is_Fraudulent']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Set up preprocessing pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ],
        remainder='passthrough'
    )
    
    # Combine preprocessing and model in a Pipeline
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced'))
    ])
    
    # Train
    pipeline.fit(X_train, y_train)
    
    # Evaluate
    y_pred = pipeline.predict(X_test)
    print("Classification Report on Test Data:")
    print(classification_report(y_test, y_pred))
    
    # Save the pipeline
    joblib.dump(pipeline, os.path.join(models_dir, 'upi_fraud_pipeline.pkl'))
    print("Saved UPI Fraud model pipeline to models/upi_fraud_pipeline.pkl")

def main():
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    processed_path = os.path.join(BASE_DIR, 'data', 'processed', 'master_ev_dataset.csv')
    raw_data_dir = os.path.join(BASE_DIR, 'data', 'raw')
    models_dir = os.path.join(BASE_DIR, 'models')
    
    os.makedirs(models_dir, exist_ok=True)
    
    if os.path.exists(processed_path):
        df = pd.read_csv(processed_path)
        train_forecasting_models(df, models_dir)
    else:
        print(f"Error: Processed master dataset not found at {processed_path}")
        
    train_upi_fraud_model(models_dir, raw_data_dir)

if __name__ == '__main__':
    main()
