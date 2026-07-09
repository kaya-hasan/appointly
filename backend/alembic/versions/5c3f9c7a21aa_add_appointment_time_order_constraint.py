"""add appointment time order constraint

Revision ID: 5c3f9c7a21aa
Revises: 1e7b9c2c4f91
Create Date: 2026-07-09
"""

from typing import Sequence, Union

from alembic import op


revision: str = "5c3f9c7a21aa"
down_revision: Union[str, Sequence[str], None] = "1e7b9c2c4f91"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_check_constraint(
        "ck_appointments_time_order",
        "appointments",
        "end_time > start_time",
    )


def downgrade() -> None:
    op.drop_constraint(
        "ck_appointments_time_order",
        "appointments",
        type_="check",
    )
