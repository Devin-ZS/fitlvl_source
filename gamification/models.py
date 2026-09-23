from django.db import models
from django.conf import settings

class Badge(models.Model):
    CATEGORY_CHOICES = [
        ('workout', 'Workout'), ('streak', 'Streak'), ('strength', 'Strength'),
        ('cardio', 'Cardio'), ('social', 'Social'), ('milestone', 'Milestone'),
    ]
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=10, default='🏅')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    requirement_value = models.IntegerField(default=1)
    requirement_type = models.CharField(max_length=50)
    rarity = models.CharField(max_length=20, choices=[('common','Common'),('rare','Rare'),('epic','Epic'),('legendary','Legendary')], default='common')

    def __str__(self):
        return self.name

class UserBadge(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge')

class XPTransaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='xp_transactions')
    amount = models.IntegerField()
    reason = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

class Achievement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='achievements')
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=10, default='⭐')
    created_at = models.DateTimeField(auto_now_add=True)
