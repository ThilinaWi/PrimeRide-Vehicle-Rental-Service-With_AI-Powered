# import pandas as pd
# import numpy as np
# from datetime import datetime, timedelta
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import LabelEncoder
# from collections import Counter

# class VehiclePredictionModel:
#     def __init__(self):
#         # Expanded dataset with a variety of maintenance issues
#         self.data = pd.DataFrame({
#             "mileage": [15000, 20000, 18000, 25000, 22000, 30000, 28000, 35000, 40000, 45000, 48000, 50000],
#             "tire_wear": [40, 50, 35, 60, 55, 65, 70, 75, 80, 85, 90, 95],
#             "engine_health": [85, 75, 90, 70, 65, 55, 50, 40, 30, 25, 20, 15],
#             "brake_wear": [35, 45, 20, 50, 40, 60, 65, 70, 75, 80, 85, 90],
#             "oil_viscosity": [80, 70, 60, 50, 40, 30, 25, 20, 15, 10, 5, 0],
#             "coolant_level": [90, 85, 95, 80, 75, 60, 50, 40, 30, 20, 10, 5],
#             "issue_reported": [
#                 "Brake Pad Replacement", "Oil Change", "Tire Change",
#                 "Engine Check", "Suspension Repair", "Transmission Issue",
#                 "Battery Replacement", "Fuel System Check",
#                 "Overheating Problem", "Alternator Issue",
#                 "Clutch Failure", "Exhaust System Leak"
#             ]
#         })

#         # Print training data distribution (for debugging)
#         print("Training Data Distribution:", Counter(self.data["issue_reported"]))

#         # Prepare Data (Inputs & Output)
#         self.X = self.data[["mileage", "tire_wear", "engine_health", "brake_wear", "oil_viscosity", "coolant_level"]]
#         self.label_encoder = LabelEncoder()
#         self.y = self.label_encoder.fit_transform(self.data["issue_reported"])  # Encode issue names as numbers

#         # Train AI Model (RandomForest for better stability)
#         self.model = RandomForestClassifier(n_estimators=200, max_depth=6, random_state=42)
#         self.model.fit(self.X, self.y)

#     def predict_next_service(self, last_service_date: str, mileage: int, tire_wear: int, engine_health: int, brake_wear: int, oil_viscosity: int, coolant_level: int):
#         last_service = datetime.strptime(last_service_date, "%Y-%m-%d")

#         # Calculate time until next maintenance (based on engine health)
#         months_until_service = max(6, min(12, int((100 - engine_health) / 10)))
#         next_service_date = last_service + timedelta(days=months_until_service * 30)

#         # AI Predicts Issue
#         input_data = np.array([[mileage, tire_wear, engine_health, brake_wear, oil_viscosity, coolant_level]])
#         predicted_issue_index = self.model.predict(input_data)[0]
#         predicted_issue = self.label_encoder.inverse_transform([predicted_issue_index])[0]

#         # 🔹 Override AI with Rule-Based Enhancements
#         if brake_wear > 60:
#             predicted_issue = "Brake Pad Replacement"
#         elif oil_viscosity < 30:
#             predicted_issue = "Oil Change"
#         elif coolant_level < 40:
#             predicted_issue = "Engine Overheating Risk"
#         elif tire_wear > 70:
#             predicted_issue = "Tire Replacement"
#         elif engine_health < 50:
#             predicted_issue = "Alternator Issue"
        
#         # 🔹 Fix Status Issue
#         if engine_health >= 70 and tire_wear < 60 and brake_wear < 50 and oil_viscosity > 40 and coolant_level > 50:
#             status = "✅ Good Condition"
#         else:
#             status = "⚠ Needs Attention"

#         recommendation = f"Vehicle is safe to rent for now. Maintenance suggested before {next_service_date.strftime('%B %Y')}."

#         return {
#             "nextServiceDate": next_service_date.strftime("%Y-%m-%d"),
#             "predictedIssue": predicted_issue,
#             "status": status,
#             "recommendation": recommendation
#         }


# import pandas as pd
# import numpy as np
# from datetime import datetime, timedelta
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.preprocessing import LabelEncoder
# from collections import Counter

