        
<?php require 'template/header.html'; ?>

	<h1>Kalorientabelle</h1>
        <p>
            <table class="table">
                <thead>
                    <tr>
                        <th>Art</th>
                        <th>Typ</th>
                    	<th>Kal</th>
			<th>Eiweiss</th>
			<th>Fett</th>
			<th>KH</th>
			<th>BE</th>
		    </tr>
                </thead>
                <tbody>
                    <?php
                        while($row = $stms->fetch(PDO::FETCH_ASSOC)){
                        	echo "<tr>";
				echo "<td>". $row['Typetxt']  ."</td>";
                            	echo "<td>". $row['Lebensmittel']  ."</td>";
				echo "<td>". $row['Kal']  ."</td>";
				echo "<td>". $row['Eiweiss']  ."</td>";
				echo "<td>". $row['Fett']  ."</td>";
				echo "<td>". $row['KH']  ."</td>";
				echo "<td>". $row['BE']  ."</td>";
				echo "</tr>";
                        } 
                    ?>
                    
                </tbody>
                
            </table>
            
        
  
            
        </p>

<?php require 'template/footer.html'; ?>

