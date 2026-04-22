import requests
from bs4 import BeautifulSoup


def scrape_price(url, selector):

    try:

        headers = {
            "User-Agent":
            "Mozilla/5.0"
        }

        response = requests.get(url, headers=headers)

        soup = BeautifulSoup(response.text, "html.parser")

        price = soup.select_one(selector).text

        price = price.replace("₹","") \
                     .replace("$","") \
                     .replace(",","") \
                     .strip()

        return float(price)

    except Exception as e:
        print("Scrape error:", e)
        return None