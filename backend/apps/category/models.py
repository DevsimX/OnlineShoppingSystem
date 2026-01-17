from django.db import models


class Category(models.Model):
    """Product category model"""
    name = models.CharField(max_length=100, unique=True)
    href = models.CharField(max_length=255, default='')
    imageUrl = models.URLField(max_length=500, default='')

    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name
