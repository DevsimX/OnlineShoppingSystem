from django.contrib import admin
from .models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'href', 'great_gift')
    list_filter = ('great_gift',)
    search_fields = ('name', 'href')
