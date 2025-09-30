import React from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  Box,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { languages } from '../../i18n/i18n';
import TranslateIcon from '@mui/icons-material/Translate';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <Select
        value={i18n.language}
        onChange={handleLanguageChange}
        displayEmpty
        startAdornment={
          <TranslateIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
        }
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2">{lang.nativeName}</Typography>
              <Typography variant="caption" color="text.secondary">
                {lang.name}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;