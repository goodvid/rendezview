"""Changed blogs schema

Revision ID: fba421a3b528
Revises: 041c026d2162
Create Date: 2024-04-25 03:09:41.488376

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fba421a3b528'
down_revision = '041c026d2162'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('blog', schema=None) as batch_op:
        batch_op.alter_column('blogID',
               existing_type=sa.INTEGER(),
               nullable=False,
               autoincrement=True)

    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('picture',
               existing_type=sa.VARCHAR(length=50),
               type_=sa.String(length=100),
               existing_nullable=True)
        batch_op.drop_column('friends')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('friends', sa.VARCHAR(length=1000), nullable=True))
        batch_op.alter_column('picture',
               existing_type=sa.String(length=100),
               type_=sa.VARCHAR(length=50),
               existing_nullable=True)

    with op.batch_alter_table('blog', schema=None) as batch_op:
        batch_op.alter_column('blogID',
               existing_type=sa.INTEGER(),
               nullable=True,
               autoincrement=True)

    # ### end Alembic commands ###
