from django.contrib import admin
from .models import Brand


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name', 'description')
    fieldsets = (
        ('Brand Information', {
            'fields': ('name', 'description')
        }),
    )
