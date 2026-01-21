from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator


class User(AbstractUser):
    """Custom user model"""
    # Australian phone number validator: +61 or 0 followed by 9 digits
    # Format: +61XXXXXXXXX or 0XXXXXXXXX (e.g., +61412345678 or 0412345678)
    australian_phone_validator = RegexValidator(
        regex=r'^(\+61|0)[2-478](?:[ -]?[0-9]){8}$',
        message="Phone number must be in Australian format (+61XXXXXXXXX or 0XXXXXXXXX)"
    )
    
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    phone = models.CharField(
        max_length=20,
        validators=[australian_phone_validator],
        null=False,
        blank=False,
        help_text="Australian phone number format: +61XXXXXXXXX or 0XXXXXXXXX"
    )
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'phone']
    
    class Meta:
        db_table = 'users'


class UserPostalAddress(models.Model):
    """User postal address model"""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='postal_addresses',
        help_text="User who owns this address"
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    company = models.CharField(max_length=200, blank=True, null=True, help_text="Company name (optional)")
    address_line_1 = models.CharField(max_length=200)
    address_line_2 = models.CharField(max_length=200, blank=True, null=True, help_text="Address line 2 (optional)")
    city = models.CharField(max_length=100)
    province = models.CharField(max_length=100, help_text="State/Province")
    country = models.CharField(max_length=100, default='Australia')
    postal_code = models.CharField(max_length=20)
    phone = models.CharField(max_length=20, blank=True, null=True, help_text="Phone for this address (optional)")
    is_default = models.BooleanField(default=False, help_text="Default address for this user")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_postal_addresses'
        ordering = ['-is_default', '-created_at']
        verbose_name_plural = 'User Postal Addresses'

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.address_line_1}, {self.city}"
