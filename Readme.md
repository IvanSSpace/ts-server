# Backend сервер Express.js TypeScript PostgreSQL


## 1. Установить зависимости:

### npm install

## 2. Установка PostgreSQL

### brew services list | grep postgresql

### brew services start postgresql@14

## 3. Создать базу данных:

### createdb tsserver_db

### Создать таблицы:

### psql tsserver_db -f init-db.sql

## 4. Настройка переменных окружения

Убедитесь, что файл `.env` содержит:

```env
JWT_SECRET=secret123xsersda
PORT=3000
JWT_EXPIRES_IN=15m
BCRYPT_ROUNDS=10
DATABASE_URL=postgresql://ваш_username@localhost:5432/tsserver_db
```

## 5. Запуск сервера

### npm start

Сервер запустится на `http://localhost:3000`

---

## 📊 API Endpoints

| Метод | Endpoint         | Описание                            | Auth |
| ----- | ---------------- | ----------------------------------- | ---- |
| GET   | `/health`        | Health check                        | ❌   |
| GET   | `/users`         | Список пользователей                | ❌   |
| POST  | `/users`         | Создать пользователя                | ❌   |
| GET   | `/users/:id`     | Получить пользователя               | ❌   |
| POST  | `/auth/register` | Регистрация                         | ❌   |
| POST  | `/auth/login`    | Вход (получить токен)               | ❌   |
| GET   | `/me`            | Данные авторизованного пользователя | ✅   |


---

### Полезные команды PostgreSQL:

```bash
# Подключиться к базе
psql tsserver_db

# Внутри psql:
\dt                          # показать все таблицы
\d users                     # структура таблицы users
\d auth_users               # структура таблицы auth_users
SELECT * FROM users;        # показать всех пользователей
SELECT * FROM auth_users;   # показать auth пользователей
\q                          # выйти
```

### Пересоздать базу данных:

```bash
# ОСТОРОЖНО - удалит все данные!
dropdb tsserver_db
createdb tsserver_db
psql tsserver_db -f init-db.sql
```

### Резервное копирование:

```bash
# Создать бэкап
pg_dump tsserver_db > backup.sql

# Восстановить из бэкапа
psql tsserver_db < backup.sql
```

---


### после использования остановить PostgreSQL

### brew services stop postgresql@14