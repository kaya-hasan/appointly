from app.schemas import CustomerUpdate
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.customer import Customer
from app.schemas import CustomerCreate
from app.models.appointment import Appointment

def list_customers(db: Session):
    return db.query(Customer).all()


def create_customer(db: Session, customer_data: CustomerCreate):
    customer = Customer(**customer_data.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer

def get_customer_by_id(db: Session, customer_id: int):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


def update_customer(db: Session, customer_id: int, customer_data: CustomerUpdate):
    customer = get_customer_by_id(db, customer_id)
    customer_data_as_dict = customer_data.model_dump(exclude_unset=True)
    for field, value in customer_data_as_dict.items():
        setattr(customer, field, value)
    db.commit()
    db.refresh(customer)
    return customer

def delete_customer(db: Session, customer_id: int):
    customer = get_customer_by_id(db, customer_id)
    if db.query(Appointment).filter(Appointment.customer_id == customer_id).first():
        raise HTTPException(status_code=409, detail="Customer has appointments")
    db.delete(customer)
    db.commit()
    return customer
