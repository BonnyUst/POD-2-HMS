import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

import { styles } from '../../../styles/patient/appointments/bookAppointmentForm.style';

type Props =Readonly< {
    availableSlots: string[];
    selectedSlot: string;
    loading: boolean;
    onSelectSlot: (slot: string) => void;
}>;

export default function SlotSelector({ availableSlots, selectedSlot, loading, onSelectSlot }: Props) {
    return (
        <>
            <Text style={styles.label}>Available Time Slots</Text>

            {loading ? (
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
                        const isSelected = selectedSlot === slot;
                        return (
                            <TouchableOpacity
                                key={slot}
                                style={[styles.slotButton, isSelected && styles.activeSlotButton]}
                                onPress={() => onSelectSlot(slot)}
                            >
                                <Text style={[styles.slotText, isSelected && styles.activeSlotText]}>
                                    {slot}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
        </>
    );
}