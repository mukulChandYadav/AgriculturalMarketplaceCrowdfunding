const StandardRegisterUserHub = artifacts.require('./StandardRegisterUserHub.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('StructStorage', (accounts) => {
    let standardRegisterUserHub, creatorAccount, sender, receiver, registeringAccount, registeringAccount2;

    before(async () => {
        standardRegisterUserHub = await StandardRegisterUserHub.new();
        creatorAccount = accounts[0];
    });

    describe('creation', () => {
        it('deploys successfully', async () => {
            assert.notEqual(StandardRegisterUserHub.address, 0x0);
            assert.notEqual(StandardRegisterUserHub.address, '');
            assert.notEqual(StandardRegisterUserHub.address, null);
            assert.notEqual(StandardRegisterUserHub.address, undefined);
        });

        it('sets owner account', async () => {
            const owner = await standardRegisterUserHub.getOwner();
            console.log(owner);
            assert.equal(owner, accounts[0]);

        });
    });

    describe('Register Users', () => {

        describe('FAILURE', () => {

            it('must not re-register a user', async () => {
                registeringAccount = accounts[3]; // Receiver cannot send
                userRole = 3;
                await standardRegisterUserHub.registerUser("Investor1", 3, { from: registeringAccount });
                await standardRegisterUserHub.registerUser("Investor1", 3, { from: registeringAccount }).should.be.rejected;
            });
        });

        describe('SUCCESS', () => {

            before(async () => {
                registeringAccount = accounts[4];
                registeringAccount2 = accounts[1];
                await standardRegisterUserHub.registerUser("Investor1", 3, { from: registeringAccount });
                //Register another user
                await standardRegisterUserHub.registerUser("Farmer1", 1, { from: registeringAccount2 });
            });

            it('verify user has registered', async () => {
                assert.equal(await standardRegisterUserHub.isRegistered({ from: registeringAccount }), true);

            });

            it('verify user has assigned investor role', async () => {
                assert.equal(await standardRegisterUserHub.getUserRole({ from: registeringAccount }), 3);

            });
            it('verify user has assigned name', async () => {
                assert.equal(await standardRegisterUserHub.getUserName({ from: registeringAccount }), "Investor1");

            });

            it('verify user has assigned name for particular account', async () => {
                assert.equal(await standardRegisterUserHub.getUserNameOf(registeringAccount, { from: registeringAccount2 }), "Investor1");

            });
        });
    });
});