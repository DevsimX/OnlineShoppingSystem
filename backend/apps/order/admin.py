from django.contrib import admin
from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'owner', 'amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('owner__username', 'owner__email')
    readonly_fields = ('created_at', 'updated_at')
