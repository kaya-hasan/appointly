from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from app.schemas.appointment import AppointmentCreate, AppointmentRead
from app.db.database import get_db
from app.services import appointment_service

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.get("/", response_model=list[AppointmentRead])
async def read_appointments(db: Session = Depends(get_db)):
    return appointment_service.list_appointments(db)


@router.post("/", response_model=AppointmentRead)
async def create_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db),
):
    return appointment_service.create_appointment(db, appointment)
