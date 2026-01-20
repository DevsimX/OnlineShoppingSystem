# Generated manually to drop category table

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0009_remove_category_field'),
    ]

    operations = [
        migrations.RunSQL(
            # Drop the category table if it exists
            sql="DROP TABLE IF EXISTS categories CASCADE;",
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]
