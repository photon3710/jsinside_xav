/*
 * spec: empty
 */
var SHADERS;
var Shaders=(function (){

    var get_shader=function(source, type) {
            var shader = GL.createShader(type);
            GL.shaderSource(shader, source);
            GL.compileShader(shader);
            if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
                alert(GL.getShaderInfoLog(shader));
                return false;
            }
            return shader;
    };

    var shader_vertex_source="$SHADER_VERTEX$",
        shader_fragment_source="$SHADER_FRAGMENT$";

    var shader_vertex,
        shader_fragment,
        shader_program;

    var matrice_vue,
        matrice_projection,
        matrice_objet,
        position,
        couleur;

    var that={
        instance: function(spec) {
            shader_vertex=get_shader(shader_vertex_source, GL.VERTEX_SHADER);
            shader_fragment=get_shader(shader_fragment_source, GL.FRAGMENT_SHADER);
            shader_program=GL.createProgram();
            GL.attachShader(shader_program, shader_vertex);
            GL.attachShader(shader_program, shader_fragment);
            GL.linkProgram(shader_program);
            matrice_projection = GL.getUniformLocation(shader_program, "matrice_projection");
            matrice_vue = GL.getUniformLocation(shader_program, "matrice_vue");
            matrice_objet = GL.getUniformLocation(shader_program, "matrice_objet");
            position = GL.getAttribLocation(shader_program, "position");
            couleur = GL.getAttribLocation(shader_program, "couleur");
            GL.enableVertexAttribArray(position);
            GL.enableVertexAttribArray(couleur);
            GL.useProgram(shader_program);
        },

        set_matriceProjection: function(matrice) {
            GL.uniformMatrix4fv(matrice_projection, false, matrice);
        },

        set_matriceVue: function(matrice) {
            GL.uniformMatrix4fv(matrice_vue, false, matrice);
        },

        set_matriceObjet: function(matrice) {
            GL.uniformMatrix4fv(matrice_objet, false, matrice);
        },

        set_vertexPointers: function() {
            GL.vertexAttribPointer(position, 3, GL.FLOAT, false,24,0) ;
            GL.vertexAttribPointer(couleur, 3, GL.FLOAT, false,24,12) ;
        }

    };
    SHADERS=that;
    return that;

})();


