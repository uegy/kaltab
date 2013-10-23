/**
 * LinkedSelection ist ein Klasse zur Steuerung dynamisch verketteter Auswahllisten
 * @param inputSelects ein Array mit den IDs der Auswahllisten in hierarchischer Reihenfolge
 *						Bsp: [ 'select1', 'select2', 'select3' ]
 * @param callback Funktion, welche beim Abschlie�en (und �ndern) der Auswahl aufgerufen werden soll
 * @param data das Daten-Objekt in JSON
 *						Bsp: { 'select1':['wert1','text1'], 'select2':['wert5','text5'] }
 **/
function LinkedSelection( inputSelects, callback, data )
{
	var self = this;				/* um aus EventHandlern auf diese Instanz zugreifen zu k�nnen */
	var selects = new Array();		/* Liste der verketteten Auswahllisten */

	/**
	 * Die Funktion changeHandler wird dem onchange-Handler jeder Auswahlliste zugewiesen.
	 * Wenn eine g�ltige Auswahl getroffen wurde, soll entweder die als n�chste
	 * Auswahlliste (nextSelect) bekannte Auswahlliste mit Daten bef�llt werden,
	 * oder die Callback-Funktion ausgef�hrt werden.
	 **/
	var changeHandler = function()
	{
		var value = this.selectedValue();

		// Auf die n�chste Auswahlliste folgende Auswahllisten m�ssen wieder
		// in den default-Zustand versetzt werden
		if( typeof(this.nextSelect) == 'object' )
		{
			for( var i = this.nextSelect.selectID + 1; i < selects.length; i++ )
				selects[i].replaceOptions( new Array() );
		}

		// Abbrechen, wenn ein Dummy-Wert ausgew�hlt wurde
		if( value == '--' )
		{
			if( this.selectID < selects.length )
				selects[ this.selectID +1 ].replaceOptions( new Array() );

			return;
		}

		if( typeof(this.nextSelect) == 'object' )
		{
			/*
			 * nextSelect ist eine Auswahlliste
			 */

			// Wenn keine Daten zur gemachten Auswahl zur Verf�gung stehen,
			// m�ssen wir sicherstellen, dass wir auf keine nicht vorhandenen Objekte zugreifen.
			if( !data[ this.nextSelect.id ][ value ] )
			{
				if( !data[ this.nextSelect.id ] )
					data[ this.nextSelect.id ] = {};

				data[ this.nextSelect.id ][ value ] = new Array();
			}

			// Neue Optionen in der n�chsten Auswahlliste setzen
			this.nextSelect.replaceOptions( data[ this.nextSelect.id ][ value ] );

			// Wenn die Auswahlstrecke nicht beendet ist, muss die Callback-Funktion
			// dennoch aufgerufen werden, damit entsprechend auf �nderungen
			// reagiert werden kann.
			callback( new Array() );
		}
		else
		{
			/*
			 * Die Auswahlstrecke ist absolviert
			 */

			// Wahlen der einzelnen Listen in ein Array schreiben um
			// dieses an die Callback-Funktion zu �bergeben.
			var selected = new Array();
			for( var i = 0; i < selects.length; i++ )
			{
				selected.push( { 'id' : selects[i].id,
								 'value': selects[i].selectedValue(),
								 'text' : selects[i].selectedText() } );
			}
			callback( selected );
		}
	};

	/**
	 * replaceOptions ersetzt die aktuellen Optionen der Auswahlliste durch
	 * die im Array newOptions gelieferten Daten. Wenn ein leeres Array �bergeben
	 * wird, wird die default-Option "--" gesetzt.
	 * @param newOptions ein Array mit den neuen Optionen
	 *					  Bsp: [ ['value1','text1'], ['value2','text2'], ]
	 **/
	var replaceOptions = function( newOptions )
	{
		/*
		 * Diese Funktion setzt bewusst DOM-Methoden ein und verzichtet
		 * auf die vom Options-Objekt gegebenen M�glichkeiten.
		 */

		// alte Optionen der Auswahlliste l�schen
		var opts = this.getElementsByTagName( 'option' );
		while( opts.length > 0 )
			this.removeChild( opts[0] );

		// wenn keine neuen Optionen �bergeben wurden, default-Option setzen
		// andernfalls "Bitte w�hlen" voranstellen
		if( newOptions.length == 0)
			this.addOption( '--', '------' );
		else
			this.addOption( '--', 'Bitte waelen:' );

		// neue Optionen in die Auswahlliste schreiben
		for( var i = 0; i < newOptions.length; i++ )
			this.addOption( newOptions[i][0], newOptions[i][1] );
	};

	/*
	 * F�gt der Auswahlliste eine neue Option hinzu
	 * @param value Wert der neuen Option
	 * @param text Name der neuen Option
	 */
	var addOption = function( value, text )
	{
		var opt = document.createElement( 'option' );
		opt.value = value;
		opt.appendChild( document.createTextNode( text ) );
		this.appendChild( opt );
	};

	/**
	 * holt den Wert der aktuell gew�hlten Option
	 * @returns den Value der aktuell gew�hlten Option
	 **/
	var selectedValue = function()
	{
		return this.options[ this.selectedIndex ].value;
	};

	/**
	 * holt den Text (Name) der aktuell gew�hlten Option
	 * @returns den Text der aktuell gew�hlten Option
	 **/
	var selectedText = function()
	{
		return this.options[ this.selectedIndex ].text;
	};

	/**
	 * Selektiere die Option mit dem Wert value, wenn keine Option mit dem Wert
	 * value existiert, wird die Auswahl nicht ge�ndert.
	 * @param value der Wert den eine Option haben muss, um ausgew�hlt zu werden.
	 **/
	var selectByValue = function( value )
	{
		for( var i = 0; i < this.options.length; i++ )
		{
			if( this.options[i].value == value )
				this.selectedIndex = i;
		}
	}

	/**
	 * Initialisiere den Manager f�r verkettete Auswahllisten.
	 * Findet Auswahllisten anhand der (per inputSelects) bekannten IDs.
	 * Best�ckt die Auswahllisten mit den n�tigen Funktionen und Event-Handlern
	 **/
	this.init = function()
	{
		// best�cke bestehende selects
		for( var i = 0; i < inputSelects.length; i++ )
		{
			var t = document.getElementById( inputSelects[i] );

			// ignoriere falsche IDs
			if(!t)
				continue;

			// neue Funktionen und Event-Handler zuweisen und in selects registrieren
			t.replaceOptions = replaceOptions;
			t.addOption = addOption;
			t.selectedValue = selectedValue;
			t.selectedText = selectedText;
			t.selectByValue = selectByValue;
			t.selectID = selects.length;
			t.onchange = changeHandler;
			selects.push( t );

			// registriere Auswahlliste als nextSelect bei der vorhergehenden
			if( selects.length > 1 )
				selects[ selects.length-2 ].nextSelect = t;
		}
	};

	// initialisieren!
	this.init();
}
