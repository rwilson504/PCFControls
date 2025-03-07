import * as React from "react";
import { usePcfContext } from "../services/PcfContext";
import {
  Dropdown,
  Option,
  Tooltip,
} from "@fluentui/react-components";
import type { DropdownProps } from "@fluentui/react-components";
import { useStyles } from "../utils/styles";
import { IRestrictedChoiceAppProps } from "../RestrictedChoiceApp";

interface IOption {
  key: string | number;
  text: string;
  restricted?: boolean;
}

export const RestrictedChoiceControl: React.FC<IRestrictedChoiceAppProps> = (
  props
) => {
  const pcfContext = usePcfContext();
  const styles = useStyles();
  // Check if control is visible
  if (!pcfContext.isVisible()) return <></>;

  const isMultiSelect = props.isMultiSelect;
  // Determine disabled state from context.
  const isDisabled = pcfContext.isControlDisabled();

  // For single select, maintain the selected key as a string.
  const [selectedKey, setSelectedKey] = React.useState<string | undefined>(
    !isMultiSelect && props.currentValue != null
      ? props.currentValue.toString()
      : undefined
  );
  // For multi select, maintain the selected keys as an array of strings.
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>(
    isMultiSelect && Array.isArray(props.currentValue)
      ? (props.currentValue).map(String)
      : []
  );

  // Update state if props.currentValue changes.
  React.useEffect(() => {
    if (isMultiSelect) {
      if (Array.isArray(props.currentValue)) {
        setSelectedKeys((props.currentValue).map(String));
      } else {
        setSelectedKeys([]);
      }
    } else {
      if (props.currentValue != null) {
        setSelectedKey(props.currentValue.toString());
      } else {
        setSelectedKey(undefined);
      }
    }
  }, [props.currentValue, isMultiSelect]);

  // Map the options using the information passed from the index.
  const mappedOptions: IOption[] = props.options.map((opt) => ({
    key: opt.Value,
    text: opt.Label,
    restricted: props.restrictedOptions.includes(Number(opt.Value)),
  }));

  // Add the --Select-- option if conditions are met
  const selectOption: IOption = { key: -1, text: '--Select--' };
  const includeSelectOption = !props.isMultiSelect && !props.defaultValue;

  // Determine which options to display:
  const displayedOptions = !props.restrictChoices
    ? (includeSelectOption ? [selectOption, ...mappedOptions] : mappedOptions)  // Show all options when restrictions are off
    : props.restrictedChoiceVisibility === 0
    ? includeSelectOption 
      ? [
          selectOption,
          ...mappedOptions.filter(
            (opt) =>
              !opt.restricted ||
              (!isMultiSelect && selectedKey !== undefined && opt.key.toString() === selectedKey) ||
              (isMultiSelect && selectedKeys.includes(opt.key.toString()))
          ),
        ]
      : mappedOptions.filter(
          (opt) =>
            !opt.restricted ||
            (!isMultiSelect && selectedKey !== undefined && opt.key.toString() === selectedKey) ||
            (isMultiSelect && selectedKeys.includes(opt.key.toString()))
        )
    : includeSelectOption ? [selectOption, ...mappedOptions] : mappedOptions;

  // Compute the display text based on current selection.
  const displayText = isMultiSelect
    ? selectedKeys.length > 0
      ? selectedKeys
          .map((key) => {
            const opt = mappedOptions.find((o) => o.key.toString() === key);
            return opt ? opt.text : key;
          })
          .join(", ")
      : ""
    : selectedKey === '-1' || selectedKey === undefined
    ? ""
    : selectedKey
    ? mappedOptions.find((o) => o.key.toString() === selectedKey)?.text ??
      selectedKey
    : "";

  const onOptionSelect: DropdownProps["onOptionSelect"] = (event, data) => {
    if (isMultiSelect) {
      const newSelected = data?.selectedOptions ?? [];
      setSelectedKeys(newSelected);
      const numericValues = newSelected.map((val) => Number(val));
      props.onChange(numericValues);
      console.log("Multi-select chosen options:", newSelected);
    } else {
      const newSelected =
        data?.selectedOptions && data.selectedOptions.length > 0
          ? data.selectedOptions[0]
          : undefined;
      setSelectedKey(newSelected);
      const numericValue = newSelected !== null ? Number(newSelected) : null;
      props.onChange(numericValue);
      console.log("Single-select chosen option:", newSelected);
    }
  };

  return (
    <Tooltip content={displayText === "" ? "--Select--" : displayText} relationship="label">
      <Dropdown        
        appearance="filled-darker"
        className={styles.root}
        onOptionSelect={onOptionSelect}
        multiselect={isMultiSelect}
        selectedOptions={
          isMultiSelect ? selectedKeys : selectedKey ? [selectedKey] : []
        }        
        disabled={isDisabled}
        value={displayText}
        placeholder="---" // <-- Use placeholder to show ---
      >
        {displayedOptions.map((opt) => {
          const isSelected = isMultiSelect
            ? selectedKeys.includes(opt.key.toString())
            : selectedKey === opt.key.toString();
          // Only apply restrictions if restrictChoices is true
          const isDisabled = props.restrictChoices && opt.restricted && !isSelected;
          return (
            <Option
              key={opt.key}
              disabled={isDisabled}
              value={opt.key.toString()}
            >
              {opt.text}
            </Option>
          );
        })}
      </Dropdown>
    </Tooltip>
  );
};
