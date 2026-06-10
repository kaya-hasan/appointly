from pydantic import BaseModel
from typing import Optional
from datetime import date, time

class AppointmentBase(BaseModel):
    customer_id: int
    appointment_date: date
    start_time: time
    end_time: time
    service_type: str
    status: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentRead(AppointmentBase):
    id: int
    customer_id: int
    appointment_date: date
    start_time: time
    end_time: time
    service_type: str
    status: Optional[str] = None
    model_config = {"from_attributes": True}

class AppointmentStatusUpdate(BaseModel):
    status: str
