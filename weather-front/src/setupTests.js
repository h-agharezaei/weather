const mockGeolocation = {
  getCurrentPosition: jest.fn().mockImplementationOnce((success) =>
    Promise.resolve(
      success({
        city: 'Tehran',
      }),
    ),
  ),
};

global.navigator.geolocation = mockGeolocation;
