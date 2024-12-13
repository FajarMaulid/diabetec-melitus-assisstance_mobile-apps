from email import message
from django.shortcuts import render
from django.http import HttpResponse
<<<<<<< HEAD
from db_connection import user_collection, aktivitasFisik, gulaDarah, konsumsi
=======
from db_connection import user_collection, aktivitasFisik, gulaDarah, konsumsi, messages
>>>>>>> front
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
<<<<<<< HEAD
from django.contrib.auth import authenticate
from datetime import datetime
from pymongo import DESCENDING
=======
from django.contrib.auth import authenticate, logout, login
from django.contrib.auth.forms import AuthenticationForm
from datetime import datetime
from pymongo import DESCENDING
from django.contrib.auth.hashers import check_password, make_password
from bson import ObjectId
import google.generativeai as genai
from dotenv import load_dotenv, find_dotenv
import os
import pytz
>>>>>>> front

def index():
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
        
        user = user_collection.find_one({'email': email})
        # print(user['_id'])
        if user is not None:
            if check_password(password, user['password']):
                user1 = User.objects.get(email=user['email'])
                refresh = RefreshToken.for_user(user1)
                refresh['user_id'] = str(user['_id'])
                request.session['user_id'] = str(user['_id'])
                # request.session.modified = True
                request.session.save()
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user_id': str(user['_id']),
                })
                response.set_cookie('user_id', str(user.id), max_age=60*60*24*7, httponly=True)

<<<<<<< HEAD
class AktivitasFisikListView(APIView):
    def get(self, request, *args, **kwargs):
        data = list(aktivitasFisik.find({}, {"_id": 0}))
        
=======
            return Response({"detail": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"detail": "User not found"}, status=status.HTTP_401_UNAUTHORIZED)

class AktivitasFisikListView(APIView):
    def get(self, request, *args, **kwargs):
        # data = list(aktivitasFisik.find({}, {"_id": 0}))
        data = list(aktivitasFisik.find({}, {"_id": 0}, sort=[("createdAt", DESCENDING)]))
>>>>>>> front
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
<<<<<<< HEAD
        data = list(gulaDarah.find({}, {"_id": 0}))
=======
        data = list(gulaDarah.find({}, {"_id": 0}, sort=[("createdAt", DESCENDING)]))
>>>>>>> front
        
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
<<<<<<< HEAD
        data = list(konsumsi.find({}, {"_id": 0}))
        
=======
        data = list(konsumsi.find({}, {"_id": 0}, sort=[("createdAt", DESCENDING)]))
>>>>>>> front
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
<<<<<<< HEAD
    
=======

>>>>>>> front
class LatestKonsumsiData(APIView):
    def get(self, request, *args, **kwargs):
        konsumsiTerakhir = konsumsi.find_one({}, sort=[("createdAt", DESCENDING)])

        if konsumsiTerakhir:
            serializer = KonsumsiSerializer(konsumsiTerakhir)
            return Response(serializer.data, status=status.HTTP_200_OK)
<<<<<<< HEAD
        return Response({"message": "No data found"}, status=status.HTTP_404_NOT_FOUND)
=======
        return Response({"message": "No data found"}, status=status.HTTP_404_NOT_FOUND)

class Message(APIView):
    def get(self, request, *args, **kwargs):
        pipeline = [
            {
                "$unwind": "$message"  # Unwind array 'message' menjadi dokumen individual
            },
            {
                "$sort": { "message.createdAt": DESCENDING }  # Sorting berdasarkan 'createdAt' dalam 'message'
            },
            {
                "$group": {
                    "_id": "$_id",  # Mengelompokkan berdasarkan _id utama
                    "message": { "$push": "$message" }  # Memasukkan kembali pesan-pesan ke dalam array 'messages'
                }
            }
        ]
        data = list(messages.aggregate(pipeline))
        # data = list(messages.find({}, sort=[("message.createdAt", DESCENDING)]))
        print(data)
        for i in data:
            i['_id'] = str(i['_id'])
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        new_message = {
            "_id": str(ObjectId()),
            "text": request.data['text'],
            "user": {
                "_id": request.data['user']['_id'],
            },
            "createdAt": datetime.now()
        }
        messages.update_one(
            {"_id":ObjectId("6730acef204bbc66d5969e5c")},
            {"$push": {"message": new_message}}
        )

        return Response({"message": "Message sent successfully!"}, status=status.HTTP_201_CREATED)

class ChatBot(APIView):    
    def post(self, request, *args, **kwargs):    
        dotenv_path = find_dotenv()
        load_dotenv(dotenv_path)
        key = os.getenv('KEY')
        genai.configure(api_key=key)
        generation_config = {
            "temperature": 2,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
        }

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=generation_config,
            system_instruction="""
            You're a Medical AI Assistant that specialized in diabetes mellitus disease.
            If you're being asked to do any task (like build a code) or talk about something besides diabetes area, tell them that you only answer diabetes-related question.
            You must answer the question from user in a comprehensive explanation.
            Include any needed details, like numbers, scientific names, etc.
            If you're not sure about the answer, you must give an appropriate suggestion or any similar case.
            Don't forget to include any resource where you take the information, such as medical study.
            Always answer like how a doctor explains something.
            Give response with the same language as the question.
            Remove any markdown

            If users asks you about what kind of food they should eat, answer with this sturcture {'dish_name', 'recipe_link', 'calories', 'carbohydrates', 'protein', 'fat'}.
            if users asks you about daily routine tips, don't forget to answer as detailed as possible, like how long they should work on it.
            """,
        )
        chat_session = model.start_chat(
            history=[]
        )
        answer = chat_session.send_message(request.data['question'])
        details = answer.usage_metadata
        results = {
          'model': model.model_name,
          'question': request.data['question'],
          'answer': answer.text,
          'language': request.data['lang'],
          'time': datetime.now(pytz.timezone('Asia/Jakarta')).strftime("%Y-%m-%d %H:%M:%S"),
          'details': {
              'prompt_token_count': details.prompt_token_count,
              'candidates_token_count': details.candidates_token_count,
              'total_token_count': details.total_token_count,
            }
        }
        return JsonResponse(results)
    def get(self, request, *args, **kwargs):
        return JsonResponse({"message": "Chatbot is ready to chat!"}, status=status.HTTP_200_OK)
>>>>>>> front
