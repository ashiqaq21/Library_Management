from django.contrib.auth.backends import BaseBackend
from .models import CustomUser  # Adjust the import for your CustomUser model
from django.contrib.auth.hashers import check_password

class EmailAuthBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            user = CustomUser.objects.get(email=email)
            if user and check_password(password, user.password):
                return user
        except CustomUser.DoesNotExist:
            return None
        return None

    def get_user(self, user_id):
        try:
            return CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            return None
