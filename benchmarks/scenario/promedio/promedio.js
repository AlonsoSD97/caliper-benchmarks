'use strict';

const { WorkloadModuleInterface } = require('@hyperledger/caliper-core');

class Myworkload extends WorkloadModuleInterface {
    
    constructor() {
        super();
        this.workerIndex = -1;
        this.totalWorkers = -1;
        this.roundIndex = -1;
        this.roundArguments = undefined;
        this.sutAdapter = undefined;
        this.sutContext = undefined;
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {

        this.workerIndex = workerIndex;
        this.totalWorkers = totalWorkers;
        this.roundIndex = roundIndex;
        this.roundArguments = roundArguments;
        this.sutAdapter = sutAdapter;
        this.sutContext = sutContext;
    }

    async submitTransaction() {
        console.log('Submitting transaction with serialized Alumno:', this.serializedAlumno.toString());
        const request = {
            contract: 'promedios',
            verb: 'actualizar_promedio',
            args: [this.serializedAlumno]
        };

        await this.sutAdapter.sendRequests(JSON.stringify(request));
    }
}

async function createWorkloadModule() {
    console.log('Creating workload module instance');
    return new Myworkload();
}

module.exports.createWorkloadModule = createWorkloadModule;