# Backend FastAPI


### マイグレーション作成
コンテナ内で `uv run alembic revision --autogenerate -m "migration message"`
あるいは `docker compose exec backend uv run alembic revision --autogenerate -m "migration message"`

### マイグレーション実行
コンテナ内で `uv run alembic upgrade head`
あるいは `docker compose exec backend uv run alembic upgrade head`
