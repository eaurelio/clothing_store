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
    phones?: {
        number: string;
        type: string;
    }[];
}

export interface UserDBOutput {
    id: string;
    personal_id: string;
    entity_type: EntityType;
    name: string;
    email: string;
    // password: string;
    birthdate: string;
    role: USER_ROLES;
    created_at: string;
    address: string;
    number: string;
    neighborhood: string;
    city: string;
    country: string;
    gender: string;
    phones?: {
        number: string;
        type: string;
    }[];
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
        private entityType: EntityType,
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
