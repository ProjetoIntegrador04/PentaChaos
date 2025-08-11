from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base # Esta linha não é mais necessária se você já tem base_class.py
from app.db.base_class import Base # Importamos a Base que definimos

class User(Base):
    __tablename__ = "users" # Define o nome da tabela no banco de dados

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False) # Email deve ser único e não nulo
    hashed_password = Column(String, nullable=False) # Senha deve ser criptografada
    is_active = Column(Boolean, default=True) # Se o usuário está ativo
    is_superuser = Column(Boolean, default=False) # Se o usuário tem privilégios de superusuário

    # Método de representação para facilitar a depuração
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}')>"