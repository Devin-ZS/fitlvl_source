from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .models import Quest, UserQuest
from .serializers import UserQuestSerializer, QuestSerializer
from gamification.utils import award_xp

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_quests(request):
    now = timezone.now()
    # Auto-assign active quests
    active_quests = Quest.objects.filter(is_active=True)
    for quest in active_quests:
        UserQuest.objects.get_or_create(user=request.user, quest=quest)
    user_quests = UserQuest.objects.filter(user=request.user, completed=False).select_related('quest')
    return Response(UserQuestSerializer(user_quests, many=True).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_quest_progress(request, quest_id):
    try:
        uq = UserQuest.objects.get(user=request.user, quest_id=quest_id)
    except UserQuest.DoesNotExist:
        return Response({'error': 'Quest not found'}, status=404)
    progress = request.data.get('progress', 1)
    uq.progress = min(uq.progress + progress, uq.quest.requirement_value)
    if uq.progress >= uq.quest.requirement_value and not uq.completed:
        uq.completed = True
        uq.completed_at = timezone.now()
        award_xp(request.user, uq.quest.xp_reward, f"Completed quest: {uq.quest.name}")
    uq.save()
    return Response(UserQuestSerializer(uq).data)
