from django.contrib import admin
from .models import CustomUser, Book, IssuedBook


admin.site.register(CustomUser)
admin.site.register(Book)
admin.site.register(IssuedBook)
