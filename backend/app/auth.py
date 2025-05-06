import logging
import os
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from supabase import AsyncClient, AsyncClientOptions, create_async_client
from gotrue import User as GotrueUser
import jwt

SUPABASE_API_URL = os.getenv("SUPABASE_API_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
SUPABASE_ISSUER = os.getenv("SUPABASE_ISSUER", f"{SUPABASE_API_URL}/auth/v1")
SUPABASE_AUDIENCE = os.getenv("SUPABASE_AUDIENCE", "authenticated")


async def get_service_client() -> AsyncClient:
    """Get the Supabase client for the service"""
    service_client = await create_async_client(
        SUPABASE_API_URL,
        SUPABASE_SERVICE_ROLE_KEY,
        options=AsyncClientOptions(
            postgrest_client_timeout=10, storage_client_timeout=10
        ),
    )
    if not service_client:
        raise HTTPException(status_code=500, detail="Super client not initialized")
    return service_client


ServiceClient = Annotated[AsyncClient, Depends(get_service_client)]

# auto get token from header
reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl="dummy",  # FIXME email password based login endpoint
)
BearerToken = Annotated[str, Depends(reusable_oauth2)]


async def get_current_user(token: BearerToken, service_client: ServiceClient) -> GotrueUser:
    """Get the current user from the token"""
    response = await service_client.auth.get_user(jwt=token)
    if not response:
        logging.error("User not found")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return response.user


async def get_current_user_without_client(token: BearerToken) -> dict:
    """Get the current user from the token"""
    try:
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            issuer=SUPABASE_ISSUER,
            audience=SUPABASE_AUDIENCE,
        )
    except Exception as error:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(error))
    return payload

# Example payload
# {
#     'iss': 'http://127.0.0.1:54321/auth/v1', 'sub': '**uuid_userid**', 'aud': 'authenticated',
#     'exp': 1234567890, 'iat': 1234567890, 'email': 'test@example.com', 'phone': '',
#     'app_metadata': {'provider': 'email', 'providers': ['email']}, 'user_metadata': {'email_verified': True},
#     'role': 'authenticated', 'aal': 'aal1', 'amr': [{'method': 'password', 'timestamp': 1234567890}],
#     'session_id': '**uuid**', 'is_anonymous': False
# }

CurrentUser = Annotated[GotrueUser, Depends(get_current_user)]
