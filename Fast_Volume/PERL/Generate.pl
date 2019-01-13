use warnings;
use strict;

use Win32::Shortcut;
use Cwd qw(abs_path);
use POSIX;
my $abs_path = abs_path;
while (1) {
	print "Insert volume percentage you want to create shortcut: ";
	chomp(my $input = <STDIN>);
	# Valid = check all these conditions
	if (($input =~ /^([1-9]\d*)|([0]+)$/i)&($input < 100)&($input >= 0)) {
		createShortcut($input);
		next;
	}
	print "Please insert correct number (0-100).\n";
}
sub createShortcut {
	my $LINK;
	my $vol = floor($_[0]/100*65535);
	$LINK = Win32::Shortcut->new();
	$LINK->{'Path'} = "$abs_path\\nircmd.exe";
	$LINK->{'Arguments'} = "setsysvolume $vol";
	$LINK->{'WorkingDirectory'} = $abs_path;
	$LINK->{'Description'} = "Set the volume to $_[0] percent";
	$LINK->{'ShowCmd'} = SW_SHOWMAXIMIZED;
	$LINK->Save("Vol_$_[0].lnk");
	$LINK->Close();
	print "Shortcut for $_[0] percent volume created successfully!\n\n";
}
