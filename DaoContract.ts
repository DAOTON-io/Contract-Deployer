import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from "ton-core";
import { DaoContent } from "./models/DaoContent";

export default class DaoContract implements Contract {
  static createForDeploy(code: Cell, daoTypeId: number, tokenContract: Address, nftCollection: Address, daoContent: DaoContent): DaoContract {
    const data = beginCell()
      .storeUint(daoTypeId, 16)
      .storeAddress(tokenContract)
      .storeAddress(nftCollection)
      .storeRef(
        beginCell()
          .storeBuffer(Buffer.from(JSON.stringify(daoContent)))
          .endCell()
      )
      .storeUint(0, 32)
      .storeRef(beginCell().storeDict(null).endCell())
      .endCell();

    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code, data });
    return new DaoContract(address, { code, data });
  }

  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  async sendDeploy(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: "0.01", // send 0.01 TON to contract for rent
      bounce: false,
    });
  }

  async sendProposal(provider: ContractProvider, via: Sender) {
    const messageBody = beginCell()
      .storeUint(1, 32) // op (op #1 = create proposal)
      .storeUint(Date.now(), 64) // timestamp
      .storeCoins(100) // success threshold
      .storeCoins(1) // fail threshold
      .endCell();

    await provider.internal(via, {
      value: "0.002", // send 0.002 TON for gas
      body: messageBody,
    });
  }

  getDaoData = async (provider: ContractProvider) => {
    try {
      const { stack } = await provider.get("get_dao_data", []);
      console.log(stack);
      // console.log("dao type id: ", stack.readBigNumber().toString());
      // console.log("token address: ", stack.readAddress().toString());
      // console.log("nft address : ", stack.readAddress().toString());
      // console.log("content :", stack.readBuffer().toString());
      // console.log("last proposal id :", stack.readBigNumber().toString());

      return stack;
    } catch {}
  };

  getProposal = async (provider: ContractProvider) => {
    const { stack } = await provider.get("get_proposal", [
      {
        type: "int",
        value: BigInt(0),
      },
    ]);

    console.log(stack);

    // console.log("PROPS:", stack.readCell());
    return stack;
  };
}
