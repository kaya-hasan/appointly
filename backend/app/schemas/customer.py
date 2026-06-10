
from pydantic import BaseModel
from typing import Optional

class CustomerBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: str


class CustomerCreate(CustomerBase):
  pass

class CustomerRead(CustomerBase):
    id: int
    name: str
    email: Optional[str] = None
    phone: str
    model_config = {"from_attributes": True}