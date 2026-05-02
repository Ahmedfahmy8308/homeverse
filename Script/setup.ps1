# Copyright (c) 2025 Ahmed Fahmy
# Developed at UFUQ TECH
# Proprietary software. See LICENSE file in the project root for full license information.

param(
    [switch]$SkipBrowser,
    [switch]$ForceRestart,
    [int]$BackendPort = 8000,
    [int]$FrontendPort = 3000
)

function Write-Step   { param($Message) Write-Host "`n>> $Message" -ForegroundColor Cyan }
function Write-OK     { param($Message) Write-Host "   [OK] $Message" -ForegroundColor Green }
function Write-Warn   { param($Message) Write-Host "   [WARN] $Message" -ForegroundColor Yellow }
function Write-Fail   { param($Message) Write-Host "   [FAIL] $Message" -ForegroundColor Red }
function Write-Info   { param($Message) Write-Host "   $Message" -ForegroundColor Gray }

function Test-PortOpen {
    param([int]$Port)

    return [bool](Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue)
}

function Wait-ForPort {
    param(
        [int]$Port,
        [string]$Name,
        [int]$TimeoutSeconds = 60
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        if (Test-PortOpen -Port $Port) {
            Write-OK "$Name is listening on port $Port"
            return $true
        }

        Start-Sleep -Milliseconds 500
    }

    Write-Fail "$Name did not start within $TimeoutSeconds seconds on port $Port"
    return $false
}

function Stop-ProcessOnPort {
    param([int]$Port)

    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue |
        Select-Object -ExpandProperty OwningProcess -Unique

    foreach ($processId in $connections) {
        if ($processId -le 0) { continue }
        try {
            Stop-Process -Id $processId -Force -ErrorAction Stop
            Write-OK "Stopped existing process PID $processId on port $Port"
        } catch {
            Write-Warn "Could not stop process PID $processId on port $Port"
        }
    }
}

function Copy-SeededImageAssets {
    param(
        [string]$RootPath,
        [string]$SeedFile
    )

    $sourceRoots = @(
        (Join-Path $RootPath "Front\public\images\imported"),
        (Join-Path $RootPath "Front\public\images\ui-imported")
    )
    $destinationRoot = Join-Path $RootPath "Api\storage\app\public"
    if (-not (Test-Path $SeedFile)) {
        Write-Warn "Seed file not found: $SeedFile"
        return
    }

    $sourceFiles = foreach ($sourceRoot in $sourceRoots) {
        if (Test-Path $sourceRoot) {
            Get-ChildItem $sourceRoot -File | Where-Object { $_.Extension -in '.jpg', '.jpeg', '.png', '.webp' }
        } else {
            Write-Warn "Image source folder not found: $sourceRoot"
        }
    }
    if (-not $sourceFiles) {
        Write-Warn "No source images found under any configured image folder"
        return
    }

    $seedContent = Get-Content $SeedFile -Raw
    $pattern = 'uploads/images/[^''"\r\n)]+ '
    $targetMatches = [regex]::Matches($seedContent, $pattern.TrimEnd())
    $targetPaths = $targetMatches | ForEach-Object { $_.Value } | Sort-Object -Unique
    if (-not $targetPaths) {
        Write-Warn "No seeded image paths found in $SeedFile"
        return
    }

    Write-Step "Copying seeded image assets to backend storage..."
    $index = 0
    $copiedCount = 0
    foreach ($targetPath in $targetPaths) {
        $sourceFile = $sourceFiles[$index % $sourceFiles.Count]
        $destinationFile = Join-Path $destinationRoot ($targetPath -replace '/', '\\')
        $destinationDir = Split-Path -Parent $destinationFile
        if (-not (Test-Path $destinationDir)) {
            New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
        }
        Copy-Item $sourceFile.FullName $destinationFile -Force
        $index++
        $copiedCount++
    }

    Write-OK "Prepared $copiedCount backend image files under Api/storage/app/public"
}

$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$ROOT = Split-Path -Parent $SCRIPT_DIR
$API_DIR = Join-Path $ROOT "Api"
$FRONT_DIR = Join-Path $ROOT "Front"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host "  Homeverse - Full Stack Auto Setup" -ForegroundColor Magenta
Write-Host "  Project By: Ahmed Fahmy (Ufuq Tech)" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Magenta

