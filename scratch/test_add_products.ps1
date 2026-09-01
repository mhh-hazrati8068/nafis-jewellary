$json = @{ username = "admin"; password = "admin" } | ConvertTo-Json
$token = Invoke-RestMethod -Uri "http://188.212.99.215:8080/api/auth/admin-login" -Method Post -Body $json -ContentType "application/json"
$headers = @{ "Authorization" = "Bearer $token" }

# Let's test force silver price update
try {
    $priceRes = Invoke-RestMethod -Uri "http://188.212.99.215:8080/api/admin/update-silver-price" -Method Post -Headers $headers
    Write-Host "Silver price update: $priceRes"
} catch {
    Write-Host "Silver price update error: $($_.Exception.Message)"
}

# Let's test adding a Stone product (METHOD_4_STONE_ONLY)
try {
    # In PowerShell we can use curl.exe for multipart
    $curlOut = curl.exe -X POST "http://188.212.99.215:8080/api/admin/products" `
        -H "Authorization: Bearer $token" `
        -F "name=سنگ فیروزه نیشابور اصل" `
        -F "pricingMethod=METHOD_4_STONE_ONLY" `
        -F "stonePrice=850000" `
        -F "stockQuantity=15" `
        -F "badge=SPECIAL_OFFER" `
        -F "isVisible=true"
    Write-Host "Add Stone result: $curlOut"
} catch {
    Write-Host "Add Stone error: $($_.Exception.Message)"
}

# Let's test getting stones
$stones = Invoke-RestMethod -Uri "http://188.212.99.215:8080/api/admin/stones" -Method Get -Headers $headers
Write-Host "Stones now: $($stones.Count)"
$stoneId = if ($stones.Count -gt 0) { $stones[0].id } else { $null }

# Let's test adding a Ring product with the stone (METHOD_1_SILVER_MAKING_STONE)
if ($stoneId) {
    $curlRing = curl.exe -X POST "http://188.212.99.215:8080/api/admin/products?stoneId=$stoneId" `
        -H "Authorization: Bearer $token" `
        -F "name=انگشتر نقره مردانه دست‌ساز نگین فیروزه نیشابور" `
        -F "pricingMethod=METHOD_1_SILVER_MAKING_STONE" `
        -F "weight=7.8" `
        -F "makingChargePercentage=20" `
        -F "stockQuantity=5" `
        -F "badge=BEST_SELLER" `
        -F "isVisible=true"
    Write-Host "Add Ring result: $curlRing"
}

# Test getting all admin products
$allProd = Invoke-RestMethod -Uri "http://188.212.99.215:8080/api/admin/products" -Method Get -Headers $headers
Write-Host "All admin products: $($allProd.Count)"
Write-Host ($allProd | ConvertTo-Json -Depth 3)
