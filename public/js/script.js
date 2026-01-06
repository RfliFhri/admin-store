function showToast(message, type = 'success') {
  const toastEl = document.getElementById('appToast');
  const messageEl = document.getElementById('appToastMessage');

  if (!toastEl || !messageEl) return;

  toastEl.className = `toast toast-width align-items-center text-bg-${type} border-0`;
  messageEl.textContent = message;

  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
}

// form add
document.getElementById('purchaseForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const product_id = this.product_id.value;
  const quantity   = this.quantity.value;

  const res = await fetch('/purchases/add', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
    product_id,
    quantity
  })
  });

  let data;

  try {
    data = await res.json();
  } catch {
    showToast('Server error (response bukan JSON)', 'danger');
    return;
  }

  if (!res.ok) {
  showToast(data.message || 'Terjadi kesalahan', 'danger');
  return;
}

  showToast(data.message, data.success ? 'success' : 'danger');

  if (data.success) {
    const modalEl = document.getElementById('staticBackdrop');
    const modal =
        bootstrap.Modal.getInstance(modalEl) ||
        new bootstrap.Modal(modalEl);

    modal.hide();

    setTimeout(() => {
        window.location.href = '/purchases';
    }, 1500);
  }


});

const modalEl = document.getElementById('staticBackdrop');
const formEl  = document.getElementById('purchaseForm');

modalEl.addEventListener('hidden.bs.modal', () => {
  formEl.reset();
});

async function cancelPurchase(id) {
  if (!confirm('Yakin ingin membatalkan pembelian ini?')) return;

  try {
    const res = await fetch(`/purchases/cancel/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    showToast(data.message, data.success ? 'success' : 'danger');

    if (data.success) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  } catch (err) {
    showToast('Gagal menghubungi server', 'danger');
  }
}

async function deletePurchase(id) {
  if (!confirm('Hapus permanen data ini?')) return;

  try {
    const res = await fetch(`/purchases/delete/${id}`, {
      method: 'POST'
    });

    const data = await res.json();

    showToast(data.message, data.success ? 'success' : 'danger');

    if (data.success) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  } catch {
    showToast('Server error', 'danger');
  }
}

