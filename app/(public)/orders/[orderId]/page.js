"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCallback } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) throw new Error("Error al obtener la orden");
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const generateInvoice = useCallback(async () => {
    try {
      const response = await fetch(`/api/invoices/${orderId}`);
      if (!response.ok) throw new Error('Error al obtener datos de factura');
      const data = await response.json();
  
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
  
      // Header
      doc.setFontSize(16);
      doc.text('FACTURA B', pageWidth / 2, 15, { align: 'center' });
      
      // Marco del comprobante
      doc.rect(10, 20, pageWidth - 20, 240);
      
      // Info empresa (izquierda)
      doc.setFontSize(12);
      doc.text([
        'SOLYMAR HOGAR S.A.',
        'IVA Responsable Inscripto',
        'CUIT: XX-XXXXXXXX-X',
        'Domicilio Comercial: Ejemplo 123',
        'Código Postal: XXXX - Ciudad',
        'Tel: (XXX) XXXX-XXXX'
      ], 15, 35);
  
      // Datos del comprobante (derecha)
      doc.text([
        `Punto de Venta: 0001`,
        `Comp. Nro: ${String(data.invoiceNumber).padStart(8, '0')}`,
        `Fecha de Emisión: ${data.date}`,
        `CUIT: XX-XXXXXXXX-X`,
        `Ingresos Brutos: XX-XXXXXXXX-X`,
        `Inicio de Actividades: 01/01/2024`
      ], 120, 35);
  
      // Datos del cliente
      doc.line(10, 70, pageWidth - 10, 70); // Línea separadora
      doc.text([
        `CUIT: ${data.customer.cuit || 'Consumidor Final'}`,
        `Nombre y Apellido: ${data.customer.name}`,
        `Condición frente al IVA: Consumidor Final`,
        `Domicilio: ${data.customer.address || 'No especificado'}`,
        `Condición de venta: ${data.paymentMethod || 'Contado'}`
      ], 15, 85);
  
      // Tabla de items
      doc.autoTable({
        startY: 110,
        head: [['Código', 'Producto/Servicio', 'Cantidad', 'Precio Unit.', 'Subtotal']],
        body: data.items.map(item => [
          item.id,
          item.description,
          item.quantity,
          `$${item.price.toFixed(2)}`,
          `$${item.total.toFixed(2)}`
        ]),
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] }
      });
  
      // Totales
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.text([
        `Subtotal: $${data.total.toFixed(2)}`,
        `IVA (21%): $${(data.total * 0.21).toFixed(2)}`,
        `Total: $${(data.total * 1.21).toFixed(2)}`
      ], 120, finalY);
  
      // Info fiscal pie de página
      doc.setFontSize(8);
      const fiscalInfo = [
        'CAE N°: XXXXXXXXXXXXXXX',
        'Fecha de Vto. de CAE: XX/XX/XXXX',
        'Comprobante Autorizado',
        'Esta factura contribuye al Régimen de Factura de Crédito Electrónica MiPyMEs'
      ];
      doc.text(fiscalInfo, pageWidth / 2, 270, { align: 'center' });
  
      // QR Code placeholder
      doc.rect(15, 250, 20, 20);
      doc.setFontSize(6);
      doc.text('QR AFIP', 25, 265, { align: 'center' });
  
      doc.save(`factura-${data.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generando factura:', error);
      setError('Error al generar la factura');
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-['Montserrat'] rounded-xl justify-center">
      <div className="max-w-4xl mx-auto p-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-red-600 hover:text-red-700">
            Dashboard
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Orden #{orderId.slice(-8)}</span>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Detalles de la Orden
              </h1>
              <p className="text-gray-600 font-['Roboto']">
                Realizada el {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium
              ${
                order.status === "approved"
                  ? "bg-green-50 text-green-700"
                  : order.status === "pending"
                  ? "bg-red-50 text-red-600"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              {order.status === "approved"
                ? "Aprobado"
                : order.status === "pending"
                ? "Pendiente"
                : "Rechazado"}
            </span>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Detalles del Pago
              </h3>
              <div className="space-y-2 font-['Roboto']">
                <p className="text-gray-600">ID de Pago: {order.paymentId}</p>
                <p className="text-gray-600">Método: {order.paymentMethod}</p>
                <p className="text-gray-600">
                  Cuotas: {order.installments}{" "}
                  {order.installments > 1 ? "cuotas" : "cuota"}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Resumen</h3>
              <div className="space-y-2 font-['Roboto']">
                <p className="text-gray-600">
                  Total:{" "}
                  <span className="font-semibold">
                    ${Number(order.total).toFixed(2)}
                  </span>
                </p>
                <p className="text-gray-600">
                  Productos:{" "}
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Products List */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Productos</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {item.product.imageUrl && (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600 font-['Roboto']">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ${Number(item.price).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 font-['Roboto']">
                      ${Number(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Instructions for pending payments */}
        {order.status === "pending" &&
          (order.paymentMethod === "rapipago" ||
            order.paymentMethod === "pagofacil") && (
            <div className="bg-red-50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Instrucciones de pago
              </h3>
              <div className="space-y-4 font-['Roboto'] text-gray-700">
                <div className="flex items-center">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold">
                    1
                  </span>
                  <p className="ml-4">
                    Dirígete a{" "}
                    {order.paymentMethod === "rapipago"
                      ? "Rapipago"
                      : "Pago Fácil"}{" "}
                    más cercano
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold">
                    2
                  </span>
                  <div className="ml-4">
                    <p>Muestra este código:</p>
                    <code className="mt-2 block bg-white px-4 py-2 rounded-lg font-mono text-red-600">
                      {order.paymentId}
                    </code>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold">
                    3
                  </span>
                  <p className="ml-4">
                    Realiza el pago por el monto exacto: $
                    {Number(order.total).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold">
                    4
                  </span>
                  <p className="ml-4">Guarda tu comprobante de pago</p>
                </div>
              </div>
              <p className="mt-6 text-sm text-red-600 bg-red-100 p-4 rounded-lg">
                * El pago puede demorar hasta 24 horas en ser procesado
              </p>
            </div>
          )}

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Volver al Dashboard
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Seguir Comprando
          </Link>
          <button
            onClick={generateInvoice}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Descargar Factura
          </button>
        </div>
      </div>
    </div>
  );
}
