from django.db import models
from django.contrib.auth.models import AbstractUser


from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models


from django.contrib.auth.models import AbstractUser
from django.db import models

from django.contrib.auth.models import AbstractUser
from django.db import models
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    usertype = models.CharField(max_length=20, default='admin')  # Removed 'unique=True'

    def __str__(self):
        return self.username


class Book(models.Model):
    STATUS_CHOICES = [
        ('Available', 'Available'),
        ('Issued', 'Issued'),
    ]

    title = models.CharField(max_length=255)
    cover_image = models.ImageField(upload_to='book_covers/', max_length=255, blank=True, null=True)
    author = models.CharField(max_length=255)
    genre = models.CharField(max_length=100)
    publication_date = models.DateField()
    availability_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Available')

    def __str__(self):
        return f"{self.title} by {self.author}"


from django.db import models
from django.utils.timezone import now, timedelta

class IssuedBook(models.Model):
    STATUS_CHOICES = [
        ('Issued', 'Issued'),
        ('Returned', 'Returned'),
    ]

    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='issued_books')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='issued_books')
    issue_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)  # Optional field for the return date
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Issued')  # Status of the issued book

    def save(self, *args, **kwargs):
        # Automatically set the due date to 3 days after the issue date if not already set
        if not self.due_date:
            self.due_date = now().date() + timedelta(days=3)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.book.title} issued to {self.user.username} (Status: {self.status})"

