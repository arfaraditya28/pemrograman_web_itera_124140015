"""create mahasiswa table

Revision ID: 7a4263f7ee44
Revises:
Create Date: 2026-11-26 01:13:19.734728

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7a4263f7ee44'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'mahasiswa',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nim', sa.Text(), nullable=False),
        sa.Column('nama', sa.Text(), nullable=False),
        sa.Column('jurusan', sa.Text(), nullable=False),
        sa.Column('tanggal_lahir', sa.Date(), nullable=True),
        sa.Column('alamat', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_mahasiswa')),
        sa.UniqueConstraint('nim', name=op.f('uq_mahasiswa_nim')),
    )
    op.create_table(
        'models',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.Text(), nullable=True),
        sa.Column('value', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_models')),
    )
    op.create_index(
        'my_index',
        'models',
        ['name'],
        unique=True,
        mysql_length=255,
    )


def downgrade():
    op.drop_index('my_index', table_name='models')
    op.drop_table('models')
    op.drop_table('mahasiswa')
