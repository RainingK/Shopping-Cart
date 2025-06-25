from django.contrib.auth.models import User
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Creates a super user"

    def handle(self, *args, **options):
        try:
            User.objects.get(username="admin")
        except User.DoesNotExist:
            User.objects.create_superuser(username="admin", password="password")

        self.stdout.write(self.style.SUCCESS("Successfully Created Superuser!"))
