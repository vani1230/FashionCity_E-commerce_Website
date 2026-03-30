import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrdersThunk,
  updateOrderStatusThunk,
} from "../../store/order-slice/Index.js";

const AdminOrders = () => {
  const dispatch = useDispatch();

  const { orders = [] } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchAllOrdersThunk());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatusThunk({ orderId, status: newStatus }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Orders</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-xl p-5 shadow-sm bg-white"
          >
            {/* 🔹 USER INFO */}
            <div className="flex justify-between flex-wrap gap-2">
              <div>
                <p className="font-bold">Order ID: {order._id}</p>
                <p className="text-sm text-gray-600">
                  User: {order.user?.name} ({order.user?.email})
                </p>
              </div>

              <div>
                <p className="text-sm">
                  Status:{" "}
                  <span className="font-semibold">
                    {order.orderStatus}
                  </span>
                </p>

                <select
                  value={order.orderStatus}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className="mt-1 border rounded px-2 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* 🔹 ADDRESS */}
            <div className="mt-3 text-sm text-gray-600">
              <p>
                Address: {order.shippingAddress?.address},{" "}
                {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.pincode}
              </p>
              <p>Phone: {order.shippingAddress?.phone}</p>
            </div>

            {/* 🔹 ITEMS */}
            <div className="mt-4 space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 border-b pb-2"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-sm">
                    ₹{item.price}
                  </span>
                </div>
              ))}
            </div>

            {/* 🔹 PAYMENT + TOTAL */}
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <p>
                  Payment:{" "}
                  <span className="font-semibold">
                    {order.paymentMethod}
                  </span>
                </p>
                <p>
                  Paid:{" "}
                  <span className="font-semibold">
                    {order.isPaid ? "Yes" : "No"}
                  </span>
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg">
                  ₹{order.totalAmount}
                </p>
              </div>
            </div>

            {/* 🧾 INVOICE SECTION */}
            <div className="mt-4">
              {order.invoiceUrl ? (
                <a
                  href={`http://localhost:5000/${order.invoiceUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline text-sm"
                >
                  View GST Invoice
                </a>
              ) : (
                <p className="text-gray-400 text-sm">
                  Invoice not generated yet
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;