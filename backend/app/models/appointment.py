from sqlalchemy import CheckConstraint, Column, Date, ForeignKey, Integer, String, Time
from sqlalchemy.orm import relationship

from app.db.database import Base


class Appointment(Base):
    __tablename__ = "appointments"
    __table_args__ = (
        CheckConstraint(
            "status IN ('pending', 'confirmed', 'cancelled')",
            name="ck_appointments_status",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="RESTRICT"), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="RESTRICT"), index=True, nullable=True)
    appointment_date = Column(Date, index=True, nullable=False)
    start_time = Column(Time, index=True, nullable=False)
    end_time = Column(Time, index=True, nullable=False)
    service_type = Column(String, index=True, nullable=False)
    status = Column(String, index=True, nullable=False, default="pending")

    customer = relationship("Customer", back_populates="appointments")
    owner = relationship("User", back_populates="appointments")
