from fastapi import FastAPI
from pydantic import BaseModel
from prophet import Prophet
import pandas as pd
import numpy as np

app = FastAPI()

np.random.seed(42)  
dates = pd.date_range(start='2022-01-01', periods=180)
demand = np.random.randint(100, 250, size=len(dates))  

historical_data = pd.DataFrame({
    'ds': dates,
    'y': demand
})

# Pydantic model for request
class ForecastRequest(BaseModel):
    is_probabilistic: bool

@app.post("/api/forecast")
async def get_forecast(request: ForecastRequest):
    # Create the model
    model = Prophet()

    # If probabilistic demand model is selected, modify the behavior slightly
    if request.is_probabilistic:
        model.add_seasonality(name='yearly', period=365.25, fourier_order=8) 

    model.fit(historical_data)

    # Make future predictions
    future = model.make_future_dataframe(historical_data, periods=30)
    forecast = model.predict(future)

    # Prepare the data to return
    forecast_data = {
        'dates': forecast['ds'].dt.strftime('%Y-%m-%d').tolist(),
        'forecast_values': forecast['yhat'].tolist(),
    }

    return forecast_data