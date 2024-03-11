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

const OperationBase = require('./utils/operation-base');

/**
 * Workload module for initializing the SUT with various accounts.
 */
class Promedio extends OperationBase {

    /**
     * Initializes the parameters of the workload.
     */
    constructor() {
        super();
    }

    /**
     * Assemble TXs for opening new accounts.
     */
    _generateRandomString(length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    async submitTransaction() {
        let Alumno = {
            nombre: this._generateRandomString(10),
            edad: Math.floor(Math.random() * 100) + 1,
        }
        let args = {
            index: Math.floor(Math.random() * 10),
            Alumno: Alumno
        };
        console.log('input',JSON.stringify(args));
        await this.sutAdapter.sendRequests(this._createEthereumConnectorRequest('promedios','actualizar_promedio' , args));
    }
    
    createSimpleState() {
        return {
            getOpenAccountArguments: () => {
                return {
                    nombre: 'Juan',
                    edad: 20,
                };
            },
        };
    }

}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new Promedio();
}

module.exports.createWorkloadModule = createWorkloadModule;
