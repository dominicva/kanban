import { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
export default function useOutsideClickNavigate(
  ref: React.RefObject<HTMLDivElement>
) {
  const navigate = useNavigate();
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        navigate('/projects');
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, navigate]);
}
