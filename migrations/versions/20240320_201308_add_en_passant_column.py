"""add en passant column

Revision ID: 87e87e2f0f20
Revises: 54c7df800e03
Create Date: 2024-03-20 20:13:08.171725

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '87e87e2f0f20'
down_revision = '54c7df800e03'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('games', schema=None) as batch_op:
        batch_op.add_column(sa.Column('en_passant', sa.String(length=2), nullable=True))
        batch_op.alter_column('white_can_long',
               existing_type=sa.BOOLEAN(),
               nullable=False)
        batch_op.alter_column('white_can_short',
               existing_type=sa.BOOLEAN(),
               nullable=False)
        batch_op.alter_column('black_can_long',
               existing_type=sa.BOOLEAN(),
               nullable=False)
        batch_op.alter_column('black_can_short',
               existing_type=sa.BOOLEAN(),
               nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('games', schema=None) as batch_op:
        batch_op.alter_column('black_can_short',
               existing_type=sa.BOOLEAN(),
               nullable=True)
        batch_op.alter_column('black_can_long',
               existing_type=sa.BOOLEAN(),
               nullable=True)
        batch_op.alter_column('white_can_short',
               existing_type=sa.BOOLEAN(),
               nullable=True)
        batch_op.alter_column('white_can_long',
               existing_type=sa.BOOLEAN(),
               nullable=True)
        batch_op.drop_column('en_passant')

    # ### end Alembic commands ###