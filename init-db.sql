-- Создание таблицы для обычных пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы для auth пользователей
CREATE TABLE IF NOT EXISTS auth_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавление начального пользователя (из вашего кода)
INSERT INTO users (id, name, password)
VALUES (1, 'Ivan', '123456')
ON CONFLICT (id) DO NOTHING;

-- Индекс для быстрого поиска по email
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users(email);

-- Вывод информации о созданных таблицах
SELECT 'Tables created successfully!' as status;

