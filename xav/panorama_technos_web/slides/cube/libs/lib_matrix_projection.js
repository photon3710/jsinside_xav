var lib_matrix_projection={
    get: function(angle, a, zMin, zMax) {
        var tan=Math.tan(lib_maths.degToRad(0.5*angle)),
            A=-(zMax+zMin)/(zMax-zMin),
            B=(-2*zMax*zMin)/(zMax-zMin);

        return [
            .5/tan, 0 , 0, 0,
            0, .5*a/tan,  0, 0,
            0, 0,      A, B,
            0, 0,     -1, 0
        ];
    }


}


