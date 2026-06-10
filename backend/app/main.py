# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from app.api.routes import customers, appointments

app = FastAPI(title="Appointly", debug=True)

app.include_router(customers.router)
app.include_router(appointments.router)

@app.get("/")
def read_root():
    return {"message": "Appointly API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}
