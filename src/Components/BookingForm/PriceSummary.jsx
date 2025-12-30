// src/Components/BookingForm/PriceSummary.jsx
// Real-time price calculation component for booking forms

import React, { useMemo } from 'react';
import { FaRupeeSign, FaCalculator, FaInfoCircle } from 'react-icons/fa';

// GST rate for hotel rooms (12% for rooms priced ₹1000-₹7500)
const GST_RATE = 0.12; // 12% GST

/**
 * PriceSummary Component
 * Displays real-time price calculation with breakdown
 * 
 * @param {Object} props
 * @param {Array} props.selectedRooms - Array of selected room objects with base_price
 * @param {string} props.checkInDate - Check-in date (YYYY-MM-DD format)
 * @param {string} props.checkOutDate - Check-out date (YYYY-MM-DD format)
 * @param {boolean} props.showTaxes - Whether to show GST breakdown (default: true)
 * @param {string} props.variant - 'compact' | 'detailed' (default: 'detailed')
 */
const PriceSummary = ({ 
  selectedRooms = [], 
  checkInDate, 
  checkOutDate, 
  showTaxes = true,
  variant = 'detailed' 
}) => {
  // Calculate pricing
  const pricing = useMemo(() => {
    if (!checkInDate || !checkOutDate || selectedRooms.length === 0) {
      return null;
    }

    // Calculate number of nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (nights <= 0) return null;

    // Calculate total room price per night
    const totalPricePerNight = selectedRooms.reduce((sum, room) => {
      return sum + (parseFloat(room.base_price) || 0);
    }, 0);

    // Calculate subtotal (before taxes)
    const subtotal = totalPricePerNight * nights;

    // Calculate GST
    const gstAmount = showTaxes ? Math.round(subtotal * GST_RATE) : 0;

    // Calculate final total
    const total = subtotal + gstAmount;

    return {
      nights,
      numberOfRooms: selectedRooms.length,
      rooms: selectedRooms,
      pricePerNight: totalPricePerNight,
      subtotal,
      gstRate: GST_RATE * 100,
      gstAmount,
      total,
    };
  }, [selectedRooms, checkInDate, checkOutDate, showTaxes]);

  if (!pricing) {
    return null;
  }

  // Compact variant for smaller displays
  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-r from-[#006938]/10 to-[#c49e72]/10 rounded-lg p-4 border border-[#006938]/20">
        <div className="flex items-center justify-between">
          <span className="text-sm font-Lora text-gray dark:text-lightGray">
            Total ({pricing.nights} night{pricing.nights !== 1 ? 's' : ''})
          </span>
          <span className="text-xl font-Garamond font-bold text-[#006938]">
            ₹{pricing.total.toLocaleString('en-IN')}
          </span>
        </div>
        {showTaxes && pricing.gstAmount > 0 && (
          <p className="text-xs text-gray dark:text-lightGray mt-1 font-Lora">
            Incl. {pricing.gstRate}% GST
          </p>
        )}
      </div>
    );
  }

  // Detailed variant (default)
  return (
    <div className="bg-gradient-to-br from-[#006938]/5 to-[#c49e72]/5 rounded-xl p-5 border border-[#006938]/20 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#006938]/20">
        <FaCalculator className="text-[#006938]" />
        <h4 className="text-base font-bold font-Garamond text-lightBlack dark:text-white">
          Price Summary
        </h4>
      </div>

      {/* Room breakdown */}
      <div className="space-y-2 mb-4">
        {pricing.rooms.map((room, index) => (
          <div key={room.id || index} className="flex justify-between text-sm font-Lora">
            <span className="text-gray dark:text-lightGray">{room.name}</span>
            <span className="text-lightBlack dark:text-white">₹{parseFloat(room.base_price).toLocaleString('en-IN')}/night</span>
          </div>
        ))}
      </div>

      {/* Calculation breakdown */}
      <div className="space-y-2 py-3 border-t border-b border-[#006938]/10">
        <div className="flex justify-between text-sm font-Lora">
          <span className="text-gray dark:text-lightGray">Price per night</span>
          <span className="text-lightBlack dark:text-white font-medium">
            ₹{pricing.pricePerNight.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex justify-between text-sm font-Lora">
          <span className="text-gray dark:text-lightGray">
            × {pricing.nights} night{pricing.nights !== 1 ? 's' : ''}
          </span>
          <span className="text-lightBlack dark:text-white font-medium">
            ₹{pricing.subtotal.toLocaleString('en-IN')}
          </span>
        </div>
        {showTaxes && pricing.gstAmount > 0 && (
          <div className="flex justify-between text-sm font-Lora items-center">
            <span className="text-gray dark:text-lightGray flex items-center gap-1">
              GST ({pricing.gstRate}%)
              <FaInfoCircle className="text-xs text-gray-400" title="Goods and Services Tax" />
            </span>
            <span className="text-lightBlack dark:text-white font-medium">
              ₹{pricing.gstAmount.toLocaleString('en-IN')}
            </span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-base font-Garamond font-semibold text-lightBlack dark:text-white">
          Total Amount
        </span>
        <span className="text-2xl font-Garamond font-bold text-[#006938]">
          ₹{pricing.total.toLocaleString('en-IN')}
        </span>
      </div>

      {/* Note */}
      <p className="text-xs text-gray dark:text-lightGray mt-3 font-Lora italic">
        * Final amount may vary based on applicable offers and discounts
      </p>
    </div>
  );
};

export default PriceSummary;

