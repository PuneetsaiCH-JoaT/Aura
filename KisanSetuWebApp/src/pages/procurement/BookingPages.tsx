import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { Button, Card, PageHeader, StepBanner, FormField, Input } from '../../components/shared';
import { CROP_LIST, MOCK_SLOTS } from '../../data/mockData';
import { mockCreateBooking } from '../../services/mockApi';
import type { Slot } from '../../types';
import { clsx } from 'clsx';

// ============================================================
// CROP & QUANTITY PAGE
// ============================================================
export const CropQuantityPage: React.FC = () => {
  const { goBack, setCropDetails, selectedCentre } = useAppStore();
  const [crop, setCrop] = useState('Paddy');
  const [quantityBags, setQuantityBags] = useState('60');
  const [harvestDate, setHarvestDate] = useState('2024-05-28');
  const [vehicleNumber, setVehicleNumber] = useState('AP 26 AB 1234');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!crop) e.crop = 'Please select a crop';
    if (!quantityBags || isNaN(Number(quantityBags)) || Number(quantityBags) <= 0)
      e.qty = 'Enter a valid quantity';
    if (!harvestDate) e.harvestDate = 'Enter harvest date';
    if (!vehicleNumber) e.vehicle = 'Enter vehicle number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    const bags = Number(quantityBags);
    setCropDetails({
      crop,
      quantityBags: bags,
      quantityKg: bags * 50,
      harvestDate,
      vehicleNumber,
    });
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <PageHeader title="Crop & Quantity" subtitle="Step 1 of 4" onBack={goBack} />
      <StepBanner step={1} total={4} label="Crop Details" />

      <div className="px-4 py-4 flex flex-col gap-1 flex-1">
        <Card variant="green" className="mb-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#22863A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <div>
              <p className="text-xs text-gray-500">Selected Centre</p>
              <p className="font-semibold text-[#1B5E20] text-sm">{selectedCentre?.name ?? 'Centre A'}</p>
            </div>
          </div>
        </Card>

        <FormField label="Crop" required error={errors.crop}>
          <select
            value={crop}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCrop(e.target.value)}
            className="field-input"
          >
            <option value="">Select Crop</option>
            {CROP_LIST.map(c => <option key={c}>{c}</option>)}
          </select>
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Quantity (Bags)" required error={errors.qty}>
            <Input
              type="number"
              value={quantityBags}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantityBags(e.target.value)}
              placeholder="60"
              min="1"
              error={!!errors.qty}
            />
          </FormField>
          <FormField label="Est. Weight (kg)">
            <div className="field-input bg-gray-50 text-gray-600 text-base py-3 px-4">
              {quantityBags ? Number(quantityBags) * 50 : 0} kg
            </div>
          </FormField>
        </div>

        <FormField label="Harvested On" required error={errors.harvestDate}>
          <Input
            type="date"
            value={harvestDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHarvestDate(e.target.value)}
            error={!!errors.harvestDate}
          />
        </FormField>

        <FormField label="Vehicle Number" required error={errors.vehicle}>
          <Input
            type="text"
            value={vehicleNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVehicleNumber(e.target.value)}
            placeholder="AP 26 AB 1234"
            error={!!errors.vehicle}
          />
        </FormField>

        <Card variant="green" className="mt-2">
          <p className="text-xs text-[#1B5E20] font-semibold mb-1">💡 Quality Tip</p>
          <p className="text-xs text-gray-600">
            For <strong>Paddy</strong>, ensure moisture ≤16% and foreign matter ≤1% before visiting to avoid rejection.
          </p>
        </Card>
      </div>

      <div className="px-4 py-4">
        <Button onClick={handleNext} size="lg">Next — Select Slot</Button>
      </div>
    </div>
  );
};

