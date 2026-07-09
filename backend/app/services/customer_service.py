from fastapi import HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.appointment import Appointment
from app.models.customer import Customer
from app.models.user import User
from app.schemas.customer import CustomerCreate, CustomerUpdate


def list_customers(db: Session, owner_id: int, limit: int = 50, offset: int = 0):
    total = db.query(Customer).filter(Customer.owner_id == owner_id).count()
    items = (
        db.query(Customer)
        .filter(Customer.owner_id == owner_id)
        .order_by(Customer.id.asc())
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


def create_customer(db: Session, customer_data: CustomerCreate, current_user: User):
    duplicate_filters = [Customer.phone == customer_data.phone]
    if customer_data.email:
        duplicate_filters.append(Customer.email == customer_data.email)

    existing_customer = (
        db.query(Customer)
        .filter(Customer.owner_id == current_user.id)
        .filter(or_(*duplicate_filters))
        .first()
    )
    if existing_customer:
        raise HTTPException(status_code=409, detail="Customer already exists")

    customer = Customer(**customer_data.model_dump(), owner_id=current_user.id)
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


def get_customer_by_id(db: Session, customer_id: int, owner_id: int):
    customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id, Customer.owner_id == owner_id)
        .first()
    )
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


def update_customer(db: Session, customer_id: int, customer_data: CustomerUpdate, owner_id: int):
    customer = get_customer_by_id(db, customer_id, owner_id)
    customer_data_as_dict = customer_data.model_dump(exclude_unset=True)

    duplicate_filters = []
    if customer_data_as_dict.get("phone"):
        duplicate_filters.append(Customer.phone == customer_data_as_dict["phone"])
    if customer_data_as_dict.get("email"):
        duplicate_filters.append(Customer.email == customer_data_as_dict["email"])

    if duplicate_filters:
        duplicate_customer = (
            db.query(Customer)
            .filter(Customer.owner_id == owner_id, Customer.id != customer_id)
            .filter(or_(*duplicate_filters))
            .first()
        )
        if duplicate_customer:
            raise HTTPException(status_code=409, detail="Customer already exists")

    for field, value in customer_data_as_dict.items():
        setattr(customer, field, value)
    db.commit()
    db.refresh(customer)
    return customer


def delete_customer(db: Session, customer_id: int, owner_id: int):
    customer = get_customer_by_id(db, customer_id, owner_id)
    if (
        db.query(Appointment)
        .filter(Appointment.customer_id == customer_id, Appointment.owner_id == owner_id)
        .first()
    ):
        raise HTTPException(status_code=409, detail="Customer has appointments")
    db.delete(customer)
    db.commit()
    return customer
