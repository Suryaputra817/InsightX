# INSIGHTX ML SERVICE

from fastapi import FastAPI
from pydantic import BaseModel

import joblib
import pandas as pd
import numpy as np
import os
import shap

# INPUT MODELS

class DriverInput(BaseModel):

    orders_change_pct_new: float
    customers_change_pct_new: float
    aov_change_pct_new: float
    delivery_change_pct_new: float
    late_delivery_change_pct_new: float
    review_change_pct_new: float

    inventory_index: float
    price_index: float
    marketing_index: float


class HypothesisInput(BaseModel):

    revenue_change: float
    orders_change: float
    customers_change: float
    aov_change: float
    delivery_change: float
    late_delivery_change: float
    review_change: float

    inventory_index: float
    price_index: float
    marketing_index: float


# PROJECT PATH

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models"
)


# MODEL PATHS

ANOMALY_MODEL_PATH = os.path.join(
    MODEL_DIR,
    "anomaly_model.pkl"
)

DRIVER_MODEL_PATH = os.path.join(
    MODEL_DIR,
    "driver_xgboost.pkl"
)

HYPOTHESIS_MODEL_PATH = os.path.join(
    MODEL_DIR,
    "hypothesis_classifier.pkl"
)

ENCODER_PATH = os.path.join(
    MODEL_DIR,
    "hypothesis_label_encoder.pkl"
)


# LOAD MODELS

anomaly_model = joblib.load(
    ANOMALY_MODEL_PATH
)

driver_model = joblib.load(
    DRIVER_MODEL_PATH
)

driver_explainer = shap.TreeExplainer(
    driver_model
)

hypothesis_model = joblib.load(
    HYPOTHESIS_MODEL_PATH
)

hypothesis_encoder = joblib.load(
    ENCODER_PATH
)



# FASTAPI APPLICATION


app = FastAPI(
    title="InsightX ML Service",
    description="Machine Learning API for InsightX",
    version="1.0.0"
)



# CONFIDENCE ENGINE


def calculate_confidence(
    hypothesis_probability,
    evidence_strength,
    data_quality
):

    confidence = (
        0.50 * hypothesis_probability
        + 0.30 * evidence_strength
        + 0.20 * data_quality
    )

    return round(
        confidence,
        4
    )



# ANOMALY DETECTION


def predict_anomaly(data):

    anomaly_input = pd.DataFrame(
        [[
            data.revenue_change,
            data.orders_change,
            data.customers_change,
            data.aov_change,
            data.delivery_change,
            data.late_delivery_change,
            data.review_change,

            # Temporary values
            # These will be replaced with real
            # historical 7-day calculations later.
            0.0,
            0.0
        ]],
        columns=[
            "revenue_change_pct",
            "orders_change_pct",
            "customers_change_pct",
            "aov_change_pct",
            "delivery_change_pct",
            "late_delivery_change_pct",
            "review_change_pct",
            "revenue_deviation_7d_pct",
            "revenue_volatility_7d"
        ]
    )

    prediction = anomaly_model.predict(
        anomaly_input
    )[0]

    anomaly_score = anomaly_model.decision_function(
        anomaly_input
    )[0]

    return {
        "is_anomaly": bool(
            prediction == -1
        ),

        "anomaly_score": round(
            float(anomaly_score),
            4
        )
    }


# EVIDENCE STRENGTH


def calculate_evidence_strength(data):

    evidence_scores = []


    # Revenue
    if abs(data.revenue_change) >= 10:

        evidence_scores.append(1.0)

    elif abs(data.revenue_change) >= 5:

        evidence_scores.append(0.7)

    else:

        evidence_scores.append(0.3)


    # Orders
    if abs(data.orders_change) >= 10:

        evidence_scores.append(1.0)

    elif abs(data.orders_change) >= 5:

        evidence_scores.append(0.7)

    else:

        evidence_scores.append(0.3)


    # Delivery
    if abs(data.delivery_change) >= 20:

        evidence_scores.append(1.0)

    elif abs(data.delivery_change) >= 10:

        evidence_scores.append(0.7)

    else:

        evidence_scores.append(0.3)


    # Late delivery
    if abs(data.late_delivery_change) >= 20:

        evidence_scores.append(1.0)

    elif abs(data.late_delivery_change) >= 10:

        evidence_scores.append(0.7)

    else:

        evidence_scores.append(0.3)


    return round(
        sum(evidence_scores)
        / len(evidence_scores),
        4
    )



# DATA QUALITY


