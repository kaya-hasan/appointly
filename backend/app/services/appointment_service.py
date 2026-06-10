from sqlalchemy.orm import Session
from app.models.appointment import Appointment
from app.schemas import AppointmentCreate


def list_appointments(db: Session):
    return db.query(Appointment).all()


def create_appointment(db: Session, appointment_data: AppointmentCreate):
    appointment = Appointment(**appointment_data.model_dump())
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment
