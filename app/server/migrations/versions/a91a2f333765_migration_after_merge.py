"""migration after merge

Revision ID: a91a2f333765
Revises: 
Create Date: 2024-03-25 22:48:12.637856

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a91a2f333765'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('status',
    sa.Column('sid', sa.Integer(), nullable=False),
    sa.Column('user', sa.String(length=5000), nullable=True),
    sa.Column('friend', sa.String(length=5000), nullable=True),
    sa.Column('status', sa.String(length=5000), nullable=True),
    sa.ForeignKeyConstraint(['friend'], ['user.email'], ),
    sa.ForeignKeyConstraint(['user'], ['user.email'], ),
    sa.PrimaryKeyConstraint('sid')
    )
    op.create_table('event_rating',
    sa.Column('userID', sa.Integer(), nullable=False),
    sa.Column('eventID', sa.Integer(), nullable=False),
    sa.Column('yelpID', sa.String(length=500), nullable=True),
    sa.Column('rating', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['eventID'], ['event.eventID'], ),
    sa.ForeignKeyConstraint(['userID'], ['user.id'], ),
    sa.PrimaryKeyConstraint('userID', 'eventID')
    )
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

    op.drop_table('event_rating')
    op.drop_table('status')
    # ### end Alembic commands ###
