=head1
Ma soi - Werewolf BOT

Roles:
(1)	Villager
(2) Werewolf
(3) Protector
(4) Wizard
(5) Oracle
(6) Hunter
(7) Cupid
(8)	Half_Wolf
=cut

=head2
Players - Num of roles
6
2 x Villager
1 x Protector
1 x Werewolf
1 x Oracle
1 x Half_Wolf

7
2 x Villager
2 x Werewolf
1 x Protector
1 x Oracle
1 x Cupid
=cut

# Use stuff... for debug
use warnings;
use strict;

# Use libraries, if needed
use Data::Dumper qw(Dumper);

# Global variables
my ($numPlayers,	%playerTables);
my %counter = (
'counterPlayer' => 0,
'counterRole'	=> 0
);
my %roles = (
6 => {
	'Villager' 	=>	2,
	'Werewolf' 	=>	1,
	'Protector'	=>	1,
	'Wizard'	=>	0,
	'Oracle'	=>	1,
	'Hunter'	=>	0,
	'Cupid'		=>	0,
	'Half_Wolf'	=>	1
},
7 => {
	'Villager' 	=>	2,
	'Werewolf' 	=>	2,
	'Protector'	=>	1,
	'Wizard'	=>	0,
	'Oracle'	=>	1,
	'Hunter'	=>	0,
	'Cupid'		=>	1,
	'Half_Wolf'	=>	0
}
);


# ====================== Data collecting ===================== #

# Insert number of players
print "How many players are there? ";
while (1) {
	chomp($numPlayers = <STDIN>);
	if (($numPlayers =~ /^\d+$/i) and ($numPlayers >5)) {
		last;
	}
}

# Create hash for players | from 0 to numPlayers-1
for (my $temp = 0; $temp < $numPlayers; $temp++) {
	$playerTables{$temp} = "NONE";
}

# Print out roles & assign roles
print "\nThere are $numPlayers players, these are the roles:\n";
foreach my $temp (sort keys %{$roles{$numPlayers}}) {
	$counter{counterRole} = $roles{$numPlayers}{$temp};
	if ($counter{counterRole} >0) {
		while ($counter{counterRole} > 0) {
			while (1) { # Assign role for empty table
				my $randNum = int rand($numPlayers); # Random integer
				if ($playerTables{$randNum} =~ /NONE/i) {
					$playerTables{$randNum} = $temp;
					last;
				}
			}
			$counter{counterPlayer}++;
			$counter{counterRole}--;
		}
		print "\t" . $roles{$numPlayers}{$temp} . " x\t$temp\n";
	}
	else {
		delete $roles{$numPlayers}{$temp}; # Delete unneeded roles.
	}
}

# Entering player's names then assign to table
for (my $temp = 0; $temp < $numPlayers; $temp++) {
	while (1) {
		my $input;
		while (1) { # Enter name & check
			print "Enter the name of player ". ($temp + 1) . ": ";
			chomp($input = <STDIN>);
			if ($input =~ /^.+$/i) {
				last;
			}
		}
		
		if (exists $playerTables{$input}) { # Check if name existed
			print "Player name existed!\n";
			next;
		}
		
		else {
			$playerTables{$input} = delete $playerTables{$temp}; # Swap innital num with real name
			last;
		}
	}		
}

print Dumper \%playerTables; # Check roles

# ==================== Game begins ========================= #

