<#
	.SYNOPSIS 
    Downloads the Spkl Tools to "$PSScriptRoot\..\Tools"

	.NOTES  
    File Name  : DownloadTools.ps1  

    .INPUTS
    None. You cannot pipe objects to DownloadTools.ps1.

    .OUTPUTS
    None. DownloadTools.ps1 does not generate any output.

    .EXAMPLE
    C:\PS> .\DownloadTools.ps1
#>

$sourceNugetExe = "https://dist.nuget.org/win-x86-commandline/latest/nuget.exe"
$targetNugetExe = ".\nuget.exe"
Invoke-WebRequest $sourceNugetExe -OutFile $targetNugetExe
Set-Alias nuget $targetNugetExe -Scope Global -Verbose

if ((Test-Path "$PSScriptRoot\Tools") -and (Test-Path "$PSScriptRoot\Tools\spkl")) 
{
    Write-Host "Tools already downloaded."
    exit;        
}

##
##Download spkl
##
./nuget install Microsoft.CrmSdk.CoreTools -O .\Tools
./nuget install spkl-raw -Source "https://pkgs.dev.azure.com/rickwilson/GitHub-rwilson504/_packaging/rwilson504/nuget/v3/index.json" -O .\Tools
md .\Tools\spkl
$spklToolsFolder = Get-ChildItem ./Tools | Where-Object {$_.Name -Match '^spkl-raw[.]'}
Write-Host $spklToolsFolder
move .\Tools\$spklToolsFolder\tools\*.* .\Tools\spkl
Remove-Item .\Tools\$spklToolsFolder -Force -Recurse

##
## Download CoreTools
##
# ./nuget install Microsoft.CrmSdk.CoreTools -O .\Tools
# md .\Tools\CoreTools
# $coreToolsFolder = Get-ChildItem ./Tools | Where-Object {$_.Name -Match '^Microsoft.CrmSdk.CoreTools[.]'}
# Write-Host $coreToolsFolder
# move .\Tools\$coreToolsFolder\content\bin\coretools\*.* .\Tools\CoreTools
# Remove-Item .\Tools\$coreToolsFolder -Force -Recurse

##
##Remove NuGet.exe
##
Remove-Item nuget.exe    