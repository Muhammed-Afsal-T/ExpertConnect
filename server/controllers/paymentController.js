const Razorpay = require('razorpay');
const crypto = require('crypto');

// Single Razorpay client initialized from env secrets.
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            // Razorpay expects the amount in the smallest currency unit (paise).
            amount: amount * 100, // Amount in paise
            currency: "INR",
            // Unique receipt helps reconcile orders in dashboard/logs.
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Recreate signature payload exactly as Razorpay specifies: order_id|payment_id.
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        // Payment is valid only when generated and received signatures match.
        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ success: true, message: "Payment Verified Successfully" });
        } else {
            return res.status(400).json({ success: false, message: "Invalid Signature" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
