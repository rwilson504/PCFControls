# ## Create a copy of the original files in the Other Folder.
# if (-Not (Test-Path "$PSScriptRoot\temp")) 
# { 
#     md .\temp\Other
# }
# copy .\AzureMapsGrid\AzureMapsGridControl\*.* .\temp -Force
# copy .\AzureMapsGrid\AzureMapsGridControl\Other\*.* .\temp\Other -Force

## Unpack the solution from the server
# $solutionPackager = (Get-ChildItem ..\Tools -Include SolutionPackager.exe -Recurse | Sort-Object FullName -Descending | Select -First 1).FullName
# write-host "Using" $solutionPackager
# &$solutionPackager /action:Extract /zipFile:"AzureMapsGridControl" /folder:".\\AzureMapsGrid\\AzureMapsGridControl" /nologo /log:packagerlog.txt /allowDelete:No /allowWrite:Yes /packagetype:Both

$spkl = (Get-ChildItem ..\Tools -Include spkl.exe -Recurse | Sort-Object FullName -Descending | Select -First 1).FullName
write-host "Using" $spkl
&$spkl unpack spkl.json $args

## Put back the original solution and customization xml files or the pac will not build correctly.
# copy .\temp\*.* .\AzureMapsGrid\AzureMapsGridControl
# copy .\temp\Other\Customizations.xml .\AzureMapsGrid\AzureMapsGridControl\Other -Force
# copy .\temp\Other\Solution.xml .\AzureMapsGrid\AzureMapsGridControl\Other -Force
#Remove-Item .\temp -Force -Recurse