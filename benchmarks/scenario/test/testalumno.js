'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class CustomContractWorkload extends WorkloadModuleBase {
    constructor() {
        super();
        // Objeto alumno
        this.alumnoObject = {
            name: this._generateRandomString(10),
            edad: Math.floor(Math.random() * 100)
        };
        // Serialización del objeto alumno
        this.serializedAlumno = this.serializeAlumno(this.alumnoObject);
    }
    _generateRandomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    serializeAlumno(alumno) {
        // Codificar el objeto alumno como una cadena de bytes
        return Buffer.from(`${alumno.name},${alumno.edad}`);
    }

    async submitTransaction() {
        // Ejemplo de cómo pasar el objeto serializado como parámetro en una transacción
        await this.sutAdapter.sendRequests({
            contract: 'promedios', // Nombre del contrato
            verb: 'actualizar_promedio', // Nombre del método que quieres llamar
            args: [this.serializedAlumno] // Parámetros que quieres pasar al método
        });
    }

    async cleanupWorkload() {
        // Lógica de limpieza si es necesario
    }
}

async function instantiateWorkloadModule() {
    return new CustomContractWorkload();
}

module.exports.instantiateWorkloadModule = instantiateWorkloadModule;
