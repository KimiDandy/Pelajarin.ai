"""
Add performance indexes for course detail loading optimization

Revision ID: 20250727_add_performance_indexes
Revises: 4c880efadbad
Create Date: 2025-07-27 00:40:00.000000

This migration adds strategic indexes to improve query performance
for course detail loading (reducing 5-7s to 2-3s).
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '20250727_add_performance_indexes'
down_revision = '4c880efadbad'
branch_labels = None
depends_on = None


def upgrade():
    # Index for course queries by user_id
    op.create_index('idx_courses_user_id', 'courses', ['user_id'])
    
    # Index for module queries by course_id
    op.create_index('idx_modules_course_id', 'modules', ['course_id'])
    
    # Index for sub_topic queries by module_id
    op.create_index('idx_sub_topics_module_id', 'sub_topics', ['module_id'])
    
    # Index for assessment queries by course_id
    op.create_index('idx_assessments_course_id', 'assessments', ['course_id'])
    
    # Composite index for course details (user_id + course_id)
    op.create_index('idx_courses_user_course', 'courses', ['user_id', 'id'])
    
    # Index for course status filtering
    op.create_index('idx_courses_status', 'courses', ['status'])


def downgrade():
    # Drop all performance indexes
    op.drop_index('idx_courses_user_id', table_name='courses')
    op.drop_index('idx_modules_course_id', table_name='modules')
    op.drop_index('idx_sub_topics_module_id', table_name='sub_topics')
    op.drop_index('idx_assessments_course_id', table_name='assessments')
    op.drop_index('idx_courses_user_course', table_name='courses')
    op.drop_index('idx_courses_status', table_name='courses')
