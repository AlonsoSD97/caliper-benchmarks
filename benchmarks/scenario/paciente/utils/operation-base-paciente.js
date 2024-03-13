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
class OperationBasePaciente extends WorkloadModuleBase {
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
    // se extiende la clase WorkloadModuleBase, el metodo initializeWorkloadModule es un metodo de la clase WorkloadModuleBase
    // se sobreescribe el metodo initializeWorkloadModule para agregar funcionalidad 
    // el metodo initializeWorkloadModule del modulo padre se ejecuta mediante la palabra reservada super
    // el metodo initializeWorkloadModule del modulo padre recibe los mismos parametros que el metodo sobreescribido
    // la variable this.roundArguments es un objeto que contiene los parametros del archivo de configuracion

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
        //se verifica que el tipo de conector sea soportado, los tipos soportados son fabric y ethereum como se ve en la lista SupportedConnectors 
        this.assertConnectorType();
        //se verifica que los parametros esten en el archivo de configuracion mediante el metodo assertSetting
        // el metodo assertSetting hace uso del metodo hasOwnProperty para verificar que el parametro exista

        //se asignan los parametros a variables para ser usadas en el resto del codigo
        // la variable this.roundArguments es un objeto que contiene los parametros del archivo de configuracion
        this.initialMoney = this.roundArguments.initialMoney;
        this.moneyToTransfer = this.roundArguments.moneyToTransfer;
        this.numberOfAccounts = this.roundArguments.numberOfAccounts;
        //se crea una instancia de la clase SimpleState
        
        this.simpleState = this.createSimpleState();
        this.pacienteData = this.createPacienteData();
    }

    /**
     * Performs the operation mode-specific initialization.
     * @return {SimpleState} the initialized SimpleState instance.
     * @protected
     */
    // se sobreescribe el metodo createSimpleState para agregar funcionalidad
    // 
    createSimpleState() {
        throw new Error('Simple workload error: "createSimpleState" must be overridden in derived classes');
    }

    /**
     * Creates the data for a paciente.
     * This method must be overridden in derived classes.
     * @throws {Error} Throws an error indicating that "createPacienteData" must be overridden.
     */
    createPacienteData() {
        throw new Error('Simple workload error: "createPacienteData" must be overridden in derived classes');
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
     * Assert that a given setting is present among the arguments.
     * @param {string} settingName The name of the setting.
     * @protected
     */
    assertSetting(settingName) {
        if(!this.roundArguments.hasOwnProperty(settingName)) {
            throw new Error(`Simple workload error: module setting "${settingName}" is missing from the benchmark configuration file`);
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
     * Assemble a Ethereum-specific request from the business parameters.
     * @param {string} operation The name of the operation to invoke.
     * @param {object} args The object containing the arguments.
     * @return {object} The Ethereum-specific request.
     * @private
     */
    _createEthereumConnectorRequest(operation, args) {
        const query = operation === 'query';
        return {
            contract: 'simple',
            verb: operation,
            args: Object.keys(args).map(k => args[k]),
            readOnly: query
        };
    }
}

module.exports = OperationBasePaciente;