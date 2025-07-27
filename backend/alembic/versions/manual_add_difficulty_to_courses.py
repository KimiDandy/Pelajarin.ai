"""Manually add difficulty column to courses table

Revision ID: manual_add_difficulty
Revises: fe42b2a828b7
Create Date: 2025-07-27 22:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'manual_add_difficulty'
down_revision: Union[str, Sequence[str], None] = 'fe42b2a828b7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema to add difficulty column."""
    # Define the ENUM type. The 'name' is important for PostgreSQL.
    difficulty_enum = sa.Enum('pemula', 'menengah', 'mahir', name='difficultylevel')
    difficulty_enum.create(op.get_bind(), checkfirst=True)
    
    # Add the column to the 'courses' table.
    op.add_column('courses', 
        sa.Column('difficulty', 
                  difficulty_enum, 
                  nullable=False, 
                  server_default='pemula')
    )


def downgrade() -> None:
    """Downgrade schema to remove difficulty column."""
    # Drop the column first.
    op.drop_column('courses', 'difficulty')
    
    # Then, drop the ENUM type.
    difficulty_enum = sa.Enum('pemula', 'menengah', 'mahir', name='difficultylevel')
    difficulty_enum.drop(op.get_bind())
