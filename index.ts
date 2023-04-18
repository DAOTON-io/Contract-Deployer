// import { deploy } from "./deployer";

import { getHttpEndpoint } from "@orbs-network/ton-access";
import { Address, TonClient } from "ton";
import MasterContract from "./MasterContract";
import { deploy } from "./deployer";

// const test = await getContract();

async function main(address: string) {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // open Counter instance by address
  const contractAddress = Address.parse(address); // replace with your address from step 8
  const masterContract = new MasterContract(contractAddress);
  const contract = client.open(masterContract);

  // call the getter on chain
  const counterValue = await contract.getContract();
  console.log("value:", counterValue.toString());
}

deploy().then((data) => {
  main(data);
});

// main("EQDZsSr7q4WP4PE2bZQzwjpv_cq5BAst50P_9-WF3wyR8nX9");
