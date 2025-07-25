const Subscriber = require("../models/subscribe.js");

exports.addSubscriber = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Already subscribed" });
    }

    await Subscriber.create({ email });
    res.status(200).json({ success: true, message: "Subscribed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
