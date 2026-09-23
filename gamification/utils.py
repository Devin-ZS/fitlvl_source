from .models import Badge, UserBadge, XPTransaction

def award_xp(user, amount, reason):
    XPTransaction.objects.create(user=user, amount=amount, reason=reason)
    user.xp += amount
    user.total_xp += amount
    badges_earned = []
    xp_needed = user.xp_for_next_level()
    while user.xp >= xp_needed:
        user.xp -= xp_needed
        user.level += 1
        xp_needed = user.xp_for_next_level()
        badges_earned.append({'type': 'level_up', 'level': user.level})
    user.save()
    return badges_earned

def check_badges(user):
    from workouts.models import WorkoutSession
    sessions_count = WorkoutSession.objects.filter(user=user, completed_at__isnull=False).count()
    badges = Badge.objects.all()
    for badge in badges:
        if UserBadge.objects.filter(user=user, badge=badge).exists():
            continue
        earned = False
        if badge.requirement_type == 'workout_count' and sessions_count >= badge.requirement_value:
            earned = True
        elif badge.requirement_type == 'streak' and user.streak >= badge.requirement_value:
            earned = True
        elif badge.requirement_type == 'level' and user.level >= badge.requirement_value:
            earned = True
        elif badge.requirement_type == 'total_xp' and user.total_xp >= badge.requirement_value:
            earned = True
        if earned:
            UserBadge.objects.create(user=user, badge=badge)
