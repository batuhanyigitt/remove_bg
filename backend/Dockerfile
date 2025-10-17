# Python base image
FROM python:3.10-slim

# Çalışma dizinini ayarla
WORKDIR /app

# Gereksinimleri kopyala ve kur
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Tüm dosyaları kopyala
COPY . .

# Uygulama hangi portta çalışacak
ENV PORT=5001
EXPOSE 5001

# Flask app'i başlat
CMD ["python", "main.py"]