# --- Environment Setup ---
Write-Step "Checking environment files..."
$apiEnv = Join-Path $API_DIR ".env"
$apiEnvEx = Join-Path $API_DIR ".env.example"
if (-not (Test-Path $apiEnv)) {
    if (Test-Path $apiEnvEx) {
        Copy-Item $apiEnvEx $apiEnv -Force
        Write-OK "Created Api/.env from .env.example"
    } else {
        # create a minimal .env with sensible defaults for local MySQL
        @"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:$BackendPort
APP_KEY=

# Database connection (local dev)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=homeverse_db
DB_USERNAME=root
DB_PASSWORD=
DB_CHARSET=utf8mb4
DB_COLLATION=utf8mb4_unicode_ci
"@ | Out-File $apiEnv -Encoding utf8
        Write-OK "Created Api/.env with default MySQL settings"
    }
}

$frontEnv = Join-Path $FRONT_DIR ".env"
if (-not (Test-Path $frontEnv)) {
    "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api" | Out-File $frontEnv -Encoding utf8
    Write-OK "Created Front/.env with default API URL"
}

# --- Tool Checks ---
Write-Step "Checking requirements..."
$PHP = (Get-Command php -ErrorAction SilentlyContinue).Source
if (-not $PHP) {
    $phpCandidates = @("C:\xampp\php\php.exe", "C:\php\php.exe")
    foreach ($candidate in $phpCandidates) { if (Test-Path $candidate) { $PHP = $candidate; break } }
}
if (-not $PHP) { Write-Fail "PHP not found. Please install PHP or XAMPP."; exit 1 }
Write-OK "PHP: $PHP"

$MYSQL = (Get-Command mysql -ErrorAction SilentlyContinue).Source
if (-not $MYSQL) {
    $mysqlCandidates = @("C:\xampp\mysql\bin\mysql.exe", "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe")
    foreach ($candidate in $mysqlCandidates) { if (Test-Path $candidate) { $MYSQL = $candidate; break } }
}
if (-not $MYSQL) { Write-Fail "MySQL not found. Please install MySQL or XAMPP."; exit 1 }
Write-OK "MySQL: $MYSQL"

$NODE = (Get-Command node -ErrorAction SilentlyContinue).Source
$NPM = (Get-Command npm -ErrorAction SilentlyContinue).Source
if (-not $NODE -or -not $NPM) { Write-Fail "Node.js/npm not found."; exit 1 }
Write-OK "Node.js & npm found"

# --- Database Setup ---
Write-Step "Setting up database..."
Push-Location $API_DIR
Write-Info "Creating database if not exists..."
$envPath = Join-Path $API_DIR ".env"
$dbName = "homeverse_db"
$dbUser = "root"
$dbPass = ""
if (Test-Path $envPath) {
    $envLines = Get-Content $envPath | Where-Object { $_ -match '^DB_' }
    foreach ($line in $envLines) {
        if ($line -match '^DB_DATABASE=(.+)') { $dbName = $matches[1] }
        if ($line -match '^DB_USERNAME=(.+)') { $dbUser = $matches[1] }
        if ($line -match '^DB_PASSWORD=(.*)') { $dbPass = $matches[1] }
        if ($line -match '^DB_NAME=(.+)') { $dbName = $matches[1] } # legacy
        if ($line -match '^DB_USER=(.+)') { $dbUser = $matches[1] }   # legacy
        if ($line -match '^DB_PASS=(.*)') { $dbPass = $matches[1] }   # legacy
    }
}
$mysqlArgs = @("-u$dbUser")
if ($dbPass) { $mysqlArgs += "-p$dbPass" }
$mysqlArgs += "-e", "CREATE DATABASE IF NOT EXISTS $dbName;"
& $MYSQL $mysqlArgs
if ($LASTEXITCODE -ne 0) { Write-Fail "Failed to create database!"; exit 1 }
Write-OK "Database created or already exists"

    # Ensure Composer dependencies are installed so artisan and vendor/autoload.php exist
    $autoloadFile = Join-Path $API_DIR "vendor\autoload.php"
    if (-not (Test-Path $autoloadFile)) {
        Write-Step "Composer dependencies missing - installing..."
        $composerCmd = (Get-Command composer -ErrorAction SilentlyContinue).Source
        if ($composerCmd) {
            Write-Info "Running 'composer install' using system composer..."
            Push-Location $API_DIR
            & $composerCmd install --no-interaction --prefer-dist
            $composerExit = $LASTEXITCODE
            Pop-Location
        } else {
            $composerPhar = Join-Path $API_DIR "composer.phar"
            if (Test-Path $composerPhar) {
                Write-Info "Running 'php composer.phar install'..."
                Push-Location $API_DIR
                & $PHP $composerPhar install --no-interaction --prefer-dist
                $composerExit = $LASTEXITCODE
                Pop-Location
            } else {
                Write-Warn "Composer not found. Please install Composer or add composer.phar to Api/ and re-run setup.";
                Pop-Location
                exit 1
            }
        }
        if ($composerExit -ne 0) { Write-Fail "composer install failed (exit code: $composerExit)"; exit 1 }
        Write-OK "Composer dependencies installed"
    }

