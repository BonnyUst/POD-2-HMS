import { StyleSheet } from 'react-native';

export const registerStyles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },

  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },

  registerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 6,
  },

  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#0F172A',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 26,
    lineHeight: 20,
  },

  formContainer: {
    gap: 16,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },

  halfInput: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: -4,
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },

  loginText: {
    fontSize: 14,
    color: '#64748B',
  },

  loginLink: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '700',
  },
});