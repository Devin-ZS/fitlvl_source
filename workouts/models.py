from django.db import models
from django.conf import settings

class Exercise(models.Model):
    CATEGORY_CHOICES = [
        ('strength', 'Strength'), ('cardio', 'Cardio'),
        ('flexibility', 'Flexibility'), ('hiit', 'HIIT'), ('yoga', 'Yoga'),
    ]
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    xp_reward = models.IntegerField(default=10)
    muscle_groups = models.CharField(max_length=200, blank=True)
    icon = models.CharField(max_length=10, default='💪')

    def __str__(self):
        return self.name

class WorkoutTemplate(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    difficulty = models.CharField(max_length=20, choices=[('beginner','Beginner'),('intermediate','Intermediate'),('advanced','Advanced')], default='beginner')
    estimated_duration = models.IntegerField(default=30)
    xp_reward = models.IntegerField(default=100)
    exercises = models.ManyToManyField(Exercise, through='WorkoutExercise')
    icon = models.CharField(max_length=10, default='🏋️')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    is_public = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class WorkoutExercise(models.Model):
    workout = models.ForeignKey(WorkoutTemplate, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    sets = models.IntegerField(default=3)
    reps = models.IntegerField(null=True, blank=True)
    duration_seconds = models.IntegerField(null=True, blank=True)
    order = models.IntegerField(default=0)

class WorkoutSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sessions')
    template = models.ForeignKey(WorkoutTemplate, null=True, blank=True, on_delete=models.SET_NULL)
    name = models.CharField(max_length=100)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.IntegerField(default=0)
    xp_earned = models.IntegerField(default=0)
    calories_burned = models.IntegerField(default=0)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.name}"

class ExerciseLog(models.Model):
    session = models.ForeignKey(WorkoutSession, on_delete=models.CASCADE, related_name='logs')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    sets_completed = models.IntegerField(default=0)
    reps_completed = models.IntegerField(null=True, blank=True)
    weight_kg = models.FloatField(null=True, blank=True)
    duration_seconds = models.IntegerField(null=True, blank=True)
