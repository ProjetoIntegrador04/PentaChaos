from typing import Any
from sqlalchemy.ext.declarative import as_declarative, declared_attr
from sqlalchemy.orm import declarative_base

@as_declarative()
class Base:
    """
    Classe base declarativa para todos os modelos SQLAlchemy.
    Automaticamente gera o nome da tabela a partir do nome da classe.
    """
    __name__: str

    # Para gerar o nome da tabela automaticamente, ex: "User" -> "users"
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower() + "s"

# Ou, se preferir uma abordagem mais simples:
# Base = declarative_base()