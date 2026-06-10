from sqlalchemy.orm import relationship
from app.db.database import Base
from sqlalchemy import Column, Integer, String


class Customer(Base):
  __tablename__ = "customers"
  id = Column(Integer, primary_key=True, index=True, nullable=False)
  name = Column(String, index=True, nullable=False)
  email = Column(String, index=True, nullable=True)
  phone = Column(String, index=True, nullable=False)
  appointments = relationship("Appointment", back_populates="customer")

