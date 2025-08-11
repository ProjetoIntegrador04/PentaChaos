from typing import AsyncGenerator # Note a mudança para AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession # Importamos a AsyncSession para a tipagem
from app.db.session import AsyncSessionLocal # Importa a AsyncSessionLocal que criamos

# A função get_db agora é assíncrona
async def get_db() -> AsyncGenerator[AsyncSession, None]: # O tipo de retorno também muda para AsyncGenerator
    """
    Dependency para obter uma sessão de banco de dados assíncrona.

    Cria uma nova sessão de banco de dados assíncrona para cada requisição,
    garante que ela seja fechada após a requisição (mesmo em caso de erro).
    """
    session: AsyncSession = AsyncSessionLocal() # Cria uma nova sessão assíncrona
    try:
        yield session # Retorna a sessão para a rota que a solicitou
    finally:
        await session.close() # Garante que a sessão seja fechada assincronamente após o uso