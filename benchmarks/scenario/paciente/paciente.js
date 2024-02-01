'use strict';

const { WorkloadModuleInterface } = require('@hyperledger/caliper-core');

class MyWorkload extends WorkloadModuleInterface {
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
        let txArgs = {
            // TX arguments for "Paciente" contract
            contractId: 'Paciente',
            contractVersion: '0.8.0',
            contractFunction: 'storeTelecom',
            contractArguments: [
                // Pass your telecom data here
                {
                    id: '1',
                    system: 'example system',
                    value: 'example value',
                    use: 'example use',
                    rank: 'example rank'
                }
            ]
        };

        return this.sutAdapter.invokeSmartContract('Paciente', '0.8.0', txArgs, 30);
    }

    async cleanupWorkloadModule() {
        // NOOP
    }
}

function createWorkloadModule() {
    return new MyWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
