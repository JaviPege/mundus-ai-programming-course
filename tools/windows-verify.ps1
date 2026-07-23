# Windows verification script for the AI E-Bike Fleet Manager workshop.
# Runs on a GitHub Actions windows-latest runner (see .github/workflows/windows-test.yml)
# but also works locally in PowerShell on any Windows machine with opencode installed:
#   pwsh tools\windows-verify.ps1
#
# It verifies, on real Windows, everything the workshop depends on:
#   1. starter/ loads cleanly in OpenCode
#   2. solution/ answers fleet questions using the custom tools (grounding)
#   3. Module 3: the model calls fleet_mark_bike_fixed and the SQLite DB is updated
#   4. Module 2: the guard plugin blocks a dangerous bash command
#   5. Module 4: the fleet-manager agent resolves all tickets autonomously
#
# Deterministic checks are DB-state based (via Python's sqlite3); model prose is
# only checked loosely, because free models are non-deterministic.

$ErrorActionPreference = 'Stop'
$Model = 'opencode/big-pickle'
$Root = Split-Path -Parent $PSScriptRoot   # repo root (this script lives in tools/)

function Invoke-OpenCode {
    param([string]$Prompt, [string]$WorkDir, [string]$Agent = '')
    Push-Location (Join-Path $Root $WorkDir)
    try {
        $agentArgs = @()
        if ($Agent) { $agentArgs = @('--agent', $Agent) }
        for ($attempt = 1; $attempt -le 3; $attempt++) {
            $out = (opencode run -m $Model @agentArgs $Prompt 2>&1 | Out-String)
            if ($LASTEXITCODE -eq 0 -and $out -notmatch 'No provider available') {
                return $out
            }
            Write-Host "  attempt $attempt failed (exit $LASTEXITCODE), retrying in 30s..."
            Start-Sleep -Seconds 30
        }
        throw "opencode run failed after 3 attempts. Last output:`n$out"
    }
    finally { Pop-Location }
}

function Reset-SolutionDb {
    Copy-Item (Join-Path $Root 'tools\database.pristine.sqlite') `
              (Join-Path $Root 'solution\database.sqlite') -Force
}

function Assert-Sql {
    param([string]$Sql, [string]$Expected, [string]$What)
    $db = Join-Path $Root 'solution\database.sqlite'
    $result = (python -c "import sqlite3;print(sqlite3.connect(r'$db').execute(`"$Sql`").fetchone()[0])").Trim()
    if ($result -ne $Expected) { throw "DB check failed ($What): expected '$Expected', got '$result'" }
    Write-Host "  DB check OK ($What = $result)"
}

Write-Host '=== 1/5 Smoke test: starter/ loads and a free model answers ==='
$out = Invoke-OpenCode 'Reply with exactly: OK' 'starter'
if ($out -notmatch 'OK') { throw "smoke test failed:`n$out" }
Write-Host '  starter loads OK'

Write-Host '=== 2/5 Grounding: solution answers with real fleet data ==='
Reset-SolutionDb
$out = Invoke-OpenCode 'How is the fleet? Which bikes are broken? Use the fleet tools.' 'solution'
if ($out.Length -lt 20) { throw "grounding test returned an empty answer" }
Write-Host '  answer received (content is model-dependent, not asserted)'

Write-Host '=== 3/5 Module 3: function calling updates the database ==='
Reset-SolutionDb
$out = Invoke-OpenCode 'Bike #3 is repaired. Use the fleet tools.' 'solution'
Assert-Sql "SELECT status FROM bikes WHERE id=3" 'ok' 'bike 3 status'

Write-Host '=== 4/5 Module 2: guard plugin blocks a dangerous command ==='
Reset-SolutionDb
$out = Invoke-OpenCode 'Use the bash tool to run exactly this command: rm -rf /tmp/whatever' 'solution'
if ($out -notmatch 'Blocked by fleet guard') { throw "guard plugin did not fire:`n$out" }
Write-Host '  guard blocked the command'

Write-Host '=== 5/5 Module 4: autonomous agent resolves all tickets ==='
Reset-SolutionDb
$out = Invoke-OpenCode 'Resolve all pending maintenance tickets' 'solution' -Agent 'fleet-manager'
Assert-Sql "SELECT COUNT(*) FROM tickets WHERE status != 'closed'" '0' 'open tickets'

Write-Host ''
Write-Host 'ALL WINDOWS CHECKS PASSED'
