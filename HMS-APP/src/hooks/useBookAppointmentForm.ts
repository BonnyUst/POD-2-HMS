import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import {
    createAppointment,
    getAvailableSlots,
    getDoctorsForAppointment,
} from '../services/appointment.service';
import { getPatientProfile } from '../services/patient.service';
import { AppointmentDoctor } from '../types/appointment.types';

export function useBookAppointmentForm(
    routeDoctorId: string,
    routeDoctorName: string,
    onAppointmentCreated: () => void
) {
    const [patientId, setPatientId] = useState('');
    const [doctors, setDoctors] = useState<AppointmentDoctor[]>([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState(routeDoctorId);
    const [selectedDoctorName, setSelectedDoctorName] = useState(routeDoctorName);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [selectedDateObject, setSelectedDateObject] = useState(new Date());
    const [timeSlot, setTimeSlot] = useState('');
    const [reason, setReason] = useState('');
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // ─── Helpers ─────────────────────────────────────────────────────────────

    const getDoctorId = (doctor: AppointmentDoctor) => {
        if (typeof doctor.employeeId === 'string') return doctor.employeeId;
        return doctor.employeeId?._id || doctor._id || doctor.doctorId || '';
    };

    const getDoctorName = (doctor?: AppointmentDoctor) => {
        if (!doctor) return 'Doctor';
        if (doctor.name) return doctor.name;
        if (doctor.firstName || doctor.lastName)
            return `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim();
        if (doctor.employeeId?.userId)
            return `${doctor.employeeId.userId.firstName || ''} ${doctor.employeeId.userId.lastName || ''}`.trim();
        return 'Doctor';
    };

    const formatDateForBackend = (date: Date) => {
        const y = date.getFullYear();
        const m = `${date.getMonth() + 1}`.padStart(2, '0');
        const d = `${date.getDate()}`.padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    // ─── Derived state ────────────────────────────────────────────────────────

    const selectedDoctor = useMemo(
        () => doctors.find((d) => getDoctorId(d) === selectedDoctorId),
        [doctors, selectedDoctorId]
    );

    const minimumDate = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (!selectedDoctor) return today;

        const joiningDateStr =
            selectedDoctor.joiningDate || selectedDoctor.employeeId?.joiningDate;
        if (!joiningDateStr) return today;

        const joiningDate = new Date(joiningDateStr);
        joiningDate.setHours(0, 0, 0, 0);
        return joiningDate > today ? joiningDate : today;
    }, [selectedDoctor]);

    const maximumDate = useMemo(() => {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d;
    }, []);

    // ─── Data loading ─────────────────────────────────────────────────────────

    useEffect(() => { loadInitialData(); }, []);

    useEffect(() => {
        if (selectedDoctorId && appointmentDate) loadAvailableSlots();
        else { setAvailableSlots([]); setTimeSlot(''); }
    }, [selectedDoctorId, appointmentDate]);

    const loadInitialData = async () => {
        try {
            setLoadingDoctors(true);
            const [profileData, doctorsData] = await Promise.all([
                getPatientProfile(),
                getDoctorsForAppointment(),
            ]);

            setPatientId(profileData?.patientId || '');
            setDoctors(doctorsData || []);

            if (routeDoctorId && doctorsData?.length) {
                const match = doctorsData.find(
                    (d) => d._id === routeDoctorId || d.doctorId === routeDoctorId
                );
                if (match) {
                    setSelectedDoctorId(getDoctorId(match));
                    setSelectedDoctorName(getDoctorName(match));
                } else {
                    setSelectedDoctorId('');
                    setSelectedDoctorName('');
                }
            }
        } catch (error: any) {
            console.log('Load error:', error);
            Alert.alert('Error', 'Unable to load appointment data');
        } finally {
            setLoadingDoctors(false);
        }
    };

    const loadAvailableSlots = async () => {
        try {
            setSlotsLoading(true);
            const slots = await getAvailableSlots(selectedDoctorId, appointmentDate);
            setAvailableSlots(slots || []);
            setTimeSlot('');
        } catch (error: any) {
            setAvailableSlots([]);
            setTimeSlot('');
            Alert.alert('Error', error.response?.data?.message || 'Unable to load available slots');
        } finally {
            setSlotsLoading(false);
        }
    };

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleSelectDoctor = (doctor: AppointmentDoctor) => {
        setSelectedDoctorId(getDoctorId(doctor));
        setSelectedDoctorName(getDoctorName(doctor));
        setAppointmentDate('');
        setSelectedDateObject(new Date());
        setAvailableSlots([]);
        setTimeSlot('');
    };

    const handleDateChange = (_event: any, selectedDate?: Date) => {
        if (!selectedDate) return;
        setSelectedDateObject(selectedDate);
        setAppointmentDate(formatDateForBackend(selectedDate));
        setAvailableSlots([]);
        setTimeSlot('');
    };

    const handleSubmit = async () => {
        if (!patientId) return Alert.alert('Error', 'Patient profile not found');
        if (!selectedDoctorId) return Alert.alert('Validation', 'Please select a doctor');
        if (!appointmentDate) return Alert.alert('Validation', 'Please select appointment date');
        if (!timeSlot) return Alert.alert('Validation', 'Please select a time slot');
        if (!reason.trim()) return Alert.alert('Validation', 'Please enter reason');

        try {
            setSubmitting(true);
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
            Alert.alert('Error', error.response?.data?.message || 'Doctor not yet joined');
        } finally {
            setSubmitting(false);
        }
    };

    return {
        // state
        doctors,
        selectedDoctorId,
        selectedDoctorName,
        selectedDoctor,
        appointmentDate,
        selectedDateObject,
        timeSlot,
        reason,
        availableSlots,
        loadingDoctors,
        slotsLoading,
        submitting,
        minimumDate,
        maximumDate,
        // setters
        setReason,
        setTimeSlot,
        // helpers (needed by child components)
        getDoctorId,
        getDoctorName,
        // handlers
        handleSelectDoctor,
        handleDateChange,
        handleSubmit,
    };
}