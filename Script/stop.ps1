# Copyright (c) 2025 Ahmed Fahmy
# Developed at UFUQ TECH
# Proprietary software. See LICENSE file in the project root for full license information.

param(
    [int[]]$Ports = @(8000, 3000)
)

function Stop-ProcessByIdSafe {
    param([int]$ProcessId, [string]$Reason)

    if ($ProcessId -le 0) { return }
    try {
        Stop-Process -Id $ProcessId -Force -ErrorAction Stop
        Write-Host "  Stopped PID $ProcessId ($Reason)" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "  Failed to stop PID $ProcessId ($Reason)" -ForegroundColor Red
        return $false
    }
}

function Get-HomeverseProcesses {
    Get-CimInstance Win32_Process |
        Where-Object {
            $_.CommandLine -and (
                $_.CommandLine -match 'Homeverse' -or
                $_.CommandLine -match '\\Api\\' -or
                $_.CommandLine -match '\\Front\\' -or
                $_.CommandLine -match 'php -S 127\.0\.0\.1:8000' -or
                $_.CommandLine -match 'npm run dev'
            )
        }
}

Write-Host ""
Write-Host "Stopping Homeverse servers (API & Frontend)..." -ForegroundColor Yellow

$stopped = $false

foreach ($port in $Ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
        Select-Object -ExpandProperty OwningProcess -Unique

    foreach ($processId in $connections) {
        if (Stop-ProcessByIdSafe -ProcessId $processId -Reason "port $port") { $stopped = $true }
    }
}

# Also kill any lingering Homeverse-related processes by command line.
Get-HomeverseProcesses | ForEach-Object {
    if (Stop-ProcessByIdSafe -ProcessId $_.ProcessId -Reason "command line match") { $stopped = $true }
}

if (-not $stopped) {
    Write-Host "  No Homeverse servers found on ports $($Ports -join ', ')." -ForegroundColor Gray
}

Write-Host ""
Write-Host "Done." -ForegroundColor Green
