/*
 * spec: tableau_js : tableau js des vertex
 */
var VBO=(function() {
    return {
       instance: function(spec) {
            var vbo= GL.createBuffer ();
            GL.bindBuffer(GL.ARRAY_BUFFER, vbo);
            GL.bufferData(GL.ARRAY_BUFFER,
	  		  new Float32Array(spec.tableau_js),
			  GL.STATIC_DRAW);
            return {
                draw: function() {                   
                   GL.bindBuffer(GL.ARRAY_BUFFER, vbo) ;
                   SHADERS.set_vertexPointers();
                }
            }
       }
    }
})();

