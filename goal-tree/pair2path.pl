#!/usr/bin/perl

my %hash = ();
my @leaves = ();

open(IN, "goals.tsv");
while(<IN>) {
    s/\s+$//;
    my @tokens = split(/\t/);
    $hash{$tokens[1]} = $tokens[0];
    push(@leaves, $tokens[1]);
    $leaves_hash{$tokens[1]} = 1;
    $leaves_hash{$tokens[0]} = 0;
}

print "\"node0\",\"node1\",\"node2\",\"node3\",\"node4\",\"node5\",\"size\"\n";

my $max = 0;
foreach $leaf (@leaves) {    
    if ($leaves_hash{$leaf}) {
	my @path = ();
      loop:
	for (my $node = $leaf; $node; $node = $hash{$node}) { 
	    if (grep(/$node/, @path)) {
		last loop;
	    }
	    unshift @path, $node;	    
	}
	if ($path[0] eq "\"震災復興\"") {
	    for (my $i = 0; $i < 6; $i++) {
		if ($i > 0) { print ",";}
		if ($i < @path) {
		    my $node = $path[$i];
		    print "$node";
		} else {
		    print "\"\"";
		}
	    }
	    print ",\"10\"\n";
	    if (@path > $max) {
		$max = @path;
	    }
	}
    }
}
print $max;

