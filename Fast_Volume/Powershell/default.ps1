do {
#Input percentage
do {
	write-host -NoNewline "Enter the volume percentage: "
	$input = read-host
	$input = $input -as [uint16]
	$check = ($input -eq $NULL) -or ($input -gt 100)
	if ($check){ #if $check = 1 then FAIL (INVALID NUM)
		write-host "Please enter valid percentage number (0-100): "
	}
}
until (-not $check) # Break loop if $check = 0 (VALID NUM)

$vol = ($input * 655.35) -as [uint16] #Calculate for nircmd

$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($PSScriptRoot + "\Vol_$input.lnk")
$Shortcut.TargetPath = $PSScriptRoot + "\nircmd.exe"
$ShortCut.Arguments="setsysvolume $vol"
$ShortCut.WindowStyle = 7;
$Shortcut.Save()

write-host "Created shortcut for $input% volume`n"
}
until (0)
