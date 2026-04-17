import db from '../config/db.jd'

export const getDashboardData = async () => {
   const [students] = await db.query(
    'SELECT COUNT(*) AS total FROM students');

   const [pendingPayments] = await db.query(
    'SELECT COUNT(*) AS total FROM payments WHERE status = "pending"');

   const [absencesToday] = await db.query(
        'SELECT COUNT(*) AS total FROM attendance WHERE attendance_date = CURDATE() AND status = "absent"'
   );


   return {
    totalStudents: students[0].total,
    pendingPayments: pendingPayments[0].total,
    absencesToday: absencesToday[0].total,
   }
   
};