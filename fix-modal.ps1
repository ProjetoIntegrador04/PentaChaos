# Script para simplificar o modal de Squads
$file = "c:\Users\gabri\OneDrive\Área de Trabalho\PentaChaos\frontend\frontProject\src\pages\Coordinator\Squads.tsx"

# Ler o conteúdo
$content = Get-Content $file -Raw -Encoding UTF8

# Substituir o bloco problemático
$oldBlock = @"
  const [searchTerm, setSearchTerm] = useState("");

  // Lista de TODOS os usuários (ADMIN e USER)
  const allAvailableUsers = useMemo(() => {
    console.log("👥 Total de usuários disponíveis:", allUsers.length);
"@

$newBlock = @"
  const [searchTerm, setSearchTerm] = useState("");

  // DEBUG SIMPLES
  useEffect(() => {
    console.log("=== MODAL ABRIU ===");
    console.log("Total usuarios recebidos:", allUsers?.length || 0);
    console.log("Usuarios:", allUsers);
  }, [allUsers]);

  // Filtro simples
  const filteredUsers = !searchTerm.trim() ? allUsers : allUsers.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("Usuarios filtrados:", filteredUsers?.length || 0);
"@

$content = $content -replace [regex]::Escape($oldBlock), $newBlock

# Salvar
Set-Content $file -Value $content -Encoding UTF8

Write-Host "Arquivo atualizado com sucesso!"
