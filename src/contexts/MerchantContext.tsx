import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import merchantService from '../services/merchantService';
import { toast } from 'react-toastify';

interface Merchant {
  merchantId: string;
  businessName: string;
  status: string;
  email: string;
  phoneNumber: string;
  businessType: string;
}

interface MerchantContextType {
  merchants: Merchant[];
  selectedMerchant: Merchant | null;
  selectedMerchantId: string;
  loading: boolean;
  error: string | null;
  selectMerchant: (merchantId: string) => void;
  refreshMerchants: () => Promise<void>;
  clearSelection: () => void;
}

const MerchantContext = createContext<MerchantContextType | undefined>(undefined);

export const useMerchant = () => {
  const context = useContext(MerchantContext);
  if (!context) {
    throw new Error('useMerchant must be used within MerchantProvider');
  }
  return context;
};

interface MerchantProviderProps {
  children: ReactNode;
}

export const MerchantProvider: React.FC<MerchantProviderProps> = ({ children }) => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('');
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load merchants on mount
  useEffect(() => {
    fetchMerchants();
  }, []);

  // Update selected merchant when ID changes
  useEffect(() => {
    if (selectedMerchantId && merchants.length > 0) {
      const merchant = merchants.find(m => m.merchantId === selectedMerchantId);
      setSelectedMerchant(merchant || null);
      
      // Store in localStorage for persistence
      if (merchant) {
        localStorage.setItem('selectedMerchantId', merchant.merchantId);
      }
    } else {
      setSelectedMerchant(null);
    }
  }, [selectedMerchantId, merchants]);

  const fetchMerchants = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await merchantService.getAllMerchants({ page: 0, size: 100 });
      const activeMerchants = response.merchants
        .filter((m: any) => m.status === 'ACTIVE')
        .map((m: any) => ({
          ...m,
          phoneNumber: m.phoneNumber || m.phone || '', // Add phoneNumber with fallback
        }));
      setMerchants(activeMerchants);
      
      // Auto-select based on localStorage or if only one merchant
      const savedMerchantId = localStorage.getItem('selectedMerchantId');
      if (savedMerchantId && activeMerchants.some((m: any) => m.merchantId === savedMerchantId)) {
        setSelectedMerchantId(savedMerchantId);
      } else if (activeMerchants.length === 1) {
        setSelectedMerchantId(activeMerchants[0].merchantId);
      }
    } catch (err: any) {
      console.error('Error fetching merchants:', err);
      setError(err.message || 'Failed to load merchants');
      toast.error('Failed to load merchants');
    } finally {
      setLoading(false);
    }
  };

  const selectMerchant = (merchantId: string) => {
    setSelectedMerchantId(merchantId);
  };

  const refreshMerchants = async () => {
    await fetchMerchants();
  };

  const clearSelection = () => {
    setSelectedMerchantId('');
    localStorage.removeItem('selectedMerchantId');
  };

  const value: MerchantContextType = {
    merchants,
    selectedMerchant,
    selectedMerchantId,
    loading,
    error,
    selectMerchant,
    refreshMerchants,
    clearSelection,
  };

  return (
    <MerchantContext.Provider value={value}>
      {children}
    </MerchantContext.Provider>
  );
};

export default MerchantContext;