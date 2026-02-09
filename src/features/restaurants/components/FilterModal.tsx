import { Modal, Pressable, View, Text, FlatList, StyleSheet } from 'react-native';
import { moderateScale, scale, scaleFont, verticalScale } from '../../../shared/utils/scale';
import { useMemo } from 'react';

type ModalProps = {
  visible: boolean;                
  title: string;                   
  options: string[];     
  mapIdToLabel?: (value: string) => string;      
  onSelect: (value: string | null) => void;
  onClose: () => void;              
  colors: any;                     
};

export function FilterModal({
  visible,
  title,
  options,
  mapIdToLabel,
  onSelect,
  onClose,
  colors,
}: ModalProps) {
  const optionsList = useMemo(() => ['ALL', ...options], [options]);

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="fade"
      accessibilityViewIsModal
      onRequestClose={onClose} 
    >
      <Pressable 
        testID="modal-backdrop" 
        style={styles.backdrop} 
        onPress={onClose}
        accessible
        accessibilityLabel="Close modal"
      >
        <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
          <Text 
            testID="modal-title" 
            style={[styles.modalTitle, { color: colors.textPrimary }]}
            accessibilityRole="header"
          >
            {title}
          </Text>
          <FlatList
            data={optionsList}
            keyExtractor={i => i}
            style={{ maxHeight: verticalScale(360) }}
            renderItem={({ item }) => (
              <Pressable
                testID={`modal-option-${item}`}
                style={({ pressed }) => [
                  styles.modalItem,
                  {
                    backgroundColor: pressed
                      ? `${colors.accent}22`
                      : 'transparent', 
                  },
                ]}
                onPress={() => onSelect(item === 'ALL' ? null : item)}
                accessible
                accessibilityRole="button"
                accessibilityLabel={item === 'ALL' ? 'All options' : mapIdToLabel?.(item) ?? item}
              >
                <Text style={{ color: colors.textPrimary, fontSize: scaleFont(14) }}>
                  {item === 'ALL' ? 'All' : mapIdToLabel?.(item) ?? item}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    maxHeight: '80%',
    borderRadius: moderateScale(12),
    padding: scale(16),
  },
  modalTitle: {
    fontSize: scaleFont(18),
    fontWeight: '700',
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(6),
  },
});