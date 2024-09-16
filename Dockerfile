# Вказуємо базовий образ
FROM  --platform=amd64 node:18-alpine AS builder

# Встановлюємо робочий каталог
WORKDIR /app

# Копіюємо package.json і package-lock.json
COPY package*.json ./

# Копіюємо файл .env
COPY .env .env

# Встановлюємо залежності
RUN npm install

# Копіюємо решту коду додатку
COPY . .

# Будуємо Next.js додаток
RUN npm run build

# Видаляємо непотрібні файли, щоб зменшити розмір образу
RUN npm prune --production

# Використовуємо інший базовий образ для запуску додатку
FROM --platform=amd64 node:18-alpine

# Встановлюємо робочий каталог
WORKDIR /app

# Копіюємо папку з побудованим додатком з попереднього образу
COPY --from=builder /app ./

# Встановлюємо залежності для запуску
RUN npm install --production

# Копіюємо файл .env
COPY .env .env

# Виставляємо порт додатку
EXPOSE 3000

# Запускаємо Next.js додаток
CMD ["npm", "run", "start-prod"]
