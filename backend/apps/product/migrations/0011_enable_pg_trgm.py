# Generated manually to enable pg_trgm extension

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0010_drop_category_table'),
    ]

    operations = [
        migrations.RunSQL(
            # Enable pg_trgm extension for fuzzy text matching
            sql="CREATE EXTENSION IF NOT EXISTS pg_trgm;",
            reverse_sql="DROP EXTENSION IF EXISTS pg_trgm;",
        ),
    ]
