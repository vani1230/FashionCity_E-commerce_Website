import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoice = (order) => {
  return new Promise((resolve, reject) => {
    const fileName = `invoice_${order._id}.pdf`;
    const filePath = path.join("invoices", fileName);

    const doc = new PDFDocument();

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // 🧾 HEADER
    doc.fontSize(20).text("GST INVOICE", { align: "center" });

    doc.moveDown();
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Date: ${new Date().toDateString()}`);

    doc.moveDown();

    // 👤 USER
    doc.text(`Customer: ${order.user.name}`);
    doc.text(`Email: ${order.user.email}`);

    doc.moveDown();

    // 🛒 ITEMS
    order.items.forEach((item) => {
      doc.text(
        `${item.title} - Qty: ${item.quantity} - ₹${item.price}`
      );
    });

    doc.moveDown();

    // 💰 TOTAL
    doc.fontSize(16).text(`Total: ₹${order.totalAmount}`);
    doc.end();
    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};