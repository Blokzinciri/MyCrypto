import getUuid from 'uuid-by-string';
import { toChecksumAddress } from 'ethereumjs-util';
import { v4 as uuidv4 } from 'uuid';
import { TUuid, NetworkId } from '@types';

// This is a randomly-generated uuid (non-deterministic).
export const generateUUID = (): TUuid => {
  return uuidv4() as TUuid;
};

const generateUUIDByIdAndAddress = (id: string, address?: string) =>
  address ? (getUuid(`${id}-${toChecksumAddress(address)}`) as TUuid) : (getUuid(`${id}`) as TUuid);

export const generateAssetUUID = (chainId: string | number, address?: string): TUuid =>
  generateUUIDByIdAndAddress(chainId.toString(), address);

export const generateDeterministicAddressUUID = (id: NetworkId, address: string) =>
  generateUUIDByIdAndAddress(id, address);

export const getUUID = (val: string): TUuid => getUuid(val) as TUuid;
