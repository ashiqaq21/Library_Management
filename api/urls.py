import statistics
from tracemalloc import Statistic
from django.conf import settings
from django.urls import path
from .views import *

urlpatterns = [
    
    path('books/', AddBookView.as_view(), name='books'),
      path('signup/', RegisterUserView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    
    path('books/<int:pk>/', AddBookView.as_view(), name='books'),
    path('issuebooks/', IssueBookView.as_view(), name='issue-book'),
    path('returnbook/', ReturnBooks.as_view(), name='issue-book'),
    path('myissuebooks/<int:pk>/', MyIssuedBooksView.as_view(), name='issue-book'),

]
from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

