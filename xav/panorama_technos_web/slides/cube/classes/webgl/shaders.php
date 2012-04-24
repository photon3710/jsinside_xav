<?php
    function stripShader($shader) {
        $jsShader=$shader;
        $jsShader=str_replace("\n", "\\n\\\n", $jsShader);
        return $jsShader;
    }

    $fragment=stripShader(file_get_contents("classes/webgl/shader_fragment.gl"));
    $vertex=stripShader(file_get_contents("classes/webgl/shader_vertex.gl"));
    $shaders=file_get_contents("classes/webgl/Shaders.js");

    $shaders=str_replace("\$SHADER_VERTEX\$", $vertex, $shaders);
    $shaders=str_replace("\$SHADER_FRAGMENT\$", $fragment, $shaders);

    echo $shaders;
?>
