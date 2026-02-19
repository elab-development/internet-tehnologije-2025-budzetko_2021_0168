import { getExchangeRate } from './exchangeApi';

// "Mock-ujemo" fetch da ne bismo stvarno trošili API pozive tokom testa
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ rates: { EUR: 0.0085 } }),
  })
) as jest.Mock;

describe('Exchange API Test', () => {
  it('treba da vrati kurs za EUR kao broj', async () => {
    const rate = await getExchangeRate('EUR');
    
    // Proveravamo dva uslova:
    expect(rate).toBeDefined();
    expect(typeof rate).toBe('number');
  });

  it('treba da vrati defaultnu vrednost ako API padne', async () => {
    // Simuliramo grešku na mreži
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject("API Error")
    );

    const rate = await getExchangeRate('EUR');
    expect(rate).toBeNull();
  });
});