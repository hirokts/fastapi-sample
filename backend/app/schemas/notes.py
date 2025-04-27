from pydantic import BaseModel
from datetime import datetime


class NoteBase(BaseModel):
    content: str

class NoteCreate(NoteBase):
    pass

class NoteResponse(NoteBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
