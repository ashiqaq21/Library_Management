
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.hashers import check_password
from django.contrib.auth import authenticate
from .models import Book, IssuedBook, CustomUser
from .serializers import BookSerializer, UserSerializer, IssueBookSerializer


class RegisterUserView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if 'usertype' not in request.data:
            request.data['usertype'] = 'user'

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)
            if user.usertype == 'admin':
                user_is_admin = True
            else:
                user_is_admin = False
        except CustomUser.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        if not check_password(password, user.password):
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        token, _ = Token.objects.get_or_create(user=user)
        jwt_payload = {
            'user_id': user.id,
            'exp': timezone.now() + timedelta(hours=1),
        }

        import jwt
        jwt_token = jwt.encode(jwt_payload, 'secret_key', algorithm='HS256')

        return Response({
            'token': jwt_token,
            'is_admin': user_is_admin
        }, status=status.HTTP_200_OK)


class AddBookView(APIView):
    def get(self, request):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Book added successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Book updated successfully!"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        book.delete()
        return Response({"message": "Book deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)


class IssueBookView(APIView):
    def post(self, request):
        book_id = request.data.get('book_id')
        user_id = request.data.get('user_id')

        if not user_id:
            return Response({'error': 'User not logged in'}, status=status.HTTP_401_UNAUTHORIZED)

        book = get_object_or_404(Book, id=book_id)
        if book.availability_status != 'Available':
            return Response({'error': 'Book is not available'}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(CustomUser, id=user_id)
        book.availability_status = 'Issued'
        book.save()

        due_date = timezone.now() + timedelta(days=7)
        issued_book = IssuedBook.objects.create(book=book, user=user, due_date=due_date)

        return Response({
            'message': f'Book "{book.title}" issued successfully.',
            'due_date': issued_book.due_date.strftime('%Y-%m-%d'),
        }, status=status.HTTP_200_OK)


class MyIssuedBooksView(APIView):
    def get(self, request, pk):
        books = IssuedBook.objects.filter(user_id=pk)
        serializer = IssueBookSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReturnBooks(APIView):
    def post(self, request):
        issue_id = request.data.get('IssueId')
        if not issue_id:
            return Response({'error': 'Issue ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

        issued_book = get_object_or_404(IssuedBook, id=issue_id)
        book = issued_book.book

        if book.availability_status != 'Issued':
            return Response({'error': 'Book is not currently issued'}, status=status.HTTP_400_BAD_REQUEST)

        book.availability_status = 'Available'
        book.save()

        issued_book.status = 'Returned'
        issued_book.return_date = timezone.now().date()
        issued_book.save()

        return Response({'message': 'Book returned successfully'}, status=status.HTTP_200_OK)
