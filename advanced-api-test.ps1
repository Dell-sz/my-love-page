# Advanced PowerShell script for automated QA testing of "My Love Page" API
# Includes reporting, multiple users, complex tests, and documentation generation

# Configuration
$baseUrl = "http://localhost:5000"
$reportCsvPath = "api-test-report.csv"
$reportJsonPath = "api-test-report.json"
$documentationPath = "API-Documentation.md"
$logFile = "api-test-log.txt"

# Test users data
$testUsers = @(
  @{name = "Teste1"; email = "teste1@teste.com"; password = "123456" },
  @{name = "Teste2"; email = "teste2@teste.com"; password = "123456" },
  @{name = "Teste3"; email = "teste3@teste.com"; password = "123456" }
)

# Complex memory test data
$memoryTestData = @(
  @{title = "Memória curta"; description = "Descrição simples" },
  @{title = "Memória com título muito longo que pode causar problemas de validação ou exibição"; description = "Descrição também longa para testar limites de caracteres e formatação" },
  @{title = "Memória com caracteres especiais: áéíóú ñ @#$%^&*()"; description = "Descrição com símbolos: <>{}[]|\" },
  @{title = "Memória futura"; description = "Descrição para data futura" },
  @{title = ""; description = "Descrição sem título (teste de erro)" }
)

# Results storage
$results = @()
$allResponses = @{}

# Logging function
function Write-Log {
  param([string]$message)
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $logMessage = "$timestamp - $message"
  Write-Host $logMessage
  Add-Content -Path $logFile -Value $logMessage
}

# Function to run a test and capture result
function Run-Test {
  param(
    [string]$endpoint,
    [string]$method,
    [hashtable]$headers = @{},
    [string]$body = "",
    [string]$description
  )

  Write-Log "Executando teste: $description - $method $endpoint"

  $uri = "$baseUrl$endpoint"
  $params = @{
    Uri         = $uri
    Method      = $method
    ContentType = "application/json"
  }

  if ($headers.Count -gt 0) {
    $params.Headers = $headers
  }

  if ($body) {
    $params.Body = $body
  }

  try {
    $response = Invoke-RestMethod @params
    $status = "Passou"
    $errorMessage = ""
    $responseJson = $response | ConvertTo-Json -Depth 10
  }
  catch {
    $status = "Falhou"
    $errorMessage = $_.Exception.Message
    $responseJson = $null
    if ($_.Exception.Response) {
      $statusCode = $_.Exception.Response.StatusCode.Value__
      $errorMessage += " (Status: $statusCode)"
    }
  }

  $result = @{
    Endpoint     = $endpoint
    Method       = $method
    Description  = $description
    Status       = $status
    ErrorMessage = $errorMessage
    Timestamp    = Get-Date
  }

  $results += $result
  $allResponses["$method $endpoint"] = @{
    Request  = @{Uri = $uri; Method = $method; Headers = $headers; Body = $body }
    Response = $responseJson
    Error    = $errorMessage
  }

  Write-Log "Resultado: $status"
  if ($responseJson) {
    Write-Log "Response: $responseJson"
  }
  if ($errorMessage) {
    Write-Log "Erro: $errorMessage"
  }

  return $result
}

# Function to test single user
function Test-User {
  param([hashtable]$user)

  Write-Log "Iniciando testes para usuário: $($user.email)"

  # Register user
  $registerResult = Run-Test -endpoint "/api/auth/register" -method "POST" -body (@{name = $user.name; email = $user.email; password = $user.password } | ConvertTo-Json) -description "Registro de usuário $($user.email)"

  # Login
  $loginResult = Run-Test -endpoint "/api/auth/login" -method "POST" -body (@{email = $user.email; password = $user.password } | ConvertTo-Json) -description "Login de usuário $($user.email)"

  if ($loginResult.Status -eq "Falhou") {
    Write-Log "Login falhou para $($user.email), pulando testes de memória"
    return
  }

  $token = (ConvertFrom-Json $allResponses["POST /api/auth/login"].Response).data.token

  # Test memories for this user
  foreach ($memory in $memoryTestData) {
    # Create memory
    $createResult = Run-Test -endpoint "/api/memories" -method "POST" -headers @{Authorization = "Bearer $token" } -body ($memory | ConvertTo-Json) -description "Criar memória para $($user.email): $($memory.title)"

    if ($createResult.Status -eq "Passou") {
      $memoryId = (ConvertFrom-Json $allResponses["POST /api/memories"].Response).data._id

      # Update memory
      $updateData = @{title = "Atualizado: $($memory.title)"; description = "Atualizado: $($memory.description)" }
      Run-Test -endpoint "/api/memories/$memoryId" -method "PUT" -headers @{Authorization = "Bearer $token" } -body ($updateData | ConvertTo-Json) -description "Atualizar memória para $($user.email)"

      # Delete memory
      Run-Test -endpoint "/api/memories/$memoryId" -method "DELETE" -headers @{Authorization = "Bearer $token" } -description "Deletar memória para $($user.email)"
    }
  }

  # List memories
  Run-Test -endpoint "/api/memories" -method "GET" -headers @{Authorization = "Bearer $token" } -description "Listar memórias para $($user.email)"
}

# Main execution
Write-Log "Iniciando testes automatizados da API My Love Page"

# Health Check
Run-Test -endpoint "/api/health" -method "GET" -description "Health Check da API"

# Test multiple users
foreach ($user in $testUsers) {
  Test-User -user $user
}

# Additional tests
Write-Log "Executando testes adicionais"

# Test without token
Run-Test -endpoint "/api/memories" -method "GET" -description "Acesso sem token (deve falhar com 401)"

# Test invalid data
$invalidData = @{description = "Descrição sem título" }
Run-Test -endpoint "/api/memories" -method "POST" -headers @{Authorization = "Bearer invalid_token" } -body ($invalidData | ConvertTo-Json) -description "Criar memória com token inválido"

# Generate CSV report
Write-Log "Gerando relatório CSV"
$results | Export-Csv -Path $reportCsvPath -NoTypeInformation -Encoding UTF8

# Generate JSON report
Write-Log "Gerando relatório JSON"
@{
  ExecutionDate = Get-Date
  Results       = $results
  AllResponses  = $allResponses
} | ConvertTo-Json -Depth 10 | Out-File -FilePath $reportJsonPath -Encoding UTF8

# Generate documentation
Write-Log "Gerando documentação da API"

$documentation = @"
# API Documentation - My Love Page

Gerado automaticamente em $(Get-Date)

## Endpoints

### Health Check
- **Endpoint:** GET /api/health
- **Descrição:** Verifica se a API está funcionando
- **Exemplo de Response:**
$($allResponses["GET /api/health"].Response)

### Autenticação

#### Registro
- **Endpoint:** POST /api/auth/register
- **Descrição:** Registra um novo usuário
- **Exemplo de Request:**
```json
{
  "name": "Teste",
  "email": "teste@teste.com",
  "password": "123456"
}
```
- **Exemplo de Response:**
$($allResponses["POST /api/auth/register"].Response)

#### Login
- **Endpoint:** POST /api/auth/login
- **Descrição:** Faz login e retorna token JWT
- **Exemplo de Request:**
```json
{
  "email": "teste@teste.com",
  "password": "123456"
}
```
- **Exemplo de Response:**
$($allResponses["POST /api/auth/login"].Response)

### Memórias

#### Criar Memória
- **Endpoint:** POST /api/memories
- **Descrição:** Cria uma nova memória (requer token JWT)
- **Headers:** Authorization: Bearer {token}
- **Exemplo de Request:**
```json
{
  "title": "Minha memória",
  "description": "Descrição da memória"
}
```
- **Exemplo de Response:**
$($allResponses["POST /api/memories"].Response)

#### Listar Memórias
- **Endpoint:** GET /api/memories
- **Descrição:** Lista todas as memórias do usuário (requer token JWT)
- **Headers:** Authorization: Bearer {token}
- **Exemplo de Response:**
$($allResponses["GET /api/memories"].Response)

#### Atualizar Memória
- **Endpoint:** PUT /api/memories/{id}
- **Descrição:** Atualiza uma memória existente (requer token JWT)
- **Headers:** Authorization: Bearer {token}
- **Exemplo de Request:**
```json
{
  "title": "Título atualizado",
  "description": "Descrição atualizada"
}
```

#### Deletar Memória
- **Endpoint:** DELETE /api/memories/{id}
- **Descrição:** Deleta uma memória (requer token JWT)
- **Headers:** Authorization: Bearer {token}

## Códigos de Erro

- **400 Bad Request:** Dados inválidos (ex.: título vazio)
- **401 Unauthorized:** Token ausente, inválido ou expirado
- **404 Not Found:** Recurso não encontrado
- **500 Internal Server Error:** Erro interno do servidor

## Notas

- Todos os endpoints de memória requerem autenticação via JWT no header Authorization
- O token JWT tem expiração, faça login novamente se necessário
- Testes executados com usuários: $($testUsers.email -join ', ')
"@

$documentation | Out-File -FilePath $documentationPath -Encoding UTF8

Write-Log "Testes e geração de relatórios concluídos"
Write-Log "Arquivos gerados: $reportCsvPath, $reportJsonPath, $documentationPath"
