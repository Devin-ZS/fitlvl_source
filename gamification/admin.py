from django.contrib import admin
from .models import Badge, UserBadge, XPTransaction
admin.site.register(Badge)
admin.site.register(UserBadge)
admin.site.register(XPTransaction)
