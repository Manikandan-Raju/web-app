
from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import Saving, Expense, Credit


class CreditSerializer(serializers.ModelSerializer):
    date = serializers.DateField(allow_null=True, required=False)
    class Meta:
        model = Credit
        fields = ["id", "date", "particular", "amount"]


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "groups"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]


class SavingSerializer(serializers.ModelSerializer):
    date = serializers.DateField(allow_null=True, required=False)
    class Meta:
        model = Saving
        fields = ["id", "date", "particular", "amount"]


class ExpenseSerializer(serializers.ModelSerializer):
    date = serializers.DateField(allow_null=True, required=False)
    class Meta:
        model = Expense
        fields = ["id", "date", "particular", "amount"]

from .models import ParticularOption

class ParticularOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParticularOption
        fields = ['id', 'name', 'type']