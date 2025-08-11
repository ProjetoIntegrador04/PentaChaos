# ESTE ARQUIVO LIDA COM VARIAVEIS DE AMBIENTE

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # Model de configuração para carregar variáveis de ambiente

    # Configuração do Banco de Dados
    DATABASE_URL: str = "postgresql+asyncpg://user:password@db:5432/internship_db"
    
    # Chave Secreta para JWT e outras operações criptográficas
    # GERE UMA CHAVE MAIS SEGURA PARA PRODUÇÃO!
    SECRET_KEY: str = "your-super-secret-and-complex-key"
    ALGORITHM: str = "HS256" # Algoritmo de hashing para JWT
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 # Tempo de expiração do token JWT em minutos

    # Configurações de Projeto (opcional, mas bom ter)
    PROJECT_NAME: str = "Sistema de Gestão de Estágios"
    DEBUG: bool = True # Flag para modo de depuração

    # Configuração para carregar variáveis de ambiente de um arquivo .env
    # Se você tiver um .env na raiz do projeto, ele será lido automaticamente
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore" # Ignora variáveis no .env que não estão definidas aqui
    )

# Instância única das configurações para ser usada em toda a aplicação
settings = Settings()