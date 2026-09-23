from rest_framework import serializers
from .models import Exercise, WorkoutTemplate, WorkoutExercise, WorkoutSession, ExerciseLog

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'

class WorkoutExerciseSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer(read_only=True)
    class Meta:
        model = WorkoutExercise
        fields = '__all__'

class WorkoutTemplateSerializer(serializers.ModelSerializer):
    exercises_detail = WorkoutExerciseSerializer(source='workoutexercise_set', many=True, read_only=True)
    class Meta:
        model = WorkoutTemplate
        fields = '__all__'

class ExerciseLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseLog
        fields = '__all__'

class WorkoutSessionSerializer(serializers.ModelSerializer):
    logs = ExerciseLogSerializer(many=True, read_only=True)
    template_name = serializers.CharField(source='template.name', read_only=True)
    class Meta:
        model = WorkoutSession
        fields = '__all__'
        read_only_fields = ['user','xp_earned']
