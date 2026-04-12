import { type Product, Category } from "./types";

const PRODUCTS_API_BASE_URL = process.env.PRODUCTS_API_BASE_URL ?? 'http://localhost:3001';
const REQUEST_TIMEOUT_MS = 10_000;

const mergeSignals = (signals: Array<AbortSignal | undefined>): AbortSignal | undefined => {
  const validSignals = signals.filter((signal): signal is AbortSignal => Boolean(signal));

  if (validSignals.length === 0) {
    return undefined;
  }

  const controller = new AbortController();
  const abort = () => controller.abort();

  validSignals.forEach((signal) => {
    if (signal.aborted) {
      abort();
      return;
    }

    signal.addEventListener('abort', abort, { once: true });
  });

  return controller.signal;
};

export const fetchItemById = async (itemId: string, signal?: AbortSignal): Promise<Product> => {
  const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const response = await fetch(`${PRODUCTS_API_BASE_URL}/api/item`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ itemId }),
    cache: 'default',
    signal: mergeSignals([signal, timeoutSignal]),
  });

  if (response.status === 404) {
    throw new Error('item not found');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch item');
  }

  return (await response.json()) as Product;
};

export const fetchCategory = async (category: Category, signal?: AbortSignal): Promise<Product[]> => {
  const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const response = await fetch(`${PRODUCTS_API_BASE_URL}/api/category`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ category }),
    cache: 'default',
    signal: mergeSignals([signal, timeoutSignal]),
  });

  if (response.status === 404) {
    throw new Error('items for category not found');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch items for category');
  }

  return (await response.json()) as Product[];
};

export const fetchSpecials = async (signal?: AbortSignal): Promise<Product[]> => {
  const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const response = await fetch(`${PRODUCTS_API_BASE_URL}/api/specials`, {
    method: 'GET',
    cache: 'default',
    signal: mergeSignals([signal, timeoutSignal]),
  });

  if (response.status === 404) {
    throw new Error('items for category not found');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch items for category');
  }

  return (await response.json()) as Product[];
};