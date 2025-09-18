from django.core.management.base import BaseCommand
from shop.models import Category, Product, ProductImage


class Command(BaseCommand):
    help = "Seed initial categories and products"

    def handle(self, *args, **options):
        categories = [
            ("Gift Boxes", "gift-boxes"),
            ("Beer, Wine & Spirits", "beer-wine-spirits"),
            ("Non-Alc Drinks", "non-alc-drinks"),
            ("Sweet Treats", "sweet-treats"),
            ("Snacks & Sauces", "snacks-sauces"),
            ("Coffee & Tea", "coffee-tea"),
            ("Skincare", "skincare"),
            ("Candles & Perfumes", "candles-perfumes"),
            ("Homewares", "homewares"),
            ("Greeting Cards", "greeting-cards"),
        ]

        for idx, (name, slug) in enumerate(categories):
            Category.objects.get_or_create(slug=slug, defaults={
                "name": name,
                "order": idx,
                "description": "",
                "image_url": "https://picsum.photos/seed/" + slug + "/800/600",
            })

        snacks = Category.objects.get(slug="snacks-sauces")
        gift = Category.objects.get(slug="gift-boxes")
        products = [
            {
                "name": "Sample Sauce",
                "slug": "sample-sauce",
                "short_description": "A tasty local sauce.",
                "price_cents": 1299,
            },
            {
                "name": "Crunchy Snack",
                "slug": "crunchy-snack",
                "short_description": "Crunchy and delightful.",
                "price_cents": 799,
            },
        ]

        for p in products:
            prod, _ = Product.objects.get_or_create(
                slug=p["slug"],
                defaults={
                    "category": snacks,
                    "name": p["name"],
                    "short_description": p["short_description"],
                    "price_cents": p["price_cents"],
                },
            )
            if not prod.images.exists():
                ProductImage.objects.create(
                    product=prod,
                    image_url=f"https://picsum.photos/seed/{prod.slug}/1200/900",
                    alt_text=prod.name,
                )

        gift_products = [
            {
                "name": "Local Treats Gift Box",
                "slug": "local-treats-gift-box",
                "short_description": "A curated selection of local favorites.",
                "price_cents": 4999,
            },
            {
                "name": "Relax & Unwind Box",
                "slug": "relax-unwind-box",
                "short_description": "A soothing bundle of skincare and candles.",
                "price_cents": 6999,
            },
        ]

        for p in gift_products:
            prod, _ = Product.objects.get_or_create(
                slug=p["slug"],
                defaults={
                    "category": gift,
                    "name": p["name"],
                    "short_description": p["short_description"],
                    "price_cents": p["price_cents"],
                },
            )
            if not prod.images.exists():
                ProductImage.objects.create(
                    product=prod,
                    image_url=f"https://picsum.photos/seed/{prod.slug}/1200/900",
                    alt_text=prod.name,
                )

        self.stdout.write(self.style.SUCCESS("Seeded categories and products."))


