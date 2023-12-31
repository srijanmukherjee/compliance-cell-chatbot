"""message log updated

Revision ID: 17d3b096aa73
Revises: 36fe12893597
Create Date: 2023-11-15 13:53:02.629803

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '17d3b096aa73'
down_revision: Union[str, None] = '36fe12893597'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('message_log', sa.Column('tag', sa.String(), nullable=True))
    op.drop_constraint('message_log_intent_id_fkey', 'message_log', type_='foreignkey')
    op.drop_column('message_log', 'intent_id')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('message_log', sa.Column('intent_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.create_foreign_key('message_log_intent_id_fkey', 'message_log', 'intent', ['intent_id'], ['id'])
    op.drop_column('message_log', 'tag')
    # ### end Alembic commands ###
