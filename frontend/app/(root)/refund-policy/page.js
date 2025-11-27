import React from "react";

export default function RefundCancellationPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-md my-12">
      <h1 className="text-3xl font-bold mb-6">Refund and Cancellation Policy</h1>

      <p className="mb-4">
        This refund and cancellation policy outlines how you can cancel or seek a refund for a product/service purchased through the Platform.
      </p>

      <ul className="list-disc list-inside space-y-3 mb-6">
        <li>
          Cancellations are considered only if requested within 1 day of placing the order. Cancellation may not be entertained if the order has been communicated to sellers/merchants and shipping has started or product is out for delivery. In such cases, you may reject the product at delivery.
        </li>
        <li>
          Cancellation requests are not accepted for perishable items like flowers, eatables, etc. Refunds or replacements may be made if product quality is proven unsatisfactory.
        </li>
        <li>
          For damaged or defective items, report within 1 day of receipt to customer service. Refund requests will be entertained after seller/merchant verification.
        </li>
        <li>
          If the product received is not as described or expected, notify customer service within 1 day of receipt. The team will review and decide on the complaint.
        </li>
        <li>
          For products with manufacturer warranties, please contact the manufacturer directly.
        </li>
        <li>
          Approved refunds by U&I Naturals will be processed within 1 day.
        </li>
      </ul>
    </div>
  );
}
