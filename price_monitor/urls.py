from django.contrib import admin
from django.urls import path
from monitor import views
from monitor.api_views import ProductAPI

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.dashboard, name='dashboard'),
    path('add/', views.add_product, name='add_product'),
    path('export/', views.export_csv, name='export_csv'),
    path('api/products/', ProductAPI.as_view(), name='api_products'),
]
