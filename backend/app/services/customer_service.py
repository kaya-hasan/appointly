from sqlalchemy.orm import Session
from app.models.customer import Customer
from app.schemas import CustomerCreate


def list_customers(db: Session):
    return db.query(Customer).all()


def create_customer(db: Session, customer_data: CustomerCreate):
    customer = Customer(**customer_data.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer
