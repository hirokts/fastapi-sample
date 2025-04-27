import os
from os.path import dirname, join

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base

dotenv_path = join(dirname(dirname(__file__)), ".env")
load_dotenv(dotenv_path)

username = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
db_name = os.getenv("DB_NAME")
DATABASE_URL = f"postgresql+asyncpg://{username}:{password}@{db_host}:{db_port}/{db_name}"


engine = create_async_engine(DATABASE_URL)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)
Base = declarative_base()


async def get_async_session():
    async with async_session_maker() as session:
        yield session
