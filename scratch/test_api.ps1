$json = @{ username = "admin"; password = "admin" } | ConvertTo-Json
$token = Invoke-RestMethod -Uri "http://188.212.99.215:8080/api/auth/admin-login" -Method Post -Body $json -ContentType "application/json"
Write-Host "Admin Token: $token"

$headers = @{ "Authorization" = "Bearer $token" }

# Test /api/admin/products
try {
    $products = Invoke-RestMethod -Uri "http://188.212.99.215:8080/api/admin/products" -Method Get -Headers $headers
    Write-Host "Admin products count: $($products.Count)"
    Write-Host ($products | ConvertTo-Json -Depth 3)
} catch {
    Write-Host "Admin products error: $($_.Exception.Message)"
}

# Test /api/admin/stones
try {
    $stones = Invoke-RestMethod -Uri "http://188.212.99.215:8080/api/admin/stones" -Method Get -Headers $headers
    Write-Host "Admin stones count: $($stones.Count)"
} catch {
    Write-Host "Admin stones error: $($_.Exception.Message)"
}

# Test /api/products with token
try {
    $pubProducts = Invoke-RestMethod -Uri "http://188.212.99.215:8080/api/products" -Method Get -Headers $headers
    Write-Host "Public products with token: $($pubProducts.Count)"
} catch {
    Write-Host "Public products with token error: $($_.Exception.Message)"
}

# Test /api/products without token
try {
    $pubNoToken = Invoke-RestMethod -Uri "http://188.212.99.215:8080/api/products" -Method Get
    Write-Host "Public products without token: $($pubNoToken.Count)"
} catch {
    Write-Host "Public products without token error: $($_.Exception.Message)"
}
