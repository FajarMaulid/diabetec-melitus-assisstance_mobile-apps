from rest_framework import serializers
from django.http import HttpResponse
from db_connection import user_collection
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class UserSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise ValidationError("Passwords do not match.")

        if user_collection.find_one({'email': data['email']}):
            raise ValidationError("Username already exists.")
        if User.objects.filter(email=data['email']).exists():
            raise ValidationError("Username already exists")

        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password1')

        user = User.objects.create_user(**validated_data)
        user_collection.insert_one({'email': user.email, 'password': password, 'username': user.username})

        user.set_password(password)
        return user