def calculate_data_quality(data):

    values = [

        data.revenue_change,
        data.orders_change,
        data.customers_change,
        data.aov_change,
        data.delivery_change,
        data.late_delivery_change,
        data.review_change,

        data.inventory_index,
        data.price_index,
        data.marketing_index
    ]

    total_values = len(values)

    valid_values = 0


    for value in values:

        if value is not None:

            try:

                if np.isfinite(value):

                    valid_values += 1

            except Exception:

                pass


    quality = (
        valid_values
        / total_values
    )

    return round(
        quality,
        4
    )



# EVIDENCE GENERATOR


def generate_evidence(data):

    evidence = []


    # -----------------------------------------------------
    # Revenue
    # -----------------------------------------------------

    if data.revenue_change <= -10:

        evidence.append(
            f"Revenue declined by "
            f"{abs(data.revenue_change):.1f}%."
        )

    elif data.revenue_change >= 10:

        evidence.append(
            f"Revenue increased by "
            f"{data.revenue_change:.1f}%."
        )


    # -----------------------------------------------------
    # Orders
    # -----------------------------------------------------

    if data.orders_change <= -10:

        evidence.append(
            f"Orders declined by "
            f"{abs(data.orders_change):.1f}%."
        )

    elif data.orders_change >= 10:

        evidence.append(
            f"Orders increased by "
            f"{data.orders_change:.1f}%."
        )


    # -----------------------------------------------------
    # Customers
    # -----------------------------------------------------

    if data.customers_change <= -10:

        evidence.append(
            f"Customers declined by "
            f"{abs(data.customers_change):.1f}%."
        )

    elif data.customers_change >= 10:

        evidence.append(
            f"Customers increased by "
            f"{data.customers_change:.1f}%."
        )


    # -----------------------------------------------------
    # Delivery
    # -----------------------------------------------------

    if data.delivery_change >= 10:

        evidence.append(
            f"Average delivery time increased by "
            f"{data.delivery_change:.1f}%."
        )

    elif data.delivery_change <= -10:

        evidence.append(
            f"Average delivery time decreased by "
            f"{abs(data.delivery_change):.1f}%."
        )


    # -----------------------------------------------------
    # Late Delivery
    # -----------------------------------------------------

    if data.late_delivery_change >= 10:

        evidence.append(
            f"Late delivery rate increased by "
            f"{data.late_delivery_change:.1f}%."
        )

    elif data.late_delivery_change <= -10:

        evidence.append(
            f"Late delivery rate decreased by "
            f"{abs(data.late_delivery_change):.1f}%."
        )


    # -----------------------------------------------------
    # Reviews
    # -----------------------------------------------------

    if data.review_change <= -10:

        evidence.append(
            f"Review performance declined by "
            f"{abs(data.review_change):.1f}%."
        )

    elif data.review_change >= 10:

        evidence.append(
            f"Review performance increased by "
            f"{data.review_change:.1f}%."
        )


    # -----------------------------------------------------
    # Inventory
    # -----------------------------------------------------

    if data.inventory_index < 0.8:

        evidence.append(
            "Inventory levels are significantly below "
            "the reference level."
        )


    # -----------------------------------------------------
    # Price
    # -----------------------------------------------------

    if abs(data.price_index - 1) >= 0.1:

        evidence.append(
            f"Price index changed to "
            f"{data.price_index:.2f}."
        )


    # -----------------------------------------------------
    # Marketing
    # -----------------------------------------------------

    if abs(data.marketing_index - 1) >= 0.1:

        evidence.append(
            f"Marketing activity changed to "
            f"{data.marketing_index:.2f}."
        )


    return evidence


# =========================================================
# RECOMMENDATION ENGINE
# =========================================================

def generate_recommendations(
    data,
    hypothesis
):

    recommendations = []


    # -----------------------------------------------------
    # Logistics
    # -----------------------------------------------------

    if (
        data.delivery_change >= 20
        or data.late_delivery_change >= 20
    ):

        recommendations.append(
            "Investigate logistics partner SLA "
            "and delivery performance."
        )

        recommendations.append(
            "Review delayed orders and identify "
            "the most affected regions or warehouses."
        )


    # -----------------------------------------------------
    # Inventory
    # -----------------------------------------------------

    if data.inventory_index < 0.8:

        recommendations.append(
            "Investigate inventory shortages and "
            "replenishment delays."
        )

        recommendations.append(
            "Review safety-stock levels for "
            "affected products."
        )


    # -----------------------------------------------------
    # Customer Churn
    # -----------------------------------------------------

    if data.customers_change <= -10:

        recommendations.append(
            "Investigate customer churn and "
            "customer retention performance."
        )

        recommendations.append(
            "Analyze whether customer loss is "
            "concentrated in specific segments."
        )


    # -----------------------------------------------------
    # Pricing
    # -----------------------------------------------------

    if abs(data.price_index - 1) >= 0.1:

        recommendations.append(
            "Review recent pricing changes and "
            "their impact on demand."
        )


    # -----------------------------------------------------
    # Marketing
    # -----------------------------------------------------

    if abs(data.marketing_index - 1) >= 0.1:

        recommendations.append(
            "Review marketing campaign performance "
            "and recent changes in marketing activity."
        )


    # -----------------------------------------------------
    # Product / Reviews
    # -----------------------------------------------------

    if data.review_change <= -10:

        recommendations.append(
            "Investigate product quality and "
            "customer feedback."
        )


    # -----------------------------------------------------
    # Fallback
    # -----------------------------------------------------

    if len(recommendations) == 0:

        recommendations.append(
            "Investigate the highest-ranked hypothesis "
            "using additional business and historical data."
        )


    return recommendations



