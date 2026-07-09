from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.appointment import Appointment
from app.models.customer import Customer
from app.models.user import User
from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentStatusUpdate,
    AppointmentUpdate,
)


def list_appointments(db: Session, owner_id: int, limit: int = 50, offset: int = 0):
    total = db.query(Appointment).filter(Appointment.owner_id == owner_id).count()
    items = (
        db.query(Appointment)
        .filter(Appointment.owner_id == owner_id)
        .order_by(
            Appointment.appointment_date.asc(),
            Appointment.start_time.asc(),
            Appointment.id.asc(),
        )
        .offset(offset)
        .limit(limit)
        .all()
    )
    return {
        "items": items,
        "total": total,
        "limit": limit,
        "offset": offset,
    }


def create_appointment(db: Session, appointment_data: AppointmentCreate, current_user: User):
    customer = (
        db.query(Customer)
        .filter(
            Customer.id == appointment_data.customer_id,
            Customer.owner_id == current_user.id,
        )
        .first()
    )
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    if appointment_data.end_time <= appointment_data.start_time:
        raise HTTPException(status_code=400, detail="End time must be after start time")

    conflicting_appointment = (
        db.query(Appointment)
        .filter(Appointment.owner_id == current_user.id)
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

    appointment = Appointment(**appointment_data.model_dump(), owner_id=current_user.id)
    db.add(appointment)
    try:
        db.commit()
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Appointment time conflicts with an existing appointment",
        ) from exc
    db.refresh(appointment)
    return appointment


def get_appointment_by_id(db: Session, appointment_id: int, owner_id: int):
    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id, Appointment.owner_id == owner_id)
        .first()
    )
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment


def update_appointment_status(
    db: Session,
    appointment_id: int,
    appointment_status_data: AppointmentStatusUpdate,
    owner_id: int,
):
    appointment = get_appointment_by_id(db, appointment_id, owner_id)
    appointment.status = appointment_status_data.status
    db.commit()
    db.refresh(appointment)
    return appointment


def delete_appointment(db: Session, appointment_id: int, owner_id: int):
    appointment = get_appointment_by_id(db, appointment_id, owner_id)
    db.delete(appointment)
    db.commit()
    return appointment


def update_appointment(
    db: Session,
    appointment_id: int,
    appointment_data: AppointmentUpdate,
    owner_id: int,
):
    appointment = get_appointment_by_id(db, appointment_id, owner_id)
    appointment_data_as_dict = appointment_data.model_dump(exclude_unset=True)

    if "customer_id" in appointment_data_as_dict:
        customer = (
            db.query(Customer)
            .filter(
                Customer.id == appointment_data_as_dict["customer_id"],
                Customer.owner_id == owner_id,
            )
            .first()
        )
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")

    final_date = appointment_data.appointment_date or appointment.appointment_date
    final_start_time = appointment_data.start_time or appointment.start_time
    final_end_time = appointment_data.end_time or appointment.end_time

    if final_end_time <= final_start_time:
        raise HTTPException(status_code=400, detail="End time must be after start time")

    conflicting_appointment = (
        db.query(Appointment)
        .filter(Appointment.id != appointment_id)
        .filter(Appointment.owner_id == owner_id)
        .filter(Appointment.appointment_date == final_date)
        .filter(Appointment.start_time < final_end_time)
        .filter(Appointment.end_time > final_start_time)
        .first()
    )
    if conflicting_appointment:
        raise HTTPException(
            status_code=409,
            detail="Appointment time conflicts with an existing appointment",
        )

    for field, value in appointment_data_as_dict.items():
        setattr(appointment, field, value)

    try:
        db.commit()
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Appointment time conflicts with an existing appointment",
        ) from exc
    db.refresh(appointment)
    return appointment
