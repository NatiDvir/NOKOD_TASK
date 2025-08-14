import { Autocomplete, TextField, Box } from '@mui/material';
import { tableStyles } from './styles';
import type { Automation } from '@sharedTypes/types';

interface FilterDropdownProps {
  field: keyof Automation;
  value: string | null;
  options: string[];
  width: string;
  onChange: (value: string | null) => void;
}

const FilterDropdown = ({ 
  field, 
  value, 
  options, 
  width, 
  onChange 
}: FilterDropdownProps): JSX.Element => {
  const handleChange = (event: any, newValue: string | null) => {
    onChange(newValue);
  };

  return (
    <Box sx={tableStyles.filterContainer}>
      <Box sx={tableStyles.filterBox(width)}>
        <Autocomplete
          size="small"
          value={value}
          onChange={handleChange}
          options={options}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Filter"
              sx={tableStyles.filterInput}
            />
          )}
          ListboxProps={{
            style: {
              maxHeight: 300
            }
          }}
          noOptionsText="No options found"
          clearOnEscape
        />
      </Box>
    </Box>
  );
};

export default FilterDropdown;
