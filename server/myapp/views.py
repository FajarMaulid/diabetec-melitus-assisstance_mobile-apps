from django.shortcuts import render
from django.http import HttpResponse
from db_connection import user_collection
from rest_framework import generics
from .serializer import UserSerializer
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

