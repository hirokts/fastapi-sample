from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.notes import NoteCreate, NoteResponse
from app.database import engine, Base, get_async_session
from app.crud.notes import create_note, get_note, get_notes, update_note, delete_note


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)


@app.get("/")
async def root():
    return {"message": "Hello World"}


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
