import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell, Dictionary, Slice } from "ton-core";
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
      .storeDict(null)
      .endCell();

    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code, data });
    return new DaoContract(address, { code, data });
  }

  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  async sendDeploy(provider: ContractProvider, via: Sender) {
    // const messageBody = beginCell()
    //   .storeUint(1, 32) // op (op #1 = create proposal)
    //   .storeUint(Date.now(), 64) // timestamp
    //   .storeUint(100, 32) // success threshold
    //   .storeUint(1, 32) // fail threshold
    //   .endCell();

    const daotonAddress = Address.parse("EQBQRTkM-tKgHZdOggw5bSxTdbku7Pyd60YLJwEHfQhFtRdr");

    const body = beginCell().storeUint(0, 32).storeAddress(this.address).storeAddress(daotonAddress).endCell();

    await provider.internal(via, {
      value: "0.02", // send 0.01 TON to contract for rent
      bounce: false,
      body,
    });
  }

  async sendProposal(provider: ContractProvider, via: Sender) {
    const daoContract = Address.parse("EQCeq1eEbTzsc1BWdgyPH_Q_vEk8miKjDVXKk6ZwCAdHVxj9");

    // const messageBody = beginCell()
    //   .storeUint(1, 32) // op (op #1 = create proposal)
    //   .storeUint(Date.now(), 64) // timestamp
    //   .storeCoins(100) // success threshold
    //   .storeCoins(20) // fail threshold
    //   .storeUint(0, 2)
    //   .storeRef(
    //     beginCell()
    //       .storeBuffer(Buffer.from(JSON.stringify({ name: "xxxx" })))
    //       .endCell()
    //   )
    //   // .storeAddress(daoContract)
    //   .endCell();

    const messageBody = beginCell()
      .storeUint(2, 32) // op (op #2 = vote)
      .storeUint(0, 32) // propsal_id
      .storeUint(0, 2) // vote
      .endCell();

    await provider.internal(via, {
      value: "0.01", // send 0.002 TON for gas
      body: messageBody,
    });
  }

  async vote(provider: ContractProvider, via: Sender) {
    const messageBody = beginCell()
      .storeUint(2, 32) // op (op #2 = vote)
      .storeUint(0, 32) // propsal_id
      .storeUint(1, 2) // vote
      .endCell();

    await provider.internal(via, {
      value: "0.01", // send 0.002 TON for gas
      body: messageBody,
    });
  }

  getDaoData = async (provider: ContractProvider) => {
    try {
      const { stack } = await provider.get("get_current_data", []);
      console.log(stack);
      // console.log("dao type id: ", stack.readBigNumber().toString());
      // console.log("token address: ", stack.readAddress().toString());
      // console.log("nft address : ", stack.readAddress().toString());
      // console.log("content :", stack.readBuffer().toString());
      // console.log("last proposal id :", stack.readBigNumber().toString());

      return stack;
    } catch {}
  };

  getProposal = async (provider: ContractProvider, id: number) => {
    const { stack } = await provider.get("get_proposal", [
      {
        type: "int",
        value: BigInt(id),
      },
    ]);

    // const { stack } = await provider.get("get_proposal", []);

    console.log(stack);

    // console.log("PROPS:", stack.readCell());
    return stack;
  };
}
