import { Download, FileText, DollarSign } from 'lucide-react';
import { Invoice } from '../../App';

interface ClientInvoicesProps {
  invoices: Invoice[];
}

export function ClientInvoices({ invoices }: ClientInvoicesProps) {
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices.filter((inv) => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices.filter((inv) => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Invoices</h2>
        <p className="text-gray-600">View and download your invoices</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-700 mb-1">Total Amount</p>
              <p className="text-indigo-900">${totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-indigo-600 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 mb-1">Paid</p>
              <p className="text-green-900">${paidAmount.toLocaleString()}</p>
            </div>
            <div className="bg-green-600 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-700 mb-1">Pending</p>
              <p className="text-yellow-900">${pendingAmount.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-600 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">Invoice ID</th>
              <th className="px-6 py-3 text-left text-gray-700">Project Name</th>
              <th className="px-6 py-3 text-left text-gray-700">Description</th>
              <th className="px-6 py-3 text-left text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left text-gray-700">Generated Date</th>
              <th className="px-6 py-3 text-left text-gray-700">Due Date</th>
              <th className="px-6 py-3 text-left text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((invoice) => {
              const isOverdue = invoice.status === 'pending' && new Date(invoice.dueDate) < new Date();
              return (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">#{invoice.id.slice(-6)}</td>
                  <td className="px-6 py-4 text-gray-900">{invoice.projectName}</td>
                  <td className="px-6 py-4 text-gray-700">{invoice.description}</td>
                  <td className="px-6 py-4 text-gray-900">
                    ${invoice.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(invoice.generatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className={isOverdue ? 'text-red-600' : 'text-gray-600'}>
                      {new Date(invoice.dueDate).toLocaleDateString()}
                      {isOverdue && <span className="block text-red-500">Overdue</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : isOverdue
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {invoice.status === 'paid' ? 'Paid' : isOverdue ? 'Overdue' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        alert(
                          `Invoice Details:\n\n` +
                            `Invoice ID: #${invoice.id.slice(-6)}\n` +
                            `Project: ${invoice.projectName}\n` +
                            `Amount: $${invoice.amount.toLocaleString()}\n` +
                            `Description: ${invoice.description}\n` +
                            `Generated: ${new Date(invoice.generatedAt).toLocaleDateString()}\n` +
                            `Due: ${new Date(invoice.dueDate).toLocaleDateString()}\n` +
                            `Status: ${invoice.status}\n\n` +
                            `Download functionality would be available in production.`
                        );
                      }}
                      className="flex items-center gap-2 px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Download Invoice"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </td>
                </tr>
              );
            })}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No invoices available</p>
                  <p className="text-gray-400">Invoices will appear here once generated</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Information */}
      {invoices.some((inv) => inv.status === 'pending') && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-blue-900 mb-2">Payment Information</h3>
          <p className="text-blue-700 mb-4">
            You have pending invoices. Please make payment before the due date to avoid late fees.
          </p>
          <div className="space-y-1 text-blue-700">
            <p><strong>Bank Name:</strong> ATS Banking Corp</p>
            <p><strong>Account Number:</strong> 1234567890</p>
            <p><strong>Routing Number:</strong> 987654321</p>
            <p><strong>Swift Code:</strong> ATSBANK123</p>
          </div>
        </div>
      )}
    </div>
  );
}
