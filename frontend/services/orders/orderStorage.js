const STORAGE_KEY = "avatar_orders";

function getDefaultOrders() {
  return {
    processing: null,
    completed: {},
  };
}

export function loadOrders() {
  if (typeof window === "undefined") {
    return getDefaultOrders();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getDefaultOrders();
    }

    const parsed = JSON.parse(raw);

    return {
      processing: parsed.processing ?? null,
      completed: parsed.completed ?? {},
    };
  } catch {
    return getDefaultOrders();
  }
}

export function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function createOrderId() {
  return `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function setProcessingOrder(order) {
  const orders = loadOrders();
  orders.processing = order;
  saveOrders(orders);
  return order;
}

export function clearProcessingOrder() {
  const orders = loadOrders();
  orders.processing = null;
  saveOrders(orders);
}

export function completeProcessingOrder(videoUrl) {
  const orders = loadOrders();

  if (!orders.processing) {
    return null;
  }

  const completedOrder = {
    ...orders.processing,
    video_url: videoUrl,
    completedAt: new Date().toISOString(),
  };

  orders.completed[completedOrder.id] = completedOrder;
  orders.processing = null;
  saveOrders(orders);

  return completedOrder;
}

export function getCompletedOrder(id) {
  const orders = loadOrders();
  return orders.completed[id] || null;
}

export function getProcessingOrder() {
  return loadOrders().processing;
}

export function getAllCompletedOrders() {
  const { completed } = loadOrders();

  return Object.values(completed).sort((a, b) => {
    const aTime = new Date(a.completedAt || a.createdAt || 0).getTime();
    const bTime = new Date(b.completedAt || b.createdAt || 0).getTime();
    return bTime - aTime;
  });
}
