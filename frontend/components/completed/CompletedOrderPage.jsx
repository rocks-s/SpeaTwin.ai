"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getCompletedOrder } from "../../services/orders/orderStorage";
import styles from "./completed.module.css";

function getDownloadFileName(orderId) {
  return `avatar-${orderId}.mp4`;
}

export default function CompletedOrderPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setIsReady(true);
      return;
    }

    setOrder(getCompletedOrder(orderId));
    setIsReady(true);
  }, [orderId]);

  if (!isReady) {
    return (
      <main className={styles.page}>
        <p className={styles.message}>Loading...</p>
      </main>
    );
  }

  if (!orderId) {
    return (
      <main className={styles.page}>
        <p className={styles.message}>Order id is missing.</p>
      </main>
    );
  }

  if (!order?.video_url) {
    return (
      <main className={styles.page}>
        <p className={styles.message}>Completed order not found.</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Your video is ready</h1>

      <section className={styles.videoSection}>
        {!videoError ? (
          <video
            className={styles.video}
            src={order.video_url}
            controls
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
          />
        ) : (
          <div className={styles.videoFallback}>
            <p>This video cannot be played inline.</p>
            <p>Use the download button below to open the file.</p>
          </div>
        )}
      </section>

      <a
        className={styles.downloadButton}
        href={order.video_url}
        download={getDownloadFileName(orderId)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Download video
      </a>
    </main>
  );
}
