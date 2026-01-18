from django.db import models


class Brand(models.Model):
    """Brand model"""
    name = models.CharField(max_length=200, unique=True, help_text="Brand name")
    description = models.TextField(help_text="Brand description")

    class Meta:
        db_table = 'brands'
        ordering = ['name']

    def __str__(self):
        return self.name
