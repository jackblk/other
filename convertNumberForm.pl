# Convert number to bin/octan/dec/hex.
# Use warnings
use warnings;

# Constants
$regInt = qr/^\d+$/;
$regBin = qr/^0b[01]+$/i;
$regOct = qr/^0\d+$/;
$regHex = qr/^0x[0-9A-F]+$/i;
%data = (0=>0, 1=>1, 2=>2, 3=>3, 4=>4, 5=>5, 6=>6, 7=>7, 8=>8, 9=>9, 10=>'A', 11=>'B', 12=>'C', 13=>'D', 14=>'E', 15=>'F');
%choicesOut = (	1=>[2,'binary','0b'],
				2=>[8,'octal','0'],
				3=>[10,'decimal',''], 
				4=>[16,'hexadecimal','0x']
				);

# Input
while (1) {
	print '
Enter a number in valid form.
Oct form: "0YYYY"; Hex form: "0xYYYY"
Bin form: "0bYYYY"; Dec form: "YYYY".
The amount of Y is unlimited.

Number = ';
	chomp($input = uc <STDIN>);
	
	#Check if valid input
	if (checkValid($input, $regHex)) {
		$input = convert2Dec($input,16);
		last;
	}
	elsif (checkValid($input, $regBin)) {
		$input = convert2Dec($input,2);
		last;
	}
	elsif (checkValid($input, $regOct)) {
		$input = convert2Dec($input,8);
		last;
	}
	elsif (checkValid($input, $regInt)) {
		last;
	}
	print "$input is not a valid number.\n\n";
}

# Choose form to convert
print "\nChoose a form to convert to:
1. Bin\n2. Oct\n3. Dec\n4. Hex\n";

while (1) {
	chomp($chosenForm = <STDIN>);
	if (((checkValid($chosenForm, $regInt))&&($chosenForm>0))&&($chosenForm<5)) {
		last;
	};
	print "Enter valid number please: ";
}


# Display converted num.
print "\nNumber in $choicesOut{$chosenForm}->[1] is: $choicesOut{$chosenForm}->[2]", convertNum($input,$choicesOut{$chosenForm}->[0]), "\n";

# ====================== Functions =====================

# Check if valid (var, regex)
sub checkValid{
	if ($_[0] =~ $_[1]) {
		return 1;
	}
	else {
		return 0;
	}
}

# Convert number to dec form (input, form)
sub convert2Dec {
	my %dataRev = reverse %data;
	my @numIn = split //, reverse $_[0];
	my $form = $_[1];
	my $formReduction = 2;
	my $numInLeng = scalar @numIn;
	my $result = 0;

	if ($form == 8) { $formReduction = 1; }

	for (my $i=0; $i<($numInLeng-$formReduction); $i++) {
		$result += $dataRev{$numIn[$i]}*($form**$i);
	}
	return $result;
}

# Convert dec to chosen form (input decimal, form)
sub convertNum {
	my $dec = $_[0];
	my $form = $_[1];
	my $result;

	while ($dec >= 1) {
		my $remainder = $dec % $form;
		$result .= $data{$remainder};
		$dec = $dec/$form;
	}

	$result = reverse $result;
	return $result;
}
