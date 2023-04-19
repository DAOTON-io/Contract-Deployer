// import { deploy } from "./deployer";

import { getHttpEndpoint } from "@orbs-network/ton-access";
import { Address, TonClient } from "ton";
import { deploy } from "./daoDeployer";
import { createProposalTest } from "./proposal";
import DaoContract from "./DaoContract";

// const test = await getContract();

async function newContractCreateTest(address: string) {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // open Counter instance by address
  const contractAddress = Address.parse(address); // replace with your address from step 8
  const masterContract = new DaoContract(contractAddress);
  const contract = client.open(masterContract);

  // call the getter on chain
  const counterValue = await contract.getContract();
}

// deploy().then((data) => {
//   newContractCreateTest(data);
// });

// newContractCreateTest("EQAgsMx-jXIFqVMv2Ph-i9LYc6S-QlBUFwWDMGlpSfrZEIPd");
createProposalTest("EQCy0lsIwRuChtbitcG1jY9WXCjUiQo2eNIDWCo_UIV-Dzn4").then(() => {
  newContractCreateTest("EQCy0lsIwRuChtbitcG1jY9WXCjUiQo2eNIDWCo_UIV-Dzn4");
});
// newContractCreateTest("EQCmHn9GJSrVArzRUOjgw8kjU0ybEbzy1vu9UwBj247bEtBO");
