/*
 * spec: tableau_js : tableau js des indices
 */
var VBO_indices=(function() {
    return {
       instance: function(spec) {
            var vbo= GL.createBuffer ();
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, vbo);
            GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
	  		  new Uint16Array(spec.tableau_js),
			  GL.STATIC_DRAW);
            var taille=spec.tableau_js.length;
            return {
                draw: function() {
                   GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, vbo);
                   GL.drawElements(GL.TRIANGLES, taille, GL.UNSIGNED_SHORT, 0);
                }
            }
       }
    }
})();


