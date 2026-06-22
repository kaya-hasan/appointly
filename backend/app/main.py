# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import customers, appointments

app = FastAPI(title="Appointly", debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customers.router)
app.include_router(appointments.router)

@app.get("/")
def read_root():
    return {"message": "Appointly API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}
