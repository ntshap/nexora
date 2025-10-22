const asyncStorageStub = {
  getItem: async () => null,
  setItem: async () => undefined,
  removeItem: async () => undefined,
  clear: async () => undefined,
};

export default asyncStorageStub;
