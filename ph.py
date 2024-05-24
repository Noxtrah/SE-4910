import requests

url = 'https://www.themealdb.com/api/json/v1/1/random.php'
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    # Rastgele yemek tarifini içeren 'data' şimdi elimizde
    print(data)
else:
    print('Hata:', response.status_code)
