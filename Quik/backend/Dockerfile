FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# force rebuild

CMD ["sh", "-c", "python manage.py migrate sessions && python manage.py migrate contenttypes && python manage.py migrate authtoken && python manage.py migrate auth && python manage.py migrate admin && python manage.py migrate api --fake   && daphne -b 0.0.0.0 -p ${PORT} projeto.asgi:application"]
