from django.contrib import admin
from .models import Product, ProductTag, ProductDetailPic


@admin.register(ProductDetailPic)
class ProductDetailPicAdmin(admin.ModelAdmin):
    list_display = ('id', 'small_pic_link', 'big_pic_link', 'extra_big_pic_link')
    search_fields = ('small_pic_link', 'big_pic_link', 'extra_big_pic_link')
    fieldsets = (
        ('Image Links', {
            'fields': ('small_pic_link', 'big_pic_link', 'extra_big_pic_link')
        }),
    )


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'category', 'price', 'current_stock', 'status', 'created_at')
    list_filter = ('category', 'status', 'created_at')
    search_fields = ('name', 'brand', 'description')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'brand', 'description', 'category', 'type')
        }),
        ('Pricing & Stock', {
            'fields': ('price', 'current_stock', 'status')
        }),
        ('Images', {
            'fields': ('profile_pic_link', 'detail_pics')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ProductTag)
class ProductTagAdmin(admin.ModelAdmin):
    list_display = ('product', 'new', 'new_if', 'hot', 'hot_if', 'rank_if')
    list_filter = ('new', 'hot')
    search_fields = ('product__name',)
