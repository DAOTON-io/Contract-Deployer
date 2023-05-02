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
  await contract.getProposal(0);
}

// deploy().then((data) => {
//   console.log("1");
//   // newContractCreateTest(data).finally(() => {
//   //   console.log("2");
//   //   createProposalTest(data).then(() => {
//   //     console.log("3");
//   //     newContractCreateTest(data);
//   //   });
//   // });
// });
// createProposalTest("EQCov901r3EQ8YfyNZ92Nz5B2Jswv9LdVms1jjQIUjo1jpdi").then(() => {
//   console.log("3");
//   // newContractCreateTest("EQCM32Frx8tFMBt673-BVz0KblSurtEIIckKAGietjeAj2Tb");
// });
// newContractCreateTest("EQCov901r3EQ8YfyNZ92Nz5B2Jswv9LdVms1jjQIUjo1jpdi");
