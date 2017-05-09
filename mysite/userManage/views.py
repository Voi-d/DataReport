from django.shortcuts import render_to_response, RequestContext
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.http import HttpResponse
from django.db import connection
import calendar
import json


# Create your views here.
@ensure_csrf_cookie
def regist(request):
    if request.method == 'POST':
        username = request.POST['user']
        password = request.POST['pwd']
        email = request.POST['email']
        user = User.objects.filter(username=username)
        if user.__len__() == 0:
            user = User.objects.create_user(username=username, password=password, email=email)
            user.save()
            return HttpResponse('ok')
        else:
            return HttpResponse('Account is already existed')
    return render_to_response('regist.html', context_instance=RequestContext(request))

@ensure_csrf_cookie
def log_in(request):
    if request.method == 'POST':
        username = request.POST['user']
        password = request.POST['pwd']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:      #the flag of the deleted user is set to false
                login(request, user)
                return  HttpResponse('ok')
        else:
            return  HttpResponse('Account or password is wrong')
    return render_to_response('login.html', context_instance=RequestContext(request))

def log_out(request):
    logout(request)
    return render_to_response('login.html', context_instance=RequestContext(request))

@login_required(login_url='/login/')
def home(request):
    return  render_to_response('home.html')

def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
        ]

@csrf_exempt
def data(request):
    if request.method == 'POST':
        parameter = request.POST
        startDate = parameter['start'].replace('-', '') + "000000"
        endDate = parameter['end'].replace('-', '') + "235959"
        sql = "select num, times," + parameter['types'] + " as value from " + parameter['stationNum'] + \
              " where times >= " + startDate + " and times <= " + endDate + ";"
        # print sql
        cursor = connection.cursor()
        cursor.execute(sql)
        d = dictfetchall(cursor)
        for i in d:
            i['times'] = calendar.timegm(i['times'].timetuple()) * 1000 #change to UTC time
        # fp = open('json.txt', 'w')
        # fp.write(json.dumps(d))
        return HttpResponse(json.dumps(d), content_type='application/json')
    return render_to_response('data.html')




