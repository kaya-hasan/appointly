from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class CustomerBase(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: Optional[EmailStr] = None
    phone: str = Field(min_length=7, max_length=30)


class CustomerCreate(CustomerBase):
    pass


class CustomerRead(CustomerBase):
    id: int
    model_config = {"from_attributes": True}


class CustomerListResponse(BaseModel):
    items: list[CustomerRead]
    total: int
    limit: int
    offset: int


class CustomerUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=120)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(default=None, min_length=7, max_length=30)
