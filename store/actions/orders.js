import Order from "../../models/order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDER = "SET_ORDER";

export const fetchOrders = () => {
  try {
    return async (dispatch, getSate) => {
      const userId = getSate().auth.userId;
      //here you can run any async code you want!
      const response = await fetch(
        `https://rnshop-app.firebaseio.com/orders/${userId}.json`
      );

      if (!response.ok) {
        throw new Error("Algo ha salido mal!");
      }

      const resData = await response.json();
      const loadedOrders = [];
      for (const key in resData) {
        loadedOrders.push(
          new Order(
            key,
            resData[key].cartItems,
            resData[key].totalAmaount,
            new Date(resData[key].date)
          )
        );
      }
      dispatch({
        type: SET_ORDER,
        orders: loadedOrders
      });
    };
  } catch (error) {
    throw error;
  }
};

export const addOrder = (cartItems, totalAmaount) => {
  return async (dispatch, getSate) => {
    const token = getSate().auth.token;
    const userId = getSate().auth.userId;
    const date = new Date();
    //here you can run any async code you want!
    const response = await fetch(
      `https://rnshop-app.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cartItems,
          totalAmaount,
          date: date.toISOString() //esto en el servidor
        })
      }
    );
    let resData = await response.json();
    if (!response.ok) {
      throw new Error("Algo ha salido mal");
    }
    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resData.name,
        cartItems,
        amount: totalAmaount,
        date: date
      }
    });
  };
};
