from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import RegisterView, login_view, profile_view, leaderboard_view
from workouts.views import ExerciseViewSet, WorkoutTemplateViewSet, WorkoutSessionViewSet, complete_workout, workout_stats
from gamification.views import badges_view, xp_history_view, achievements_view
from quests.views import my_quests, update_quest_progress

router = DefaultRouter()
router.register(r'exercises', ExerciseViewSet)
router.register(r'workout-templates', WorkoutTemplateViewSet, basename='workouttemplate')
router.register(r'workout-sessions', WorkoutSessionViewSet, basename='workoutsession')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/register/', RegisterView.as_view()),
    path('api/auth/login/', login_view),
    path('api/auth/refresh/', TokenRefreshView.as_view()),
    path('api/profile/', profile_view),
    path('api/leaderboard/', leaderboard_view),
    path('api/workouts/<int:session_id>/complete/', complete_workout),
    path('api/workout-stats/', workout_stats),
    path('api/badges/', badges_view),
    path('api/xp-history/', xp_history_view),
    path('api/achievements/', achievements_view),
    path('api/quests/', my_quests),
    path('api/quests/<int:quest_id>/progress/', update_quest_progress),
]
