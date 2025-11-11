'use client';

import { ShoppingBag } from "lucide-react";

export default function CartSummary({ items, subtotal, shipping, tax, total }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="w-6 h-6 text-gray-700" />
        <h2 className="text-xl font-semibold">Order Summary</h2>
      </div>

      <div className="divide-y divide-gray-100 text-sm">
        {items.map((item) => (
          <div key={item.cart_item_id} className="flex justify-between py-3">
            <div>
              <p className="font-medium">{item.product_name}</p>
              <p className="text-gray-600">{item.variant_name} x {item.quantity}</p>
            </div>
            <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between py-3">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-3">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">₹{shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-3">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-4 text-base font-semibold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-500 text-center">
        All payments are encrypted & secured 🔒
      </div>
    </div>
  );
}
