import { getExchangeRate } from './exchangeApi';

// Definišemo globalni fetch kao Jest mock funkciju
global.fetch = jest.fn();

describe('Exchange API - getExchangeRate', () => {
  let consoleSpy: jest.SpyInstance;

  // Pre svih testova, "utišavamo" console.error 
  beforeAll(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // Posle svakog testa čistimo mock-ove kako se ne bi mešali
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Na kraju vraćamo console.error u normalno stanje
  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it('treba uspesno da preuzme i vrati kurs za zadatu valutu (EUR)', async () => {
    // 1. Priprema (Mock-ujemo uspešan odgovor API-ja)
    const mockResponse = {
      ok: true,
      json: async () => ({ rates: { EUR: 0.0085, USD: 0.0092 } }),
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    // 2. Akcija (Pozivamo funkciju)
    const rate = await getExchangeRate('EUR');

    // 3. Provera (Da li je fetch pozvan sa dobrim linkom i da li je vratio 0.0085)
    expect(global.fetch).toHaveBeenCalledWith('https://api.exchangerate-api.com/v4/latest/RSD');
    expect(rate).toBe(0.0085);
  });

  it('treba da vrati null ako API vrati status koji nije OK (npr. 404 ili 500)', async () => {
    // 1. Priprema (Simuliramo da je server vratio grešku)
    const mockResponse = { ok: false };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    // 2. Akcija
    const rate = await getExchangeRate('EUR');

    // 3. Provera
    expect(rate).toBeNull();
    expect(consoleSpy).toHaveBeenCalled(); // Proveravamo da li je ispisao grešku u konzolu
  });

  it('treba da vrati null ako dodje do potpunog pada mreze', async () => {
    // 1. Priprema (Simuliramo da je internet pukao - Promise.reject)
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));

    // 2. Akcija
    const rate = await getExchangeRate('EUR');

    // 3. Provera
    expect(rate).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
  });
});