import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getPatientProfile } from '@/services/patient.service';
import { logout } from '@/services/auth.service';
import { profileStyles as styles } from '@/styles/patient/profile.style';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getPatientProfile();
      setProfile(data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={50} color="#fff" />
        </View>
        <Text style={styles.name}>
          {profile.firstName} {profile.lastName}
        </Text>
        <Text style={styles.uhid}>UHID: {profile.UHID}</Text>
      </View>

      {/* Personal Details */}
      <View style={styles.card}>
        <InfoRow icon="mail" label="Email" value={profile.email} />
        <InfoRow icon="call" label="Phone" value={profile.phone} />
        <InfoRow icon="water" label="Blood Group" value={profile.bloodGroup} />
        <InfoRow icon="person" label="Gender" value={profile.gender} />
        <InfoRow icon="calendar" label="DOB" value={new Date(profile.dob).toDateString()} />
      </View>

      {/* Address */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Address</Text>
        <InfoRow icon="location" label="City" value={profile.address?.city || 'N/A'} />
        <InfoRow icon="map" label="State" value={profile.address?.state || 'N/A'} />
        <InfoRow icon="pin" label="Pincode" value={profile.address?.pincode || 'N/A'} />
      </View>

      {/* Emergency Contact */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Emergency Contact</Text>
        <InfoRow icon="person" label="Name" value={profile.emergencyContactName} />
        <InfoRow icon="call" label="Phone" value={profile.emergencyContactPhone} />
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const InfoRow = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={18} color="#64748B"/>
    {/* 2563EB */}
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);