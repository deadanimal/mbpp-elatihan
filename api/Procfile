web: gunicorn core.wsgi -w 4 --max-requests 100
worker: celery -A core worker --concurrency=8 -Ofair
beat: celery -A core beat