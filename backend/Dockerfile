FROM python:3.13.0-slim-bookworm
COPY --from=ghcr.io/astral-sh/uv:0.6.17 /uv /uvx /bin/

WORKDIR /app

# Place executables in the environment at the front of the path
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#using-the-environment
ENV PATH="/app/.venv/bin:$PATH"

# Compile bytecode
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#compiling-bytecode
ENV UV_COMPILE_BYTECODE=1

# uv Cache
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#caching
ENV UV_LINK_MODE=copy

COPY pyproject.toml uv.lock ./

RUN apt update && apt install -y --no-install-recommends build-essential gcc libpq-dev && \
    uv sync --frozen --no-cache --no-dev && \
    apt remove -y build-essential && apt autoremove -y && apt clean


COPY ./app ./app


CMD ["uv", "run", "uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]
