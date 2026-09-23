from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.db import transaction
from .models import Exercise, WorkoutTemplate, WorkoutSession, ExerciseLog
from .serializers import ExerciseSerializer, WorkoutTemplateSerializer, WorkoutSessionSerializer, ExerciseLogSerializer
from gamification.utils import award_xp, check_badges

class ExerciseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

class WorkoutTemplateViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutTemplateSerializer

    def get_queryset(self):
        return WorkoutTemplate.objects.filter(is_public=True) | WorkoutTemplate.objects.filter(created_by=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class WorkoutSessionViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutSessionSerializer

    def get_queryset(self):
        return WorkoutSession.objects.filter(user=self.request.user).order_by('-started_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_workout(request, session_id):
    try:
        session = WorkoutSession.objects.get(id=session_id, user=request.user)
    except WorkoutSession.DoesNotExist:
        return Response({'error': 'Session not found'}, status=404)

    with transaction.atomic():
        session.completed_at = timezone.now()
        duration = request.data.get('duration_minutes', 30)
        session.duration_minutes = duration
        xp = 50 + (duration * 2)
        if session.template:
            xp += session.template.xp_reward
        session.xp_earned = xp
        session.calories_burned = int(duration * 6)
        session.save()

        user = request.user
        today = timezone.now().date()
        if user.last_workout_date:
            from datetime import timedelta
            diff = (today - user.last_workout_date).days
            if diff == 1:
                user.streak += 1
            elif diff > 1:
                user.streak = 1
        else:
            user.streak = 1
        user.last_workout_date = today
        user.save()

        badges = award_xp(user, xp, f"Completed workout: {session.name}")
        check_badges(user)

    return Response({
        'xp_earned': xp,
        'new_level': user.level,
        'new_xp': user.xp,
        'streak': user.streak,
        'badges_earned': badges,
        'session': WorkoutSessionSerializer(session).data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def workout_stats(request):
    user = request.user
    sessions = WorkoutSession.objects.filter(user=user, completed_at__isnull=False)
    total_sessions = sessions.count()
    total_minutes = sum(s.duration_minutes for s in sessions)
    total_calories = sum(s.calories_burned for s in sessions)
    total_xp = sum(s.xp_earned for s in sessions)
    recent = sessions.order_by('-completed_at')[:5]
    return Response({
        'total_sessions': total_sessions,
        'total_minutes': total_minutes,
        'total_calories': total_calories,
        'total_xp': total_xp,
        'recent_sessions': WorkoutSessionSerializer(recent, many=True).data,
    })
