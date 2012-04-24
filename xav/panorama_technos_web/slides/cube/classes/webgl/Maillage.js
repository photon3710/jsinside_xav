/*
 * spec.vertices : tableau js des vertex
 * spec.indices : tableau js des indices
 */
var Maillage=(function () {
    return {
        instance: function(spec) {
            var vbo=VBO.instance({tableau_js: spec.vertices});
            var vbo_indices=VBO_indices.instance({tableau_js: spec.indices});

            return {
                draw: function() {
                    vbo.draw();
                    vbo_indices.draw();
                }
            }
        }
    }
}());


