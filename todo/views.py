from django.shortcuts import render
from rest_framework import viewsets
from .models import Todo
from .serializers import TodoSerializer


class TodoViewSet(viewsets.ModelViewSet):
    serializer_class = TodoSerializer

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)

    # Automatically assigns the logged-in user when creating a new todo
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
