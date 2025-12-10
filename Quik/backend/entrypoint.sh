#!/bin/sh

# Espera o banco ficar pronto
./wait-for-it.sh $MYSQLHOST:$MYSQLPORT --strict --timeout=30

# Rodar migrations
python manage.py makemigrations
python manage.py migrate

# Iniciar servidor
daphne -b 0.0.0.0 -p $PORT projeto.asgi:application
