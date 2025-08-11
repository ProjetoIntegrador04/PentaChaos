from typing import Optional
from pydantic import BaseModel, EmailStr # EmailStr para validação de e-mail

# Propriedades básicas do Usuário (base para criação e leitura)
# Estes são os campos comuns que um usuário terá.
class UserBase(BaseModel):
    email: EmailStr # Garante que o formato seja de e-mail
    full_name: Optional[str] = None # Nome completo é opcional na base, pode ser nulo

# Propriedades para quando um Usuário é criado
# Inclui a senha em texto claro, que será hasheada antes de salvar no DB
class UserCreate(UserBase):
    password: str # A senha é obrigatória na criação

# Propriedades para quando um Usuário é atualizado
# Todos os campos são opcionais, pois você pode querer atualizar apenas um deles
class UserUpdate(UserBase):
    full_name: Optional[str] = None # Nome completo opcional na atualização
    password: Optional[str] = None # Senha opcional na atualização
    is_active: Optional[bool] = None # Status ativo opcional
    is_superuser: Optional[bool] = None # Status superusuário opcional

# Propriedades adicionais do Usuário armazenadas no DB
# Esta classe é usada para a resposta da API (o que mostramos ao usuário)
class User(UserBase):
    id: int
    is_active: bool = True
    is_superuser: bool = False

    # Configuração necessária para que o Pydantic possa ler dados de objetos ORM (SQLAlchemy)
    model_config = {
        "from_attributes": True
    }

class UserLogin(BaseModel):
    email: EmailStr
    password: str

    # Adicione ao seu schemas/user.py
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"