from django.conf.urls import url,include
from django.contrib import admin
import views
admin.autodiscover()

urlpatterns = [
    url(r'^login/$',views.log_in),
    url(r'^logout/$',views.log_out),
    url(r'^regist/$',views.regist),
    url(r'^home/$',views.home),
    url(r'^data/$',views.data),

]