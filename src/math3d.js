export class Vector3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Scalar multiplication
    multiply(k){
        return new Vector3D(this.x*k, this.y*k, this.z*k);
    };

    // Vector addition
    add(u) {
        return new Vector3D(this.x + u.x, this.y + u.y, this.z + u.z);
    };

    // Dot product with other vector u
    dotProduct(u) {
        return u.x*this.x + u.y*this.y + u.z*this.z;
    }

    // Normalize self
    normalize() {
        const norm = Math.sqrt(this.dotProduct(this));
        return new Vector3D(this.x/norm, this.y/norm, this.z/norm)
    }

    // Orthogonalize self with u with Gram-Schmidt
    orthogonalize2D(u) {
        const u1 = u;
        const proj_u1_this = u1.multiply(u1.dotProduct(this)/u1.dotProduct(u1));

        return this.add(proj_u1_this.multiply(-1));
    }

    // Orthogonalize self with u and v with Gram-Schmidt
    orthogonalize3D(u, v) {
        const u1 = u;
        const proj_u1_v = u1.multiply(u1.dotProduct(v)/u1.dotProduct(u1));
        
        const u2 = v.add(proj_u1_v.multiply(-1));
        const proj_u1_this = u1.multiply(u1.dotProduct(this)/u1.dotProduct(u1));
        const proj_u2_this = u2.multiply(u2.dotProduct(this)/u2.dotProduct(u2));

        return this.add(proj_u1_this.multiply(-1)).add(proj_u2_this.multiply(-1));
    }
}

export function projectPointToPlane(p, u, v, n) {
    return {
        x: p.dotProduct(u),
        y: p.dotProduct(v),
        z: p.dotProduct(n)
    };
}