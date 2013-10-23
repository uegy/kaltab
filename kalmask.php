        
<?php require 'template/header.html'; ?>

<?php

// Make a MySQL Connection
mysql_connect("localhost", "kaltab", "cnc390cnc") or die(mysql_error());
mysql_select_db("kaldb") or die(mysql_error());

//ermittle den max Type Wert
$result = mysql_query("SELECT Type FROM kaltab ORDER BY Type DESC LIMIT 0,1;")
or die(mysql_error());  

// speichere das Ergebniss in $row
$row = mysql_fetch_array( $result );
//$row ist ein array, darum in maxt speichern
$maxt = $row[0];

for ($i = 1; $i < $maxt+1; ++$i) {
$result = mysql_query("select Typetxt from kaltab where Type='$i' LIMIT 1;")
or die(mysql_error());
$row = mysql_fetch_array( $result );
$typetext_arr[$i]=$row[0];
}

// Print out the contents of the entry 
//echo "Debug Vars";
//echo "<pre>";
//echo "maxt=";
//print_r($maxt);
//print_r($typetext_arr);
//echo "</pre>";
?>

	<h1>Kalorientabelle Maske</h1>
        <p>
            <!--Input Maske-->
	    <table class="table">
		<thead>
		   <tr>
			<select name="type">
			     <?php
			     for ($i = 1; $i < $maxt+1; ++$i) {
				echo"<option value=$i>$typetext_arr[$i]</option>";
			     }
			     ?>
			</select>

		   </tr>
		</thead>

	    </table>
            <!--Output Tabelle-->
            <table class="table">
                <thead>
                    <tr>
		<!--	<th>Type</th>	-->
                        <th>Typetxt</th>
                        <th>Lebensmittel</th>
                    	<th>Kal</th>
			<th>Eiweiss</th>
			<th>Fett</th>
			<th>KH</th>
			<th>BE</th>
			<th>ID</th>
		    </tr>
                </thead>
            </table>
            
        
  
            
        </p>

<?php require 'template/footer.html'; ?>

