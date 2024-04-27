const canvas = document.querySelector("#c");
const gl = canvas.getContext("webgl");

canvas.width = 512;
canvas.height = 512;

/* Variables */
let scene_angle = 0;
let scene_scale = [1, 1];
let scene_translations = [256, 256];

let positions = new Float32Array([
    -100, -100,
    100, -100,
    -100, 100,
    100, -100,
    -100, 100,
    100, 100
]);

let tex_coords = new Float32Array([
    0.0,  0.0,
    1.0,  0.0,
    0.0,  1.0,

    1.0,  0.0,
    0.0,  1.0,
    1.0,  1.0
]);

let image = new Image();
image.src = "./src/assets/texture.jpg";
image.onload = draw_scene;

/* Shader Code */
const vertex_shader_src = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    uniform mat3 u_matrix;
    varying vec2 v_texCoord;
    
    void main(){
        gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
        v_texCoord = a_texCoord;
    }
`;

const fragment_shader_src = `
    precision mediump float;
    
    uniform sampler2D u_image;
    varying vec2 v_texCoord;
    
    void main() {
        gl_FragColor = texture2D(u_image, v_texCoord);
    }
`;

if(!gl) {
    throw new Error("WebGL is not supported on your browser!");
}

/* Util Functions */
function create_shader(gl, type, src){
    let shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success){
        return shader;
    }
    
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function create_program(gl, vertex_shader, fragment_shader){
    let program = gl.createProgram();
    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);
    gl.linkProgram(program);
    
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(success){
        return program;
    }
    
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram();
}

/* WebGL Driver Code */
const vertex_shader = create_shader(gl, gl.VERTEX_SHADER, vertex_shader_src);
const fragment_shader = create_shader(gl, gl.FRAGMENT_SHADER, fragment_shader_src);
const program = create_program(gl, vertex_shader, fragment_shader);

let pos_attribute_loc = gl.getAttribLocation(program, "a_position");
let tex_attribute_loc = gl.getAttribLocation(program, "a_texCoord");
let mat_uniform_loc = gl.getUniformLocation(program, "u_matrix");

let pos_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, pos_buffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

let tex_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, tex_buffer);
gl.bufferData(gl.ARRAY_BUFFER, tex_coords, gl.STATIC_DRAW);

function draw_scene(){
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);

    gl.enableVertexAttribArray(pos_attribute_loc);
    gl.bindBuffer(gl.ARRAY_BUFFER, pos_buffer);
    gl.vertexAttribPointer(pos_attribute_loc, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(tex_attribute_loc);
    gl.bindBuffer(gl.ARRAY_BUFFER, tex_buffer);
    gl.vertexAttribPointer(tex_attribute_loc, 2, gl.FLOAT, false, 0, 0);

    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    let mat = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
    mat = m3.translate(mat, scene_translations[0], scene_translations[1]);
    mat = m3.rotate(mat, scene_angle);
    mat = m3.scale(mat, scene_scale[0], scene_scale[1]);

    gl.uniformMatrix3fv(mat_uniform_loc, false, mat);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}