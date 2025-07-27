
from django.db import models

# Option model for dropdown particulars

class ParticularOption(models.Model):
    TYPE_CHOICES = [
        ("saving", "Saving"),
        ("credit", "Credit"),
        ("expense", "Expense"),
    ]
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)

    class Meta:
        unique_together = ("name", "type")

    def __str__(self):
        return f"{self.get_type_display()}: {self.name}"

# Create your models here.


class Saving(models.Model):
    date = models.DateField(blank=True, null=True)
    particular = models.CharField(max_length=100, default="")
    amount = models.IntegerField(default=0)


class Credit(models.Model):
    date = models.DateField(blank=True, null=True)
    particular = models.CharField(max_length=100, default="")
    amount = models.IntegerField(default=0)


class Expense(models.Model):
    date = models.DateField(blank=True, null=True)
    particular = models.CharField(max_length=100, default="")
    amount = models.IntegerField(default=0)
