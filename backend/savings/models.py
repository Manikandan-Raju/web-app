from django.db import models

# Create your models here.

class Saving(models.Model):
    particular = models.CharField(max_length=100,default=str)
    amount = models.IntegerField(default=int)