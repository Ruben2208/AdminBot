const table = document.getElementById('alertsTable');

let pendingStudents = [];

async function getPendingPayments() {

  try {

    const response =
      await fetch(
        'http://localhost:3000/api/pagos/pendientes'
      );

    const data = await response.json();

    pendingStudents = data;

    renderAlerts(data);

  } catch (error) {
    console.log(error);
  }

}

function renderAlerts(data) {

  table.innerHTML = '';

  data.forEach(student => {

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>
        ${student.first_name}
        ${student.last_name}
      </td>

      <td>
        ${student.guardian_phone || ''}
      </td>

      <td>
        <span class="pending">
          Pendiente
        </span>
      </td>

      <td>
        <button onclick="sendWhatsapp(
          '${student.guardian_phone}',
          '${student.first_name}'
        )">
          Enviar
        </button>
      </td>
    `;

    table.appendChild(tr);

  });

}

function sendWhatsapp(phone, student) {

  const message =
  `Hola, le recordamos que el pago del estudiante ${student} se encuentra pendiente.`;

  const url =
  `https://wa.me/57${phone}?text=${encodeURIComponent(message)}`;

  window.open(url);

}

function sendAll() {

  pendingStudents.forEach(student => {

    sendWhatsapp(
      student.guardian_phone,
      student.first_name
    );

  });

}

getPendingPayments();