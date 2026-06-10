from app.schemas.customer import CustomerBase, CustomerCreate, CustomerRead
from app.schemas.appointment import (
    AppointmentBase,
    AppointmentCreate,
    AppointmentRead,
    AppointmentStatusUpdate,
)

__all__ = [
    "CustomerBase",
    "CustomerCreate",
    "CustomerRead",
    "AppointmentBase",
    "AppointmentCreate",
    "AppointmentRead",
    "AppointmentStatusUpdate",
]
