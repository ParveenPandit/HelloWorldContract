/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class HelloWorldContractContract extends Contract {

  //update ledger with a greeting to show that the function was called
  async instantiate(ctx) {
    let greeting = { text: 'Instantiate was called!' };
    await ctx.stub.putState('GREETING', Buffer.from(JSON.stringify(greeting)));
  }

  //take argument and create a greeting object to be updated to the ledger
  async transaction1(ctx, arg1) {
    console.info('transaction1', arg1);
    let greeting = { text: arg1 };
    await ctx.stub.putState('GREETING', Buffer.from(JSON.stringify(greeting)));
    return JSON.stringify(greeting);
  }

    // look up data by key
    async query(ctx, key) {
        console.info('querying for key: ' + key  );
        let returnAsBytes = await ctx.stub.getState(key);
        let result = JSON.parse(returnAsBytes);
        return JSON.stringify(result);
      }

}

module.exports = HelloWorldContractContract;
