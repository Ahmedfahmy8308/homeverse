// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

# Convert all .md files from markdown/ to .docx in pandoc docs/
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$baseDir = Split-Path -Parent $scriptDir
$pandoc = "$env:LOCALAPPDATA\Pandoc\pandoc.exe"
$mdDir = Join-Path $baseDir "markdown"
$outDir = Join-Path $baseDir "pandoc docs"
$refDir = Join-Path $baseDir "docs"

if (-not (Test-Path $pandoc)) {
    # Check system PATH if not in LOCALAPPDATA
    $pandocCmd = Get-Command pandoc -ErrorAction SilentlyContinue
    if ($pandocCmd) {
        $pandoc = $pandocCmd.Source
    } else {
        Write-Host "ERROR: Pandoc not found at $pandoc or in PATH" -ForegroundColor Red
        Write-Host "Install pandoc from https://pandoc.org/installing.html"
        pause
        exit 1
    }
}

if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$files = Get-ChildItem "$mdDir\*.md" -ErrorAction SilentlyContinue
if (-not $files) {
    Write-Host "No .md files found in $mdDir" -ForegroundColor Yellow
    pause
    exit 0
}

Write-Host "Converting Markdown to Word documents..." -ForegroundColor Cyan
Write-Host ""

Push-Location $mdDir
foreach ($file in $files) {
    $outFile = Join-Path $outDir ($file.BaseName + ".docx")
    $refFile = Join-Path $refDir ($file.BaseName + ".docx")
    
    # Optional image path replacement could go here if needed.
    
    if (Test-Path $refFile) {
        Write-Host "  $($file.Name) -> $($file.BaseName).docx (with original styles)" -ForegroundColor White
        & $pandoc $file.FullName -f markdown+pipe_tables+grid_tables+native_divs+native_spans+raw_html+header_attributes -t docx -o $outFile --reference-doc="$refFile" --resource-path="$mdDir"
    } else {
        Write-Host "  $($file.Name) -> $($file.BaseName).docx (default styles)" -ForegroundColor White
        & $pandoc $file.FullName -f markdown+pipe_tables+grid_tables+native_divs+native_spans+raw_html+header_attributes -t docx -o $outFile --resource-path="$mdDir"
    }
    if ($LASTEXITCODE -ne 0) {
        Write-Host "    FAILED" -ForegroundColor Red
    }
}
Pop-Location

Write-Host ""
Write-Host "Done! Word files saved to: $outDir" -ForegroundColor Green
pause
