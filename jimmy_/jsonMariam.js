var objTest = (
{
	"biliothèque": {
		"etagère1": {
			"attribut":{
				"numero":"etage1",
				"categorie":"histoire des sciences",
				"type contenu":"livre"
			},
			"données": [
				{
					"titre":"La belle et la bête",
					"auteurs":  [
						{"nom":"auteur1","prenom":"prenom1"},
						{"nom":"auteur2","prenom":"prenom2"}
					],
					"editeurs": [
						{"nom":"editeur1","prenom":"prenom1"},
						{"nom":"auteur2","prenom":"prenom2"}
					],
					"date d'edition":"1980",
					"langue":"français"
				},
				{
					"titre":"titre2",
					"auteurs":  [
						{"nom":"auteur1","prenom":"prenom1"},
						{"nom":"auteur2","prenom":"prenom2"}
					],
					"editeurs": [
						{"nom":"editeur1","prenom":"prenom1"},
						{"nom":"auteur2","prenom":"prenom2"}
					],
					"date d'edition":"1980",
					"langue":"français"

				}
				{
					"titre":"titre3",
					"auteurs":  [
						{"nom":"auteur1","prenom":"prenom1"},
						{"nom":"auteur2","prenom":"prenom2"}
					],
					"editeurs": [
						{"nom":"editeur1","prenom":"prenom1"},
						{"nom":"auteur2","prenom":"prenom2"}
					],
					"date d'edition":"1980",
					"langue":"anglais"

				}
			]
		},
		{
			"etagère2": {
				"attribut":{
					"numero":"etage2",
					"categorie":"sociologie",
					"type contenu":"revues de presse"
				},
				"données":[
					{
						"auteurs":  [
							{"nom":"auteur1","prenom":"prenom1"},
							{"nom":"auteur2","prenom":"prenom2"}
						],
						"date d'edition":"1980",
						"theme":"theme1",
						"langue":"anglais"
					},
					{

						"auteurs":  [
							{"nom":"auteur1","prenom":"prenom1"},
							{"nom":"auteur2","prenom":"prenom2"}
						],
						"date d'edition":"1980",
						"theme":"theme2",
						"langue":"français"
					}

				]
			}
		},
		{	  
			"etagère3": {
				"attribut":{
					"numero":"etage3",
					"categorie":"histoire",
					"type contenu":"manuscrits"
				},
				"données": [
					{
						"titre":"title1",
						"date d'edition":"1945",
						"langue":"français"
					},
					{
						"titre":"title2",
						"date d'edition":"1905",
						"langue":"anglais"
					}
				]
			}
		},
		{
			"etagère4": {
				"attribut":{
					"numero":"etage4",
					"categorie":"documentaire",
					"type contenu":"multimedia"
				},
				"données": [
					{
						"titre":"LE BON PERE",
						"auteurs":  [
							{"nom":"","prenom":""},
							{"nom":"","prenom":""}
						],
						"date d'edition":"1961", 
						"type":"sound" ,
						"description":"1 disque : 45 t ; 17 cm",
						"format":" BnF-Partenariats, Collection sonore - Believe "
					},
					{
						"titre":"Ma mère l'oye",
						"auteurs":  [
							{"nom":"Ravel","prenom":"Maurice"},
							{"nom":" Cluytens","prenom":" André"}
						],
						"date d'edition":"196",
						"type":"sound",
						"description":"1 disque : 33 t ; 30 cm ",
						"format":" BnF-Partenariats, Collection sonore - Believe "
					}
				]    
			]
		}
);
console.log(objTest);