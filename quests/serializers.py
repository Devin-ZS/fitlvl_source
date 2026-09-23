from rest_framework import serializers
from .models import Quest, UserQuest

class QuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quest
        fields = '__all__'

class UserQuestSerializer(serializers.ModelSerializer):
    quest = QuestSerializer(read_only=True)
    progress_percentage = serializers.SerializerMethodField()
    class Meta:
        model = UserQuest
        fields = '__all__'

    def get_progress_percentage(self, obj):
        if obj.quest.requirement_value == 0:
            return 100
        return min(int((obj.progress / obj.quest.requirement_value) * 100), 100)
