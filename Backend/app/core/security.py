# app/core/security.py

from passlib.context import CryptContext

# Define o esquema de hashing de senhas. Usaremos bcrypt por ser seguro e amplamente aceito.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica se uma senha em texto puro corresponde a uma senha hasheada.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Gera o hash de uma senha em texto puro.
    """
    return pwd_context.hash(password)
