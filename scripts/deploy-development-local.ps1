param(
  [string]$ServerHost = "85.31.237.111",
  [string]$ServerUser = "root",
  [string]$ServerPort = "22",
  [string]$AppRoot = "/home/nexgen-academy-development/htdocs/development.nexgen-academy.com",
  [string]$Pm2AppName = "nexgen-development-website",
  [string]$Port = "6060",
  [string]$SshKeyPath = ""
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$releaseSha = try {
  (git -C $repoRoot rev-parse --short=12 HEAD).Trim()
} catch {
  Get-Date -Format "yyyyMMddHHmm"
}

$archiveName = "website-release-$releaseSha.tgz"
$localArchive = Join-Path ([System.IO.Path]::GetTempPath()) $archiveName
$remoteArchive = "$AppRoot/_deploy/incoming/$archiveName"
$remoteScript = "$AppRoot/_deploy/deploy-development-website.sh"
$remote = "${ServerUser}@${ServerHost}"

$sshArgs = @(
  "-p", $ServerPort,
  "-o", "StrictHostKeyChecking=accept-new",
  "-o", "ConnectTimeout=20",
  "-o", "ServerAliveInterval=15",
  "-o", "ServerAliveCountMax=2"
)

$scpArgs = @(
  "-P", $ServerPort,
  "-o", "StrictHostKeyChecking=accept-new",
  "-o", "ConnectTimeout=20",
  "-o", "ServerAliveInterval=15",
  "-o", "ServerAliveCountMax=2"
)

if ($SshKeyPath) {
  $sshArgs += @("-i", $SshKeyPath)
  $scpArgs += @("-i", $SshKeyPath)
}

try {
  Write-Host "Creating release archive: $localArchive"
  if (Test-Path $localArchive) {
    Remove-Item -LiteralPath $localArchive -Force
  }

  tar `
    -C $repoRoot `
    --exclude=".git" `
    --exclude=".github" `
    --exclude=".next" `
    --exclude="node_modules" `
    --exclude="Website.rar" `
    --exclude="*.log" `
    -czf $localArchive .

  Write-Host "Preparing remote deploy directory"
  ssh @sshArgs $remote "mkdir -p '$AppRoot/_deploy/incoming'"

  Write-Host "Uploading deploy script"
  scp @scpArgs (Join-Path $repoRoot "scripts/deploy-development-website.sh") "${remote}:$remoteScript"

  Write-Host "Uploading release archive"
  scp @scpArgs $localArchive "${remote}:$remoteArchive"

  Write-Host "Running remote deploy"
  ssh @sshArgs $remote "bash '$remoteScript' '$AppRoot' '$remoteArchive' '$releaseSha' '$Pm2AppName' '$Port'"

  Write-Host "Done. Development website deployed to $AppRoot on port $Port."
} finally {
  if (Test-Path $localArchive) {
    Remove-Item -LiteralPath $localArchive -Force
  }
}
