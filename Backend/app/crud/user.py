from typing import Any, Optional, Dict, List # 'List' está corretamente importado!

from sqlalchemy.orm import Session
from sqlalchemy import select # Importação de 'select' para construir queries (uma única vez)

from app.core.security import get_password_hash, verify_password # Funções para hash de senha
from app.models.user import User # Nosso modelo SQLAlchemy de User
from app.schemas.user import UserCreate, UserUpdate # Nossos esquemas Pydantic para User

# A linha 'from sqlalchemy import select' duplicada foi removida.

class CRUDUser:
    def get(self, db: Session, user_id: int) -> Optional[User]:
        """Obtém um usuário pelo ID."""
        return db.get(User, user_id)

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        """Obtém múltiplos usuários com paginação."""
        stmt = select(User).offset(skip).limit(limit)
        return db.execute(stmt).scalars().all()

    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        """Obtém um usuário pelo email."""
        stmt = select(User).where(User.email == email)
        return db.execute(stmt).scalars().first()

    def create(self, db: Session, obj_in: UserCreate) -> User:
        """Cria um novo usuário."""
        # Hashear a senha antes de salvar no banco de dados
        hashed_password = get_password_hash(obj_in.password)

        db_obj = User(
            email=obj_in.email,
            hashed_password=hashed_password,
            full_name=obj_in.full_name, # Pode ser None
            is_active=True, # Por padrão, novos usuários são ativos
            is_superuser=False # Por padrão, novos usuários não são superusuários
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj) # Atualiza o objeto com os dados do banco (ex: ID gerado)
        return db_obj

    def update(self, db: Session, db_obj: User, obj_in: UserUpdate) -> User:
        """Atualiza um usuário existente."""
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            # Garante que 'obj_in' é um modelo Pydantic e extrai dados
            update_data = obj_in.model_dump(exclude_unset=True) 

        if "password" in update_data and update_data["password"]:
            # Hashear a nova senha se ela for fornecida
            update_data["hashed_password"] = get_password_hash(update_data.pop("password")) # Remove a senha do dict antes de atualizar

        # Atualiza apenas os campos presentes em update_data
        for field in update_data:
            if hasattr(db_obj, field): # Verifica se o atributo existe no objeto do banco de dados
                setattr(db_obj, field, update_data[field])

        db.add(db_obj) # Adiciona o objeto modificado à sessão
        db.commit() # Confirma as mudanças no banco de dados
        db.refresh(db_obj) # Atualiza o objeto com os dados mais recentes do banco
        return db_obj

    def delete(self, db: Session, user_id: int) -> Optional[User]:
        """Deleta um usuário pelo ID."""
        user = db.get(User, user_id)
        if user:
            db.delete(user)
            db.commit()
        return user # Retorna o usuário deletado (ou None se não encontrado)

    def authenticate(
        self, db: Session, email: str, password: str
    ) -> Optional[User]:
        """Autentica um usuário pelo email e senha."""
        user = self.get_by_email(db, email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

user = CRUDUser() # Instância da classe para ser importada e utilizada