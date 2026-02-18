# Koristimo Node.js bazu
FROM node:20-alpine

# Dodajemo OpenSSL i libc6-compat jer su neophodni za Prismu na Alpine verziji
RUN apk add --no-cache openssl libc6-compat

# Postavljamo radni direktorijum unutar kontejnera
WORKDIR /app

# Kopiramo package fajlove i instaliramo zavisnosti
COPY package*.json ./
RUN npm install

# Kopiramo ostali kod
COPY . .

# Generišemo Prisma klijent 
RUN npx prisma generate

# Build-ujemo Next.js aplikaciju
RUN npm run build

# Otvaramo port 3000
EXPOSE 3000

# Komanda za pokretanje aplikacije
CMD ["npm", "run", "start"]