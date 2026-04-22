from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Product, Competitor, PriceHistory
import json
import csv


def dashboard(request):
    products = Product.objects.prefetch_related('competitors', 'price_history').all()

    chart_data = {}
    product_list = []

    for p in products:
        history = p.price_history.all().order_by('timestamp')
        chart_data[p.name] = [
            {
                "price": h.price,
                "time": h.timestamp.strftime("%Y-%m-%d %H:%M"),
                "competitor": h.competitor.name,
            }
            for h in history
        ]

        latest = history.last()
        product_list.append({
            'id': p.id,
            'name': p.name,
            'target_price': p.target_price,
            'latest_price': latest.price if latest else None,
            'competitor_count': p.competitors.count(),
            'history_count': history.count(),
        })

    return render(request, "dashboard.html", {
        "chart_data": json.dumps(chart_data),
        "products": product_list,
    })


def add_product(request):
    if request.method == "POST":
        name = request.POST.get("name", "").strip()
        target_price = request.POST.get("target_price", "").strip()
        competitor_name = request.POST.get("competitor_name", "").strip()
        url = request.POST.get("url", "").strip()
        selector = request.POST.get("selector", "").strip()

        errors = []
        if not name:
            errors.append("Product name is required.")
        if not target_price:
            errors.append("Target price is required.")
        else:
            try:
                target_price = float(target_price)
            except ValueError:
                errors.append("Target price must be a valid number.")

        if errors:
            return render(request, "add_product.html", {"errors": errors})

        product = Product.objects.create(name=name, target_price=target_price)

        if competitor_name and url and selector:
            Competitor.objects.create(
                product=product,
                name=competitor_name,
                url=url,
                selector=selector,
            )

        return redirect("/")

    return render(request, "add_product.html")


def export_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="prices.csv"'

    writer = csv.writer(response)
    writer.writerow(['Product', 'Competitor', 'Price', 'Timestamp'])

    history = PriceHistory.objects.select_related('product', 'competitor').all()
    for h in history:
        writer.writerow([
            h.product.name,
            h.competitor.name,
            h.price,
            h.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        ])

    return response
