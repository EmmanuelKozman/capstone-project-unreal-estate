from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
  first_name = models.CharField(max_length=30)
  last_name = models.CharField(max_length=30)
  phone = models.IntegerField(null=True, blank=True)
  is_property_owner = models.BooleanField(default=False)