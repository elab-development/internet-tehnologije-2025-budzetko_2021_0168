# 1. Koristimo 'slim' verziju koja je stabilnija za Next.js i baze
FROM node:20-slim

# 2. Instaliramo OpenSSL koji je neophodan za Prismu
# RUN apt-get update && apt-get install -y openssl
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# 3. Postavljamo radni direktorijum
WORKDIR /app

# 4. Kopiramo package fajlove i instaliramo zavisnosti
COPY package*.json ./
RUN npm install

# 5. Kopiramo ostatak koda
COPY . .

# 6. Generišemo Prisma klijent
RUN npx prisma generate

# 7. Build-ujemo Next.js aplikaciju
RUN npm run build

# 8. Otvaramo port 3000
EXPOSE 3000

# 9. Komanda za pokretanje aplikacije
CMD ["npm", "run", "start"]