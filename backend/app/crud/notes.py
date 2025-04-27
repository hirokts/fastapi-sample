from typing import Sequence

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.notes import Note
from app.schemas.notes import NoteCreate


async def create_note(db: AsyncSession, note: NoteCreate) -> Note:
    db_note = Note(content=note.content)
    db.add(db_note)
    await db.commit()
    await db.refresh(db_note)
    return db_note


async def get_notes(db: AsyncSession, skip: int = 0, limit: int = 10) -> Sequence[Note]:
    result = await db.execute(select(Note).offset(skip).limit(limit))
    return result.scalars().all()


async def get_note(db: AsyncSession, note_id: int) -> Note | None:
    result = await db.execute(select(Note).filter(Note.id == note_id))
    return result.scalars().first()


async def update_note(db: AsyncSession, note_id: int, note: NoteCreate) -> Note | None:
    db_note = await get_note(db, note_id)
    if db_note is None:
        return None
    db_note.content = note.content
    await db.commit()
    await db.refresh(db_note)
    return db_note


async def delete_note(db: AsyncSession, note_id: int) -> bool:
    db_note = await get_note(db, note_id)
    if db_note is None:
        return False
    await db.delete(db_note)
    await db.commit()
    return True
