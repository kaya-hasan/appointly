# pyrefly: ignore [missing-import]
from time import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.api.routes import appointments, auth, customers
from app.core.config import settings


class SimpleRateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, requests_per_minute: int = 120):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.storage: dict[str, list[float]] = {}

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        now = time()
        window_start = now - 60
        timestamps = self.storage.get(client_ip, [])
        timestamps = [stamp for stamp in timestamps if stamp > window_start]
        if len(timestamps) >= self.requests_per_minute:
            return JSONResponse(status_code=429, content={"detail": "Rate limit exceeded"})
        timestamps.append(now)
        self.storage[client_ip] = timestamps
        return await call_next(request)


app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SimpleRateLimitMiddleware)

app.include_router(auth.router)
app.include_router(customers.router)
app.include_router(appointments.router)


@app.get("/")
def read_root():
    return {"message": f"{settings.APP_NAME} API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}
