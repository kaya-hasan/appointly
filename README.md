# Appointly

İşletmeler ve kuaförler için geliştirilmiş bir randevu yönetim sistemi.

Bu proje, müşteri kayıtlarını ve randevu süreçlerini tek panel üzerinden yönetmeyi amaçlar.

Backend tarafında FastAPI, frontend tarafında React kullanılmıştır.

## Features

- Customer create, list, update and delete operations
- Appointment create, list, update and delete operations
- Appointment status tracking
- Search and filter support on frontend
- Simple dashboard overview on homepage

## Tech Stack

- Backend: FastAPI
- Database: PostgreSQL
- ORM: SQLAlchemy
- Migrations: Alembic
- Frontend: React + Vite

## Project Structure

Proje iki ana klasörden oluşur:

- backend: FastAPI tabanlı API ve veritabanı katmanı
- frontend: React + Vite tabanlı kullanıcı arayüzü

## Setup

Projeyi lokal ortamda çalıştırmak için backend ve frontend taraflarını ayrı ayrı kurmanız gerekir.

- PostgreSQL veritabanı oluşturun
- Backend bağımlılıklarını kurun
- Frontend bağımlılıklarını kurun
- Backend ve frontend sunucularını ayrı terminallerde çalıştırın

Kurulum ve çalıştırma adımları aşağıda ayrı başlıklar altında verilmiştir.

## Backend Setup

Backend tarafını çalıştırmak için aşağıdaki adımları izleyin:

- backend klasörüne girin
- sanal ortam oluşturun
- sanal ortamı aktif edin
- bağımlılıkları yükleyin
- PostgreSQL bağlantı ayarlarını yapılandırın
- migration işlemlerini çalıştırın
- FastAPI sunucusunu başlatın

Örnek komut sırası:

- `cd backend`
- `python -m venv .venv`
- `source .venv/bin/activate`
- `pip install -r requirements.txt`
- `alembic upgrade head`
- `uvicorn app.main:app --reload`

## Frontend Setup

Frontend tarafını çalıştırmak için aşağıdaki adımları izleyin:

- frontend klasörüne girin
- bağımlılıkları yükleyin
- Vite geliştirme sunucusunu başlatın

Örnek komut sırası:

- `cd frontend`
- `npm install`
- `npm run dev`

## Current Status

Proje şu anda çalışan bir MVP seviyesindedir.

- Customer CRUD işlemleri tamamlandı
- Appointment CRUD işlemleri tamamlandı
- PostgreSQL, SQLAlchemy ve Alembic entegrasyonu kuruldu
- Frontend tarafında arama, filtreleme ve dashboard ekranı eklendi
- Temel kullanıcı deneyimi iyileştirmeleri uygulandı

Gelecek adımlar arasında dil desteği, ek arayüz iyileştirmeleri ve deploy hazırlığı yer almaktadır.
