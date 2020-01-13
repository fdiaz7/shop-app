import moment from "moment-with-locales-es6";

class Order {
  constructor(id, items, totalAmount, date) {
    this.id = id;
    this.items = items;
    this.totalAmount = totalAmount;
    this.date = date;
  }
  get readableDate() {
    // return this.date.toLocaleDateString("en-GB", {
    //   year: "numeric",
    //   month: "long",
    //   day: "numeric",
    //   hour: "2-digit",
    //   minute: "2-digit"
    // });
    return moment(this.date)
      .locale("es")
      .format("DD MMMM YYYY");
  }
}

export default Order;
