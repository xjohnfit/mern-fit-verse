import React from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { styles } from '@/styles/nutrition/AddCustomCategoryModalStyles';

interface AddCustomCategoryModalProps {
  visible: boolean;
  newCategoryName: string;
  onChangeText: (text: string) => void;
  onCancel: () => void;
  onAdd: () => void;
}

export const AddCustomCategoryModal = ({
  visible,
  newCategoryName,
  onChangeText,
  onCancel,
  onAdd,
}: AddCustomCategoryModalProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
          <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
            Add Custom Category
          </Text>
          <TextInput
            value={newCategoryName}
            onChangeText={onChangeText}
            placeholder="Category name"
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            style={[styles.input, isDark && styles.inputDark]}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.cancelButton, isDark && styles.cancelButtonDark]}
            >
              <Text style={[styles.cancelButtonText, isDark && styles.cancelButtonTextDark]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onAdd}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

