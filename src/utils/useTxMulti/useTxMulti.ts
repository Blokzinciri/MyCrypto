import { useContext, useEffect } from 'react';
import { useReducer } from 'reinspect';

import { ITxObject, ITxStatus, ITxType } from '@types';
import { StoreContext, AccountContext, useAssets } from '@services';
import { makeTxConfigFromTxResponse, makePendingTxReceipt } from '@utils';

import { TxMultiReducer, initialState } from './reducer';
import { init, initWith, stopYield, prepareTx, sendTx, reset } from './actions';
import { TxParcel, TxMultiState } from './types';
import { identity, lensIndex, view } from '@vendor';

/*
  Create a queue of transactions the need to be sent in order.
  When you know which txs you want to send you:
  1. call `init([tx1, tx2])` or `initWith(getTxs, ...)`
  2. when the status of the previous tx is `ITxStatus.CONFIRMED` the queue will
     move to the next tx in line.
*/

export type TUseTxMulti = () => {
  prepareTx: ReturnType<typeof prepareTx>;
  sendTx: ReturnType<typeof sendTx>;
  reset: ReturnType<typeof reset>;
  currentTx: TxParcel;
  state: TxMultiState;
  init(txs: any[], account: any, network: any): Promise<void>;
  initWith(getTxs: () => Promise<Partial<ITxObject>[]>, account: any, network: any): Promise<void>;
  stopYield(): Promise<void>;
};

export const useTxMulti: TUseTxMulti = () => {
  const [state, dispatch] = useReducer(TxMultiReducer, initialState, identity, 'TxMulti');
  const getState = () => state;
  const { accounts } = useContext(StoreContext);
  const { addNewTxToAccount } = useContext(AccountContext);
  const { assets } = useAssets();
  const { account, network } = state;

  const currentTx: TxParcel = view(lensIndex(state._currentTxIdx), state.transactions);

  useEffect(() => {
    if (
      account &&
      network &&
      currentTx &&
      currentTx.txResponse &&
      currentTx.txHash &&
      currentTx.status === ITxStatus.BROADCASTED
    ) {
      const txConfig = makeTxConfigFromTxResponse(currentTx.txResponse, assets, network, accounts);
      const pendingTxReceipt = makePendingTxReceipt(currentTx.txHash)(ITxType.UNKNOWN, txConfig);
      addNewTxToAccount(account, pendingTxReceipt);
    }
  }, [currentTx]);

  return {
    state,
    init: init(dispatch),
    initWith: initWith(dispatch),
    stopYield: stopYield(dispatch),
    prepareTx: prepareTx(dispatch, getState),
    sendTx: sendTx(dispatch, getState),
    reset: reset(dispatch),
    currentTx
  };
};
