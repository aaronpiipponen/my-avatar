export class Vector3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

export function dotProduct3D(u, v) {
    return u.x*v.x + u.y*v.y + u.z*v.z;
}

export function normalizeVector3D(u) {
    const norm = Math.sqrt(dotProduct3D(u,u));
    return new Vector3D(u.x/norm, u.y/norm, u.z/norm);
}

export function projectPointToPlane(p, n) {

    n = normalizeVector3D(n);

    // Project point to plane
    const cos_n = dotProduct3D(p,n);
    const p_proj = new Vector3D(p.x - n.x * cos_n, 
                                        p.y - n.y * cos_n, 
                                        p.z - n.z * cos_n);

    // Rotate point to xy-plane
    var x = p_proj.x * (1 - n.x**2 / (1 + n.z)) - p_proj.y * (n.x*n.y / (1 + n.z)) - p_proj.z*n.x;
    var y = -p_proj.x * (n.x*n.y / (1 + n.z)) + p_proj.y * (1 - n.y**2 / (1 + n.z)) - p_proj.z*n.y;

    return {x: x, y: y};
}