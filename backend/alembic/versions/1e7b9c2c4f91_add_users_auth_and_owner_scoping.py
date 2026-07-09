"""add users auth and owner scoping

Revision ID: 1e7b9c2c4f91
Revises: 0348d6d6304e
Create Date: 2026-07-09
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "1e7b9c2c4f91"
down_revision: Union[str, Sequence[str], None] = "0348d6d6304e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)

    op.add_column("customers", sa.Column("owner_id", sa.Integer(), nullable=True))
    op.create_index(op.f("ix_customers_owner_id"), "customers", ["owner_id"], unique=False)
    op.create_foreign_key(
        "fk_customers_owner_id_users",
        "customers",
        "users",
        ["owner_id"],
        ["id"],
        ondelete="RESTRICT",
    )
    op.create_unique_constraint(
        "uq_customers_owner_email", "customers", ["owner_id", "email"]
    )
    op.create_unique_constraint(
        "uq_customers_owner_phone", "customers", ["owner_id", "phone"]
    )

    op.add_column("appointments", sa.Column("owner_id", sa.Integer(), nullable=True))
    op.create_index(op.f("ix_appointments_owner_id"), "appointments", ["owner_id"], unique=False)
    op.create_foreign_key(
        "fk_appointments_owner_id_users",
        "appointments",
        "users",
        ["owner_id"],
        ["id"],
        ondelete="RESTRICT",
    )
    op.create_check_constraint(
        "ck_appointments_status",
        "appointments",
        "status IN ('pending', 'confirmed', 'cancelled')",
    )

    op.execute("CREATE EXTENSION IF NOT EXISTS btree_gist")
    op.execute(
        """
        ALTER TABLE appointments
        ADD CONSTRAINT appointments_owner_time_excl
        EXCLUDE USING gist (
            owner_id WITH =,
            tsrange(
                (appointment_date + start_time)::timestamp,
                (appointment_date + end_time)::timestamp,
                '[)'
            ) WITH &&
        )
        WHERE (owner_id IS NOT NULL)
        """
    )


def downgrade() -> None:
    op.execute(
        "ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_owner_time_excl"
    )
    op.drop_constraint("ck_appointments_status", "appointments", type_="check")
    op.drop_constraint("fk_appointments_owner_id_users", "appointments", type_="foreignkey")
    op.drop_index(op.f("ix_appointments_owner_id"), table_name="appointments")
    op.drop_column("appointments", "owner_id")

    op.drop_constraint("uq_customers_owner_phone", "customers", type_="unique")
    op.drop_constraint("uq_customers_owner_email", "customers", type_="unique")
    op.drop_constraint("fk_customers_owner_id_users", "customers", type_="foreignkey")
    op.drop_index(op.f("ix_customers_owner_id"), table_name="customers")
    op.drop_column("customers", "owner_id")

    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")
