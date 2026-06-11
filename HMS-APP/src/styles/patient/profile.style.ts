import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F7FB',
  },

  header: {
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },

  uhid: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  },

  card: {
    backgroundColor: '#FFFFFF',
    margin: 12,
    borderRadius: 22,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 6,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F7FB',
  },

  infoLabel: {
    flex: 1,
    color: '#64748B',
    fontSize: 14,
    marginLeft: 10,
  },

  infoValue: {
    flex: 2,
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },

  editButton: {
    margin: 12,
    backgroundColor: '#0F172A',
    padding: 16,
    borderRadius: 22,
    alignItems: 'center',
  },

  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },

  logoutButton: {
    margin: 12,
    marginTop: 0,
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 22,
    alignItems: 'center',
  },

  logoutButtonText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 15,
  },
});