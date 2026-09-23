from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    xp_for_next_level = serializers.SerializerMethodField()
    xp_percentage = serializers.SerializerMethodField()
    badge_count = serializers.SerializerMethodField()
    workout_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id','username','email','bio','avatar','level','xp','total_xp',
                  'streak','xp_for_next_level','xp_percentage','badge_count','workout_count','created_at']
        read_only_fields = ['level','xp','total_xp','streak']

    def get_xp_for_next_level(self, obj):
        return obj.xp_for_next_level()

    def get_xp_percentage(self, obj):
        return obj.xp_percentage()

    def get_badge_count(self, obj):
        return obj.badges.count()

    def get_workout_count(self, obj):
        return obj.sessions.filter(completed_at__isnull=False).count()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    class Meta:
        model = User
        fields = ['username','email','password']

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
