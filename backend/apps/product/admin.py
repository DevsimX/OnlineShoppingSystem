from django.contrib import admin
from .models import Product, ProductTag


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'category', 'price', 'current_stock', 'status', 'created_at')
    list_filter = ('category', 'status', 'created_at')
    search_fields = ('name', 'company', 'description')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'company', 'description', 'category')
        }),
        ('Pricing & Stock', {
            'fields': ('price', 'current_stock', 'status')
        }),
        ('Images', {
            'fields': ('profile_pic_link', 'detail_pic_links')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ProductTag)
class ProductTagAdmin(admin.ModelAdmin):
    list_display = ('product', 'new', 'new_if', 'hot', 'hot_if', 'rank_if', 'gift_box')
    list_filter = ('new', 'hot', 'gift_box')
    search_fields = ('product__name',)
