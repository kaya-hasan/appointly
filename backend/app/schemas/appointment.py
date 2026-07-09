from datetime import date, time
from typing import Optional

from pydantic import BaseModel, Field


class AppointmentBase(BaseModel):
    customer_id: int
    appointment_date: date
    start_time: time
    end_time: time
    service_type: str = Field(min_length=2, max_length=120)
    status: Optional[str] = Field(default="pending", pattern="^(pending|confirmed|cancelled)$")


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentRead(AppointmentBase):
    id: int
    model_config = {"from_attributes": True}


class AppointmentStatusUpdate(BaseModel):
    status: str = Field(pattern="^(pending|confirmed|cancelled)$")


class AppointmentUpdate(BaseModel):
    customer_id: Optional[int] = None
    appointment_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    service_type: Optional[str] = Field(default=None, min_length=2, max_length=120)
    status: Optional[str] = Field(default=None, pattern="^(pending|confirmed|cancelled)$")
