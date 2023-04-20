import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "ton-crypto";
import { TonClient, WalletContractV4, Address } from "ton";
import DaoContract from "./DaoContract";
import { sleep } from "./utils";

export async function createProposalTest(address: string) {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });
  //const client = new TonClient({ endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC", apiKey: "f20ff0043ded8c132d0b4b870e678b4bbab3940788cbb8c8762491935cf3a460" });

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = process.env.MNEMONIC;
  const key = await mnemonicToWalletKey(mnemonic!.split(" "));

  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  if (!(await client.isContractDeployed(wallet.address))) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  // open Dao instance by address
  const daoAddress = Address.parse(address);
  const dao = new DaoContract(daoAddress);
  const daoContract = client.open(dao);

  // send the increment transaction
  await daoContract.sendProposal(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    //console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}