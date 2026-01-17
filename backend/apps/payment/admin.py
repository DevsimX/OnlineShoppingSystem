from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'stripe_payment_id', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('stripe_payment_id', 'order__id')
    readonly_fields = ('created_at', 'updated_at')
