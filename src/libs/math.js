let util = {

    /**
     * Converts radians to degrees
     * @param {number} rad Angle in Radians 
     * @returns Angle in degrees
     */
    rad_to_deg: (rad) => {
        return rad * 180 / Math.PI;
    },

    /**
     * 
     * @param {number} deg Angle in Degrees
     * @returns Angle in Radians
     */
    deg_to_rad: (deg) => {
        return deg * Math.PI / 180;
    }
};

let m4 = {

    /**
     * Creates a 3d translation matrix
     * @param {number} tx x translation
     * @param {number} ty y translation
     * @param {number} tz z translation
     * @returns {matrix} matrix with applied translations
     */
    translation: (tx, ty, tz) => {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1
        ];
    },

    /**
     * Creates a 3d scaling matrix
     * @param {number} sx x scale factor
     * @param {number} sy y scale factor
     * @param {number} sz z scale factor
     * @returns {matrix} matrix with applied scaling
     */
    scale: (sx, sy, sz) => {
        return [
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        ];
    },

    /**
     * Creates a 3d rotation x matrix
     * @param {number} angle angle of rotation
     * @returns {matrix} matrix with applied rotations
     */
    rotation_x: (angle) => {
        let c = Math.cos(angle);
        let s = Math.sin(angle);

        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        ];
    },

    /**
     * Creates a 3d rotation y matrix
     * @param {number} angle angle of rotation
     * @returns {matrix} matrix with applied rotations
     */
    rotation_y: (angle) => {
        let c = Math.cos(angle);
        let s = Math.sin(angle);

        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ];
    },

    /**
     * Creates a 3d rotation z matrix
     * @param {number} angle angle of rotation
     * @returns {matrix} matrix with applied rotations
     */
    rotation_z: (angle) => {
        let c = Math.cos(angle);
        let s = Math.sin(angle);

        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    },

    /**
     * Applies a translation to a matrix
     * @param {matrix} m matrix to apply the translation to
     * @param {number} tx x translation
     * @param {number} ty y translation
     * @param {number} tz z translation
     * @returns {matrix} input matrix with applied translations
     */
    mat_translate: (m, tx, ty, tz) => {
        return m4.multiply(m, m4.translation(tx, ty, tz));
    },

    /**
     * Applies a rotation of x to a matrix
     * @param {matrix} m matrix to apply the rotation to
     * @param {number} angle angle of rotation
     * @returns {matrix} input matrix with applied rotations
     */
    mat_rotation_x: (m, angle) => {
        return m4.multiply(m, m4.rotation_x(angle));
    },

    /**
     * Applies a rotation of y to a matrix
     * @param {matrix} m matrix to apply the rotation to
     * @param {number} angle angle of rotation
     * @returns {matrix} input matrix with applied rotations
     */
    mat_rotation_y: (m, angle) => {
        return m4.multiply(m, m4.rotation_y(angle));
    },

    /**
     * Applies a rotation of z to a matrix
     * @param {matrix} m matrix to apply the rotation to
     * @param {number} angle angle of rotation
     * @returns {matrix} input matrix with applied rotations
     */
    mat_rotation_z: (m, angle) => {
        return m4.multiply(m, m4.rotation_z(angle));
    },

    /**
     * Applies a scaling factor to the matrix
     * @param {matrix} m matrix to apply the scaling to
     * @param {number} sx x scaling factor
     * @param {number} sy y scaling factor
     * @param {number} sz z scaling factor
     * @returns {matrix} input matrix with applied scaling factor
     */
    mat_scale: (m, sx, sy, sz) => {
        return m4.multiply(m, m4.scale(sx, sy, sz));
    },

    /**
     * Multiplies 2 4x4 matrices
     * @param {matrix} a first input matrix
     * @param {matrix} b second input matrix
     * @returns {matrix} first matrix multiplied by the second matrix
     */
    multiply: (a, b) => {
        let b00 = b[0 * 4 + 0];
        let b01 = b[0 * 4 + 1];
        let b02 = b[0 * 4 + 2];
        let b03 = b[0 * 4 + 3];
        let b10 = b[1 * 4 + 0];
        let b11 = b[1 * 4 + 1];
        let b12 = b[1 * 4 + 2];
        let b13 = b[1 * 4 + 3];
        let b20 = b[2 * 4 + 0];
        let b21 = b[2 * 4 + 1];
        let b22 = b[2 * 4 + 2];
        let b23 = b[2 * 4 + 3];
        let b30 = b[3 * 4 + 0];
        let b31 = b[3 * 4 + 1];
        let b32 = b[3 * 4 + 2];
        let b33 = b[3 * 4 + 3];
        let a00 = a[0 * 4 + 0];
        let a01 = a[0 * 4 + 1];
        let a02 = a[0 * 4 + 2];
        let a03 = a[0 * 4 + 3];
        let a10 = a[1 * 4 + 0];
        let a11 = a[1 * 4 + 1];
        let a12 = a[1 * 4 + 2];
        let a13 = a[1 * 4 + 3];
        let a20 = a[2 * 4 + 0];
        let a21 = a[2 * 4 + 1];
        let a22 = a[2 * 4 + 2];
        let a23 = a[2 * 4 + 3];
        let a30 = a[3 * 4 + 0];
        let a31 = a[3 * 4 + 1];
        let a32 = a[3 * 4 + 2];
        let a33 = a[3 * 4 + 3];
     
        return [
          b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
          b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
          b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
          b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
          b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
          b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
          b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
          b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
          b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
          b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
          b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
          b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
          b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
          b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
          b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
          b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ];
    },

    /**
     * Gives an orthographic projection matrix
     * @param {number} left 
     * @param {number} right 
     * @param {number} bottom 
     * @param {number} top 
     * @param {number} near 
     * @param {number} far 
     * @returns {matrix} An Orthographic Projection Matrix
     */
    orthographic: (left, right, bottom, top, near, far) => {
        return [
            2 / (right - left), 0, 0, 0,
            0, 2 / (top - bottom), 0, 0,
            0, 0, 2 / (near - far), 0,
       
            (left + right) / (left - right),
            (bottom + top) / (bottom - top),
            (near + far) / (near - far),
            1,
        ];
    }
};