# class VehiclePredictionModel:
#     def __init__(self):
#         # Expanded dataset with a variety of maintenance issues
#         self.data = pd.DataFrame({
#             "mileage": [15000, 20000, 18000, 25000, 22000, 30000, 28000, 35000, 40000, 45000, 48000, 50000],
#             "tire_wear": [40, 50, 35, 60, 55, 65, 70, 75, 80, 85, 90, 95],
#             "engine_health": [85, 75, 90, 70, 65, 55, 50, 40, 30, 25, 20, 15],
#             "brake_wear": [35, 45, 20, 50, 40, 60, 65, 70, 75, 80, 85, 90],
#             "oil_viscosity": [80, 70, 60, 50, 40, 30, 25, 20, 15, 10, 5, 0],
#             "coolant_level": [90, 85, 95, 80, 75, 60, 50, 40, 30, 20, 10, 5],
#             "issue_reported": [
#                 "Brake Pad Replacement", "Oil Change", "Tire Change",
#                 "Engine Check", "Suspension Repair", "Transmission Issue",
#                 "Battery Replacement", "Fuel System Check",
#                 "Overheating Problem", "Alternator Issue",
#                 "Clutch Failure", "Exhaust System Leak"
#             ]
#         })

#         # Print training data distribution (for debugging)
#         print("Training Data Distribution:", Counter(self.data["issue_reported"]))

#         # Prepare Data (Inputs & Output)
#         self.X = self.data[["mileage", "tire_wear", "engine_health", "brake_wear", "oil_viscosity", "coolant_level"]]
#         self.label_encoder = LabelEncoder()
#         self.y = self.label_encoder.fit_transform(self.data["issue_reported"])  # Encode issue names as numbers

#         # Train AI Model (RandomForest for better stability)
#         self.model = RandomForestClassifier(n_estimators=200, max_depth=6, random_state=42)
#         self.model.fit(self.X, self.y)

#     def predict_next_service(self, last_service_date: str, mileage: int, tire_wear: int, engine_health: int, brake_wear: int, oil_viscosity: int, coolant_level: int):
#         last_service = datetime.strptime(last_service_date, "%Y-%m-%d")
#         today = datetime.today()

#         # Calculate time until next maintenance (based on engine health)
#         months_until_service = max(6, min(12, int((100 - engine_health) / 10)))
#         next_service_date = last_service + timedelta(days=months_until_service * 30)

#         # Ensure next service date is always in the future
#         if next_service_date < today:
#             next_service_date = today + timedelta(days=30)  # Set to at least 1 month from today

#         # AI Predicts Issue
#         input_data = np.array([[mileage, tire_wear, engine_health, brake_wear, oil_viscosity, coolant_level]])
#         predicted_issue_index = self.model.predict(input_data)[0]
#         predicted_issue = self.label_encoder.inverse_transform([predicted_issue_index])[0]

#         # Override AI with Rule-Based Enhancements
#         if brake_wear > 60:
#             predicted_issue = "Brake Pad Replacement"
#         elif oil_viscosity < 30:
#             predicted_issue = "Oil Change"
#         elif coolant_level < 40:
#             predicted_issue = "Engine Overheating Risk"
#         elif tire_wear > 70:
#             predicted_issue = "Tire Replacement"
#         elif engine_health < 50:
#             predicted_issue = "Alternator Issue"
        
#         # Fix Status Issue
#         if engine_health >= 70 and tire_wear < 60 and brake_wear < 50 and oil_viscosity > 40 and coolant_level > 50:
#             status = "✅ Good Condition"
#         else:
#             status = "⚠ Needs Attention"

#         recommendation = f"Vehicle is safe to rent for now. Maintenance suggested before {next_service_date.strftime('%B %Y')}."

#         return {
#             "nextServiceDate": next_service_date.strftime("%Y-%m-%d"),
#             "predictedIssue": predicted_issue,
#             "status": status,
#             "recommendation": recommendation
#         }

# # Example Usage
# if __name__ == "__main__":
#     model = VehiclePredictionModel()
#     prediction = model.predict_next_service(
#         last_service_date="2024-01-01",
#         mileage=30000,
#         tire_wear=70,
#         engine_health=65,
#         brake_wear=60,
#         oil_viscosity=40,
#         coolant_level=75
#     )
#     print(prediction)




