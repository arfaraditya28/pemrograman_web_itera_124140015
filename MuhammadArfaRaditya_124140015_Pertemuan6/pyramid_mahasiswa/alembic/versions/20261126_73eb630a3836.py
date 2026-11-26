"""create matakuliah table

Revision ID: 73eb630a3836
Revises: 7a4263f7ee44
Create Date: 2026-11-26 01:13:40.858927

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '73eb630a3836'
down_revision = '7a4263f7ee44'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'matakuliah',
        sa.Column(
            'id',
            sa.Integer(),
            autoincrement=True,
            nullable=False,
        ),
        sa.Column('kode_mk', sa.Text(), nullable=False),
        sa.Column('nama_mk', sa.Text(), nullable=False),
        sa.Column('sks', sa.Integer(), nullable=False),
        sa.Column('semester', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_matakuliah')),
        sa.UniqueConstraint(
            'kode_mk',
            name=op.f('uq_matakuliah_kode_mk'),
        ),
    )


def downgrade():
    op.drop_table('matakuliah')
