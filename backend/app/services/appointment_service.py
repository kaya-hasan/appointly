from sqlalchemy.orm import Session
from app.models.appointment import Appointment
from app.schemas import AppointmentCreate, AppointmentStatusUpdate
from app.models.customer import Customer
from fastapi import HTTPException


def list_appointments(db: Session):
    return db.query(Appointment).all()


def create_appointment(db: Session, appointment_data: AppointmentCreate):
    customer = db.query(Customer).filter(Customer.id == appointment_data.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    if appointment_data.end_time <= appointment_data.start_time:
        raise HTTPException(status_code=400, detail="End time must be after start time")
    valid_statuses = {"pending", "confirmed", "cancelled"}
    if appointment_data.status and appointment_data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid appointment status")
    conflicting_appointment = (
        db.query(Appointment)
        .filter(Appointment.appointment_date == appointment_data.appointment_date)
        .filter(Appointment.start_time < appointment_data.end_time)
        .filter(Appointment.end_time > appointment_data.start_time)
        .first()
    )
    if conflicting_appointment:
        raise HTTPException(
            status_code=409,
            detail="Appointment time conflicts with an existing appointment",
        )
    appointment = Appointment(**appointment_data.model_dump())
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


def get_appointment_by_id(db: Session, appointment_id: int):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

def update_appointment_status(db: Session, appointment_id: int, appointment_status_data: AppointmentStatusUpdate):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    valid_statuses = {"pending", "confirmed", "cancelled"}
    if appointment_status_data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid appointment status")
    setattr(appointment, "status", appointment_status_data.status)
    db.commit()
    db.refresh(appointment)
    return appointment

def delete_appointment(db: Session, appointment_id: int):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    db.delete(appointment)
    db.commit()
    return appointment
