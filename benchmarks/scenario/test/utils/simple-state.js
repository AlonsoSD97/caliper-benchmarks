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

/**
 * Class for managing simple account states.
 */
class SimpleState {

    /**
     * Initializes the instance.
     */
    constructor() {
        this.name = this._generateRandomString(10);
        this.edad = Math.floor(Math.random() * 100);
        this.index = 0;
    }
    _increaseIndex(){
        this.index = this.index + 1;
        return this.index;
    }

    _generateRandomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    getOpenAccountArguments() {
        this.accountsGenerated++;
        return {
            account: this._getAccountKey(this.accountsGenerated),
            money: this.initialMoney
        };
    }

    /**
     * Get the arguments for querying an account.
     * @returns {object} The account arguments.
     */
    getQueryArguments() {
        return {
            account: this._getRandomAccount()
        };
    }

    /**
     * Get the arguments for transferring money between accounts.
     * @returns {object} The account arguments.
     */
    getTransferArguments() {
        return {
            name: this.name,
            edad: this.edad,
            amount: this.moneyToTransfer
        };
    }
}
