# Generated manually to make phone field required (non-nullable)

from django.db import migrations, models
import django.core.validators


def set_default_phone_for_existing_users(apps, schema_editor):
    """Set a default phone for existing users"""
    User = apps.get_model('authentication', 'User')
    # Set a placeholder phone for existing users
    # In production, you'd want to prompt users to add their phone
    User.objects.filter(phone__isnull=True).update(phone='0400000000')


def reverse_set_default_phone(apps, schema_editor):
    """Reverse migration - not needed"""
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0003_add_phone_and_postal_address'),
    ]

    operations = [
        migrations.RunPython(set_default_phone_for_existing_users, reverse_set_default_phone),
        migrations.AlterField(
            model_name='user',
            name='phone',
            field=models.CharField(
                help_text='Australian phone number format: +61XXXXXXXXX or 0XXXXXXXXX',
                max_length=20,
                validators=[
                    django.core.validators.RegexValidator(
                        message='Phone number must be in Australian format (+61XXXXXXXXX or 0XXXXXXXXX)',
                        regex='^(\\+61|0)[2-478](?:[ -]?[0-9]){8}$'
                    )
                ]
            ),
        ),
    ]
