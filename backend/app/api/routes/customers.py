from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from app.schemas.customer import CustomerCreate, CustomerRead
from app.db.database import get_db
from app.services import customer_service

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("/", response_model=list[CustomerRead])
async def read_customers(db: Session = Depends(get_db)):
    return customer_service.list_customers(db)


@router.post("/", response_model=CustomerRead)
async def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    return customer_service.create_customer(db, customer)
