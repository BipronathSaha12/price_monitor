from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=200)
    target_price = models.FloatField()

    def __str__(self):
        return self.name


class Competitor(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='competitors')
    name = models.CharField(max_length=200)
    url = models.URLField()
    selector = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.name} ({self.product.name})"


class PriceHistory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='price_history')
    competitor = models.ForeignKey(Competitor, on_delete=models.CASCADE, related_name='price_history')
    price = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = 'Price histories'

    def __str__(self):
        return f"{self.product.name} - {self.competitor.name}: {self.price}"
