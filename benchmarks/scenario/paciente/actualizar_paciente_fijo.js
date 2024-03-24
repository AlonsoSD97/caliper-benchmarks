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

const OperationBase = require('./utils/operation-base-2');

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

    async submitTransaction() {
        let args  = [["6","no revelado","https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSIdentidaddeGenero"],["male","male","male"],["https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CodPais",[["334","Australia","https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CodPais"]]],["old",[["316","Estados Unidos","https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CodPais"],["04","https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSTipoIdentificador","Pasaporte"]],"7208736-4"],["official",["swPcXHBxeq"],"HULHJnsIqV"],["usual","HaLjDDXrsR"],[["pager","pager","http://hl7.org/fhir/contact-point-system"],"YTQqKUCGKw",["trabajo","trabajo","http://hl7.org/fhir/contact-point-use"]],"1954-3-13",[["392","Japón","https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CodPais"],"UvXypBJLcD","nNolQREKZv","DhGBTnDCkZ","118"],["42332775-8",["C","Emergency Contact","null"],["usual",["ZVqEruBOVz"],"WcDKOgAiYe"]],[[["zh-HK","Chinese","https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje"]]],["6659769-5","Practitioner/reference","vPwcZYXpHV"]];
        await this.sutAdapter.sendRequests(this._createEthereumConnectorRequest('paciente','updatePatientData' , [args]));
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
