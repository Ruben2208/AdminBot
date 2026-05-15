import db from '../config/db.js';

export const getDashboardData = async () => {

    // TOTAL ESTUDIANTES
    const [students] = await db.query(`
        SELECT COUNT(*) AS total
        FROM students
    `);

    // PAGOS PENDIENTES
    const [pendingPayments] = await db.query(`
        SELECT COUNT(*) AS total
        FROM payments
        WHERE status = 'pending'
    `);

    // PAGOS DEL MES
    const [monthlyPayments] = await db.query(`
        SELECT IFNULL(SUM(amount_paid),0) AS total
        FROM payments
        WHERE MONTH(payment_date) = MONTH(CURDATE())
    `);

    // NOTIFICACIONES
    const [notifications] = await db.query(`
        SELECT COUNT(*) AS total
        FROM whatsapp_notifications
    `);

    // PAGOS RECIENTES
    const [recentPayments] = await db.query(`
        SELECT
            p.amount_paid,
            p.payment_method,
            p.created_at,
            s.first_name,
            s.last_name
        FROM payments p
        LEFT JOIN students s
            ON s.id = p.student_id
        ORDER BY p.created_at DESC
        LIMIT 5
    `);

    // NUEVOS ESTUDIANTES
    const [newStudents] = await db.query(`
        SELECT
            first_name,
            last_name,
            grade
        FROM students
        ORDER BY created_at DESC
        LIMIT 5
    `);

    const [absencesToday] = await db.query(`
    SELECT COUNT(*) AS total
    FROM attendance
    WHERE status = 'absent'
    AND DATE(created_at) = CURDATE()
    `);

    const [overduePayments] = await db.query(`
    SELECT COUNT(*) AS total
    FROM accounts_receivable
    WHERE due_date < CURDATE()
    AND status != 'paid'
  `);

  const [dueTomorrow] = await db.query(`
    SELECT COUNT(*) AS total
    FROM accounts_receivable
    WHERE due_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
    AND status != 'paid'
   `);

   const [recentActivity] = await db.query(`

    SELECT
        'payment' AS type,
        CONCAT(
            s.first_name,
            ' ',
            s.last_name,
            ' realizó un pago'
        ) AS description,
        p.created_at

    FROM payments p

    LEFT JOIN students s
        ON s.id = p.student_id

    UNION

    SELECT
        'student' AS type,
        CONCAT(
            first_name,
            ' ',
            last_name,
            ' fue registrado'
        ) AS description,
        created_at

    FROM students

    ORDER BY created_at DESC

    LIMIT 10

`);

    return {

        metrics: {

            totalStudents:
                students[0].total,

            pendingPayments:
                pendingPayments[0].total,

            monthlyPayments:
                monthlyPayments[0].total,

            notifications:
                notifications[0].total,

                absencesToday: absencesToday[0].total,

                overduePayments: 
                overduePayments[0].total,

                dueTomorrow: dueTomorrow[0].total,

        },

        recentPayments,

        newStudents,

        recentActivity

    };

    

};