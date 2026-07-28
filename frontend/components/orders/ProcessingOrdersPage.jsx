"use client";

import { useEffect, useState } from "react";
import { getProcessingOrder } from "../../services/orders/orderStorage";
import OrdersTable from "./OrdersTable";
import styles from "./ordersPages.module.css";

export default function ProcessingOrdersPage() {
  const [rows, setRows] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const processingOrder = getProcessingOrder();
    setRows(processingOrder ? [processingOrder] : []);
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
      <h1 className={styles.title}>Processing orders</h1>
      <OrdersTable rows={rows} />
    </main>
  );
}
