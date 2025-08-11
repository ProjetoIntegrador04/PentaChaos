# Importa todos os modelos para que o SQLAlchemy e o Alembic possam descobri-los
# Não remova a importação da classe Base, ela é usada internamente.
from app.db.base_class import Base
from app.models.user import User # Importe User, pois será o primeiro modelo que criaremos de fato

# Futuramente, você vai adicionar outros modelos aqui, como:
# from app.models.estagiario import Estagiario
# from app.models.orientador import Orientador
# from app.models.frequencia import Frequencia
# from app.models.avaliacao import Avaliacao