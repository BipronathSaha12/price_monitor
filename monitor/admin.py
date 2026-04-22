from django.contrib import admin
from django.http import HttpResponse
from .models import Product, Competitor, PriceHistory
import csv


class CompetitorInline(admin.TabularInline):
    model = Competitor
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'target_price', 'competitor_count', 'latest_price')
    search_fields = ('name',)
    list_filter = ('target_price',)
    inlines = [CompetitorInline]

    def competitor_count(self, obj):
        return obj.competitors.count()
    competitor_count.short_description = 'Competitors'

    def latest_price(self, obj):
        latest = obj.price_history.first()
        if latest:
            return f"{latest.price}"
        return '-'
    latest_price.short_description = 'Latest Price'


@admin.register(Competitor)
class CompetitorAdmin(admin.ModelAdmin):
    list_display = ('name', 'product', 'url')
    search_fields = ('name', 'product__name')
    list_filter = ('product',)


@admin.register(PriceHistory)
class PriceHistoryAdmin(admin.ModelAdmin):
    list_display = ('product', 'competitor', 'price', 'timestamp')
    list_filter = ('product', 'competitor', 'timestamp')
    search_fields = ('product__name', 'competitor__name')
    date_hierarchy = 'timestamp'
    actions = ['export_selected_as_csv']

    def export_selected_as_csv(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="price_history.csv"'
        writer = csv.writer(response)
        writer.writerow(['Product', 'Competitor', 'Price', 'Timestamp'])
        for obj in queryset.select_related('product', 'competitor'):
            writer.writerow([
                obj.product.name,
                obj.competitor.name,
                obj.price,
                obj.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            ])
        return response
    export_selected_as_csv.short_description = 'Export selected as CSV'
