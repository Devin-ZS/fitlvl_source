from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'level', 'xp', 'streak']
    fieldsets = UserAdmin.fieldsets + (('FitLvl', {'fields': ('bio','avatar','level','xp','total_xp','streak')}),)
