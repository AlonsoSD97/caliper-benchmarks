import { ethers } from 'ethers';

'use strict';

const telecomCodeList = ['email', 'phone', 'fax', 'pager', 'url', 'sms', 'other'];
const telecomSystemList = ['http://hl7.org/fhir/contact-point-system'];
const telecomUseList = ['casa', 'trabajo', 'móvil'];
const phonePrefixList = ['+1', '+44', '+49', '+61', '+81', '+86', '56'];
const emailDomainsList = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'usach.cl', 'customdomain.com'];

/**
 * Class for managing simple account states.
 */
class PacienteData {

    /**
     * Initializes the instance.
     */
    constructor(workerIndex) {
        this.accountPrefix = this._get26Num(workerIndex);
        this.telecom = this._generateRandomTelecom();
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

    _generateRandomTelecom() {
        const telecom = {
            id: this._generateRandomId(),
            system: this._generateRandomSystem(),
            value: this._generateRandomValue(),
            use: this._generateRandomUse()
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
        return system;
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

    _generateRandomString(maxLength) {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';

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
        return use;
    }
}

export default PacienteData;
