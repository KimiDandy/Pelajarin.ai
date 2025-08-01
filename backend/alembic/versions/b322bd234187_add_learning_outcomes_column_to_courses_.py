"""Add learning_outcomes column to courses table

Revision ID: b322bd234187
Revises: 2231c705198a
Create Date: 2025-08-02 00:32:55.787383

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b322bd234187'
down_revision: Union[str, Sequence[str], None] = '2231c705198a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('courses', sa.Column('learning_outcomes', sa.JSON(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('courses', 'learning_outcomes')
