from cart.models import Cart
from django.core.management.base import BaseCommand
from django.db import transaction
from inventory.models import Inventory, Product


class Command(BaseCommand):
    help = "Fills up the DB with the data needed"

    def handle(self, *args, **options):
        # for poll_id in options["poll_ids"]:
        #     try:
        #         poll = Poll.objects.get(pk=poll_id)
        #     except Poll.DoesNotExist:
        #         raise CommandError('Poll "%s" does not exist' % poll_id)

        #     poll.opened = False
        #     poll.save()

        all_products = Product.objects.all()
        if len(all_products) == 0:
            all_products.delete()
            self.stdout.write(self.style.SUCCESS("Data already initialized. Skipping!"))
            return

        products = {
            "Potatoes": {"stock": 10, "price": 5, "quantity": 2},
            "Carrots": {"stock": 5, "price": 4, "quantity": 1},
            "Onions": {"stock": 8, "price": 2, "quantity": 1},
        }

        with transaction.atomic():
            for key, value in products.items():
                stock = value["stock"]
                price = value["price"]
                quantity = value["quantity"]
                product = Product.objects.create(name=key)

                inventory = Inventory.objects.create(
                    product=product, stock=stock, price=price
                )

                Cart.objects.create(inventory=inventory, quantity=quantity)

        self.stdout.write(self.style.SUCCESS("Successfully Filled DB!"))