# HOME


@app.get("/")
def home():

    return {
        "message": "InsightX ML Service is running"
    }



# HEALTH CHECK


@app.get("/health")
def health():

    return {

        "status": "healthy",

        "models_loaded": True

    }



# DRIVER PREDICTION + SHAP


@app.post("/predict/driver")
def predict_driver(
    data: DriverInput
):

    input_data = pd.DataFrame(
        [[
            data.orders_change_pct_new,
            data.customers_change_pct_new,
            data.aov_change_pct_new,
            data.delivery_change_pct_new,
            data.late_delivery_change_pct_new,
            data.review_change_pct_new,
            data.inventory_index,
            data.price_index,
            data.marketing_index
        ]],
        columns=[
            "orders_change_pct_new",
            "customers_change_pct_new",
            "aov_change_pct_new",
            "delivery_change_pct_new",
            "late_delivery_change_pct_new",
            "review_change_pct_new",
            "inventory_index",
            "price_index",
            "marketing_index"
        ]
    )


    # XGBoost prediction

    prediction = driver_model.predict(
        input_data
    )[0]


    # SHAP explanation

    shap_values = driver_explainer(
        input_data
    )

    values = shap_values.values[0]

    feature_names = input_data.columns

    drivers = []


    for feature, value in zip(
        feature_names,
        values
    ):

        drivers.append({

            "feature": feature,

            "shap_value": round(
                float(value),
                4
            )

        })


    # Strongest drivers first

    drivers.sort(
        key=lambda x: abs(
            x["shap_value"]
        ),
        reverse=True
    )


    return {

        "predicted_revenue_change": round(
            float(prediction),
            2
        ),

        "drivers": drivers

    }



# HYPOTHESIS CLASSIFIER


@app.post("/predict/hypothesis")
def predict_hypothesis(
    data: HypothesisInput
):

    input_data = pd.DataFrame(
        [[
            data.revenue_change,
            data.orders_change,
            data.customers_change,
            data.aov_change,
            data.delivery_change,
            data.late_delivery_change,
            data.review_change,
            data.inventory_index,
            data.price_index,
            data.marketing_index
        ]],
        columns=[
            "revenue_change",
            "orders_change",
            "customers_change",
            "aov_change",
            "delivery_change",
            "late_delivery_change",
            "review_change",
            "inventory_index",
            "price_index",
            "marketing_index"
        ]
    )


    # -----------------------------------------------------
    # Hypothesis prediction
    # -----------------------------------------------------

    probabilities = hypothesis_model.predict_proba(
        input_data
    )[0]


    predicted_index = np.argmax(
        probabilities
    )


    predicted_hypothesis = (
        hypothesis_encoder.inverse_transform(
            [predicted_index]
        )[0]
    )


    hypothesis_probability = float(
        probabilities[predicted_index]
    )


    # -----------------------------------------------------
    # Evidence
    # -----------------------------------------------------

    evidence_strength = (
        calculate_evidence_strength(
            data
        )
    )


    evidence = generate_evidence(
        data
    )


    # -----------------------------------------------------
    # Data quality
    # -----------------------------------------------------

    data_quality = (
        calculate_data_quality(
            data
        )
    )


    # -----------------------------------------------------
    # Confidence
    # -----------------------------------------------------

    confidence = calculate_confidence(
        hypothesis_probability,
        evidence_strength,
        data_quality
    )


    # -----------------------------------------------------
    # Recommendations
    # -----------------------------------------------------

    recommendations = generate_recommendations(
        data,
        predicted_hypothesis
    )


    # -----------------------------------------------------
    # All hypotheses
    # -----------------------------------------------------

    all_hypotheses = []


    for label, probability in zip(
        hypothesis_encoder.classes_,
        probabilities
    ):

        all_hypotheses.append({

            "hypothesis": label,

            "probability": round(
                float(probability),
                4
            )

        })


    all_hypotheses.sort(
        key=lambda x: x["probability"],
        reverse=True
    )


    return {

        "hypothesis": predicted_hypothesis,

        "hypothesis_probability": round(
            hypothesis_probability,
            4
        ),

        "evidence_strength": evidence_strength,

        "data_quality": data_quality,

        "confidence": confidence,

        "evidence": evidence,

        "recommendations": recommendations,

        "all_hypotheses": all_hypotheses

    }



