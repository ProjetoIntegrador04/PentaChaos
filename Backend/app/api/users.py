from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud.user import user as crud_user # Importa a instância 'user' do módulo 'app.crud.user'
from app.api import deps # Importa as dependências (como get_db)
from app.schemas.user import User, UserCreate, UserUpdate # Importa nossos esquemas Pydantic

router = APIRouter()

@router.get("/", response_model=List[User])
def read_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retorna uma lista de usuários.
    """
    # CORREÇÃO: Usando crud_user no lugar de crud.user
    users = crud_user.get_multi(db, skip=skip, limit=limit)
    return users

@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """
    Cria um novo usuário.
    """
    # CORREÇÃO: Usando crud_user no lugar de crud.user
    user = crud_user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O email já está registrado."
        )
    # CORREÇÃO: Usando crud_user no lugar de crud.user
    user = crud_user.create(db, obj_in=user_in)
    return user

@router.get("/{user_id}", response_model=User)
def read_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
) -> Any:
    """
    Retorna um usuário específico pelo ID.
    """
    # CORREÇÃO: Usando crud_user no lugar de crud.user
    user = crud_user.get(db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado."
        )
    return user

@router.put("/{user_id}", response_model=User)
def update_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    user_in: UserUpdate,
) -> Any:
    """
    Atualiza um usuário existente.
    """
    # CORREÇÃO: Usando crud_user no lugar de crud.user
    user = crud_user.get(db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado."
        )
    # CORREÇÃO: Usando crud_user no lugar de crud.user
    user = crud_user.update(db, db_obj=user, obj_in=user_in)
    return user

@router.delete("/{user_id}", response_model=User)
def delete_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
) -> Any:
    """
    Deleta um usuário.
    """
    # CORREÇÃO: Usando crud_user no lugar de crud.user
    user = crud_user.get(db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado."
        )
    # CORREÇÃO: Usando crud_user no lugar de crud.user
    user = crud_user.delete(db, user_id=user_id)
    return user
