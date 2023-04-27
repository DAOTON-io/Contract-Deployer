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
  console.log("1");
  newContractCreateTest(data).finally(() => {
    console.log("2");
    createProposalTest(data).then(() => {
      console.log("3");
      newContractCreateTest(data);
    });
  });
});
// createProposalTest("EQCdFH26wm33W2k5ld0tIJfOweCy28I30byBTytLXcS1hMEv").then(() => {
//   console.log("3");
//   newContractCreateTest("EQCdFH26wm33W2k5ld0tIJfOweCy28I30byBTytLXcS1hMEv");
// });
// newContractCreateTest("EQA_I3TWKZLud5N9yxJJhznsfkx8NIWz0rV0kAgSbr9P-fvt");

// newContractCreateTest("EQBwLvMZhdRUgPBiQRYoeIhKldUWZDcm8wVtL0pJJdrBgpDb");
