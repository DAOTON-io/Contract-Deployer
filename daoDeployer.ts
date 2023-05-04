import dotenv from "dotenv";
import * as fs from "fs";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "ton-crypto";
import { TonClient, Cell, WalletContractV4, Address } from "ton";
import { makeid, sleep } from "./utils";
import DaoContract from "./DaoContract";
import { DaoContent } from "./models/DaoContent";

dotenv.config({ path: ".env" });

export const deploy = async () => {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // prepare contract's initial code and data cells for deployment
  const contractCode = Cell.fromBoc(fs.readFileSync("contract.cell"))[0]; // compilation output from step 6

  const contractHex = Cell.fromBoc(fs.readFileSync("contract.cell"))[0].toBoc().toString("hex");

  const initialContractValue = Date.now(); // to avoid collisions use current number of milliseconds since epoch as initial value
  const tokenContract = Address.parse("kQDyNhhx8N1Uy_jF4b1cT_CUFLsHKP6IwP6CwpsqBSM1tUJ1");
  const nftContract = Address.parse("kQDyNhhx8N1Uy_jF4b1cT_CUFLsHKP6IwP6CwpsqBSM1tUJ1");

  const daoContent: DaoContent = {
    name: makeid(5),
    description: makeid(5),
    image: makeid(5),
  };

  const contract = DaoContract.createForDeploy(contractCode, 2, tokenContract, nftContract, daoContent);

  // exit if contract is already deployed
  console.log("contract address:", contract.address.toString());
  if (await client.isContractDeployed(contract.address)) {
    console.log("contract already deployed");

    return "";
  }

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = process.env.MNEMONIC;
  const key = await mnemonicToWalletKey(mnemonic!.split(" "));
  const wallet = WalletContractV4.create({
    publicKey: key.publicKey,
    workchain: 0,
  });

  if (!(await client.isContractDeployed(wallet.address))) {
    console.log("wallet is not deployed");
    return "";
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  // send the deploy transaction
  const customContract = client.open(contract);
  await customContract.sendDeploy(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    //console.log("waiting for deploy transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }

  console.log("deploy transaction confirmed!");

  return contract.address.toString();
};
