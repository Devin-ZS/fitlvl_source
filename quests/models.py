from django.db import models
from django.conf import settings

class Quest(models.Model):
    QUEST_TYPE = [('daily','Daily'),('weekly','Weekly'),('special','Special')]
    DIFFICULTY = [('easy','Easy'),('medium','Medium'),('hard','Hard')]
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=10, default='📋')
    quest_type = models.CharField(max_length=10, choices=QUEST_TYPE, default='daily')
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY, default='easy')
    xp_reward = models.IntegerField(default=50)
    requirement_type = models.CharField(max_length=50)
    requirement_value = models.IntegerField(default=1)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class UserQuest(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quests')
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    assigned_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'quest')
