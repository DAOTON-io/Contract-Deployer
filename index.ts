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

  // await contract.getProposal();
  // await contract.getProposal();
  await contract.getDaoData();
}

deploy().then((data) => {
  newContractCreateTest(data);
});

// newContractCreateTest("EQAgsMx-jXIFqVMv2Ph-i9LYc6S-QlBUFwWDMGlpSfrZEIPd");
// createProposalTest("EQCgswQhtEXBht6GcoddC2bi3E5xzEJeS8duIAGAxjnr2tfU").then(() => {
//   newContractCreateTest("EQCgswQhtEXBht6GcoddC2bi3E5xzEJeS8duIAGAxjnr2tfU");
// });
// newContractCreateTest("EQCIxWE49K2CNT7ddrQpShie57xh1N3NYr1zjWCZHQlm_V5-");
