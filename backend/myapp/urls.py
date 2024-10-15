from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('api/items/', views.ItemListCreate.as_view(), name='item-list-create'),
]