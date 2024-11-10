from rest_framework import serializers
from django.http import HttpResponse
from db_connection import user_collection
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from datetime import datetime
from django.contrib.auth.hashers import make_password

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
        password = make_password(password)
        user_collection.insert_one({'email': user.email, 'password': password, 'username': user.username})
        user.id = str(user_collection.find_one({'email': user.email})['_id'])

        user.set_password(password)
        return user

class AktivitasFisikSerializer(serializers.Serializer):
    olahraga = serializers.CharField(max_length=100, required=True)
    # jadwal = serializers.DateTimeField(required=True)
    durasi = serializers.IntegerField(required=True)
    kaloriTerbakar = serializers.FloatField(default=0)
    createdAt = serializers.DateTimeField(default=datetime.now)

class GulaDarahSerializer(serializers.Serializer):
    hasilPengukuran = serializers.FloatField(required=True)
    petugas = serializers.CharField(max_length=100, required=True)
    # jadwal = serializers.DateTimeField(required=True)
    tempat = serializers.CharField(max_length=100, required=True)
    createdAt = serializers.DateTimeField(default=datetime.now)

class KonsumsiSerializer(serializers.Serializer):
    tipe = serializers.ChoiceField(choices=['Makanan', 'Minuman'], required=True)
    nama = serializers.CharField(max_length=100, required=True)
    massaOrVol = serializers.IntegerField(required=True)
    kaloriMasuk = serializers.FloatField(default=0)
    # jadwal = serializers.DateTimeField(required=True)
    createdAt = serializers.DateTimeField(default=datetime.now)
