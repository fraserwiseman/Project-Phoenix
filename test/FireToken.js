var FireToken = artifacts.require("./FireToken.sol");

contract('FireToken', function(accounts) {
    var tokenInstance;

    it('initialises the contract with the correct values', function() {
        return FireToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.name();;
        }).then(function(name) {
            assert.equal(name, 'Fire Token', 'has correct name');
            return tokenInstance.symbol();
        }).then(function(symbol) {
            assert.equal(symbol, 'FIRE', 'has the correct symbol');
            return tokenInstance.standard();
        }).then(function(standard) {
            assert.equal(standard, 'Fire Token v1.0', 'has the correct standard');
        });
    })

    it('allocates the initial supply upon deployment', function() {
        return FireToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000')
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance) {
            assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the inital supply to the admin account')
        })
    });

    it('transfers token ownership', function() {
        return FireToken.deployed().then(function(instance) {
            tokenInstance = instance;
            // Test 'require' statement first by transferring something larger than the sender's balance
            return tokenInstance.transfer.call(accounts[1], 99999999999999999999999);
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('invalid') >= 0, 'error message must contain invalid');
            return tokenInstance.transfer.call(accounts[1], 250000, {from: accounts[0] });
        }).then(function(success) {
            assert.equal(success, true, 'it returns true');
            return tokenInstance.transfer(accounts[1], 250000, {from: accounts[0] });
        }).then(function(receipt) {assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiving amount');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 750000, 'deducts amount from sending amount');
        });
    });








})