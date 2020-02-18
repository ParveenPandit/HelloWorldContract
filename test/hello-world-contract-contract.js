/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { HelloWorldContractContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('HelloWorldContractContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new HelloWorldContractContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"hello world contract 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"hello world contract 1002 value"}'));
    });

    describe('#helloWorldContractExists', () => {

        it('should return true for a hello world contract', async () => {
            await contract.helloWorldContractExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a hello world contract that does not exist', async () => {
            await contract.helloWorldContractExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createHelloWorldContract', () => {

        it('should create a hello world contract', async () => {
            await contract.createHelloWorldContract(ctx, '1003', 'hello world contract 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"hello world contract 1003 value"}'));
        });

        it('should throw an error for a hello world contract that already exists', async () => {
            await contract.createHelloWorldContract(ctx, '1001', 'myvalue').should.be.rejectedWith(/The hello world contract 1001 already exists/);
        });

    });

    describe('#readHelloWorldContract', () => {

        it('should return a hello world contract', async () => {
            await contract.readHelloWorldContract(ctx, '1001').should.eventually.deep.equal({ value: 'hello world contract 1001 value' });
        });

        it('should throw an error for a hello world contract that does not exist', async () => {
            await contract.readHelloWorldContract(ctx, '1003').should.be.rejectedWith(/The hello world contract 1003 does not exist/);
        });

    });

    describe('#updateHelloWorldContract', () => {

        it('should update a hello world contract', async () => {
            await contract.updateHelloWorldContract(ctx, '1001', 'hello world contract 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"hello world contract 1001 new value"}'));
        });

        it('should throw an error for a hello world contract that does not exist', async () => {
            await contract.updateHelloWorldContract(ctx, '1003', 'hello world contract 1003 new value').should.be.rejectedWith(/The hello world contract 1003 does not exist/);
        });

    });

    describe('#deleteHelloWorldContract', () => {

        it('should delete a hello world contract', async () => {
            await contract.deleteHelloWorldContract(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a hello world contract that does not exist', async () => {
            await contract.deleteHelloWorldContract(ctx, '1003').should.be.rejectedWith(/The hello world contract 1003 does not exist/);
        });

    });

});