Write-Info "Running migrations (includes seeding)..."
& $PHP -d display_startup_errors=0 -d display_errors=0 ".\tools\migrate.php"
if ($LASTEXITCODE -ne 0) { Write-Fail "Migration failed!"; exit 1 }
Write-OK "Migrations (and seeding) completed by migrate script"
Pop-Location

Copy-SeededImageAssets -RootPath $ROOT -SeedFile (Join-Path $API_DIR "sql\seed.sql")

# --- Frontend Installation ---
Write-Step "Installing Frontend dependencies..."
Push-Location $FRONT_DIR
if (-not (Test-Path "node_modules")) {
    Write-Info "Running 'npm install' for the first time..."
    & npm install
    if ($LASTEXITCODE -ne 0) { Write-Fail "npm install failed!"; exit 1 }
} else {
    Write-OK "node_modules already exists"
}
Pop-Location

# --- Start Servers ---
Write-Step "Launching servers..."
$stopExisting = $ForceRestart.IsPresent
if ($stopExisting) {
    Write-Info "Force restart enabled: stopping existing Homeverse processes first..."
    Stop-ProcessOnPort -Port $BackendPort
    Stop-ProcessOnPort -Port $FrontendPort
}

$backUsed = Get-NetTCPConnection -LocalPort $BackendPort -ErrorAction SilentlyContinue
if ($backUsed) { Write-Warn "Port $BackendPort is in use. Skipping backend start." }
else {
    # Run PHP directly so PowerShell does not depend on cmd parsing.
    Start-Process -FilePath $PHP -ArgumentList @(
        '-d', 'display_startup_errors=0',
        '-d', 'display_errors=0',
        '-S', "127.0.0.1:$BackendPort",
        '-t', 'public',
        'public/router.php'
    ) -WorkingDirectory $API_DIR
    Write-OK "Backend API server started in a new window"
}

$frontUsed = Get-NetTCPConnection -LocalPort $FrontendPort -ErrorAction SilentlyContinue
if ($frontUsed) { Write-Warn "Port $FrontendPort is in use. Skipping frontend start." }
else {
    # Run Next.js through cmd.exe so npm is executed as a command, not opened as a file.
    Start-Process -FilePath "cmd.exe" -ArgumentList @(
        '/k',
        'npm run dev'
    ) -WorkingDirectory $FRONT_DIR
    Write-OK "Frontend Next.js server started in a new window"
}

$backendReady = $backUsed -or (Wait-ForPort -Port $BackendPort -Name 'Backend API' -TimeoutSeconds 60)
$frontendReady = $frontUsed -or (Wait-ForPort -Port $FrontendPort -Name 'Frontend app' -TimeoutSeconds 120)

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host " Setup Complete! Homeverse is now live." -ForegroundColor Green
Write-Host "------------------------------------------------------------" -ForegroundColor Green
Write-Host " Frontend:  http://localhost:$FrontendPort" -ForegroundColor White
Write-Host " API Docs:  http://localhost:$BackendPort/docs.html" -ForegroundColor White
Write-Host " API     :  http://localhost:$BackendPort/" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green

if (-not $backendReady -or -not $frontendReady) {
    Write-Fail "Skipping browser launch because one or more servers did not become ready."
    exit 1
}

if (-not $SkipBrowser) {
    Start-Process "http://localhost:$FrontendPort"
    Write-Info "Opening frontend in default browser..."
    Start-Process "http://localhost:$BackendPort/docs.html"
    Write-Info "Opening API docs in default browser..."
}
