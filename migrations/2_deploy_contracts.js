var FireToken = artifacts.require("./FireToken.sol"); // first 'var' was 'const'

module.exports = function(deployer) {
  deployer.deploy(FireToken, 1000000);
};
