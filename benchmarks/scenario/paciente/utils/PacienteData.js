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
const { ethers } = require('ethers');
'use strict';

//en esta seccion se definen las listas de valores que se utilizaran para generar los datos de los pacientes, estos valores se bgasan en las indicaciones de la guia de implementacion de FHIR para Chile.
// los datos del tipo code siguen una estructura de 3 elementos principales, code, display y system, el sistema es el que indica el origen del valor generalmente una url hacia la web o norma donde se definen los codigos, el display es el valor que se muestra de forma que sea interpretable por un humano y el code es el valor que se utiliza para identificar el valor.
// los datos del tipo codeableConcept siguen una estructura similar a code pero ademas incluyen una referencia a un sistema terminologico a ontologia.

//El estandar define una lista de valores para el genero y el sexo. Los valores se encuentran en la url https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSIdentidaddeGenero y https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSSexoBiologico respectivamente.
const genderList = [{code: '1', display: 'Masculino', system:'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSIdentidaddeGenero'},{code: '2', display: 'Femenino', system:'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSIdentidaddeGenero'},{code: '3', display: 'Otro', system:'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSIdentidaddeGenero'}, {code: '4', display: 'No binarie', system:'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSIdentidaddeGenero'},{code: '5', display: 'otra', system:'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSIdentidaddeGenero'}, {code: '6', display: 'no revelado', system:'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSIdentidaddeGenero'}];
const sexList = [{code: 'male', display: 'male', definition:'male'},{code: 'female', display:'Female',definition:'Female'},{code: 'other', display:'Other',definition:'Other'},{code: 'unknown', display:'Unknown',definition:'Unknown'}];
//El estandar define una lista de valores para el tipo de documento de identificacion. Los valores se encuentran en la url https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSTipoIdentificador
const nacionaleidadUrl = 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CodPais';
const codigoDePaises=[{code: '152', display: 'Chile', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CodPais'},{code: '316', display: 'Estados Unidos', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CodPais'},{code: '826', display: 'Reino Unido', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CodPais'},{code: '276', display: 'Alemania', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CodPais'},{code: '334', display: 'Australia', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CodPais'},{code: '392', display: 'Japón', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CodPais'},{code: '158', display: 'China', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CodPais'}];
//El estandar define una lista de valores para el tipo de documento de identificacion. Los valores se encuentran en la url https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSTipoIdentificador, 
const identifierUse=['usual', 'official', 'temp', 'secondary', 'old'];
//El estandar define una lista de valores para el tipo de documento de identificacion. Los valores son del tipo code  
const identifierCoding = [{code:'01',system:'	https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSTipoIdentificador',display:'RUN'},{code:'04',system:'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSTipoIdentificador',display:'Pasaporte'}]

//En esta seccion se definen la lista de valores para los datos de contacto
const telecomSystem = [{code: 'email', display: 'email', system:'http://hl7.org/fhir/contact-point-system'},{code: 'phone', display: 'phone', system:'http://hl7.org/fhir/contact-point-system'},{code: 'fax', display: 'fax', system:'http://hl7.org/fhir/contact-point-system'},{code: 'pager', display: 'pager', system:'http://hl7.org/fhir/contact-point-system'},{code: 'url', display: 'url', system:'http://hl7.org/fhir/contact-point-system'},{code: 'sms', display: 'sms', system:'http://hl7.org/fhir/contact-point-system'},{code: 'other', display: 'other', system:'http://hl7.org/fhir/contact-point-system'}];

const telecomUse = [{code: 'casa', display: 'casa', system:'http://hl7.org/fhir/contact-point-use'},{code: 'trabajo', display: 'trabajo', system:'http://hl7.org/fhir/contact-point-use'},{code: 'móvil', display: 'móvil', system:'http://hl7.org/fhir/contact-point-use'}];

const administist = [{code: 'male', display: 'Male', definition: 'Male'},{code: 'female', display: 'Female', definition: 'Female'},{code: 'other', display: 'Other', definition: 'Other'},{code: 'unknown', display: 'Unknown', definition: 'Unknown'}];

const contactRelationship = [
    { code: 'C', display: 'Emergency Contact', definition: '' },
    { code: 'E', display: 'Employer', definition: '' },
    { code: 'F', display: 'Federal Agency', definition: '' },
    { code: 'I', display: 'Insurance Company', definition: '' },
    { code: 'N', display: 'Next-of-Kin', definition: '' },
    { code: 'S', display: 'State Agency', definition: '' },
    { code: 'U', display: 'Unknown', definition: '' }
];

const comunicationLenguage = [
    { code: 'ar-SA', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Arabic' },
    { code: 'bn-BD', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Bangla' },
    { code: 'bn-IN', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Bangla' },
    { code: 'cs-CZ', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Czech' },
    { code: 'da-DK', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Danish' },
    { code: 'de-AT', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'German' },
    { code: 'de-CH', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'German' },
    { code: 'de-DE', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'German' },
    { code: 'el-GR', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Greek' },
    { code: 'en-AU', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'English' },
    { code: 'en-CA', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'English' },
    { code: 'en-GB', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'English' },
    { code: 'en-IE', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'English' },
    { code: 'en-IN', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'English' },
    { code: 'en-NZ', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'English' },
    { code: 'en-US', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'English' },
    { code: 'en-ZA', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'English' },
    { code: 'es-AR', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Spanish' },
    { code: 'es-CL', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Spanish' },
    { code: 'es-CO', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Spanish' },
    { code: 'es-ES', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Spanish' },
    { code: 'es-MX', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Spanish' },
    { code: 'es-US', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Spanish' },
    { code: 'fi-FI', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Finnish' },
    { code: 'fr-BE', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'French' },
    { code: 'fr-CA', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'French' },
    { code: 'fr-CH', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'French' },
    { code: 'fr-FR', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'French' },
    { code: 'he-IL', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Hebrew' },
    { code: 'hi-IN', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Hindi' },
    { code: 'hu-HU', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Hungarian' },
    { code: 'id-ID', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Indonesian' },
    { code: 'it-CH', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Italian' },
    { code: 'it-IT', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Italian' },
    { code: 'jp-JP', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Japanese' },
    { code: 'ko-KR', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Korean' },
    { code: 'nl-BE', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Dutch' },
    { code: 'nl-NL', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Dutch' },
    { code: 'no-NO', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Norwegian' },
    { code: 'pl-PL', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Polish' },
    { code: 'pt-BR', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Portugese' },
    { code: 'pt-PT', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Portugese' },
    { code: 'ro-RO', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Romanian' },
    { code: 'ru-RU', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Russian' },
    { code: 'sk-SK', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Slovak' },
    { code: 'sv-SE', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Swedish' },
    { code: 'ta-IN', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Tamil' },
    { code: 'ta-LK', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Tamil' },
    { code: 'th-TH', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Thai' },
    { code: 'tr-TR', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Turkish' },
    { code: 'zh-CN', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Chinese' },
    { code: 'zh-HK', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Chinese' },
    { code: 'zh-TW', system: 'https://hl7chile.cl/fhir/ig/clcore/CodeSystem/CSCodigoslenguaje', display: 'Chinese' }
];

linkType = [
    { code: 'replaced-by', display: 'Replaced By'},
    { code: 'replaces', display: 'Replaces'},
    { code: 'refer', display: 'Refer'},
    { code: 'seealso', display: 'See Also'}
]
const telecomCodeList = ['email', 'phone', 'fax', 'pager', 'url', 'sms', 'other'];
const telecomSystemList= ['http://hl7.org/fhir/contact-point-system']
const telecomUseList = ['casa', 'trabajo', 'móvil']; 
const phonePrefixList = ['+1', '+44', '+49', '+61', '+81' , '+86' , '56' ];
const emailDomainsList = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com' , 'usach.cl', 'customdomain.com'];
const listaRelaciones = ['padre', 'hijo', 'cónyuge', 'pareja', 'hermano/a', 'amigo/a', 'pariente'];
const lenguageList = ['es', 'en', 'fr', 'de', 'it' , 'pt', 'zh'];

/**
 * Class for Paciente state management.
 */
class PacienteData  {

    /**
     * Initializes the instance.
     */
    constructor() {
        this.patientData = {
            identidadDeGenero : genderList[Math.floor(Math.random() * genderList.length)],
            sexoBiologico : sexList[Math.floor(Math.random() * sexList.length)],
            nacionalidad : {
                url: nacionaleidadUrl,
                value:{
                    coding: codigoDePaises[Math.floor(Math.random() * codigoDePaises.length)]
                }
            },
            identifier: {
                use: identifierUse[Math.floor(Math.random() * identifierUse.length)],
                type: {
                    paises: codigoDePaises[Math.floor(Math.random() * codigoDePaises.length)],
                    coding: identifierCoding[Math.floor(Math.random() * identifierCoding.length)],
                },
                value: this._generateRandomRun()
            },
            NombreOficial:{
                use: 'official',
                family:{
                    segundoApellido: this._generateRandomString(10)
                },
                given: this._generateRandomString(10),
            },
            NombreSocial:{
                use: 'usual',
                given: this._generateRandomString(10),
            },
            telecom:{
                system: telecomSystem[Math.floor(Math.random() * telecomSystem.length)],
                value: this._generateRandomString(10),
                use: telecomUse[Math.floor(Math.random() * telecomUse.length)]
            },
            birthDate: this._generateRandomBirthDate(),
            address: this._generateRandomAddress(),
            contact: {
                IdContacto: this._generateRandomRun(),
                relationship: contactRelationship[Math.floor(Math.random() * contactRelationship.length)],
                name: {
                    use: 'usual',
                    family: {
                        segundoApellido: this._generateRandomString(10)
                    },
                    given: this._generateRandomString(10)
                },
                },
            communication: {
                lenguage:{
                    coding: comunicationLenguage[Math.floor(Math.random() * comunicationLenguage.length)]
                },
            },
            generalPractitioner: {
                id: this._generateRandomRun(),
                reference: 'Practitioner/reference',
                display: this._generateRandomString(10)
            }
            
            }
        this.ethereumAccount= this._generateRandomAccount();    
        };        

    //seccion de metodos de la clase    
    // Generate a random Ethereum account 
    _generateRandomAccount() {
        const wallet = ethers.Wallet.createRandom();
        const address = wallet.address;
        const privateKey = wallet.privateKey;
        
        return {
            address,
            privateKey
        };
    };
    _generateRandomRelationship() {
        const relationship = {
            id: generateRandomChileanRun(),
            relationship: listaRelaciones[Math.floor(Math.random() * listaRelaciones.length)],
            name: generateRandomString(10),
            telecom: generateRandomTelecom(),
        };
        return relationship;
    };
    _generateRandomBirthDate() {
        // Generate a random birthDate
        const year = Math.floor(Math.random() * 50) + 1950;
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1;
        const birthDate = year + '-' + month + '-' + day;
        return birthDate;
    }

    _generateRandomAddress() {
        const index = Math.floor(Math.random() * codigoDePaises.length);
        const address = {
        //select a random country from the list
            country: codigoDePaises[index],
            city: this._generateRandomString(10),
            street: this._generateRandomString(10),
            postalCode: this._generateRandomString(10),
            number: toString(Math.floor(Math.random() * 1000)),
        }
        return address;
    
    }
    _generateRandomRun() {
        // Generate a random run
        function generateRandomChileanRun() {
            const runDigits = Math.floor(Math.random() * 100000000);
            const verifierDigit = calculateVerifierDigit(runDigits);
            const run = `${runDigits}-${verifierDigit}`;
        return run;
        }

        function calculateVerifierDigit(runDigits) {
            const runDigitsArray = Array.from(String(runDigits), Number);
            const multipliers = [2, 3, 4, 5, 6, 7];
            let sum = 0;

            for (let i = runDigitsArray.length - 1, j = 0; i >= 0; i--, j++) {
                sum += runDigitsArray[i] * multipliers[j % multipliers.length];
        }

            const remainder = sum % 11;
            const verifierDigit = remainder === 0 ? 0 : 11 - remainder;
        return verifierDigit === 10 ? 'K' : String(verifierDigit);
        }
        const run = generateRandomChileanRun();
        return run;
    }


    _generateRandomEmail() {
        // Generate a random email
        // Implement your logic here
        // generate a random email using emailDomainsList
        const email = this._generateRandomString(10) + '@' + emailDomainsList[Math.floor(Math.random() * emailDomainsList.length)];
        return email;
    }
    _generateRandomUrl() {
        // Generate a random url
        // Implement your logic here
        // generate a random url 
        const url = 'http://' + this._generateRandomString(10) + '.com';
        return url;
    }
    _generateRandomString(maxLength = 12) {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';    
        for (let i = 0; i < maxLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }
    getPatientData() {
        return this.patientData;
    }
    getEthereumAccount() {
        return this.ethereumAccount;
    }
    getPatient(){
        return{
            patient: this.patientData,
            ethereumAccount: this.ethereumAccount
        }
    }

}

module.exports = PacienteData;
