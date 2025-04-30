from prophet import Prophet
import pandas as pd
import numpy as np

def train_prophet_model():
    # Generate 180 days of synthetic historical demand data
    np.random.seed(42)
    dates = pd.date_range(start='2022-01-01', periods=180)
    demand = np.random.randint(100, 250, size=len(dates))

    df = pd.DataFrame({
        'ds': dates,
        'y': demand
    })

    # Train Prophet model
    model = Prophet()
    model.fit(df)

    # Predict the next 30 days
    future = model.make_future_dataframe(periods=30)
    forecast = model.predict(future)

    return forecast