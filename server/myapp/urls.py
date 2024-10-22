from django.urls import path

from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path('aktivitas/', views.AktivitasFisikListView.as_view(), name='aktivitasfisik-list'),
    path('aktivitas/terakhir', views.LatestAktivitasData.as_view(), name='aktivitasfisik-terakhir'),
    path('konsumsi/', views.KonsumsiListView.as_view(), name='konsumsi-list'),
    path('konsumsi/terakhir', views.LatestKonsumsiData.as_view(), name='konsumsi-terakhir'),
    path('guladarah/', views.GulaDarahListView.as_view(), name='guladarah-list'),
    path('guladarah/terakhir', views.LatestGulaDarahData.as_view(), name='guladarah-terakhir'),
]