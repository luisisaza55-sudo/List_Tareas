# Auto-elevacion si no es administrador
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]"Administrator")) {
    Start-Process powershell "-ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

$appDir = Split-Path $PSCommandPath

Write-Host "Abriendo puertos del firewall..." -ForegroundColor Cyan
netsh advfirewall firewall add rule name="TodoListPro-Vite" dir=in action=allow protocol=TCP localport=5173 | Out-Null
netsh advfirewall firewall add rule name="TodoListPro-API"  dir=in action=allow protocol=TCP localport=3001 | Out-Null

Write-Host "Iniciando servidores..." -ForegroundColor Cyan
$server = Start-Process "cmd" -ArgumentList "/k cd /d `"$appDir`" && npm run server" -PassThru
Start-Sleep -Seconds 2
$vite   = Start-Process "cmd" -ArgumentList "/k cd /d `"$appDir`" && npm run dev"   -PassThru
Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "App corriendo. Presiona ENTER para cerrar todo y sellar los puertos." -ForegroundColor Green
Read-Host | Out-Null

Write-Host "Cerrando servidores..." -ForegroundColor Yellow
Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $vite.Id   -Force -ErrorAction SilentlyContinue

# Matar procesos node que quedaron huerfanos
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "Cerrando puertos del firewall..." -ForegroundColor Yellow
netsh advfirewall firewall delete rule name="TodoListPro-Vite" | Out-Null
netsh advfirewall firewall delete rule name="TodoListPro-API"  | Out-Null

Write-Host "Todo cerrado correctamente." -ForegroundColor Green
Start-Sleep -Seconds 2
