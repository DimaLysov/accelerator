import os

from dotenv import load_dotenv

load_dotenv()
# для базы данных
DB = os.getenv('POSTGRES_DB')
USER = os.getenv('POSTGRES_USER')
PASSWORD = os.getenv('POSTGRES_PASSWORD')
HOST = os.getenv('POSTGRES_HOST')
PORT = os.getenv('POSTGRES_PORT')