const canvas = document.querySelector("#c");
const gl = canvas.getContext("webgl");

canvas.width = 256;
canvas.height = 256;

/* Variables */
let scene_angle = 0;
let scene_scale = [1, 1];
let scene_translations = [200, 150];

let positions = new Float32Array([
    -150, -100,
    150, -100,
    -150, 100,
    150, -100,
    -150, 100,
    150, 100
]);

/* Shader Code */
const vertex_shader_src = `
    attribute vec2 a_position;
    attribute vec4 a_color;
    uniform mat3 u_matrix;
    varying vec4 v_color;
    
    void main(){
        gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
        v_color = a_color;
    }
`;

const fragment_shader_src = `
    precision mediump float;
    varying vec4 v_color;
    
    void main(){
        gl_FragColor = v_color;
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

function generate_color(){
    let col_1 = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
    let col_2 = [Math.random() * 256, Math.random() * 256, Math.random() * 256];

    return new Uint8Array([
        ...col_1, 255,
        ...col_1, 255,
        ...col_1, 255,

        ...col_2, 255,
        ...col_2, 255,
        ...col_2, 255,
    ]);
}

/* WebGL Driver Code */
const vertex_shader = create_shader(gl, gl.VERTEX_SHADER, vertex_shader_src);
const fragment_shader = create_shader(gl, gl.FRAGMENT_SHADER, fragment_shader_src);
const program = create_program(gl, vertex_shader, fragment_shader);

let pos_attribute_loc = gl.getAttribLocation(program, "a_position");
let col_attribute_loc = gl.getAttribLocation(program, "a_color");
let mat_uniform_loc = gl.getUniformLocation(program, "u_matrix");

let pos_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, pos_buffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

let col_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, col_buffer);
gl.bufferData(gl.ARRAY_BUFFER, generate_color(), gl.STATIC_DRAW);

draw_scene();
function draw_scene(){
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);

    gl.enableVertexAttribArray(pos_attribute_loc);
    gl.bindBuffer(gl.ARRAY_BUFFER, pos_buffer);
    gl.vertexAttribPointer(pos_attribute_loc, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(col_attribute_loc);
    gl.bindBuffer(gl.ARRAY_BUFFER, col_buffer);
    gl.vertexAttribPointer(col_attribute_loc, 4, gl.UNSIGNED_BYTE, true, 0, 0);

    let mat = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
    mat = m3.translate(mat, scene_translations[0], scene_translations[1]);
    mat = m3.rotate(mat, scene_angle);
    mat = m3.scale(mat, scene_scale[0], scene_scale[1]);

    gl.uniformMatrix3fv(mat_uniform_loc, false, mat);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}