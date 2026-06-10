from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from app.schemas.appointment import AppointmentCreate, AppointmentRead, AppointmentStatusUpdate, AppointmentUpdate
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

@router.get("/{appointment_id}", response_model=AppointmentRead)
async def get_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
):
    return appointment_service.get_appointment_by_id(db, appointment_id)

@router.patch("/{appointment_id}/status", response_model=AppointmentRead)
async def update_appointment_status(
    appointment_id: int,
    appointment_status_data: AppointmentStatusUpdate,
    db: Session = Depends(get_db),
):
    return appointment_service.update_appointment_status(db, appointment_id, appointment_status_data)

@router.delete("/{appointment_id}", status_code=204)
async def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
):
    appointment_service.delete_appointment(db, appointment_id)

@router.patch("/{appointment_id}", response_model=AppointmentRead)
async def update_appointment(
    appointment_id: int,
    appointment: AppointmentUpdate,
    db: Session = Depends(get_db),
):
    return appointment_service.update_appointment(db, appointment_id, appointment)
