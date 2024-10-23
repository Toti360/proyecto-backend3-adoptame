import { petsService, usersService } from "../services/index.js";
import MockingService from "../services/mocking.js";

const validateServices = () => {
    if (!usersService?.create || typeof usersService.create !== 'function') {
        throw new Error('User service create method is not properly implemented');
    }
    if (!petsService?.create || typeof petsService.create !== 'function') {
        throw new Error('Pet service create method is not properly implemented');
    }
};

const getMockingPets = async (req, res) => {
    try {
        const pets = await MockingService.generateMockingPets(100);
        res.send({ status: "success", payload: pets });
    } catch (error) {
        console.error("Error generating mock pets:", error);
        res.status(500).send({ status: "error", error: error.message });
    }
};

const getMockingUsers = async (req, res) => {
    try {
        const users = await MockingService.generateMockingUsers(50);
        res.send({ status: "success", payload: users });
    } catch (error) {
        console.error("Error generating mock users:", error);
        res.status(500).send({ status: "error", error: error.message });
    }
};

const generateData = async (req, res) => {
    const { users = 10, pets = 10 } = req.body; 
    try {

        validateServices();

        //Generación de usuarios falsos: 
        const mockingUsers = await MockingService.generateMockingUsers(users);

        //Generación de mascotas falsas: 
        const mockingPets = await MockingService.generateMockingPets(pets);

        //Insertar los datos generados en la BD: 
        //await Promise.all([
        //    ...mockingUsers.map(user => usersService.create(user)),
        //    ...mockingPets.map(pet => petsService.create(pet))
        //]);

        const savedUsers = [];
        for (const user of mockingUsers) {
            try {
                const savedUser = await usersService.create(user);
                savedUsers.push(savedUser);
                console.log(`Usuario guardado: ${savedUser._id}`);
            } catch (error) {
                console.error(`Error guardando usuario:`, error);
            }
        };

        const savedPets = [];
        for (const pet of mockingPets) {
            try {
                const savedPet = await petsService.create(pet);
                savedPets.push(savedPet);
                console.log(`Mascota guardada: ${savedPet._id}`);
            } catch (error) {
                console.error(`Error guardando mascota:`, error);
            }
        };
        
        res.send({
            status: "success",
            message: "Los datos se han generado y cargado correctamente en la Base de Datos"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al generar y cargar los datos.!!!"); 
    }
};

export default {
    getMockingPets,
    getMockingUsers,
    generateData
};

