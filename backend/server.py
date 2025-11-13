from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from datetime import datetime
from typing import Optional, List
import os
from dotenv import load_dotenv
import uuid

load_dotenv()

app = FastAPI(title="Ophthalmos API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DATABASE_NAME", "color_vision_app")

client = MongoClient(MONGO_URL)
db = client[DB_NAME]

# Collections
users_collection = db["users"]
cone_tests_collection = db["cone_tests"]
performance_tests_collection = db["performance_tests"]

# Models
class User(BaseModel):
    name: str
    email: Optional[str] = None

class ConeTestResult(BaseModel):
    userId: str
    lCone: float  # L-cone (red) sensitivity 0-100
    mCone: float  # M-cone (green) sensitivity 0-100
    sCone: float  # S-cone (blue) sensitivity 0-100

class PerformanceTestResult(BaseModel):
    userId: str
    testType: str
    score: int
    time: float  # time in seconds
    difficulty: str

class ColorAdaptation(BaseModel):
    lCone: float
    mCone: float
    sCone: float

# Root endpoint
@app.get("/api/")
async def root():
    return {"message": "Ophthalmos API", "status": "running"}

# Health check
@app.get("/api/health")
async def health():
    try:
        client.admin.command('ping')
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

# User Management
@app.post("/api/users")
async def create_user(user: User):
    user_id = str(uuid.uuid4())
    user_data = {
        "userId": user_id,
        "name": user.name,
        "email": user.email,
        "createdAt": datetime.utcnow().isoformat()
    }
    users_collection.insert_one(user_data)
    return {"userId": user_id, "message": "User created successfully"}

@app.get("/api/users/{user_id}")
async def get_user(user_id: str):
    user = users_collection.find_one({"userId": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/api/users")
async def get_all_users():
    users = list(users_collection.find({}, {"_id": 0}))
    return users

# Cone Test Management
@app.post("/api/cone-tests")
async def save_cone_test(result: ConeTestResult):
    test_data = {
        "testId": str(uuid.uuid4()),
        "userId": result.userId,
        "lCone": result.lCone,
        "mCone": result.mCone,
        "sCone": result.sCone,
        "testDate": datetime.utcnow().isoformat()
    }
    cone_tests_collection.insert_one(test_data)
    return {"message": "Cone test saved successfully", "testId": test_data["testId"]}

@app.get("/api/cone-tests/{user_id}")
async def get_cone_tests(user_id: str):
    tests = list(cone_tests_collection.find({"userId": user_id}, {"_id": 0}).sort("testDate", -1))
    return tests

@app.get("/api/cone-tests/{user_id}/latest")
async def get_latest_cone_test(user_id: str):
    test = cone_tests_collection.find_one({"userId": user_id}, {"_id": 0}, sort=[("testDate", -1)])
    if not test:
        raise HTTPException(status_code=404, detail="No cone test found for this user")
    return test

# Performance Test Management
@app.post("/api/performance-tests")
async def save_performance_test(result: PerformanceTestResult):
    test_data = {
        "testId": str(uuid.uuid4()),
        "userId": result.userId,
        "testType": result.testType,
        "score": result.score,
        "time": result.time,
        "difficulty": result.difficulty,
        "testDate": datetime.utcnow().isoformat()
    }
    performance_tests_collection.insert_one(test_data)
    return {"message": "Performance test saved successfully", "testId": test_data["testId"]}

@app.get("/api/performance-tests/{user_id}")
async def get_performance_tests(user_id: str):
    tests = list(performance_tests_collection.find({"userId": user_id}, {"_id": 0}).sort("testDate", -1))
    return tests

@app.get("/api/performance-tests/{user_id}/stats")
async def get_performance_stats(user_id: str):
    tests = list(performance_tests_collection.find({"userId": user_id}, {"_id": 0}))
    if not tests:
        return {"totalTests": 0, "averageScore": 0, "averageTime": 0, "improvement": 0}
    
    total_tests = len(tests)
    avg_score = sum(t["score"] for t in tests) / total_tests
    avg_time = sum(t["time"] for t in tests) / total_tests
    
    # Calculate improvement (compare first 3 and last 3 tests)
    improvement = 0
    if total_tests >= 6:
        first_three = sorted(tests, key=lambda x: x["testDate"])[:3]
        last_three = sorted(tests, key=lambda x: x["testDate"])[-3:]
        first_avg = sum(t["score"] for t in first_three) / 3
        last_avg = sum(t["score"] for t in last_three) / 3
        improvement = ((last_avg - first_avg) / first_avg * 100) if first_avg > 0 else 0
    
    return {
        "totalTests": total_tests,
        "averageScore": round(avg_score, 2),
        "averageTime": round(avg_time, 2),
        "improvement": round(improvement, 2)
    }

# Color Adaptation Algorithm
@app.post("/api/color-adaptation")
async def get_color_adaptation(adaptation: ColorAdaptation):
    """
    Returns color adaptation recommendations based on cone sensitivities
    """
    recommendations = {
        "redAdjustment": 1.0,
        "greenAdjustment": 1.0,
        "blueAdjustment": 1.0,
        "contrastBoost": 1.0,
        "recommendations": []
    }
    
    # Adjust based on L-cone (red) sensitivity
    if adaptation.lCone < 50:
        recommendations["redAdjustment"] = 0.7
        recommendations["contrastBoost"] = 1.3
        recommendations["recommendations"].append(
            f"L-cone sensitivity is {adaptation.lCone}% - reducing red reliance, increasing contrast"
        )
    elif adaptation.lCone < 80:
        recommendations["redAdjustment"] = 0.85
        recommendations["recommendations"].append(
            f"L-cone sensitivity is {adaptation.lCone}% - slightly reducing red emphasis"
        )
    
    # Adjust based on M-cone (green) sensitivity
    if adaptation.mCone < 50:
        recommendations["greenAdjustment"] = 0.7
        recommendations["contrastBoost"] = max(recommendations["contrastBoost"], 1.3)
        recommendations["recommendations"].append(
            f"M-cone sensitivity is {adaptation.mCone}% - fine-tuning green shades for better separation"
        )
    elif adaptation.mCone < 80:
        recommendations["greenAdjustment"] = 0.85
        recommendations["recommendations"].append(
            f"M-cone sensitivity is {adaptation.mCone}% - adjusting green perception"
        )
    
    # Adjust based on S-cone (blue) sensitivity
    if adaptation.sCone < 50:
        recommendations["blueAdjustment"] = 0.7
        recommendations["recommendations"].append(
            f"S-cone sensitivity is {adaptation.sCone}% - shifting away from blue-yellow differentiations"
        )
    elif adaptation.sCone < 80:
        recommendations["blueAdjustment"] = 0.85
        recommendations["recommendations"].append(
            f"S-cone sensitivity is {adaptation.sCone}% - slight blue adjustment"
        )
    
    if not recommendations["recommendations"]:
        recommendations["recommendations"].append("All cone sensitivities are in normal range - no adjustments needed")
    
    return recommendations

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)