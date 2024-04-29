const canvas = document.querySelector("#c");
const gl = canvas.getContext("webgl");
if (!gl) throw new Error("WebGL not supported");

canvas.width = 512;
canvas.height = 512;

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

/* Shaders */
const vertex_shader_src = `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    uniform mat4 u_matrix;
    varying vec2 v_texCoord;

    void main(){
        gl_Position = u_matrix * a_position;
        v_texCoord = a_texCoord;
    }
`;

const fragment_shader_src = `
    precision mediump float;

    uniform sampler2D u_image;
    varying vec2 v_texCoord;

    void main(){
        gl_FragColor = texture2D(u_image, v_texCoord);
    }
`;

/* Variables */
let translation = [100, 200, 0];
let rotation = [util.deg_to_rad(40), util.deg_to_rad(25), util.deg_to_rad(325)];
let scale = [2, 2, 2];
let color = [Math.random(), Math.random(), Math.random(), 1];

let camera_left = 0;
let camera_right = gl.canvas.width;
let camera_bottom = gl.canvas.height;
let camera_top = 0;
let camera_near = 400;
let camera_far = -400;

const positions = [
    // Front
    0, 0, 0,
    0, 100, 0,
    100, 0, 0,
    
    100, 0, 0,
    0, 100, 0,
    100, 100, 0,

    // Right
    100, 0, 0,
    100, 100, 0,
    100, 0, 100,

    100, 0, 100,
    100, 100, 0,
    100, 100, 100,

    // Back
    100, 0, 100,
    100, 100, 100,
    0, 0, 100,

    0, 0, 100,
    100, 100, 100,
    0, 100, 100,
    
    // Left
    0, 0, 100,
    0, 0, 0,
    0, 100, 100,

    0, 0, 0,
    0, 100, 0,
    0, 100, 100,
    
    // Top
    0, 0, 100,
    0, 0, 0,
    100, 0, 100,
    
    100, 0, 100,
    0, 0, 0,
    100, 0, 0,

    // Bottom
    0, 100, 100,
    0, 100, 0,
    100, 100, 100,

    100, 100, 100,
    0, 100, 0,
    100, 100, 0
];

const texture_pos_pattern = [
    0, 0,
    0, 1,
    1, 0,
    
    1, 0,
    0, 1,
    1, 1
]

const texture_pos = [
    ...texture_pos_pattern,
    ...texture_pos_pattern,
    ...texture_pos_pattern,
    ...texture_pos_pattern,
    ...texture_pos_pattern,
    ...texture_pos_pattern,
];

let image = new Image();
image.src = "./src/assets/texture.jpg";
image.onload = draw_scene;

/* Driver Code */
const vertex_shader = create_shader(gl, gl.VERTEX_SHADER, vertex_shader_src);
const fragment_shader = create_shader(gl, gl.FRAGMENT_SHADER, fragment_shader_src);
const program = create_program(gl, vertex_shader, fragment_shader);

let attributes = {
    position: gl.getAttribLocation(program, "a_position"),
    texture: gl.getAttribLocation(program, "a_texCoord")
};

let uniforms = {
    matrix: gl.getUniformLocation(program, "u_matrix")
};

let position_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

let texture_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texture_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture_pos), gl.STATIC_DRAW);

function draw_scene() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(program);

    gl.enableVertexAttribArray(attributes.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    gl.vertexAttribPointer(attributes.position, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(attributes.texture);
    gl.bindBuffer(gl.ARRAY_BUFFER, texture_buffer);
    gl.vertexAttribPointer(attributes.texture, 2, gl.FLOAT, false, 0, 0);

    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    var matrix = m4.orthographic(camera_left, camera_right, camera_bottom, camera_top, camera_near, camera_far);
    matrix = m4.mat_translate(matrix, translation[0], translation[1], translation[2]);
    matrix = m4.mat_rotation_x(matrix, rotation[0]);
    matrix = m4.mat_rotation_y(matrix, rotation[1]);
    matrix = m4.mat_rotation_z(matrix, rotation[2]);
    matrix = m4.mat_scale(matrix, scale[0], scale[1], scale[2]);

    gl.uniformMatrix4fv(uniforms.matrix, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, positions.length);
}