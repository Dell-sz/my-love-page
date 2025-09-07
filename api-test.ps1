# PowerShell script para testar API "My Love Page" com Invoke-RestMethod

# 1️⃣ Health Check
Write-Host "Executando Health Check..."
Invoke-RestMethod -Uri http://localhost:5000/api/health -Method GET | ConvertTo-Json -Depth 5 | Write-Host

# 2️⃣ Registro de Usuário
Write-Host "Registrando usuário teste..."
try {
  Invoke-RestMethod -Uri http://localhost:5000/api/auth/register -Method POST -Body (@{name = "Teste"; email = "teste@teste.com"; password = "123456" } | ConvertTo-Json) -ContentType "application/json" | ConvertTo-Json -Depth 5 | Write-Host
}
catch {
  Write-Host "Registro falhou: Possível email já registrado."
}

# 3️⃣ Login de Usuário e captura do token JWT
Write-Host "Realizando login e capturando token JWT..."
$response = Invoke-RestMethod -Uri http://localhost:5000/api/auth/login -Method POST -Body (@{email = "teste@teste.com"; password = "123456" } | ConvertTo-Json) -ContentType "application/json"
Write-Host "Login response:"
$response | ConvertTo-Json -Depth 5 | Write-Host

$token = $response.data.token
if (-not $token) {
  Write-Error "Token JWT não retornado. Abortando testes de memórias."
  exit
}
Write-Host "Token JWT capturado com sucesso."

# 4️⃣ CRUD de Memórias usando token JWT

# Criar memória
Write-Host "Criando memória..."
$createResponse = Invoke-RestMethod -Uri http://localhost:5000/api/memories -Method POST -Headers @{Authorization = "Bearer $token" } -Body (@{title = "Minha primeira memória"; description = "Descrição de teste" } | ConvertTo-Json) -ContentType "application/json"
$createResponse | ConvertTo-Json -Depth 5 | Write-Host

$memoryId = $createResponse.data._id
if (-not $memoryId) {
  Write-Error "ID da memória não retornado. Abortando testes restantes."
  exit
}

# Listar memórias
Write-Host "Listando memórias..."
Invoke-RestMethod -Uri http://localhost:5000/api/memories -Method GET -Headers @{Authorization = "Bearer $token" } | ConvertTo-Json -Depth 5 | Write-Host

# Editar memória
Write-Host "Editando memória..."
Invoke-RestMethod -Uri "http://localhost:5000/api/memories/$memoryId" -Method PUT -Headers @{Authorization = "Bearer $token" } -Body (@{title = "Título atualizado"; description = "Nova descrição" } | ConvertTo-Json) -ContentType "application/json" | ConvertTo-Json -Depth 5 | Write-Host

# Deletar memória
Write-Host "Deletando memória..."
Invoke-RestMethod -Uri "http://localhost:5000/api/memories/$memoryId" -Method DELETE -Headers @{Authorization = "Bearer $token" } | ConvertTo-Json -Depth 5 | Write-Host

# 5️⃣ Testes adicionais

# Token ausente ou inválido
Write-Host "Testando acesso sem token (deve retornar 401)..."
try {
  Invoke-RestMethod -Uri http://localhost:5000/api/memories -Method GET
}
catch {
  Write-Host "Resposta esperada: 401 Unauthorized"
  Write-Host $_.Exception.Response.StatusCode.Value__
}

# Dados inválidos (sem título)
Write-Host "Testando criação de memória com dados inválidos (sem título)..."
try {
  Invoke-RestMethod -Uri http://localhost:5000/api/memories -Method POST -Headers @{Authorization = "Bearer $token" } -Body (@{description = "Descrição sem título" } | ConvertTo-Json) -ContentType "application/json"
}
catch {
  Write-Host "Resposta esperada: erro 400 Bad Request"
  Write-Host $_.Exception.Response.StatusCode.Value__
}

Write-Host "Testes concluídos."
