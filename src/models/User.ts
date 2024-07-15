export interface UserDB {
    id: string;
    personal_id: string;
    entity_type: EntityType;
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

export enum EntityType {
    PERSONAL = 'PERSONAL',
    BUSINESS = 'BUSINESS'
}

export class User {
    constructor(
        private id: string,
        private personalId: string,
        private entityType: EntityType, // Corrigido para utilizar o enum EntityType
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

    getId(): string {
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }

    getPersonalId(): string {
        return this.personalId;
    }

    setPersonalId(personalId: string): void {
        this.personalId = personalId;
    }

    getEntityType(): EntityType {
        return this.entityType;
    }

    setEntityType(entityType: EntityType): void {
        this.entityType = entityType;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getEmail(): string {
        return this.email;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    getPassword(): string {
        return this.password;
    }

    setPassword(password: string): void {
        this.password = password;
    }

    getRole(): USER_ROLES {
        return this.role;
    }

    setRole(role: USER_ROLES): void {
        this.role = role;
    }

    getCreatedAt(): string {
        return this.createdAt;
    }

    setCreatedAt(createdAt: string): void {
        this.createdAt = createdAt;
    }

    getBirthdate(): string {
        return this.birthdate;
    }

    setBirthdate(birthdate: string): void {
        this.birthdate = birthdate;
    }

    getAddress(): string {
        return this.address;
    }

    setAddress(address: string): void {
        this.address = address;
    }

    getNumber(): string {
        return this.number;
    }

    setNumber(number: string): void {
        this.number = number;
    }

    getNeighborhood(): string {
        return this.neighborhood;
    }

    setNeighborhood(neighborhood: string): void {
        this.neighborhood = neighborhood;
    }

    getCity(): string {
        return this.city;
    }

    setCity(city: string): void {
        this.city = city;
    }

    getCountry(): string {
        return this.country;
    }

    setCountry(country: string): void {
        this.country = country;
    }

    getGender(): string {
        return this.gender;
    }

    setGender(gender: string): void {
        this.gender = gender.toUpperCase();
    }
}


 // id TEXT PRIMARY KEY UNIQUE NOT NULL,
    // personal_id TEXT UNIQUE NOT NULL,
    // entity_type TEXT NOT NULL,
    // name TEXT NOT NULL,
    // gender TEXT,
    // email TEXT UNIQUE NOT NULL,
    // password TEXT NOT NULL,
    // role TEXT NOT NULL DEFAULT 'NORMAL',
    // created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    // birthdate TEXT NOT NULL,
    // address TEXT NOT NULL,
    // number TEXT NOT NULL,
    // neighborhood TEXT NOT NULL,
    // city TEXT NOT NULL,
    // country TEXT NOT NULL,

//   export class User {
//     constructor(
//         private id: string,
//         private personal_id: string,
//         private entity_type: string,
//         private name: string,
//         private email: string,
//         private password: string,
//         private birthdate: string,
//         private role: USER_ROLES,
//         private createdAt: string,
//         private address: string,
//         private number: string,
//         private neighborhood: string,
//         private city: string,
//         private country: string,
//         private gender: string
//     ) {}

//     public getId(): string {
//         return this.id;
//     }

//     public setId(value: string): void {
//         this.id = value;
//     }

//     public getPersonal_id(): string {
//         return this.personal_id;
//     }

//     public SetPersonal_id(value: string) {
//         this.personal_id = value;
//     }

//     public GetEntity_type() {
//         return this.entity_type;
//     }

//     public SetEntity_type(value: EntityType) {
//         this.personal_id = value;
//     }

//     public getName(): string {
//         return this.name;
//     }

//     public setName(value: string): void {
//         this.name = value;
//     }

//     public getEmail(): string {
//         return this.email;
//     }

//     public setEmail(value: string): void {
//         this.email = value;
//     }

//     public getPassword(): string {
//         return this.password;
//     }

//     public setPassword(value: string): void {
//         this.password = value;
//     }

//     public getRole(): USER_ROLES {
//         return this.role;
//     }

//     public setRole(value: USER_ROLES): void {
//         this.role = value;
//     }

//     public getCreatedAt(): string {
//         return this.createdAt;
//     }

//     public setCreatedAt(value: string): void {
//         this.createdAt = value;
//     }

//     public getBirthdate(): string {
//         return this.birthdate;
//     }

//     public setBirthdate(value: string): void {
//         this.birthdate = value;
//     }

//     public getAddress(): string {
//         return this.address;
//     }

//     public setAddress(value: string): void {
//         this.address = value;
//     }

//     public getNumber(): string {
//         return this.number;
//     }

//     public setNumber(value: string): void {
//         this.number = value;
//     }

//     public getNeighborhood(): string {
//         return this.neighborhood;
//     }

//     public setNeighborhood(value: string): void {
//         this.neighborhood = value;
//     }

//     public getCity(): string {
//         return this.city;
//     }

//     public setCity(value: string): void {
//         this.city = value;
//     }

//     public getCountry(): string {
//         return this.country;
//     }

//     public setCountry(value: string): void {
//         this.country = value;
//     }

//     public getGender(): string {
//         return this.gender;
//     }

//     public setGender(value: string): void {
//         this.gender = value.toUpperCase();
//     }
// }