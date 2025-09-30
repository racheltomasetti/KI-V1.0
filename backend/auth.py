"""
Supabase JWT authentication for FastAPI
Validates JWT tokens locally without calling Supabase API
"""
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from typing import Optional
import os
from pydantic import BaseModel

# Load JWT secret from environment
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

class JWTPayload(BaseModel):
    """Supabase JWT token payload structure"""
    sub: str  # User ID
    email: str
    role: str
    aud: str  # Should be "authenticated"
    exp: int  # Expiration timestamp
    iat: int  # Issued at timestamp


class JWTBearer(HTTPBearer):
    """
    FastAPI dependency for validating Supabase JWT tokens.

    Usage:
        @app.get("/protected")
        async def protected_route(user: JWTPayload = Depends(get_current_user)):
            return {"user_id": user.sub}
    """

    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, credentials: HTTPAuthorizationCredentials) -> Optional[JWTPayload]:
        if not credentials:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Bearer authentication required",
                headers={"WWW-Authenticate": 'Bearer realm="auth_required"'},
            )

        if credentials.scheme != "Bearer":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid authentication scheme. Use Bearer token."
            )

        # Validate and decode JWT
        token_payload = self.verify_jwt(credentials.credentials)

        if not token_payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired authentication token",
                headers={"WWW-Authenticate": 'Bearer realm="auth_required"'},
            )

        return token_payload

    def verify_jwt(self, token: str) -> Optional[JWTPayload]:
        """
        Verify Supabase JWT token locally without hitting the auth server.
        This is fast and efficient for protected routes.
        """
        if not SUPABASE_JWT_SECRET:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="SUPABASE_JWT_SECRET not configured"
            )

        try:
            # Decode and verify JWT
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated",  # Supabase uses "authenticated" for user tokens
                options={
                    "verify_signature": True,
                    "verify_exp": True,  # Check expiration
                    "verify_aud": True,  # Verify audience
                }
            )

            return JWTPayload(**payload)

        except jwt.ExpiredSignatureError:
            # Token has expired - client should refresh
            return None
        except jwt.InvalidTokenError:
            # Invalid token signature or structure
            return None
        except Exception:
            # Catch-all for unexpected errors
            return None


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=True))
) -> JWTPayload:
    """
    Reusable dependency to extract current user from JWT token.

    Usage:
        @app.get("/me")
        async def get_user_profile(user: JWTPayload = Depends(get_current_user)):
            return {"user_id": user.sub, "email": user.email}
    """
    bearer = JWTBearer()
    return await bearer(credentials)
