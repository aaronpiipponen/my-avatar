export class Vector3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    multiply(k){
        return new Vector3D(this.x*k, this.y*k, this.z*k);
    };

    add(u) {
        return new Vector3D(this.x + u.x, this.y + u.y, this.z + u.z);
    };
}

export function dotProduct3D(u, v) {
    return u.x*v.x + u.y*v.y + u.z*v.z;
}

export function normalizeVector3D(u) {
    const norm = Math.sqrt(dotProduct3D(u,u));
    return new Vector3D(u.x/norm, u.y/norm, u.z/norm);
}

export function projectPointToPlane(p, u, v, n) {
    return {
        x: dotProduct3D(p, u),
        y: dotProduct3D(p, v),
        z: dotProduct3D(p, n)
    };
}