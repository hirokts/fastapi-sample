# AI Base Backend with FastAPI


### マイグレーション作成
コンテナ内で `uv run alembic revision --autogenerate -m "migration message"`
あるいは `docker compose exec backend uv run alembic revision --autogenerate -m "migration message"`

### マイグレーション実行
コンテナ内で `uv run alembic upgrade head`
あるいは `docker compose exec backend uv run alembic upgrade head`

Ref: [DBマイグレーションツールのAlembicの使い方](https://zenn.dev/shimakaze_soft/articles/4c0784d9a87751)
