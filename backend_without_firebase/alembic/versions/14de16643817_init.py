"""init

Revision ID: 14de16643817
Revises: 226adc58845a
Create Date: 2023-11-15 06:00:22.844659

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '14de16643817'
down_revision: Union[str, None] = '226adc58845a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
