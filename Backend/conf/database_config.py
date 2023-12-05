from decouple import config
import os

def get_database_config(environment, BASE_DIR):
    DB_HOST = config('DATABASE_HOST')
    DB_NAME = config('DATABASE_DEFAULT_NAME')
    DB_NAME2 = config('DATABASE_SECOND_NAME')
    DB_USER = config('DATABASE_USER')
    DB_PASSWORD = config('DATABASE_PASSWORD')
    DB_PORT = config('DATABASE_PORT')
    certificate_name = config('CERTIFICATE_NAME')
    certificate_path = os.path.join(BASE_DIR,certificate_name)

    if environment == 'production_cloud':
        default_options = {'ssl': {'ca': f'{certificate_path}'}}
    else:
        default_options = {}

    database_config = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': DB_NAME,
            'USER': DB_USER,
            'HOST': DB_HOST,
            'PORT': DB_PORT,
            'PASSWORD': DB_PASSWORD,
            'OPTIONS': default_options
        },
        'parks': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': DB_NAME2,
            'USER': DB_USER,
            'HOST': DB_HOST,
            'PORT': DB_PORT,
            'PASSWORD': DB_PASSWORD,
            'OPTIONS': default_options
        }
    }

    dev_database_config = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'tesis.sqlite3',
        },
        'parks': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'parks.sqlite3',
        }
    }
    return database_config if environment != 'development' else dev_database_config
