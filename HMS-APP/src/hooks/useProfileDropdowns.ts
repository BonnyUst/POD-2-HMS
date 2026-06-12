import { useState } from 'react';

// ─── Hook ──────────────────────────────────────────────────────────────────────

/*
 * Manages open/close state for the three bottom-sheet
 * dropdown pickers on the profile edit form.
 */
export const useProfileDropdowns = () => {
  const [showBloodGroupPicker, setShowBloodGroupPicker] =
    useState(false);
  const [showGenderPicker, setShowGenderPicker] =
    useState(false);
  const [showStatePicker, setShowStatePicker] =
    useState(false);

  return {
    // Visibility flags
    showBloodGroupPicker,
    showGenderPicker,
    showStatePicker,
    // Openers
    openBloodGroupPicker: () => setShowBloodGroupPicker(true),
    openGenderPicker: () => setShowGenderPicker(true),
    openStatePicker: () => setShowStatePicker(true),
    // Closers
    closeBloodGroupPicker: () => setShowBloodGroupPicker(false),
    closeGenderPicker: () => setShowGenderPicker(false),
    closeStatePicker: () => setShowStatePicker(false),
  };
};