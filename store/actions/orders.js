export const ADD_ORDER = "ADD_ORDER";

export const addOrder = (cartItems, totalAmaount) => {
  return {
    type: ADD_ORDER,
    orderData: { items: cartItems, amount: totalAmaount }
  };
};
