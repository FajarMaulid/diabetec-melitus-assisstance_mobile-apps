from django.shortcuts import render
from django.http import HttpResponse
from db_connection import user_collection, aktivitasFisik, gulaDarah, konsumsi
from rest_framework import generics
from .serializer import UserSerializer, AktivitasFisikSerializer, GulaDarahSerializer, KonsumsiSerializer
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from datetime import datetime
from pymongo import DESCENDING



def index(request):
    # users = user_collection.find()
    # users = list(user_collection.find())  
    # for user in users:
    #     user['_id'] = str(user['_id']) 

    # return JsonResponse(users, safe=False)
    return HttpResponse("Hello World")

class UserCreate(generics.CreateAPIView):
    serializer_class = UserSerializer
    queryset = user_collection.find()
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(TokenObtainPairView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        user = user_collection.find_one({'email': email, 'password': password})
        user['id'] = str(user['_id'])
        # user = authenticate(username=email, password=password)

        if user is not None:
            refresh = RefreshToken
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class AktivitasFisikListView(APIView):
    def get(self, request, *args, **kwargs):
        # data = list(aktivitasFisik.find({}, {"_id": 0}))
        data = list(aktivitasFisik.find({}, {"_id": 0}).sort("createdAt", DESCENDING))
        
        serializer = AktivitasFisikSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = AktivitasFisikSerializer(data=request.data)
        
        if serializer.is_valid():
            aktivitasFisik.insert_one({
                "olahraga": serializer.validated_data['olahraga'],
                "durasi": serializer.validated_data['durasi'],
                "createdAt": datetime.now(),
                # "jadwal": serializer.validated_data['jadwalOlahraga']
            })
            return Response({"message": "Data uploaded successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GulaDarahListView(APIView):
    def get(self, request, *args, **kwargs):
        data = list(gulaDarah.find({}, {"_id": 0}))
        
        serializer = GulaDarahSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = GulaDarahSerializer(data=request.data)
        
        if serializer.is_valid():
            gulaDarah.insert_one({
                "hasilPengukuran": serializer.validated_data['hasilPengukuran'],
                "petugas": serializer.validated_data['petugas'],
                "tempat": serializer.validated_data['tempat'],
                # "jadwal": serializer.validated_data['jadwal'],
                "createdAt": datetime.now(),       
            })
            return Response({"message": "Data uploaded successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class KonsumsiListView(APIView):
    def get(self, request, *args, **kwargs):
        data = list(konsumsi.find({}, {"_id": 0}))
        
        serializer = KonsumsiSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = KonsumsiSerializer(data=request.data)
        
        if serializer.is_valid():
            konsumsi.insert_one({
                "tipe": serializer.validated_data['tipe'],
                "nama": serializer.validated_data['nama'],
                "massaOrVol": serializer.validated_data['massaOrVol'],
                # "jadwal": serializer.validated_data['jadwal'],
                "createdAt": datetime.now(),       
            })
            return Response({"message": "Data uploaded successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LatestAktivitasData(APIView):
    def get(self, request, *args, **kwargs):
        aktivitasTerakhir = aktivitasFisik.find_one({}, sort=[("createdAt", DESCENDING)])

        if aktivitasTerakhir:
            serializer = AktivitasFisikSerializer(aktivitasTerakhir)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"message": "No data found"}, status=status.HTTP_404_NOT_FOUND)
    
class LatestGulaDarahData(APIView):
    def get(self, request, *args, **kwargs):
        gulaDarahTerakhir = gulaDarah.find_one({}, sort=[("createdAt", DESCENDING)])

        if gulaDarahTerakhir:
            serializer = GulaDarahSerializer(gulaDarahTerakhir)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"message": "No data found"}, status=status.HTTP_404_NOT_FOUND)
    
class LatestKonsumsiData(APIView):
    def get(self, request, *args, **kwargs):
        konsumsiTerakhir = konsumsi.find_one({}, sort=[("createdAt", DESCENDING)])

        if konsumsiTerakhir:
            serializer = KonsumsiSerializer(konsumsiTerakhir)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"message": "No data found"}, status=status.HTTP_404_NOT_FOUND)