/**
 * Converts OBJ and MLT data to data that can be read by WebGL
 * @param {string} obj .obj data (scene data)
 * @param {string} mtl .mlt data (material data)
 * @returns {array} Scene data that can be read by WebGL
 */
function loadWaveFront(obj, mtl){

    /* .obj data */
    let vertices = [];
    let faces = [];

    let lines = obj.split("\n");
    for(let i = 0; i < lines.length; i++){
        if(lines[i][0] == "v"){
            let vertex = lines[i].split(" ");
            vertex.splice(0, 1);

            for(let j = 0; j < vertex.length; j++) vertex[j] = parseFloat(vertex[j]);
            vertices.push(vertex);

            continue;
        }

        if(lines[i][0] == "f"){
            let face = lines[i].split(" ");
            face.splice(0, 1);

            for(let j = 0; j < face.length; j++) face[j] = parseFloat(face[j].split("/")[0]);
            face = face.filter(elm => elm);

            console.log(face);

            if(face.length == 3){
                faces.push(face);
            } else if(face.length == 4){
                faces.push([face[0], face[1], face[2]]);
                faces.push([face[0], face[2], face[3]]);
            }
        }
    }

    let webgl_obj_data = [];
    for(let i = 0; i < faces.length; i++){
        webgl_obj_data.push(...vertices[faces[i][0] - 1]);
        webgl_obj_data.push(...vertices[faces[i][1] - 1]);
        webgl_obj_data.push(...vertices[faces[i][2] - 1]);
    }

    return webgl_obj_data;

    /* .mtl data */

}