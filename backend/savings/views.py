from django.http import HttpResponse
from django.contrib.auth.models import Group, User
from .models import Saving
from rest_framework import permissions, viewsets
from . import serializers
from .serializers import UserSerializer, SavingSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['GET'])
def get_saving():
    saving = Saving.objects.all()
    serializer = SavingSerializer(saving, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def add_saving(request):
    payload = request.data
    Saving.objects.create(**payload)
    return Response({"data":"success"})
