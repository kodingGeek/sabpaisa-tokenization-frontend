import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Switch,
  FormControlLabel,
  Tooltip,
  Menu,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
  Search,
  Add,
  Edit,
  Delete,
  Block,
  CheckCircle,
  MoreVert,
  Email,
  Phone,
  VpnKey,
  PersonAdd,
  Download,
  Upload,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  department: string;
  lastLogin: string;
  createdAt: string;
  mfaEnabled: boolean;
  phone: string;
}

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    phone: '',
    tempPassword: '',
    mfaEnabled: false,
    sendWelcomeEmail: true,
  });

  // Mock data
  const users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@sabpaisa.com',
      role: 'SYSTEM_ADMIN',
      status: 'ACTIVE',
      department: 'IT',
      lastLogin: '2024-01-23T10:30:00Z',
      createdAt: '2023-01-15T00:00:00Z',
      mfaEnabled: true,
      phone: '+91 9876543210',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@sabpaisa.com',
      role: 'SECURITY_OFFICER',
      status: 'ACTIVE',
      department: 'Security',
      lastLogin: '2024-01-23T09:15:00Z',
      createdAt: '2023-03-20T00:00:00Z',
      mfaEnabled: true,
      phone: '+91 9876543211',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@merchant.com',
      role: 'MERCHANT',
      status: 'SUSPENDED',
      department: 'External',
      lastLogin: '2024-01-20T14:20:00Z',
      createdAt: '2023-06-10T00:00:00Z',
      mfaEnabled: false,
      phone: '+91 9876543212',
    },
  ];

  const roles = [
    { value: 'MERCHANT', label: 'Merchant' },
    { value: 'SECURITY_OFFICER', label: 'Security Officer' },
    { value: 'COMPLIANCE_OFFICER', label: 'Compliance Officer' },
    { value: 'SYSTEM_ADMIN', label: 'System Administrator' },
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: '',
      department: '',
      phone: '',
      tempPassword: '',
      mfaEnabled: false,
      sendWelcomeEmail: true,
    });
    setOpenDialog(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone,
      tempPassword: '',
      mfaEnabled: user.mfaEnabled,
      sendWelcomeEmail: false,
    });
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleSaveUser = () => {
    if (editingUser) {
      toast.success('User updated successfully!');
    } else {
      toast.success('User created successfully!');
    }
    setOpenDialog(false);
  };

  const handleDeleteUser = () => {
    toast.success('User deleted successfully!');
    handleMenuClose();
  };

  const handleResetPassword = () => {
    toast.success('Password reset email sent!');
    handleMenuClose();
  };

  const handleToggleStatus = () => {
    const newStatus = selectedUser?.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    toast.success(`User ${newStatus.toLowerCase()} successfully!`);
    handleMenuClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'warning';
      case 'SUSPENDED': return 'error';
      default: return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SYSTEM_ADMIN': return 'error';
      case 'SECURITY_OFFICER': return 'warning';
      case 'COMPLIANCE_OFFICER': return 'info';
      case 'MERCHANT': return 'primary';
      default: return 'default';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'User',
      width: 250,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {params.row.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2">{params.value}</Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value.replace('_', ' ')}
          size="small"
          color={getRoleColor(params.value)}
        />
      ),
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 120,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          size="small"
          color={getStatusColor(params.value)}
          icon={params.value === 'ACTIVE' ? <CheckCircle /> : <Block />}
        />
      ),
    },
    {
      field: 'mfaEnabled',
      headerName: '2FA',
      width: 80,
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        params.value ? <CheckCircle color="success" /> : null
      ),
    },
    {
      field: 'lastLogin',
      headerName: 'Last Login',
      width: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      align: 'center',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e, params.row)}
        >
          <MoreVert />
        </IconButton>
      ),
    },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">User Management</Typography>
        <Box display="flex" gap={1}>
          <Button variant="outlined" startIcon={<Upload />}>
            Import Users
          </Button>
          <Button variant="outlined" startIcon={<Download />}>
            Export Users
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={handleCreateUser}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              {selectedUsers.length > 0 && (
                <Box display="flex" gap={1} justifyContent="flex-end">
                  <Button size="small" variant="outlined">
                    Send Message ({selectedUsers.length})
                  </Button>
                  <Button size="small" variant="outlined" color="warning">
                    Suspend ({selectedUsers.length})
                  </Button>
                  <Button size="small" variant="outlined" color="error">
                    Delete ({selectedUsers.length})
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <Box style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(selection) => setSelectedUsers(selection as string[])}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
          />
        </Box>
      </Card>

      {/* User Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEditUser(selectedUser!)}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit User
        </MenuItem>
        <MenuItem onClick={handleResetPassword}>
          <VpnKey fontSize="small" sx={{ mr: 1 }} /> Reset Password
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          <Block fontSize="small" sx={{ mr: 1 }} />
          {selectedUser?.status === 'ACTIVE' ? 'Suspend' : 'Activate'} User
        </MenuItem>
        <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete User
        </MenuItem>
      </Menu>

      {/* Create/Edit User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!!editingUser}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  label="Role"
                >
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </Grid>
            {!editingUser && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Temporary Password"
                  type="password"
                  value={formData.tempPassword}
                  onChange={(e) => setFormData({ ...formData, tempPassword: e.target.value })}
                  helperText="User will be required to change on first login"
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.mfaEnabled}
                    onChange={(e) => setFormData({ ...formData, mfaEnabled: e.target.checked })}
                  />
                }
                label="Enable Two-Factor Authentication"
              />
            </Grid>
            {!editingUser && (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.sendWelcomeEmail}
                      onChange={(e) => setFormData({ ...formData, sendWelcomeEmail: e.target.checked })}
                    />
                  }
                  label="Send welcome email with credentials"
                />
              </Grid>
            )}
          </Grid>
          
          {!editingUser && (
            <Alert severity="info" sx={{ mt: 2 }}>
              The user will receive an email with login instructions and temporary credentials.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained">
            {editingUser ? 'Save Changes' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default UserManagement;