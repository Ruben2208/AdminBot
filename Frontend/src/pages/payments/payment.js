const table = document.getElementById('paymentsTable');

const API = 'http://localhost:3000/api/pago';

async function getPayments() {

  try {

    const response = await fetch(API);
    const data = await response.json();

    renderPayments(data);

  } catch (error) {
    console.log(error);
  }

}

function renderPayments(payments) {

  table.innerHTML = '';

  payments.forEach(payment => {

    const tr = document.createElement('tr');

    const statusClass =
      payment.status === 'paid'
      ? 'paid'
      : 'pending';

    tr.innerHTML = `
      <td>
        ${payment.first_name || ''} 
        ${payment.last_name || ''}
      </td>

      <td>${payment.payment_date || ''}</td>

      <td>$ ${payment.amount_paid || 0}</td>

      <td>
        <span class="${statusClass}">
          ${payment.status}
        </span>
      </td>

      <td>
        ${
          payment.status === 'pending'
          ?
          `<button onclick="markAsPaid('${payment.id}')">
            Marcar Pagado
          </button>`
          :
          '✅'
        }
      </td>
    `;

    table.appendChild(tr);

  });

}

async function markAsPaid(id) {

  try {

    await fetch(`http://localhost:3000/api/pago/${id}`, {
      method:'PUT',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        status:'paid'
      })
    });

    getPayments();

  } catch (error) {
    console.log(error);
  }

}

getPayments();