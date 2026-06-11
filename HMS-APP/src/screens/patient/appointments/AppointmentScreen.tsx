import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import BookAppointmentForm from '../appointments/BookAppointmentForm'
import MyAppointmentsList from '../appointments/MyAppointmentsList'
import { styles } from '../../../styles/patient/appointments/appointmentScreen.style'

export default function AppointmentScreen() {
  const params = useLocalSearchParams();

  const initialTab = params?.doctorId ? 'book' : 'view';
  const [activeTab, setActiveTab] = useState<'book' | 'view'>(initialTab);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Appointments</Text>
        <Text style={styles.pageSubtitle}>
          Book and view your hospital appointments
        </Text>
      </View>

      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            activeTab === 'book' && styles.activeSegmentButton,
          ]}
          onPress={() => setActiveTab('book')}
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === 'book' && styles.activeSegmentText,
            ]}
          >
            Book Appointment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentButton,
            activeTab === 'view' && styles.activeSegmentButton,
          ]}
          onPress={() => setActiveTab('view')}
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === 'view' && styles.activeSegmentText,
            ]}
          >
            My Appointments
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'book' ? (
        <BookAppointmentForm
          routeDoctorId={params?.doctorId ? String(params.doctorId) : ''}
          routeDoctorName={params?.doctorName ? String(params.doctorName) : ''}
          onAppointmentCreated={() => setActiveTab('view')}
        />
      ) : (
        <MyAppointmentsList />
      )}
    </ScrollView>
  );
}