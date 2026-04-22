from apscheduler.schedulers.background import BackgroundScheduler
from .models import Competitor, PriceHistory
from .scraper import scrape_price
from .alerts import send_email_alert, send_whatsapp_alert


def check_prices():

    competitors = Competitor.objects.all()

    for comp in competitors:

        price = scrape_price(comp.url, comp.selector)

        if price:

            PriceHistory.objects.create(
                product=comp.product,
                competitor=comp,
                price=price
            )

            if float(price) <= float(comp.product.target_price):

                send_email_alert(comp.product, price)

                send_whatsapp_alert(
                    f"{comp.product.name} dropped to {price}"
                )


def start():

    scheduler = BackgroundScheduler()

    scheduler.add_job(
        check_prices,
        'interval',
        minutes=30
    )

    scheduler.start()