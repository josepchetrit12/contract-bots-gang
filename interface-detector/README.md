# :male_detective: InterfaceDetector

- Repo: https://github.com/OpenZeppelin/contract-bots-gang/blob/master/interface-detector

This agent uses [`ContractInspector`](https://explorer.forta.network/agent/0x9703bb3bf08bc89e6d0fd273fa995c32f75e8998c314bafdafcfe2491678f083) alerts and it automatically detects for interfaces adherences and contract type.

It detects:
- If it is an [Ownable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol) contract
- If it adheres to [ERC20](https://eips.ethereum.org/EIPS/eip-20) interface
- If it adheres to [ERC721](https://eips.ethereum.org/EIPS/eip-721) interface
- If it is an [AccessControl](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol) contract
- If it has upgradebility contract by exposing `upgradeTo` and `upgradeToAndCall` functions. This can be either a proxy (either `ERC1967` or not) or an UUPS implementation contract. 
- If it is an [UUPS](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/utils/UUPSUpgradeable.sol) implementation logic contract
- If it adheres to [ERC1967](https://eips.ethereum.org/EIPS/eip-1967) interface
- If it is a [TransparentUpgradeableProxy](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/transparent/TransparentUpgradeableProxy.sol) contract 
- If it is a [ProxyAdmin](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/transparent/ProxyAdmin.sol) contract

## How to support more interfaces

- Create a new `isItXXX` function in `src/inspectors.ts` file where `XXX` is the name of the interface you want to support.
- In this new function add the function and events names of the interface definition into the `functionsInInterface` and `eventsInInterface`. Be sure to remove parameters name and `indexes`/`memory`/`calldata` keywords or any other keyword that is not used to calculate the signatures of those functions and events.
- Add `isItXXX` to the imports of the `agent.ts` file.
- Call the `isItXXX` function inside the `analyzeInterface` and take the call results.
- Use the call results to push a new object into the `observationResults` array. Look at other examples to know how to fill the pushing object. Be sure to do this before `observationResults` is returned.

## Output

- Test block: `npm run block 15128926`

```
{
  "name": `Interface detected`,
  "description": `Contract {contractAddress} adheres to some interfaces`
  "alertId": `ID`,
  "protocol": "ethereum",
  "severity": "Info",
  "type": "Info",
  "metadata": {
    "types": // A list of supported interfaces
    "contractAddress": , // the contract address
    "overallConfidence": , // confidence level, many function signatures can correspond to different actual functions
    "extras": "{}" // extra fields
  }
}
```
