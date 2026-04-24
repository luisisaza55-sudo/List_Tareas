# Notificaciones diarias de tareas proximas a vencer
# Programar con: Administrador de tareas de Windows a las 08:25
# Para probar manualmente: powershell -ExecutionPolicy Bypass -File "ruta\notificar_tareas.ps1"

$logFile = Join-Path $PSScriptRoot "notificar_log.txt"

function Write-Log($msg) {
    "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - $msg" | Out-File $logFile -Append -Encoding utf8
}

function Send-Balloon($title, $body, $icon = "Warning") {
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing
    $notify = New-Object System.Windows.Forms.NotifyIcon
    $notify.Icon = [System.Drawing.SystemIcons]::Information
    $notify.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::$icon
    $notify.BalloonTipTitle = $title
    $notify.BalloonTipText = $body
    $notify.Visible = $true
    $notify.ShowBalloonTip(8000)
    Start-Sleep -Seconds 4
    $notify.Dispose()
}

Write-Log "Iniciando script"

# Ruta al db.json — usa la carpeta del script o ruta fija como respaldo
$dbPath = Join-Path $PSScriptRoot "db.json"
if (-not (Test-Path $dbPath)) {
    $dbPath = "C:\Users\lisaza\Documents\GitHub\List_Tareas\db.json"
}
if (-not (Test-Path $dbPath)) {
    Write-Log "ERROR: db.json no encontrado en $dbPath"
    exit 1
}

Write-Log "Leyendo $dbPath"

try {
    $db = Get-Content $dbPath -Raw -Encoding utf8 | ConvertFrom-Json
} catch {
    Write-Log "ERROR al parsear db.json: $_"
    exit 1
}

$today = [DateTime]::Today
$tasks = $db.tasks

if (-not $tasks -or $tasks.Count -eq 0) {
    Write-Log "Sin tareas en db.json"
    exit 0
}

Write-Log "Total tareas: $($tasks.Count)"

$proximas = @()
$vencidas  = @()

foreach ($t in $tasks) {
    if ($t.estado -eq "completada") { continue }
    if (-not $t.fechaFin)           { continue }

    try {
        $fechaFin = [DateTime]::Parse($t.fechaFin)
    } catch {
        continue
    }

    $dias   = ($fechaFin.Date - $today).Days
    $alerta = if ($t.alertaDias) { [int]$t.alertaDias } else { 3 }

    if ($dias -lt 0) {
        $vencidas  += "$($t.titulo) (vencio hace $([Math]::Abs($dias))d)"
    } elseif ($dias -le $alerta) {
        $proximas  += "$($t.titulo) (vence en ${dias}d)"
    }
}

Write-Log "Vencidas: $($vencidas.Count) | Proximas: $($proximas.Count)"

if ($vencidas.Count -gt 0) {
    $body = ($vencidas | Select-Object -First 4) -join " | "
    Write-Log "Enviando notif vencidas: $body"
    Send-Balloon "Tareas vencidas ($($vencidas.Count))" $body "Error"
}

if ($proximas.Count -gt 0) {
    $body = ($proximas | Select-Object -First 4) -join " | "
    Write-Log "Enviando notif proximas: $body"
    Send-Balloon "Tareas por vencer ($($proximas.Count))" $body "Warning"
}

Write-Log "Finalizado"
