from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import Saving


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class SavingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Saving
        fields = ['particular', 'amount']