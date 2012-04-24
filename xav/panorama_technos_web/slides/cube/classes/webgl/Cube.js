/*
 * spec.centre : position du centre du cube. defaut : [0,0,0]
 * spec.l : taille d'une arrete du cube. defaut : 1
 */
var Cube=(function() {
    return {        
        instance: function(spec) {
            spec.l=spec.l || 1;
            spec.centre=spec.centre || [0,0,0];
            var a=spec.l/2,
                c=spec.centre;
            return Objet.instance({maillage: Maillage.instance({
                    vertices: [-a+c[0], -a+c[1], -a+c[2], //position du 1° sommer
                             0,0,0,                      //couleur du 1° sommet (noir)
                             -a+c[0], a+c[1], -a+c[2],
                             1,0,0,
                             a+c[0], a+c[1], -a+c[2],
                             1,1,0,
                             a+c[0], -a+c[1], -a+c[2],
                             0,1,0,
                             -a+c[0], -a+c[1], a+c[2],
                             0,0,1,
                             -a+c[0], a+c[1], a+c[2],
                             1,0,1,
                             a+c[0], a+c[1], a+c[2],
                             1,1,1,
                             a+c[0], -a+c[1], a+c[2],
                             0,1,1
                    ],
                    indices: [0,1,2, 0,2,3, //les 2 triangles de la face 1
                              1,5,6, 1,6,2,
                              3,2,6, 3,6,7,
                              0,4,7, 0,7,3,
                              0,1,5, 0,5,4,
                              4,5,6, 4,6,7
                    ]
            })});
        }
    }
})();


