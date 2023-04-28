const Order = require("../../models/order");
const User = require("../../models/user");
const { sendConfirmationEmail } = require("../../routes/nodeMailer");
exports.updateOrder = (req, res) => {
  console.log(req.body.user);
  User.findById(req.body.user, (err, user) => {
    console.log("user", user);
    if (!err) {
      if (req.body.type === "delivered") {
        sendConfirmationEmail(user.email);
      }
    } else console.log("ID unknown : " + err);
  }).select("-password");

  Order.updateOne(
    { _id: req.body.orderId, "orderStatus.type": req.body.type },
    {
      $set: {
        "orderStatus.$": [
          { type: req.body.type, date: new Date(), isCompleted: true },
        ],
      },
    }
  ).exec((error, order) => {
    if (error) return res.status(400).json({ error });
    if (order) {
      res.status(201).json({ order });
    }
  });
};

exports.getCustomerOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate("items.productId", "name")
    .exec();
  res.status(200).json({ orders });
};
