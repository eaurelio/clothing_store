export interface UserDB {
    id: string;
    name: string;
    email: string;
    password: string;
    birthdate: string;
    role: USER_ROLES;
    created_at: string;
    address: string;
    number: string;
    neighborhood: string;
    city: string;
    country: string;
    gender: string;
  }

  export interface Phone {
    number: string;
    type: string;
  }

export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
  }

export interface TokenPayload {
    id: string
  }

  export class User {
    constructor(
        private id: string,
        private name: string,
        private email: string,
        private password: string,
        private birthdate: string,
        private role: USER_ROLES,
        private createdAt: string,
        private address: string,
        private number: string,
        private neighborhood: string,
        private city: string,
        private country: string,
        private gender: string
    ) {}

    public getId(): string {
        return this.id;
    }

    public setId(value: string): void {
        this.id = value;
    }

    public getName(): string {
        return this.name;
    }

    public setName(value: string): void {
        this.name = value;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(value: string): void {
        this.email = value;
    }

    public getPassword(): string {
        return this.password;
    }

    public setPassword(value: string): void {
        this.password = value;
    }

    public getRole(): USER_ROLES {
        return this.role;
    }

    public setRole(value: USER_ROLES): void {
        this.role = value;
    }

    public getCreatedAt(): string {
        return this.createdAt;
    }

    public setCreatedAt(value: string): void {
        this.createdAt = value;
    }

    public getBirthdate(): string {
        return this.birthdate;
    }

    public setBirthdate(value: string): void {
        this.birthdate = value;
    }

    public getAddress(): string {
        return this.address;
    }

    public setAddress(value: string): void {
        this.address = value;
    }

    public getNumber(): string {
        return this.number;
    }

    public setNumber(value: string): void {
        this.number = value;
    }

    public getNeighborhood(): string {
        return this.neighborhood;
    }

    public setNeighborhood(value: string): void {
        this.neighborhood = value;
    }

    public getCity(): string {
        return this.city;
    }

    public setCity(value: string): void {
        this.city = value;
    }

    public getCountry(): string {
        return this.country;
    }

    public setCountry(value: string): void {
        this.country = value;
    }

    public getGender(): string {
        return this.gender;
    }

    public setGender(value: string): void {
        this.gender = value.toUpperCase();
    }
}


// export class User {    
//     constructor(
//         private id: string,
//         private name: string,
//         private email: string,
//         private password: string,
//         private role: USER_ROLES,
//         private createdAt: string
//     ) {}

//     public getId(): string {
//         return this.id
//     }
    
//     public setId(value: string): void {
//         this.id = value
//     }

//     public getName(): string {
//         return this.name
//     }

//     public setName(value: string): void {
//         this.name = value
//     }

//     public getEmail(): string {
//         return this.email
//     }

//     public setEmail(value: string): void {
//         this.email = value
//     }

//     public getPassword(): string {
//         return this.password
//     }

//     public setPassword(value: string): void {
//         this.password = value
//     }

//     public getRole(): USER_ROLES {
//         return this.role
//     }

//     public setRole(value: USER_ROLES): void {
//         this.role = value
//     }

//     public getCreatedAt(): string {
//         return this.createdAt
//     }

//     public setCreatedAt(value: string): void {
//         this.createdAt = value
//     }
// }