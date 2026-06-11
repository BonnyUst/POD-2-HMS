import { View, Text } from 'react-native';

import { Appointment } from '../../../types/appointment.types';
import { styles } from '../../../styles/patient/appointments/appointmentCard.style';

type Props = {
  appointment: Appointment;
};

export default function AppointmentCard({ appointment }: Props) {
  const formatDate = (dateValue: string) => {
    if (!dateValue) return '--';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toDateString();
  };

  const getDoctorName = () => {
    const doctor = appointment.doctorId;

    if (!doctor) return 'Doctor';

    if (doctor.name) return doctor.name;

    if (doctor.firstName || doctor.lastName) {
      return `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim();
    }

    if (doctor.employeeId?.userId) {
      return `${doctor.employeeId.userId.firstName || ''} ${
        doctor.employeeId.userId.lastName || ''
      }`.trim();
    }

    return 'Doctor';
  };

  const doctorName = getDoctorName();

  return (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentTopRow}>
        <View>
          <Text style={styles.appointmentDoctor}>Dr. {doctorName}</Text>
          <Text style={styles.appointmentMeta}>
            {formatDate(appointment.appointmentDate)} • {appointment.timeSlot}
          </Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{appointment.status}</Text>
        </View>
      </View>

      <Text style={styles.reasonText}>
        {appointment.reason || 'No reason provided'}
      </Text>
    </View>
  );
}