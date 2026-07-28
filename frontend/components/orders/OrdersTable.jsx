import Link from "next/link";
import { getScriptPreview } from "./scriptPreview";
import styles from "./ordersTable.module.css";

export default function OrdersTable({ rows, linkIds = false }) {
  if (!rows.length) {
    return <p className={styles.empty}>No orders yet.</p>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Script</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((order) => (
            <tr key={order.id}>
              <td>
                {linkIds ? (
                  <Link
                    href={`/completedOrder?id=${encodeURIComponent(order.id)}`}
                    className={styles.orderLink}
                  >
                    {order.id}
                  </Link>
                ) : (
                  order.id
                )}
              </td>
              <td>{getScriptPreview(order.script)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