// ============================================================
// SELECT SLOT PAGE
// ============================================================
export const SelectSlotPage: React.FC = () => {
  const { goBack, selectedSlot, selectSlot, cropDetails, selectedCentre } = useAppStore();
  const [selectedDate, setSelectedDate] = useState('28 May 2024');
  const [loading, setLoading] = useState(false);
  const dates = ['28 May 2024', '29 May 2024', '30 May 2024'];

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    setLoading(true);
    const booking = await mockCreateBooking({
      centre: selectedCentre!,
      slot: selectedSlot,
      cropDetails: cropDetails!,
      date: selectedDate,
    });
    setLoading(false);
    useAppStore.getState().createBooking(booking);
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <PageHeader title="Select Slot" subtitle="Step 2 of 4" onBack={goBack} />
      <StepBanner step={2} total={4} label="Choose Your Time" />

      <div className="px-4 py-4 flex flex-col gap-4 flex-1">
        <div>
          <p className="section-header">Select Date</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {dates.map(date => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={clsx(
                  'flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all',
                  selectedDate === date
                    ? 'border-[#22863A] bg-[#E8F5E9] text-[#22863A]'
                    : 'border-gray-200 text-gray-600'
                )}
              >
                {date}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="section-header">Available Time Slots</p>
          <div className="flex flex-col gap-2">
            {MOCK_SLOTS.map(slot => (
              <SlotCard
                key={slot.id}
                slot={slot}
                selected={selectedSlot?.id === slot.id}
                onSelect={() => selectSlot(slot)}
              />
            ))}
          </div>
        </div>

        {selectedSlot && (
          <Card variant="green">
            <p className="text-xs text-gray-500 mb-1">Selected Slot</p>
            <p className="font-bold text-[#1B5E20]">{selectedSlot.label}</p>
            <p className="text-xs text-gray-600 mt-1">
              Est. wait: ~{selectedSlot.estimatedWaitMin} min · {selectedSlot.available} slots left
            </p>
          </Card>
        )}
      </div>

      <div className="px-4 py-4">
        <Button onClick={handleConfirm} loading={loading} disabled={!selectedSlot} size="lg">
          Confirm Slot
        </Button>
      </div>
    </div>
  );
};

const SlotCard: React.FC<{ slot: Slot; selected: boolean; onSelect: () => void }> = ({
  slot, selected, onSelect
}) => {
  const urgency = slot.available <= 5 ? 'text-red-500' : slot.available <= 10 ? 'text-amber-500' : 'text-green-600';
  return (
    <button
      onClick={onSelect}
      className={clsx(
        'w-full rounded-xl p-4 border-2 flex items-center justify-between transition-all',
        selected ? 'border-[#22863A] bg-[#E8F5E9]' : 'border-gray-100 bg-white hover:border-gray-200'
      )}
    >
      <div className="text-left">
        <p className={clsx('font-semibold text-sm', selected ? 'text-[#1B5E20]' : 'text-gray-800')}>
          {slot.label}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">Est. wait: ~{slot.estimatedWaitMin} min</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className={clsx('font-bold text-sm', urgency)}>{slot.available}</p>
          <p className="text-[10px] text-gray-400">available</p>
        </div>
        <div className={clsx(
          'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
          selected ? 'border-[#22863A] bg-[#22863A]' : 'border-gray-300'
        )}>
          {selected && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
};

// ============================================================
// BOOKING CONFIRMED
// ============================================================
export const BookingConfirmedPage: React.FC = () => {
  const { booking, navigate } = useAppStore();
  if (!booking) return null;

  const handleShare = () => {
    const msg = `Krishi Setu Booking!\nToken: ${booking.tokenNumber}\nCentre: ${booking.centre.name}\nDate: ${booking.date}\nSlot: ${booking.slot.label}`;
    if (navigator.share) {
      navigator.share({ title: 'Krishi Setu Token', text: msg });
    } else {
      navigator.clipboard.writeText(msg).then(() => alert('Booking details copied!'));
    }
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div className="bg-[#22863A] px-6 pt-8 pb-6 flex flex-col items-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-xl">
          <svg className="w-9 h-9 text-[#22863A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white">Booking Confirmed!</h2>
        <p className="text-green-200 text-sm mt-1">Your token has been successfully booked</p>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">
        <div className="flex flex-col items-center py-4">
          <p className="text-xs text-gray-500 mb-2">Token Number</p>
          <div className="w-28 h-28 bg-[#22863A] rounded-full flex items-center justify-center shadow-xl">
            <span className="text-4xl font-extrabold text-white">{booking.tokenNumber}</span>
          </div>
        </div>

        <Card>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['Centre', booking.centre.name.split('—')[0].trim()],
              ['Date', booking.date],
              ['Slot', booking.slot.label],
              ['Est. Wait', `${booking.estimatedWaitMin[0]}–${booking.estimatedWaitMin[1]} min`],
              ['Crop', booking.cropDetails.crop],
              ['Quantity', `${booking.cropDetails.quantityBags} Bags`],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="green">
          <p className="text-xs text-[#1B5E20] font-semibold mb-1">⚠️ Important</p>
          <p className="text-xs text-gray-700">
            Please reach the centre at least 30 minutes before your slot. Carry your Aadhaar card and vehicle documents.
          </p>
        </Card>

        <Button onClick={() => navigate('live-queue')} size="lg">Track My Token</Button>
        <Button variant="secondary" onClick={handleShare}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share via WhatsApp / SMS
        </Button>
      </div>
    </div>
  );
};
