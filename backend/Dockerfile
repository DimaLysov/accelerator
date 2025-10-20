# Используем официальный образ Python в качестве базового
FROM python:3.12-slim

# Устанавливаем переменные окружения
ENV PYTHONDONTWRITEBYTECODE=1
# Не создавать .pyc файлы
ENV PYTHONUNBUFFERED=1
# Логировать вывод сразу
ENV POETRY_VERSION=1.8.2
# Укажите нужную версию Poetry

# Устанавливаем зависимости системы
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    ca-certificates \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем/обновляем pip и Poetry
RUN python -m pip install --upgrade pip setuptools wheel
RUN python -m pip install "poetry==${POETRY_VERSION}"

# Создаём рабочую директорию
WORKDIR /src

# Копируем файлы зависимостей Poetry
COPY pyproject.toml poetry.lock ./

# Устанавливаем зависимости (без создания виртуального окружения внутри контейнера)
RUN poetry config virtualenvs.create false && poetry install --no-interaction --no-ansi

# Копируем оставшиеся файлы проекта
COPY .env .env
COPY . .

# Собираем статические файлы (если используется Django Static Files)
RUN mkdir -p /src/staticfiles /src/media
# RUN python manage.py collectstatic --noinput

# Открываем порт для приложения
EXPOSE 8000

# Команда запуска (замени `myproject` на имя своего проекта)
CMD ["gunicorn", "conf.wsgi:application", "--bind", "0.0.0.0:8000"]