import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fitlvl_backend.settings')
django.setup()

from workouts.models import Exercise, WorkoutTemplate, WorkoutExercise
from gamification.models import Badge
from quests.models import Quest

# Exercises
exercises_data = [
    ('Push-ups', 'strength', 'Upper body compound movement', 15, 'Chest, Triceps, Shoulders', '💪'),
    ('Pull-ups', 'strength', 'Back and bicep builder', 20, 'Back, Biceps', '🏋️'),
    ('Squats', 'strength', 'Lower body powerhouse', 15, 'Quads, Glutes, Hamstrings', '🦵'),
    ('Deadlifts', 'strength', 'Full body compound lift', 25, 'Back, Glutes, Hamstrings', '🏆'),
    ('Plank', 'strength', 'Core stability exercise', 10, 'Core, Shoulders', '🧘'),
    ('Burpees', 'hiit', 'Full body HIIT movement', 20, 'Full Body', '🔥'),
    ('Running', 'cardio', 'Cardiovascular endurance', 30, 'Legs, Cardio', '🏃'),
    ('Jump Rope', 'cardio', 'Cardio and coordination', 25, 'Full Body, Cardio', '⚡'),
    ('Yoga Flow', 'yoga', 'Mindful movement sequence', 20, 'Full Body, Flexibility', '🧘'),
    ('Box Jumps', 'hiit', 'Explosive power training', 20, 'Legs, Explosive Power', '📦'),
    ('Dips', 'strength', 'Tricep and chest isolation', 15, 'Triceps, Chest', '💺'),
    ('Lunges', 'strength', 'Unilateral leg strength', 12, 'Quads, Glutes', '🦵'),
    ('Mountain Climbers', 'hiit', 'Core and cardio combo', 18, 'Core, Cardio', '⛰️'),
    ('Bicycle Crunches', 'strength', 'Oblique targeting', 10, 'Core, Obliques', '🚴'),
    ('Kettlebell Swings', 'hiit', 'Hip hinge power movement', 22, 'Glutes, Hamstrings, Core', '🔔'),
]

for name, cat, desc, xp, muscles, icon in exercises_data:
    Exercise.objects.get_or_create(name=name, defaults={'category':cat,'description':desc,'xp_reward':xp,'muscle_groups':muscles,'icon':icon})

# Workout Templates
e = Exercise.objects.get(name='Push-ups')
e2 = Exercise.objects.get(name='Squats')
e3 = Exercise.objects.get(name='Plank')
e4 = Exercise.objects.get(name='Burpees')
e5 = Exercise.objects.get(name='Pull-ups')
e6 = Exercise.objects.get(name='Running')
e7 = Exercise.objects.get(name='Lunges')
e8 = Exercise.objects.get(name='Mountain Climbers')

templates = [
    ('Beginner Full Body', 'A complete full body workout for beginners', 'beginner', 30, 150, '🌟', [e, e2, e3]),
    ('HIIT Blast', 'High intensity interval training circuit', 'intermediate', 25, 200, '🔥', [e4, e8, e3]),
    ('Upper Body Power', 'Build strength in chest, back and arms', 'intermediate', 40, 180, '💪', [e, e5]),
    ('Leg Day', 'Complete lower body strength session', 'intermediate', 45, 190, '🦵', [e2, e7]),
    ('Morning Energizer', 'Quick morning routine to wake up your body', 'beginner', 20, 120, '☀️', [e, e2, e3]),
    ('Cardio Sprint', 'Intense cardio for endurance and fat burn', 'advanced', 35, 220, '🏃', [e6, e4, e8]),
]

for name, desc, diff, dur, xp, icon, exs in templates:
    t, created = WorkoutTemplate.objects.get_or_create(name=name, defaults={'description':desc,'difficulty':diff,'estimated_duration':dur,'xp_reward':xp,'icon':icon,'is_public':True})
    if created:
        for i, ex in enumerate(exs):
            WorkoutExercise.objects.create(workout=t, exercise=ex, sets=3, reps=12, order=i)

# Badges
badges_data = [
    ('First Step', 'Complete your first workout', '🎯', 'milestone', 1, 'workout_count', 'common'),
    ('Week Warrior', 'Complete 7 workouts', '⚔️', 'workout', 7, 'workout_count', 'common'),
    ('Fitness Fanatic', 'Complete 30 workouts', '🏆', 'workout', 30, 'workout_count', 'rare'),
    ('Century Club', 'Complete 100 workouts', '💯', 'milestone', 100, 'workout_count', 'epic'),
    ('Streak Starter', 'Maintain a 3-day streak', '🔥', 'streak', 3, 'streak', 'common'),
    ('On Fire', 'Maintain a 7-day streak', '🌋', 'streak', 7, 'streak', 'rare'),
    ('Unstoppable', 'Maintain a 30-day streak', '⚡', 'streak', 30, 'streak', 'legendary'),
    ('Level 5', 'Reach level 5', '⭐', 'milestone', 5, 'level', 'common'),
    ('Level 10', 'Reach level 10', '🌟', 'milestone', 10, 'level', 'rare'),
    ('Level 25', 'Reach level 25', '👑', 'milestone', 25, 'level', 'epic'),
    ('XP Hunter', 'Earn 1000 total XP', '💎', 'milestone', 1000, 'total_xp', 'common'),
    ('XP Master', 'Earn 10000 total XP', '🔮', 'milestone', 10000, 'total_xp', 'legendary'),
]

for name, desc, icon, cat, val, req_type, rarity in badges_data:
    Badge.objects.get_or_create(name=name, defaults={'description':desc,'icon':icon,'category':cat,'requirement_value':val,'requirement_type':req_type,'rarity':rarity})

# Quests
quests_data = [
    ('Daily Grind', 'Complete 1 workout today', '🏋️', 'daily', 'easy', 50, 'workout_count', 1),
    ('Double Up', 'Complete 2 workouts this week', '✌️', 'weekly', 'easy', 100, 'workout_count', 2),
    ('Strength Week', 'Complete 3 strength workouts this week', '💪', 'weekly', 'medium', 200, 'strength_workouts', 3),
    ('Cardio Kick', 'Complete 2 cardio sessions', '🏃', 'weekly', 'medium', 150, 'cardio_workouts', 2),
    ('Iron Will', 'Complete 5 workouts in a week', '🔩', 'weekly', 'hard', 350, 'workout_count', 5),
    ('Stay Hot', 'Maintain a 3-day streak', '🔥', 'daily', 'medium', 120, 'streak', 3),
    ('XP Rush', 'Earn 200 XP today', '💫', 'daily', 'easy', 50, 'xp_earned', 200),
]

for name, desc, icon, qtype, diff, xp, req_type, req_val in quests_data:
    Quest.objects.get_or_create(name=name, defaults={'description':desc,'icon':icon,'quest_type':qtype,'difficulty':diff,'xp_reward':xp,'requirement_type':req_type,'requirement_value':req_val,'is_active':True})

print("✅ Seed data created successfully!")
