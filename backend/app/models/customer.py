from sqlalchemy import Column, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship

from app.db.database import Base


class Customer(Base):
    __tablename__ = "customers"
    __table_args__ = (
        UniqueConstraint("owner_id", "email", name="uq_customers_owner_email"),
        UniqueConstraint("owner_id", "phone", name="uq_customers_owner_phone"),
    )

    id = Column(Integer, primary_key=True, index=True, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="RESTRICT"), index=True, nullable=True)
    name = Column(String, index=True, nullable=False)
    email = Column(String, index=True, nullable=True)
    phone = Column(String, index=True, nullable=False)

    appointments = relationship("Appointment", back_populates="customer")
    owner = relationship("User", back_populates="customers")
