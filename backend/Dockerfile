# Python 3.10 ortamı
FROM python:3.10-slim

# Çalışma dizini oluştur
WORKDIR /app

# Gereksinimleri kopyala ve kur
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Diğer dosyaları kopyala
COPY . .

# Ortam değişkenleri
ENV PORT=5001
ENV PYTHONUNBUFFERED=1

# Portu aç
EXPOSE 5001

# Flask uygulamasını başlat
CMD ["python", "server.py"]
