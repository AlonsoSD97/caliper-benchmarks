/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

const SupportedConnectors = ['ethereum', 'fabric'];

/**
 * Base class for simple operations.
 */
class OperationBase extends WorkloadModuleBase {
    /**
     * Initializes the base class.
     */
    constructor() {
        super();
    }

    /**
     * Initialize the workload module with the given parameters.
     * @param {number} workerIndex The 0-based index of the worker instantiating the workload module.
     * @param {number} totalWorkers The total number of workers participating in the round.
     * @param {number} roundIndex The 0-based index of the currently executing round.
     * @param {Object} roundArguments The user-provided arguments for the round from the benchmark configuration file.
     * @param {ConnectorBase} sutAdapter The adapter of the underlying SUT.
     * @param {Object} sutContext The custom context object provided by the SUT adapter.
     * @async
     */
    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        this.assertConnectorType();
        this.simpleState = this.createSimpleState();
    }

    /**
     * Performs the operation mode-specific initialization.
     * @return {SimpleState} the initialized SimpleState instance.
     * @protected
     */
    createSimpleState() {
        throw new Error('Simple workload error: "createSimpleState" must be overridden in derived classes');
    }

    /**
     * Assert that the used connector type is supported. Only Fabric is supported currently.
     * @protected
     */
    assertConnectorType() {
        this.connectorType = this.sutAdapter.getType();
        if (!SupportedConnectors.includes(this.connectorType)) {
            throw new Error(`Connector type ${this.connectorType} is not supported by the benchmark`);
        }
    }



    /**
     * Assemble a connector-specific request from the business parameters.
     * @param {string} operation The name of the operation to invoke.
     * @param {object} args The object containing the arguments.
     * @return {object} The connector-specific request.
     * @protected
     */
    createConnectorRequest(operation, args) {
        switch (this.connectorType) {
            case 'fabric':
                return this._createFabricConnectorRequest(operation, args);
            case 'ethereum':
                return this._createEthereumConnectorRequest(operation, args);
            default:
                // this shouldn't happen
                throw new Error(`Connector type ${this.connectorType} is not supported by the benchmark`);
        }
    }

    /**
     * Assemble a Fabric-specific request from the business parameters.
     * @param {string} operation The name of the operation to invoke.
     * @param {object} args The object containing the arguments.
     * @return {object} The Fabric-specific request.
     * @private
     */
    _createFabricConnectorRequest(operation, args) {
        const query = operation === 'query';
        return {
            contractId: 'simple',
            contractVersion: '1.0',
            contractFunction: operation,
            contractArguments: Object.keys(args).map(k => args[k].toString()),
            readOnly: query
        };
    }

    /**
     * Extracts all values from an object recursively.
     * @param {object} object - The object to extract values from.
     * @returns {Array} - An array containing all the values extracted from the object.
     */
    extractValuesObject(obj) {
        let result = [];

        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                // Si el valor es un objeto, llamamos recursivamente a extractValues
                result = result.concat(this.extractValuesObject(obj[key]));
            } else {
                // Si el valor no es un objeto, lo agregamos al resultado
                result.push(obj[key]);
            }
        }

        return result;
    }

    extractValuesObjectAnidated(obj) {
        let result = [];

        for (let key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
            // If the value is an object, we recursively call extractValuesObjectAnidated
            let nestedObj = this.extractValuesObjectAnidated(obj[key]);
            result = result.concat([nestedObj]);
            } else {
            // If the value is not an object, we add it to the result
            result.push(obj[key]);
            }
        }

        return result;
        }

    /**
     * Assemble a Ethereum-specific request from the business parameters.
     * @param {string} contract The name of the contract to invoke.
     * @param {string} operation The name of the operation to invoke.
     * @param {object} args The object containing the arguments.
     * @return {object} The Ethereum-specific request.
     * @private
     */
    _createEthereumConnectorRequest(contract, operation, args) {
        const query = operation === 'query';
        return {
            contract: contract,
            verb: operation,
            args: this.extractValuesObjectAnidated(args),
            readOnly: query
        };
    }
}

module.exports = OperationBase;