import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from collections import Counter

class VehiclePredictionModel:
    def __init__(self):
        # Sample dataset for training
        self.data = pd.DataFrame({
            "mileage": [15000, 20000, 18000, 25000, 22000, 30000, 28000, 35000, 40000, 45000, 48000, 50000],
            "tire_wear": [40, 50, 35, 60, 55, 65, 70, 75, 80, 85, 90, 95],
            "engine_health": [85, 75, 90, 70, 65, 55, 50, 40, 30, 25, 20, 15],
            "brake_wear": [35, 45, 20, 50, 40, 60, 65, 70, 75, 80, 85, 90],
            "oil_viscosity": [80, 70, 60, 50, 40, 30, 25, 20, 15, 10, 5, 0],
            "coolant_level": [90, 85, 95, 80, 75, 60, 50, 40, 30, 20, 10, 5],
            "issue_reported": [
                "Brake Pad Replacement", "Oil Change", "Tire Change",
                "Engine Check", "Suspension Repair", "Transmission Issue",
                "Battery Replacement", "Fuel System Check",
                "Overheating Problem", "Alternator Issue",
                "Clutch Failure", "Exhaust System Leak"
            ]
        })

        print("Training Data Distribution:", Counter(self.data["issue_reported"]))

        self.X = self.data[[
            "mileage", "tire_wear", "engine_health",
            "brake_wear", "oil_viscosity", "coolant_level"
        ]]
        self.label_encoder = LabelEncoder()
        self.y = self.label_encoder.fit_transform(self.data["issue_reported"])

        self.model = RandomForestClassifier(n_estimators=200, max_depth=6, random_state=42)
        self.model.fit(self.X, self.y)

    def predict_next_service(
        self, last_service_date: str, mileage: int, tire_wear: int, engine_health: int,
        brake_wear: int, oil_viscosity: int, coolant_level: int
    ):
        last_service = datetime.strptime(last_service_date, "%Y-%m-%d")
        today = datetime.today()

        # Estimate months until service based on engine health
        months_until_service = max(6, min(12, int((100 - engine_health) / 10)))
        estimated_next_service = last_service + timedelta(days=months_until_service * 30)

        # If prediction is in the past
        if estimated_next_service < today:
            estimated_next_service = today + timedelta(days=30)

        # Predict issue using the trained model
        input_data = np.array([[mileage, tire_wear, engine_health, brake_wear, oil_viscosity, coolant_level]])
        predicted_issue_index = self.model.predict(input_data)[0]
        predicted_issue = self.label_encoder.inverse_transform([predicted_issue_index])[0]

        # Rule-based overrides (improves accuracy)
        if brake_wear > 60:
            predicted_issue = "Brake Pad Replacement"
        elif oil_viscosity < 30:
            predicted_issue = "Oil Change"
        elif coolant_level < 40:
            predicted_issue = "Engine Overheating Risk"
        elif tire_wear > 70:
            predicted_issue = "Tire Replacement"
        elif engine_health < 50:
            predicted_issue = "Alternator Issue"

        # Determine condition status
        if (
            engine_health >= 70 and tire_wear < 60 and brake_wear < 50 and
            oil_viscosity > 40 and coolant_level > 50
        ):
            status = "✅ Good Condition"
        else:
            status = "⚠ Needs Attention"

        # Generate recommendation message
        recommendation = f"Vehicle is safe to rent for now. Maintenance suggested before {estimated_next_service.strftime('%B %Y')}."

        return {
            "nextServiceDate": estimated_next_service.strftime("%Y-%m-%d"),
            "predictedIssue": predicted_issue,
            "status": status,
            "recommendation": recommendation
        }


# Test Example (Optional)
if __name__ == "__main__":
    model = VehiclePredictionModel()
    result = model.predict_next_service(
        last_service_date="2024-01-01",
        mileage=30000,
        tire_wear=70,
        engine_health=65,
        brake_wear=60,
        oil_viscosity=40,
        coolant_level=75
    )
    print(result)
