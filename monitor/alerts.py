import os
from django.core.mail import send_mail
from django.conf import settings


def send_email_alert(product, price):
    subject = f"Price Drop Alert: {product.name}"
    message = (
        f"Product: {product.name}\n"
        f"New Price: {price}\n"
        f"Target Price: {product.target_price}\n\n"
        f"Price dropped below your target!"
    )

    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [os.environ.get('ALERT_EMAIL', 'your_email@gmail.com')],
        fail_silently=False,
    )


def send_whatsapp_alert(message):
    account_sid = os.environ.get('TWILIO_ACCOUNT_SID', '')
    auth_token = os.environ.get('TWILIO_AUTH_TOKEN', '')
    from_number = os.environ.get('TWILIO_FROM_NUMBER', '')
    to_number = os.environ.get('TWILIO_TO_NUMBER', '')

    if not all([account_sid, auth_token, from_number, to_number]):
        return

    from twilio.rest import Client
    client = Client(account_sid, auth_token)
    client.messages.create(
        body=message,
        from_=f'whatsapp:{from_number}',
        to=f'whatsapp:{to_number}',
    )
