FROM python:3.14-slim

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 PYTHONUNBUFFERED=1
ENV UV_SYSTEM_CERTS=1

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project --allow-insecure-host files.pythonhosted.org --allow-insecure-host pypi.org

COPY . .
ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]