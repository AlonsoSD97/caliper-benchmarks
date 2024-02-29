'use strict';

const OperationBase = require('./utils/operation-base-paciente');
const PacienteData = require('./utils/PacienteData');

class addPaciente extends OperationBase {

    constructor() {
        super();
    }

    /**
     * Creates a new PacienteData object.
     * 
     * @returns {PacienteData} The newly created PacienteData object.
     */
    createPacienteData() {
        return new PacienteData();
    }

    async submitTransaction() {
        let createArgs = this.pacienteData.getPatientData();
        await this.sutAdapter.sendRequests(createArgs);
    }
} 