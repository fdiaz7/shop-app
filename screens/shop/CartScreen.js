import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Colors";
import CartItem from "../../components/shop/CarItem";
import Card from "../../components/UI/Card";
import * as cartActions from "../../store/actions/cart";
import * as ordersActions from "../../store/actions/orders";

const CartScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const cartTotalAmount = useSelector(state => state.cart.totalAmount);
  const cartItems = useSelector(state => {
    const transformeCartItem = [];
    for (const key in state.cart.items) {
      transformeCartItem.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum
      });
    }
    return transformeCartItem.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });
  const dispatch = useDispatch();
  useEffect(() => {
    if (error) {
      Alert.alert("Algo salio mal", error, [{ text: "ok" }]);
    }
  }, [error]);

  const sendOrdenHandler = async () => {
    setIsLoading(true);
    try {
      await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{" "}
          <Text style={styles.amount}>
            ${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size='small' color={Colors.primary} />
        ) : (
          <Button
            color={Colors.accent}
            title='Crear Pedido'
            disabled={cartItems.length === 0}
            onPress={sendOrdenHandler}
          />
        )}
      </Card>
      <View>
        <FlatList
          data={cartItems}
          keyExtractor={item => item.productId}
          renderItem={itemData => (
            <CartItem
              quantity={itemData.item.quantity}
              title={itemData.item.productTitle}
              amount={itemData.item.sum}
              onRemove={() =>
                dispatch(cartActions.removeToCart(itemData.item.productId))
              }
              deletable={true}
            />
          )}
        />
      </View>
    </View>
  );
};

CartScreen.navigationOptions = {
  headerTitle: "Tu Carrito"
};

const styles = StyleSheet.create({
  screen: {
    margin: 20
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18
  },
  amount: {
    color: Colors.primary
  }
});

export default CartScreen;
