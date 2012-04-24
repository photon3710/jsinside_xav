/*
 * spec.camera : position de la caméra. defaut : [0,0,0]
 * spec.theta : angle horizontal en radians. defaut : 0
 * spec.phi : angle vertical en radians. defaut : 0
 * spec.angle : angle de vue en degrés. Utilisé pour la matrice de projection. defaut : 45
 * spec.zMin : zMin de la matrice de projection. defaut : 1
 * spec. zMax : zMax de la matrice de projection. defaut : 10
 * spec.a : rapport L/H du canvas. defaut : CV.width/CV.height
 */
var VUE;
var Vue=(function() {
    return {
        instance: function(spec) {
            spec.camera=spec.camera || [0,0,0];
            spec.theta=spec.theta || 0;
            spec.phi=spec.phi ||0;
            spec.angle=spec.angle || 45;
            spec.zMin=spec.zMin || 1;
            spec.zMax=spec.zMax || 10;
            spec.a=CV.width/CV.height;

            var matrice_vue=lib_matrix4.get_I4();
            var matrice_projection=lib_matrix_projection.get(spec.angle, spec.a, spec.zMin, spec.zMax);
           
            var calcule_matrice=function() {
                lib_matrix4.set_I4(matrice_vue);                
                lib_matrix_rot4.rotateZ(matrice_vue, spec.theta);
                lib_matrix_rot4.rotateX(matrice_vue, spec.phi);
                lib_matrix_mv.translateRot(matrice_vue, spec.camera);
            }

            var that={
                draw: function() {
                    SHADERS.set_matriceVue(matrice_vue);
                },
                drawPhysics: function() {

                }
            }
            calcule_matrice();
            SHADERS.set_matriceProjection(matrice_projection);
            VUE=that;
            return that;
        }
    };
})();

