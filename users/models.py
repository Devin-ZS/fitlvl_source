from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    avatar = models.CharField(max_length=10, default='🧑')
    level = models.IntegerField(default=1)
    xp = models.IntegerField(default=0)
    total_xp = models.IntegerField(default=0)
    streak = models.IntegerField(default=0)
    last_workout_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def xp_for_next_level(self):
        return self.level * 500

    def xp_percentage(self):
        return min(int((self.xp / self.xp_for_next_level()) * 100), 100)

    def __str__(self):
        return self.email
