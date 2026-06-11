export const validateEmailFormat = (email: string) => {
  const trimmedEmail = email.trim();

  const emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  return emailRegex.test(trimmedEmail);
};

export const hasSpaces = (value: string) => {
  return /\s/.test(value);
};

const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];

const getDifferenceCount = (value: string, target: string) => {
  let differences = Math.abs(value.length - target.length);

  const minLength = Math.min(value.length, target.length);

  for (let i = 0; i < minLength; i++) {
    if (value[i] !== target[i]) {
      differences++;
    }
  }

  return differences;
};

const getSuggestedDomain = (domain: string) => {
  for (const commonDomain of commonDomains) {
    const difference = getDifferenceCount(domain, commonDomain);

    if (difference <= 2 && domain !== commonDomain) {
      return commonDomain;
    }
  }

  return '';
};

export const validateLoginEmail = (email: string) => {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail) {
    return 'Email is required';
  }

  if (hasSpaces(trimmedEmail)) {
    return 'Email should not contain spaces';
  }

  if (!validateEmailFormat(trimmedEmail)) {
    return 'Please enter a valid email address';
  }

  const [localPart, domain] = trimmedEmail.split('@');

  if (!localPart || !domain) {
    return 'Please enter a valid email address';
  }

  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return 'Email username is not valid';
  }

  if (localPart.includes('..')) {
    return 'Email username should not contain consecutive dots';
  }

  if (domain.includes('..')) {
    return 'Email domain should not contain consecutive dots';
  }

  if (domain.startsWith('-') || domain.endsWith('-')) {
    return 'Email domain is not valid';
  }

  const domainParts = domain.split('.');

  if (domainParts.length < 2) {
    return 'Please enter a valid email address';
  }

  const providerName = domainParts[0];
  const extension = domainParts[domainParts.length - 1];

  if (providerName === 'gmail' && domain !== 'gmail.com') {
    return 'Please check your email domain. Did you mean gmail.com?';
  }

  if (providerName === 'yahoo' && domain !== 'yahoo.com') {
    return 'Please check your email domain. Did you mean yahoo.com?';
  }

  if (providerName === 'outlook' && domain !== 'outlook.com') {
    return 'Please check your email domain. Did you mean outlook.com?';
  }

  if (providerName === 'hotmail' && domain !== 'hotmail.com') {
    return 'Please check your email domain. Did you mean hotmail.com?';
  }

  if (extension.length > 3) {
    return 'Email domain extension looks invalid';
  }

  const suggestedDomain = getSuggestedDomain(domain);

  if (suggestedDomain) {
    return `Please check your email domain. Did you mean ${suggestedDomain}?`;
  }

  return '';
};

export const validateLoginPassword = (password: string) => {
  if (!password.trim()) {
    return 'Password is required';
  }

  return '';
};