import React from "react";

export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-md my-12">
      <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>

      <p className="mb-4">
        Orders are shipped through registered domestic courier companies and/or speed post only.
      </p>
      <p className="mb-4">
        Orders will be shipped within 7 days from the date of order or payment, or as per the delivery date agreed at confirmation, subject to courier/post office norms.
      </p>
      <p className="mb-4">
        The Platform Owner shall not be liable for any delay caused by the courier company or postal authority.
      </p>
      <p className="mb-4">
        Deliveries will be made to the address provided by the buyer at the time of purchase.
      </p>
      <p className="mb-6">
        Delivery confirmation will be sent to your registered email ID.
      </p>
      <p>
        Any shipping costs charged by the seller or Platform Owner are non-refundable.
      </p>
    </div>
  );
}
