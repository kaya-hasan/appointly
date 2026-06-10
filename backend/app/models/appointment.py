from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey, Date, Time
from app.db.database import Base


class Appointment(Base):
  __tablename__ = "appointments"
  id = Column(Integer, primary_key=True, index=True)
  customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
  customer = relationship("Customer", back_populates="appointments")
  appointment_date = Column(Date, index=True, nullable=False)
  start_time = Column(Time, index=True, nullable=False)
  end_time = Column(Time, index=True, nullable=False)
  service_type = Column(String, index=True, nullable=False)
  status = Column(String, index=True, nullable=False, default="pending")