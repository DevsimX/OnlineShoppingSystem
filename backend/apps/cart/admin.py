from django.contrib import admin
from .models import ShoppingCart


@admin.register(ShoppingCart)
class ShoppingCartAdmin(admin.ModelAdmin):
    list_display = ('owner', 'amount', 'updated_at')
    search_fields = ('owner__username', 'owner__email')
    readonly_fields = ('created_at', 'updated_at')
