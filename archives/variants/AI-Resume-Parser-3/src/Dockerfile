# Dockerfile for AI-Resume-Parser
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy code
COPY . .

# Expose typical API port (if app.py runs a web server)
EXPOSE 5000

# Default run (adjust if your app exposes a different entrypoint)
CMD ["python", "app.py"]
