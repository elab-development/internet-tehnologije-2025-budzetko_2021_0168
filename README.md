# Budzetko - Seminarski rad

Aplikacija za upravljanje ličnim finansijama sa ulogama korisnika i vizuelizacijom podataka.

## Tehnologije
* **Frontend:** Next.js 14 (App Router)
* **Baza podataka:** PostgreSQL sa Prisma ORM-om
* **Dizajn:** Tailwind CSS
* **Kontejnerizacija:** Docker & Docker Compose

## Pokretanje aplikacije (Docker)

Ovo je najlakši način da pokrenete aplikaciju bez instalacije baze na vašem sistemu.

1. Otvorite terminal u root folderu projekta.
2. Pokrenite:
   ```bash
   docker-compose up --build 
   ```

## Git Flow (Struktura grana)
Projekat je razvijan kroz sistem grana:
- `main`: Stabilna verzija.
- `develop`: Razvojna grana.
- `feature/login` i `feature/dashboard`: Feature grane.

## Bezbednosne mere
1. **SQL Injection:** Zaštita putem Prisma ORM-a.
2. **XSS:** Zaštita putem React sanitizacije.
3. **IDOR:** Provera vlasništva nad podacima na API nivou.

## API Dokumentacija
API specifikacija (Swagger) je dostupna na:
http://localhost:3000/docs

## CI/CD Pipeline
Automatizacija testiranja i build-a je podešena putem GitHub Actions (fajl se nalazi u .github/workflows).