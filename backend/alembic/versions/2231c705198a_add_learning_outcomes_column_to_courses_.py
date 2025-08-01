"""Add learning_outcomes column to courses table

Revision ID: 2231c705198a
Revises: manual_add_difficulty
Create Date: 2025-08-02 00:32:48.584774

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2231c705198a'
down_revision: Union[str, Sequence[str], None] = 'manual_add_difficulty'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
