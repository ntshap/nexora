'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from 'lucide-react';

interface AgeVerificationProps {
  open: boolean;
  onVerified: () => void;
  onDecline: () => void;
}

export function AgeVerification({
  open,
  onVerified,
  onDecline,
}: AgeVerificationProps) {
  const [birthdate, setBirthdate] = useState('');
  const [error, setError] = useState('');

  const calculateAge = (birthdate: string): number => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleVerify = () => {
    if (!birthdate) {
      setError('Please enter your birthdate');
      return;
    }

    const age = calculateAge(birthdate);

    if (age < 18) {
      setError(
        'You must be at least 18 years old to use NEXORA. We apologize for the inconvenience.'
      );
      return;
    }

    if (age > 120) {
      setError('Please enter a valid birthdate');
      return;
    }

    setError('');
    onVerified();
  };

  // Get max date (today) for date picker
  const maxDate = new Date().toISOString().split('T')[0];

  // Get min date (120 years ago)
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 120);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md border-purple-500/20 bg-gradient-to-b from-[#0b0b1f] to-[#050510] shadow-[0_0_80px_-15px_rgba(139,92,246,0.5)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
            <Calendar className="h-5 w-5 text-purple-400" />
            Age Verification Required
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            You must be 18 or older to use this service
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="birthdate" className="text-gray-300">Date of Birth</Label>
            <Input
              id="birthdate"
              type="date"
              value={birthdate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setBirthdate(e.target.value);
                setError('');
              }}
              max={maxDate}
              min={minDateStr}
              className="w-full bg-[#0f0f23] border-purple-500/30 text-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
            />
            <p className="text-xs text-gray-500">
              Your date of birth is used for age verification only and will not
              be stored.
            </p>
          </div>

          {error && (
            <Alert variant={error.includes('18') ? 'destructive' : 'default'} className="border-red-500/30 bg-red-950/20">
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}

          <Alert className="border-purple-500/20 bg-purple-950/20">
            <AlertDescription className="text-xs text-purple-200">
              <strong>Privacy Notice:</strong> NEXORA collects minimal personal
              information. We only verify that you meet the age requirement.
              Your exact birthdate is not stored.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={onDecline} 
            className="flex-1 border-purple-500/30 bg-transparent hover:bg-purple-950/30 text-gray-300"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleVerify} 
            disabled={!birthdate} 
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-[0_0_30px_-8px_rgba(139,92,246,0.8)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify Age
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
