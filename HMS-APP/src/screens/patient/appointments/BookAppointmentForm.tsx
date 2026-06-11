import { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import {
    createAppointment,
    getAvailableSlots,
    getDoctorsForAppointment,
} from '../../../services/appointment.service';

import { getPatientProfile } from '../../../services/patient.service';

import { AppointmentDoctor } from '../../../types/appointment.types';
import { styles } from '../../../styles/patient/appointments/bookAppointmentForm.style';


type Props = {
    routeDoctorId?: string;
    routeDoctorName?: string;
    onAppointmentCreated: () => void;
};

export default function BookAppointmentForm({
    routeDoctorId = '',
    routeDoctorName = '',
    onAppointmentCreated,
}: Props) {
    const [patientId, setPatientId] = useState('');

    const [doctors, setDoctors] = useState<AppointmentDoctor[]>([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState(routeDoctorId);
    const [selectedDoctorName, setSelectedDoctorName] = useState(routeDoctorName);

    const [appointmentDate, setAppointmentDate] = useState('');
    const [selectedDateObject, setSelectedDateObject] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [timeSlot, setTimeSlot] = useState('');
    const [reason, setReason] = useState('');


    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [doctorSearch, setDoctorSearch] = useState(''); //
    const [showAll, setShowAll] = useState(false);


    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (selectedDoctorId && appointmentDate) {
            loadAvailableSlots();
        } else {
            setAvailableSlots([]);
            setTimeSlot('');
        }
    }, [selectedDoctorId, appointmentDate]);

    const formatDateForBackend = (date: Date) => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');

        return `${year}-${month}-${day}`;
    };



    const getDoctorId = (doctor: AppointmentDoctor) => {
        if (typeof doctor.employeeId === 'string') {
            return doctor.employeeId;
        }

        return doctor.employeeId?._id || doctor._id || doctor.doctorId || '';
    };
    const getDoctorName = (doctor?: AppointmentDoctor) => {
        if (!doctor) return 'Doctor';

        if (doctor.name) return doctor.name;

        if (doctor.firstName || doctor.lastName) {
            return `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim();
        }

        if (doctor.employeeId?.userId) {
            return `${doctor.employeeId.userId.firstName || ''} ${doctor.employeeId.userId.lastName || ''
                }`.trim();
        }

        return 'Doctor';
    };

    const loadInitialData = async () => {
        try {
            setLoadingDoctors(true);

            const [profileData, doctorsData] = await Promise.all([
                getPatientProfile(),
                getDoctorsForAppointment(),
            ]);

            setPatientId(profileData?.patientId || '');
            setDoctors(doctorsData || []);

            console.log(
                'Doctors received in app:',
                doctorsData?.map((doctor) => ({
                    _id: doctor._id,
                    doctorId: doctor.doctorId,
                    employeeId: doctor.employeeId,
                    selectedIdUsedByApp: getDoctorId(doctor),
                    name: getDoctorName(doctor),
                    specialization: doctor.specialization,
                }))
            );

            if (routeDoctorId && doctorsData?.length) {
                const matchedDoctor = doctorsData.find(
                    (doctor) =>
                        doctor._id === routeDoctorId || doctor.doctorId === routeDoctorId
                );

                if (matchedDoctor) {
                    const correctDoctorId = getDoctorId(matchedDoctor);

                    console.log('Route doctor matched. Correct doctor id:', correctDoctorId);

                    setSelectedDoctorId(correctDoctorId);
                    setSelectedDoctorName(getDoctorName(matchedDoctor));
                } else {
                    console.log('Route doctor id did not match any doctor:', routeDoctorId);

                    setSelectedDoctorId('');
                    setSelectedDoctorName('');
                }
            }
        } catch (error: any) {
            console.log('Appointment form loading error status:', error.response?.status);
            console.log('Appointment form loading error url:', error.config?.url);
            console.log('Appointment form loading error data:', error.response?.data);
            console.log('Appointment form loading error:', error);

            Alert.alert('Error', 'Unable to load appointment data');
        } finally {
            setLoadingDoctors(false);
        }
    };


    const loadAvailableSlots = async () => {
        try {
            setSlotsLoading(true);

            console.log('Slot API doctorId:', selectedDoctorId);
            console.log('Slot API appointmentDate:', appointmentDate);
            console.log(
                'Final slot URL:',
                `/appointments/available-slots?doctorId=${selectedDoctorId}&appointmentDate=${appointmentDate}`
            );

            const slots = await getAvailableSlots(selectedDoctorId, appointmentDate);

            setAvailableSlots(slots || []);
            setTimeSlot('');
        } catch (error: any) {
            console.log('Slot loading error status:', error.response?.status);
            console.log('Slot loading error url:', error.config?.url);
            console.log('Slot loading error data:', error.response?.data);
            console.log('Slot loading error:', error);

            setAvailableSlots([]);
            setTimeSlot('');

            Alert.alert(
                'Error',
                error.response?.data?.message || 'Unable to load available slots'
            );
        } finally {
            setSlotsLoading(false);
        }
    };

    const selectedDoctor = useMemo(() => {
        return doctors.find((doctor) => getDoctorId(doctor) === selectedDoctorId);
    }, [doctors, selectedDoctorId]);


    const minimumDate = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!selectedDoctor) return today;

        const joiningDateStr =
            selectedDoctor.joiningDate ||
            selectedDoctor.employeeId?.joiningDate;

        if (!joiningDateStr) return today;

        const joiningDate = new Date(joiningDateStr);
        joiningDate.setHours(0, 0, 0, 0);

        // If doctor hasn't joined yet, block all dates before their joining date
        // If doctor already joined (joining date is past), allow from today
        return joiningDate > today ? joiningDate : today;
    }, [selectedDoctor]);

    const maximumDate = useMemo(() => {
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 1);
        return maxDate;
    }, []);


    const filteredDoctors = useMemo(() => {
        if (!doctorSearch.trim()) return doctors;
        const q = doctorSearch.toLowerCase();
        return doctors.filter(
            (d) =>
                getDoctorName(d).toLowerCase().includes(q) ||
                (d.specialization || '').toLowerCase().includes(q)
        );
    }, [doctors, doctorSearch]);

    const visibleDoctors = useMemo(() => {
        if (showAll || doctorSearch.trim()) return filteredDoctors;
        return filteredDoctors.slice(0, 5);
    }, [filteredDoctors, showAll, doctorSearch]);
    const handleSelectDoctor = (doctor: AppointmentDoctor) => {
        const doctorId = getDoctorId(doctor);
        setAppointmentDate('');
        setSelectedDateObject(new Date());

        console.log('Selected doctor object:', doctor);
        console.log('Selected doctor id used by app:', doctorId);

        setSelectedDoctorId(doctorId);
        setSelectedDoctorName(getDoctorName(doctor));
        setAvailableSlots([]);
        setTimeSlot('');
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }

        if (!selectedDate) return;

        const formattedDate = formatDateForBackend(selectedDate);



        setSelectedDateObject(selectedDate);
        setAppointmentDate(formattedDate);
        setAvailableSlots([]);
        setTimeSlot('');
    };



    const handleSubmit = async () => {
        if (!patientId) {
            Alert.alert('Error', 'Patient profile not found');
            return;
        }

        if (!selectedDoctorId) {
            Alert.alert('Validation', 'Please select a doctor');
            return;
        }

        if (!appointmentDate) {
            Alert.alert('Validation', 'Please select appointment date');
            return;
        }

        if (!timeSlot) {
            Alert.alert('Validation', 'Please select a time slot');
            return;
        }

        if (!reason.trim()) {
            Alert.alert('Validation', 'Please enter reason');
            return;
        }

        try {
            setSubmitting(true);

            console.log('Create appointment payload:', {
                patientId,
                doctorId: selectedDoctorId,
                appointmentDate,
                timeSlot,
                reason: reason.trim(),
            });

            await createAppointment({
                patientId,
                doctorId: selectedDoctorId,
                appointmentDate,
                timeSlot,
                reason: reason.trim(),
            });

            Alert.alert('Success', 'Appointment booked successfully');

            setAppointmentDate('');
            setTimeSlot('');
            setReason('');
            setAvailableSlots([]);

            onAppointmentCreated();
        } catch (error: any) {
            console.log('Create appointment error status:', error.response?.status);
            console.log('Create appointment error data:', error.response?.data);
            console.log('Create appointment error:', error);

            Alert.alert(
                'Error',
                error.response?.data?.message || 'Doctor not yet joined '
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingDoctors) {
        return (
            <View style={styles.card}>
                <ActivityIndicator />
                <Text style={styles.loadingText}>Loading doctors...</Text>
            </View>
        );
    }

    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Book Appointment</Text>

            <Text style={styles.label}>Selected Doctor</Text>

            <View style={styles.selectedDoctorBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={styles.selectedDoctorAvatar}>
                        <Text style={styles.selectedDoctorInitials}>
                            {(selectedDoctorName || getDoctorName(selectedDoctor))
                                .split(' ').filter(Boolean).slice(0, 2)
                                .map((w: string) => w[0].toUpperCase()).join('')}
                        </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.selectedDoctorName}>
                            {selectedDoctorName || getDoctorName(selectedDoctor)}
                        </Text>
                        {selectedDoctor?.specialization ? (
                            <Text style={styles.selectedDoctorSpecialization}>
                                {selectedDoctor.specialization}
                            </Text>
                        ) : null}
                    </View>

                    <View style={styles.selectedBadge}>
                        <Text style={styles.selectedBadgeText}>Selected</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.label}>Choose Doctor</Text>
            <TextInput
                style={[styles.input, { marginBottom: 10 }]}
                placeholder="Search by name or specialization"
                placeholderTextColor="#888780"
                value={doctorSearch}
                onChangeText={setDoctorSearch}
            />

            <View style={styles.doctorGrid}>
                {visibleDoctors.map((doctor) => {
                    const doctorId = getDoctorId(doctor);
                    const isSelected = selectedDoctorId === doctorId;

                    return (
                        <TouchableOpacity
                            key={doctorId}
                            style={[styles.doctorGridCard, isSelected && styles.activeDoctorGridCard]}
                            onPress={() => handleSelectDoctor(doctor)}
                        >
                            <Text
                                style={[styles.doctorChipText, isSelected && styles.activeDoctorChipText]}
                                numberOfLines={1}
                            >
                                {getDoctorName(doctor)}
                            </Text>
                            <Text
                                style={[styles.doctorChipSubText, isSelected && styles.activeDoctorChipText]}
                                numberOfLines={1}
                            >
                                {doctor.specialization || 'General'}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            {!doctorSearch.trim() && filteredDoctors.length > 5 && (
                <TouchableOpacity onPress={() => setShowAll(!showAll)}>
                    <Text style={styles.showMoreText}>
                        {showAll ? 'Show less ↑' : `Show all ${filteredDoctors.length} doctors ↓`}
                    </Text>
                </TouchableOpacity>
            )}
            <Text style={styles.label}>Appointment Date</Text>

            <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={{ color: appointmentDate ? '#2C2C2A' : '#888780' }}>
                    {appointmentDate || 'Select appointment date'}
                </Text>
            </TouchableOpacity>

            {showDatePicker ? (
                <DateTimePicker
                    value={selectedDateObject}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    minimumDate={minimumDate}   // <-- was hardcoded new Date()
                    maximumDate={maximumDate}   // <-- add this
                    onChange={handleDateChange}
                />
            ) : null}

            <Text style={styles.helperText}>Date format: YYYY-MM-DD</Text>

            <Text style={styles.label}>Available Time Slots</Text>

            {slotsLoading ? (
                <View style={styles.slotLoadingBox}>
                    <ActivityIndicator />
                    <Text style={styles.slotLoadingText}>Loading slots...</Text>
                </View>
            ) : availableSlots.length === 0 ? (
                <View style={styles.emptySlotBox}>
                    <Text style={styles.emptySlotText}>
                        Select doctor and date to view slots
                    </Text>
                </View>
            ) : (
                <View style={styles.slotGrid}>
                    {availableSlots.map((slot) => {
                        const isSelected = timeSlot === slot;

                        return (
                            <TouchableOpacity
                                key={slot}
                                style={[
                                    styles.slotButton,
                                    isSelected && styles.activeSlotButton,
                                ]}
                                onPress={() => setTimeSlot(slot)}
                            >
                                <Text
                                    style={[
                                        styles.slotText,
                                        isSelected && styles.activeSlotText,
                                    ]}
                                >
                                    {slot}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}

            <Text style={styles.label}>Reason</Text>

            <TextInput
                style={[styles.input, styles.reasonInput]}
                placeholder="Enter reason for visit"
                placeholderTextColor="#888780"
                value={reason}
                onChangeText={setReason}
                multiline
            />

            <TouchableOpacity
                style={[styles.submitButton, submitting && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={submitting}
            >
                <Text style={styles.submitButtonText}>
                    {submitting ? 'Booking...' : 'Confirm Appointment'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}