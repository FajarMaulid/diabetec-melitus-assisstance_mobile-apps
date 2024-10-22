from django.urls import path

from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path('aktivitas/', views.AktivitasFisikListView.as_view(), name='aktivitasfisik-list'),
    path('konsumsi/', views.KonsumsiListView.as_view(), name='konsumsi-list'),
    path('guladarah/', views.GulaDarahListView.as_view(), name='guladarah-list'),
]