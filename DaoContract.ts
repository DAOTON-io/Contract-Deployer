import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from "ton-core";

export default class DaoContract implements Contract {
  static createForDeploy(code: Cell, tokenContract: Address, nftCollection: Address): DaoContract {
    const data = beginCell()
      .storeUint(1, 64)
      .storeAddress(tokenContract)
      .storeAddress(nftCollection)
      .storeRef(
        beginCell()
          .storeUint(0, 64)
          .storeBit(false) // forward_payload in this slice, not separate cell
          .endCell()
      )
      .storeRef(
        beginCell()
          .storeUint(0, 64)
          .storeBit(false) // forward_payload in this slice, not separate cell
          .endCell()
      )
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

  getContract = async (provider: ContractProvider) => {
    const { stack } = await provider.get("get_current_data", []);
    console.log(stack);
    return stack;
  };
}
