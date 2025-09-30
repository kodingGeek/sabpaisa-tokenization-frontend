import React from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Box,
  Typography,
  Divider,
  Tooltip,
} from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { themes } from '../../themes/themes';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeSelect = (themeId: string) => {
    onThemeChange(themeId);
    handleClose();
  };

  const currentThemeConfig = themes.find(t => t.id === currentTheme);

  return (
    <>
      <Tooltip title="Change Theme">
        <IconButton
          onClick={handleClick}
          size="large"
          color="inherit"
        >
          <PaletteIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 250, maxHeight: 400 }
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Select Theme
          </Typography>
        </Box>
        <Divider />
        
        {/* Light Themes */}
        <MenuItem disabled>
          <Typography variant="caption" color="text.secondary">
            Light Themes
          </Typography>
        </MenuItem>
        {themes
          .filter(theme => theme.mode === 'light')
          .map((theme) => (
            <MenuItem
              key={theme.id}
              onClick={() => handleThemeSelect(theme.id)}
              selected={theme.id === currentTheme}
            >
              <LightModeIcon sx={{ mr: 1.5, fontSize: 20 }} />
              <Box>
                <Typography variant="body2">{theme.name}</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: theme.primary[500],
                    }}
                  />
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: theme.secondary[500],
                    }}
                  />
                </Box>
              </Box>
            </MenuItem>
          ))}
        
        <Divider sx={{ my: 1 }} />
        
        {/* Dark Themes */}
        <MenuItem disabled>
          <Typography variant="caption" color="text.secondary">
            Dark Themes
          </Typography>
        </MenuItem>
        {themes
          .filter(theme => theme.mode === 'dark')
          .map((theme) => (
            <MenuItem
              key={theme.id}
              onClick={() => handleThemeSelect(theme.id)}
              selected={theme.id === currentTheme}
            >
              <DarkModeIcon sx={{ mr: 1.5, fontSize: 20 }} />
              <Box>
                <Typography variant="body2">{theme.name}</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: theme.primary[500],
                    }}
                  />
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: theme.secondary[500],
                    }}
                  />
                </Box>
              </Box>
            </MenuItem>
          ))}
      </Menu>
    </>
  );
};

export default ThemeSelector;