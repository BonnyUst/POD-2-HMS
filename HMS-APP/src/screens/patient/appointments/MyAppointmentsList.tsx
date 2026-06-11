import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';

import { getMyAppointments } from '../../../services/appointment.service';
import { Appointment } from '../../../types/appointment.types';
import AppointmentCard from '../appointments/AppointmentCard'
import { styles } from '../../../styles/patient/appointments/myAppointmentsList.style'


export default function MyAppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await getMyAppointments();
      setAppointments(data || []);
    } catch (error) {
      console.log('My appointments loading error:', error);
      Alert.alert('Error', 'Unable to load appointments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Loading appointments...</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>My Appointments</Text>
        <Text style={styles.listCount}>{appointments.length} total</Text>
      </View>

      {appointments.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No appointments yet</Text>
          <Text style={styles.emptyText}>
            Book your first appointment from the Book Appointment section.
          </Text>
        </View>
      ) : (
        appointments.map((appointment) => (
          <AppointmentCard
           key={appointment._id || appointment.appointmentCode}
            appointment={appointment}
          />
        ))
      )}
    </View>
  );
}