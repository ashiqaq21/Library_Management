from rest_framework import serializers
from .models import CustomUser, Book, IssuedBook

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'usertype']  # Include 'usertype' in fields
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
      
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data['email'],
            usertype=validated_data.get('usertype', 'user'),  
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'cover_image', 'author', 'genre', 'publication_date', 'availability_status']    


class IssueBookSerializer(serializers.ModelSerializer):
    book = BookSerializer()  

    class Meta:
        model = IssuedBook
        fields = ['id', 'book', 'issue_date', 'due_date', 'status']
