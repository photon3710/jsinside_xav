var lib_matrix_mv={
    translateRot: function(m,v) {
       m[12]+=v[0]*m[0]+v[1]*m[4]+v[2]*m[8];
       m[13]+=v[0]*m[1]+v[1]*m[5]+v[2]*m[9];
       m[14]+=v[0]*m[2]+v[1]*m[6]+v[2]*m[10];
    }
};