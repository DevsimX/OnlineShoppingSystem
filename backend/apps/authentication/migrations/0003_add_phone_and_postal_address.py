# Generated manually to add phone field and UserPostalAddress model

from django.db import migrations, models
import django.core.validators
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_alter_user_username'),
    ]

    operations = [
        # Add phone field as nullable first
        migrations.AddField(
            model_name='user',
            name='phone',
            field=models.CharField(
                blank=True,
                help_text='Australian phone number format: +61XXXXXXXXX or 0XXXXXXXXX',
                max_length=20,
                null=True,
                validators=[
                    django.core.validators.RegexValidator(
                        message='Phone number must be in Australian format (+61XXXXXXXXX or 0XXXXXXXXX)',
                        regex='^(\\+61|0)[2-478](?:[ -]?[0-9]){8}$'
                    )
                ]
            ),
        ),
        # Create UserPostalAddress table
        migrations.CreateModel(
            name='UserPostalAddress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('company', models.CharField(blank=True, help_text='Company name (optional)', max_length=200, null=True)),
                ('address_line_1', models.CharField(max_length=200)),
                ('address_line_2', models.CharField(blank=True, help_text='Address line 2 (optional)', max_length=200, null=True)),
                ('city', models.CharField(max_length=100)),
                ('province', models.CharField(help_text='State/Province', max_length=100)),
                ('country', models.CharField(default='Australia', max_length=100)),
                ('postal_code', models.CharField(max_length=20)),
                ('phone', models.CharField(blank=True, help_text='Phone for this address (optional)', max_length=20, null=True)),
                ('is_default', models.BooleanField(default=False, help_text='Default address for this user')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(help_text='User who owns this address', on_delete=django.db.models.deletion.CASCADE, related_name='postal_addresses', to='authentication.user')),
            ],
            options={
                'verbose_name_plural': 'User Postal Addresses',
                'db_table': 'user_postal_addresses',
                'ordering': ['-is_default', '-created_at'],
            },
        ),
    ]
