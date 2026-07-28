"use client";

import { useEffect, useState } from "react";
import { getAllCompletedOrders } from "../../services/orders/orderStorage";
import OrdersTable from "./OrdersTable";
import styles from "./ordersPages.module.css";

export default function CompletedOrdersPage() {
  const [rows, setRows] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setRows(getAllCompletedOrders());
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <main className={styles.page}>
        <p className={styles.message}>Loading...</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Completed orders</h1>
      <OrdersTable rows={rows} linkIds />
    </main>
  );
}
