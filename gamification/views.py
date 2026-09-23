from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Badge, UserBadge, XPTransaction, Achievement
from .serializers import BadgeSerializer, UserBadgeSerializer, XPTransactionSerializer, AchievementSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def badges_view(request):
    all_badges = Badge.objects.all()
    user_badges = UserBadge.objects.filter(user=request.user).values_list('badge_id', flat=True)
    data = []
    for badge in all_badges:
        d = BadgeSerializer(badge).data
        d['earned'] = badge.id in user_badges
        data.append(d)
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def xp_history_view(request):
    txns = XPTransaction.objects.filter(user=request.user).order_by('-created_at')[:20]
    return Response(XPTransactionSerializer(txns, many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def achievements_view(request):
    items = Achievement.objects.filter(user=request.user).order_by('-created_at')
    return Response(AchievementSerializer(items, many=True).data)
