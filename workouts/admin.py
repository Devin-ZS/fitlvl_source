from django.contrib import admin
from .models import Exercise, WorkoutTemplate, WorkoutSession, WorkoutExercise
admin.site.register(Exercise)
admin.site.register(WorkoutTemplate)
admin.site.register(WorkoutSession)
admin.site.register(WorkoutExercise)
