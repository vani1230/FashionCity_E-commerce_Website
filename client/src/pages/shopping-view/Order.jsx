import React, { useEffect, useState } from "react";
import { FiClock, FiCheckCircle, FiTruck, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrdersThunk } from "../../store/order-slice/Index.js";

const Orders = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { orders = [] } = useSelector((state) => state.order);

  const [selectedOrder, setSelectedOrder] = useState(null); // ✅ modal state

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserOrdersThunk(user._id));
    }
  }, [dispatch, user]);

  // 🔁 format orders
  const formattedOrders = orders.map((order) => {
    let icon = <FiClock className="text-amber-500" />;

    if (order.orderStatus === "delivered") {
      icon = <FiCheckCircle className="text-emerald-500" />;
    } else if (order.orderStatus === "shipped") {
      icon = <FiTruck className="text-blue-500" />;
    }

    return {
      ...order,
      id: order._id,
      date: new Date(order.createdAt).toLocaleDateString("en-IN"),
      total: order.totalAmount,
      status:
        order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1),
      itemsCount: order.items.length,
      icon,
    };
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6">
        Order History
      </h2>

      <div className="space-y-4">
        {formattedOrders.length === 0 ? (
          <p className="text-gray-500 text-center">No orders found</p>
        ) : (
          formattedOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)} // ✅ open modal
              className="bg-white/50 backdrop-blur-md border border-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-inner text-xl">
                  {order.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{order.id}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    Placed on {order.date} • {order.itemsCount} Items
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                  ₹{order.total}
                </span>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md
                  ${
                    order.status === "Delivered"
                      ? "bg-emerald-100 text-emerald-600"
                      : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🔥 MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[90%] max-w-lg p-6 relative">
            {/* ❌ Close button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <FiX size={20} />
            </button>

            <h3 className="text-xl font-bold mb-4">Order Details</h3>

            <p className="text-sm text-gray-500 mb-4">
              Order ID: {selectedOrder.id}
            </p>

            {/* 🛒 ITEMS */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {selectedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 border-b pb-2"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-sm">₹{item.price}</span>
                </div>
              ))}
            </div>

            {/* 💰 TOTAL */}
            <div className="mt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{selectedOrder.total}</span>
            </div>
            {/* 🧾 INVOICE BUTTON */}
            {selectedOrder.invoiceUrl ? (
              <a
                href={`http://localhost:5000/${selectedOrder.invoiceUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-blue-500 underline text-sm"
              >
                Download Invoice
              </a>
            ) : (
              <p className="mt-4 text-xs text-gray-400">
                Invoice not available
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
