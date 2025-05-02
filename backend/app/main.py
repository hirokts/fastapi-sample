import os
from os.path import dirname, join

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import text
from app.schemas.notes import NoteCreate, NoteResponse
from app.database import get_async_session
from app.crud.notes import create_note, get_note, get_notes, update_note, delete_note
from app.utils import VerifyToken

dotenv_path = join(dirname(dirname(__file__)), ".env")
load_dotenv(dotenv_path)
token_auth_scheme = HTTPBearer()
auth = VerifyToken()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("ALLOW_ORIGIN_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

def get_current_user(token: dict) -> str:
    return token["sub"] if token else ""


@app.post("/notes/", response_model=NoteResponse)
async def create_note_endpoint(note: NoteCreate, db: AsyncSession = Depends(get_async_session)):
    return await create_note(db=db, note=note)


@app.get("/notes/", response_model=list[NoteResponse])
async def read_notes_endpoint(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_async_session)):
    return await get_notes(db=db, skip=skip, limit=limit)


@app.get("/notes/{note_id}", response_model=NoteResponse)
async def read_note_endpoint(note_id: int, db: AsyncSession = Depends(get_async_session)):
    db_note = await get_note(db=db, note_id=note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note


@app.put("/notes/{note_id}", response_model=NoteResponse)
async def update_note_endpoint(note_id: int, note: NoteCreate, db: AsyncSession = Depends(get_async_session)):
    db_note = await update_note(db=db, note_id=note_id, note=note)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note


@app.delete("/notes/{note_id}")
async def delete_note_endpoint(note_id: int, db: AsyncSession = Depends(get_async_session)):
    success = await delete_note(db=db, note_id=note_id)
    if not success:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted successfully"}


@app.get("/notes-count")
async def get_notes_count(token: dict = Security(auth.verify), db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(text("SELECT COUNT(*) FROM notes"))
    count = result.scalar()
    user = get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return {"count": count}
