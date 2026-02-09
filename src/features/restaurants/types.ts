export type Restaurant = {
  name: string;
  url: string;
  geo: {
    address: {
      streetAddress: string;
      addressLocality: string;
      postalCode: string;
    };
  };
};