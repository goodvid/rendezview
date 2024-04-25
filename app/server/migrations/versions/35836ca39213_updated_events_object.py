"""updated events object

Revision ID: 35836ca39213
Revises: 550f9372b73c
Create Date: 2024-03-19 18:16:57.040597

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '35836ca39213'
down_revision = '550f9372b73c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('event', schema=None) as batch_op:
        batch_op.add_column(sa.Column('googleID', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('longitude', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('latitude', sa.Float(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('event', schema=None) as batch_op:
        batch_op.drop_column('latitude')
        batch_op.drop_column('longitude')
        batch_op.drop_column('googleID')

    # ### end Alembic commands ###