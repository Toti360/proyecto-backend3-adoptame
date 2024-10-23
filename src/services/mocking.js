import { faker } from "@faker-js/faker";
import { createHash } from "../utils/index.js";

class MockingService {
    static async generateMockingUsers(num) {
        try {
            const hashedPassword = await createHash("coder123");
            const users = [];

            for (let i = 0; i < num; i++) {
                users.push({
                    first_name: faker.person.firstName(),
                    last_name: faker.person.lastName(),
                    email: faker.internet.email(),
                    password: hashedPassword,
                    role: faker.helpers.arrayElement(["user", "admin"]),
                    pets: []
                });
            }
            return users;
        } catch (error) {
            console.error("Error generating mock users:", error);
            throw error;
        }
    }

    static async generateMockingPets(num) {
        const pets = [];

        for (let i = 0; i < num; i++) {
            pets.push({
                name: faker.animal.dog(),
                specie: faker.animal.type(),
                adopted: false,
                birthDate: faker.date.past(),
                image: "https://via.placeholder.com/150"
            });
        }
        return pets;
    }
}

export default MockingService;
