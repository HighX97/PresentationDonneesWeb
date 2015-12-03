var exJson = (
	[
		{"p1": "v11", "p2": "v21", "p3": "v31"},
		{"p1": "v12", "p2": "v21", "p3": "v32"}
	]
);

function map(json)
{
	var valeurs = {};
	for(var i = 0; json.length; i++ ){
		var properties = Object.keys(json[i]); // properties ["p1", "p2", "p3"]
		for (p = 0; p < properties.length; p++ ){
			var valeur = json[i][p];
			if( valeur[p] === undefined ){
				valeurs[p] = [valeur];
			}
			else if( valeurs[p].indexOf(valeur) != -1 ){
				valeurs[p].push(valeur);
			}
		}
	}
	//console.log(valeurs);
	return JSON.stingfy(valeurs);
}

console.log( map(exJson) );

//créer des intervals pour les valeurs numeriques 