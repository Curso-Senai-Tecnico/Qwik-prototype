import os
from pathlib import Path
from corsheaders.defaults import default_headers

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "+!x7)zw$1z-iv7a@s1^2qs!n83b_dgxk84mvj9q%gv9l%f%7&w"

# ============================
# 🔥 AMBIENTE
# ============================
# Para desenvolvimento local, deixe DEBUG=True
# Para produção, coloque como variável de ambiente
DEBUG = os.getenv("DEBUG", "True") == "True"

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "prepituitary-hyperbarbarously-twila.ngrok-free.dev",
    "assure-encoding-ecommerce-alfred.trycloudflare.com",

    # coloque aqui seu backend futuro
]

# Necessário para Vercel/Ngrok sobre HTTPS reverso
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# ============================
# 🔥 APPS
# ============================
INSTALLED_APPS = [
    "daphne",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "channels",
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "django_extensions",
    "api.apps.ApiConfig",
]

AUTH_USER_MODEL = "api.Usuario"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

# ============================
# 🔥 MIDDLEWARE
# ============================
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]

ROOT_URLCONF = "projeto.urls"

# ============================
# 🔥 TEMPLATES
# ============================
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# ============================
# 🔥 ASGI (obrigatório p/ WebSocket)
# ============================
ASGI_APPLICATION = "projeto.asgi.application"

# ============================
# 🔥 BANCO DE DADOS LOCAL
# ============================
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "qwik",
        "USER": "root",
        "PASSWORD": "admin",
        "HOST": "127.0.0.1",
        "PORT": "3308",
        "OPTIONS": {
            "ssl": {"disabled": True},
            "init_command": "SET sql_mode='STRICT_TRANS_TABLES'"
        },
    }
}

# ============================
# 🔥 REDIS LOCAL + PRODUÇÃO
# ============================

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {"hosts": [("localhost", 6379)]},
    }
}

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": 'redis://localhost:6379/1',
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    }
}

# ============================
# 🔥 CORS (liberado para local + vercel)
# ============================
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    # local
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:4173",
    "http://127.0.0.1:8080",

    # vercel
    "https://qwik-frontend-sandy.vercel.app",

    # railway frontend antigo

    # ngrok
    "https://prepituitary-hyperbarbarously-twila.ngrok-free.dev",
    "https://assure-encoding-ecommerce-alfred.trycloudflare.com",
]

CORS_ALLOW_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
CORS_ALLOW_HEADERS = list(default_headers) + [
    "ngrok-skip-browser-warning",
    "user-agent",
]
# ============================
# 🔥 STATIC / MEDIA
# ============================
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.AutoField"
