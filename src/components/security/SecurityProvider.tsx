import React, { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout, updateActivity, selectLastActivity, selectSessionExpiry } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

interface SecurityProviderProps {
  children: React.ReactNode;
}

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const WARNING_BEFORE_TIMEOUT = 2 * 60 * 1000; // 2 minutes

const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const lastActivity = useAppSelector(selectLastActivity);
  const sessionExpiry = useAppSelector(selectSessionExpiry);

  // Update activity on user interaction
  const updateUserActivity = useCallback(() => {
    dispatch(updateActivity());
  }, [dispatch]);

  // Check for session timeout
  useEffect(() => {
    const checkTimeout = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;
      const timeUntilExpiry = sessionExpiry ? sessionExpiry - now : Infinity;

      // Check session expiry
      if (sessionExpiry && now >= sessionExpiry) {
        toast.error('Session expired. Please login again.');
        dispatch(logout());
        return;
      }

      // Check inactivity timeout
      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
        toast.warning('Session timed out due to inactivity.');
        dispatch(logout());
        return;
      }

      // Show warning before timeout
      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT - WARNING_BEFORE_TIMEOUT &&
          timeSinceLastActivity < INACTIVITY_TIMEOUT - WARNING_BEFORE_TIMEOUT + 1000) {
        toast.warning('Your session will expire in 2 minutes due to inactivity.', {
          autoClose: false,
          toastId: 'session-warning',
        });
      }
    };

    const interval = setInterval(checkTimeout, 1000);
    return () => clearInterval(interval);
  }, [dispatch, lastActivity, sessionExpiry]);

  // Listen for user activity
  useEffect(() => {
    const events = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, updateUserActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateUserActivity);
      });
    };
  }, [updateUserActivity]);

  // Prevent copy/paste on sensitive fields
  useEffect(() => {
    const preventCopyPaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.getAttribute('data-sensitive') === 'true') {
        e.preventDefault();
        toast.warning('Copy/paste is disabled for security reasons');
      }
    };

    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);
    document.addEventListener('cut', preventCopyPaste);

    return () => {
      document.removeEventListener('copy', preventCopyPaste);
      document.removeEventListener('paste', preventCopyPaste);
      document.removeEventListener('cut', preventCopyPaste);
    };
  }, []);

  // Detect developer tools (basic detection)
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const detectDevTools = () => {
        const threshold = 160;
        if (window.outerHeight - window.innerHeight > threshold ||
            window.outerWidth - window.innerWidth > threshold) {
          console.warn('Developer tools detected');
          // In production, you might want to take action here
        }
      };

      window.addEventListener('resize', detectDevTools);
      return () => window.removeEventListener('resize', detectDevTools);
    }
  }, []);

  return <>{children}</>;
};

export default SecurityProvider;