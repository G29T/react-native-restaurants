import { useMemo } from "react";
import { ActionButton } from "../../../shared/components/action-button/ActionButton";
import { View } from "react-native";

type FilterButtonProps = {
  label: string;
  value: string;
  onPress: () => void;
};

export function FilterButton({ label, value, onPress }: FilterButtonProps) {
  const displayLabel = useMemo(() => `${label}: ${value}`, [label, value]);

  return (
    <View style={{ maxWidth: '48%', flexShrink: 1 }}>
      <ActionButton
        variant="secondary"
        label={displayLabel}
        onPress={onPress}
        testID={`filter-${label.toLowerCase()}`}
      />
    </View>
  );
}