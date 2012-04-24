/*
 * spec.maillage : maillage de l'objet (type Maillage)
 * spec.matrix: matrice de mouvement (defaut : I4)
 */
var Objet=(function() {
    return {
        instance: function(spec) {
            spec.matrix=spec.matrix || lib_matrix4.get_I4();
            var matrix=lib_matrix4.copyNew(spec.matrix);
            var that={
                draw: function() {                    
                    SHADERS.set_matriceObjet(matrix);
                    spec.maillage.draw();
                },
                rotateX: function(dTheta) {
                    lib_matrix_rot4.rotateX(matrix, dTheta);
                },
                rotateY: function(dTheta) {
                    lib_matrix_rot4.rotateY(matrix, dTheta);
                },
                rotateZ: function(dTheta) {
                    lib_matrix_rot4.rotateZ(matrix, dTheta);
                },

                drawPhysics: false,

                set_physics: function(phyFunc) {
                    that.drawPhysics=phyFunc;
                }
            };
            return that;
        }
    }
})();

