import { SearchInput, ToolbarFilter } from "@patternfly/react-core";

interface Props {
  display: boolean;
  valueDisplayed: string;
  onChange: (value: string) => void;
  category: string;
}
export const AttributeFilter = ({
  display,
  valueDisplayed,
  category,
  onChange,
}: Props) => {
  return (
    <ToolbarFilter
      chips={valueDisplayed !== "" ? [valueDisplayed] : ([] as string[])}
      deleteChip={() => onChange("")}
      deleteChipGroup={() => onChange("")}
      categoryName={category}
      showToolbarItem={display}
    >
      <SearchInput
        placeholder={"Filter by " + category}
        value={valueDisplayed}
        onChange={(_event, value) => onChange(value)}
        onClear={() => onChange("")}
      />
    </ToolbarFilter>
  );
};
