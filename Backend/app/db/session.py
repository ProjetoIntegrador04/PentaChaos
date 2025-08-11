# Sua nova configuração de sessão assíncrona
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# IMPORTANT: A URL do banco de dados deve usar o driver assíncrono
# Ex: "postgresql+asyncpg://user:password@host:port/dbname"
# Certifique-se que settings.DATABASE_URL reflita isso.

print(f"DEBUGGING: DATABASE_URL sendo usada: {settings.DATABASE_URL}")

engine = create_async_engine(str(settings.DATABASE_URL), echo=settings.DEBUG)

# Usa AsyncSessionLocal para sessões assíncronas
AsyncSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession, # Importante: usar AsyncSession
    expire_on_commit=False
)

# Para a dependency injection no FastAPI
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session