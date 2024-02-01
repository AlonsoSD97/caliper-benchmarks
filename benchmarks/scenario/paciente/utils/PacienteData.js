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

const genderList = [ 'hombre', 'mujer',  ,'otro', 'no especificado'];
const sexList = ['Masculino', 'Femenino', 'Otro'];
const telecomCodeList = ['email', 'phone', 'fax', 'pager', 'url', 'sms', 'other'];
const telecomSystemList= ['http://hl7.org/fhir/contact-point-system']
const telecomUseList = ['casa', 'trabajo', 'móvil']; 
const phonePrefixList = ['+1', '+44', '+49', '+61', '+81' , '+86' , '56' ];
const emailDomainsList = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com' , 'usach.cl', 'customdomain.com'];
const listaRelaciones = ['padre', 'hijo', 'cónyuge', 'pareja', 'hermano/a', 'amigo/a', 'pariente'];
const lenguageList = ['es', 'en', 'fr', 'de', 'it' , 'pt', 'zh'];
const codigoPais = {
    'Chile': '152',
    'Estados Unidos': '316',
    'Reino Unido': '826',
    'Alemania': '276',
    'Australia': '334',
    'Japón': '392',
    'China': '158'
};
/**
 * Class for managing simple account states.
 */
class PacienteData  {

    /**
     * Initializes the instance.
     */
    constructor(workerIndex, initialMoney, moneyToTransfer, accounts = 0) {
        this.accountPrefix = this._get26Num(workerIndex);
        this.telecom = this._generateRandomTelecom();
        this.name = this._generateRandomString();
        this.birthDate = this._generateRandomBirthDate();
        this.gender = this._generateRandomGender();
        this.sex = this._generateRandomSex();
        this.address = this._generateRandomAddress();
    }
    // Generate a random Ethereum account
    _generateRandomAccount() {
        const wallet = ethers.Wallet.createRandom();
        const address = wallet.address;
        const privateKey = wallet.privateKey;
        
        return {
            address,
            privateKey
        };
    }
    _generateRandomRelationship() {
        const relationship = {
            id: generateRandomChileanRun(),
            relationship: listaRelaciones[Math.floor(Math.random() * listaRelaciones.length)],
            name: generateRandomString(10),
            telecom: generateRandomTelecom(),
        };
        return relationship;
    }
    _generateRandomBirthDate() {
        // Generate a random birthDate
        const year = Math.floor(Math.random() * 50) + 1950;
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1;
        const birthDate = year + '-' + month + '-' + day;
        return birthDate;
    }
    _generateRandomGender() {
        gender = genderList[Math.floor(Math.random() * genderList.length)];
        return gender
    }
    _generateRandomSex() {
        sex = sexList[Math.floor(Math.random() * sexList.length)];
        return sex
    }
    _generateRandomAddress() {
        keylist = Object.keys(codigoPais);
        randomKey = keylist[Math.floor(Math.random() * keylist.length)];
        const address = {
        //select a random country from the list
            country: randomKey,
            city: generateRandomString(10),
            street: generateRandomString(10),
            postalCode: generateRandomString(10),
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
        run = generateRandomChileanRun();
        return run;
    }

    _generateRandomTelecom() {
        const telecom = {
            id: generateRandomId(),
            system: generateRandomSystem(),
            value: generateRandomValue(),
            use: generateRandomUse()
        };

        return telecom;
    }

    _generateRandomId() {
        // Generate a random ID
        // Implement your logic here
        // Take a random value from telecomCodeListS
        const id = telecomCodeList[Math.floor(Math.random() * telecomCodeList.length)];
        return id;
    }

    _generateRandomSystem() {
        // Generate a random system
        // Implement your logic here
        // Take a random value from telecomSystemList
        const system = telecomSystemList[Math.floor(Math.random() * telecomSystemList.length)];
    }

    _generateRandomValue() {
        // Generate a random value
        // Implement your logic here
        // generate a random phone using phonePrefixList 
        const value = phonePrefixList[Math.floor(Math.random() * phonePrefixList.length)] + toString(Math.floor(Math.random() * 100000000));
        return value;
    }
    _generateRandomEmail() {
        // Generate a random email
        // Implement your logic here
        // generate a random email using emailDomainsList
        const email = generateRandomString(10) + '@' + emailDomainsList[Math.floor(Math.random() * emailDomainsList.length)];
        return email;
    }
    _generateRandomUrl() {
        // Generate a random url
        // Implement your logic here
        // generate a random url 
        const url = 'http://' + generateRandomString(10) + '.com';
        return url;
    }
    _generateRandomString(maxLength) {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        const maxLength = 12;

        for (let i = 0; i < maxLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }

    _generateRandomUse() {
        // Generate a random use
        // Implement your logic here
        // Take a random value from telecomUseList
        const use = telecomUseList[Math.floor(Math.random() * telecomUseList.length)];
    }


}

module.exports = PacienteData;
