FROM python:3.13.9-slim

RUN pip install mysql-connector-python

WORKDIR /app

COPY roteiro_db.py /app
COPY populacao.py /app

COPY wait-for-it.sh /app/

RUN chmod +x /app/wait-for-it.sh


CMD ["bash", "./wait-for-it.sh", "db:3306", "--", "python", "roteiro_db.py", "populacao.py" ]