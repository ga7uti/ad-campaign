import { Box, Card, CardContent, CardHeader, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import * as React from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

export default function BudgerBidding(): React.JSX.Element {

  const [age, setAge] = React.useState('');

  const handleAgeChange = (event: SelectChangeEvent<string>) => {
    const {
      target: { value },
    } = event;
    setAge(event.target.value as string);
  };
  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card>
            <CardHeader title="Budget & Bidding" />
            <CardContent>
              <Typography variant="body2">Select location for the campaign:</Typography>
              <FormControl fullWidth>
                <TextField id="outlined-basic" label="Outlined" variant="outlined" />
              </FormControl>
            </CardContent>
            <CardContent>

            <Typography variant="body2">Select location for the campaign:</Typography>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="Age"
                  onChange={handleAgeChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              </CardContent>
          </Card>
        </Box>
  );
}