# MASTER INVESTIGATION API


@app.post("/investigate")
def investigate(
    data: HypothesisInput
):


    # 1. ANOMALY DETECTION


    anomaly_result = predict_anomaly(
        data
    )



    # 2. DRIVER INPUT


    driver_input = pd.DataFrame(
        [[
            data.orders_change,
            data.customers_change,
            data.aov_change,
            data.delivery_change,
            data.late_delivery_change,
            data.review_change,
            data.inventory_index,
            data.price_index,
            data.marketing_index
        ]],
        columns=[
            "orders_change_pct_new",
            "customers_change_pct_new",
            "aov_change_pct_new",
            "delivery_change_pct_new",
            "late_delivery_change_pct_new",
            "review_change_pct_new",
            "inventory_index",
            "price_index",
            "marketing_index"
        ]
    )



    # 3. DRIVER PREDICTION


    driver_prediction = driver_model.predict(
        driver_input
    )[0]



    # 4. SHAP EXPLANATION


    shap_values = driver_explainer(
        driver_input
    )

    shap_values_row = shap_values.values[0]

    drivers = []


    for feature, value in zip(
        driver_input.columns,
        shap_values_row
    ):

        drivers.append({

            "feature": feature,

            "shap_value": round(
                float(value),
                4
            )

        })


    drivers.sort(
        key=lambda x: abs(
            x["shap_value"]
        ),
        reverse=True
    )



    # 5. HYPOTHESIS INPUT


    hypothesis_input = pd.DataFrame(
    [[
        data.revenue_change,
        data.orders_change,
        data.customers_change,
        data.aov_change,
        data.delivery_change,
        data.late_delivery_change,
        data.review_change,
        data.inventory_index,
        data.price_index,
        data.marketing_index
    ]],
    columns=[
        "revenue_change_pct",
        "orders_change_pct",
        "customers_change_pct",
        "aov_change_pct",
        "delivery_change_pct",
        "late_delivery_change_pct",
        "review_change_pct",
        "inventory_index",
        "price_index",
        "marketing_index"
    ]
)



    # 6. HYPOTHESIS PREDICTION


    probabilities = hypothesis_model.predict_proba(
        hypothesis_input
    )[0]


    predicted_index = np.argmax(
        probabilities
    )


    predicted_hypothesis = (
        hypothesis_encoder.inverse_transform(
            [predicted_index]
        )[0]
    )


    hypothesis_probability = float(
        probabilities[predicted_index]
    )



    # 7. EVIDENCE


    evidence_strength = (
        calculate_evidence_strength(
            data
        )
    )


    evidence = generate_evidence(
        data
    )



    # 8. DATA QUALITY


    data_quality = (
        calculate_data_quality(
            data
        )
    )



    # 9. CONFIDENCE


    confidence = calculate_confidence(
        hypothesis_probability,
        evidence_strength,
        data_quality
    )



    # 10. RECOMMENDATIONS


    recommendations = generate_recommendations(
        data,
        predicted_hypothesis
    )



    # 11. ALL HYPOTHESES


    all_hypotheses = []


    for label, probability in zip(
        hypothesis_encoder.classes_,
        probabilities
    ):

        all_hypotheses.append({

            "hypothesis": label,

            "probability": round(
                float(probability),
                4
            )

        })


    all_hypotheses.sort(
        key=lambda x: x["probability"],
        reverse=True
    )



    # 12. FINAL INVESTIGATION RESULT


    return {

        "metric": "revenue",


        # Anomaly detection

        "anomaly": anomaly_result,


        # Revenue

        "observed_revenue_change": round(
            float(data.revenue_change),
            2
        ),

        "predicted_revenue_change": round(
            float(driver_prediction),
            2
        ),


        # Drivers

        "top_drivers": drivers[:5],


        # Hypothesis

        "hypothesis": predicted_hypothesis,

        "hypothesis_probability": round(
            hypothesis_probability,
            4
        ),


        # Confidence

        "confidence": confidence,

        "evidence_strength": evidence_strength,

        "data_quality": data_quality,


        # Evidence

        "evidence": evidence,


        # Recommendations

        "recommendations": recommendations,


        # All hypotheses

        "all_hypotheses": all_hypotheses

    }