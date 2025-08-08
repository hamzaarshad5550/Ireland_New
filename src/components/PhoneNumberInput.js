import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { parsePhoneNumber, isValidPhoneNumber, getCountries, getCountryCallingCode } from 'libphonenumber-js';



// Function to get country name from country code using Intl API
const getCountryName = (countryCode) => {
  if (!countryCode || countryCode.length !== 2) {
    return 'Unknown Country';
  }

  try {
    // Use Intl.DisplayNames to get the country name in English
    const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
    const countryName = displayNames.of(countryCode.toUpperCase());
    return countryName || 'Unknown Country';
  } catch (error) {
    // Fallback to a generic name instead of country code
    return 'Unknown Country';
  }
};

// Country data with names
const countryData = {
  'US': { name: 'United States' },
  'IE': { name: 'Ireland' },
  'GB': { name: 'United Kingdom' },
  'CA': { name: 'Canada' },
  'AU': { name: 'Australia' },
  'DE': { name: 'Germany' },
  'FR': { name: 'France' },
  'IT': { name: 'Italy' },
  'ES': { name: 'Spain' },
  'NL': { name: 'Netherlands' },
  'BE': { name: 'Belgium' },
  'CH': { name: 'Switzerland' },
  'AT': { name: 'Austria' },
  'SE': { name: 'Sweden' },
  'NO': { name: 'Norway' },
  'DK': { name: 'Denmark' },
  'FI': { name: 'Finland' },
  'PL': { name: 'Poland' },
  'CZ': { name: 'Czech Republic' },
  'HU': { name: 'Hungary' },
  'PT': { name: 'Portugal' },
  'GR': { name: 'Greece' },
  'IN': { name: 'India' },
  'CN': { name: 'China' },
  'JP': { name: 'Japan' },
  'KR': { name: 'South Korea' },
  'SG': { name: 'Singapore' },
  'MY': { name: 'Malaysia' },
  'TH': { name: 'Thailand' },
  'VN': { name: 'Vietnam' },
  'PH': { name: 'Philippines' },
  'ID': { name: 'Indonesia' },
  'BR': { name: 'Brazil' },
  'MX': { name: 'Mexico' },
  'AR': { name: 'Argentina' },
  'CL': { name: 'Chile' },
  'CO': { name: 'Colombia' },
  'PE': { name: 'Peru' },
  'ZA': { name: 'South Africa' },
  'EG': { name: 'Egypt' },
  'NG': { name: 'Nigeria' },
  'KE': { name: 'Kenya' },
  'MA': { name: 'Morocco' },
  'AE': { name: 'United Arab Emirates' },
  'SA': { name: 'Saudi Arabia' },
  'IL': { name: 'Israel' },
  'TR': { name: 'Turkey' },
  'RU': { name: 'Russia' },
  'UA': { name: 'Ukraine' },
  'RO': { name: 'Romania' },
  'BG': { name: 'Bulgaria' },
  'HR': { name: 'Croatia' },
  'SI': { name: 'Slovenia' },
  'SK': { name: 'Slovakia' },
  'LT': { name: 'Lithuania' },
  'LV': { name: 'Latvia' },
  'EE': { name: 'Estonia' },
  'IS': { name: 'Iceland' },
  'LU': { name: 'Luxembourg' },
  'MT': { name: 'Malta' },
  'CY': { name: 'Cyprus' }
};
const PhoneNumberInput = ({
  value = '',
  onChange,
  disabled = false,
  error = null,
  placeholder = "Enter phone number",
  className = "",
  required = false,
  themeColor = "teal" // Use theme color instead of hardcoded focusColor
}) => {
  const [selectedCountry, setSelectedCountry] = useState('IE'); // Default to Ireland
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Get all available countries and their calling codes
  const availableCountries = getCountries();

  const getCountryOptions = () => {
    return availableCountries.map(countryCode => {
      const callingCode = getCountryCallingCode(countryCode);
      const country = countryData[countryCode];

      // Use hardcoded data if available, otherwise get proper country name
      const countryName = country?.name || getCountryName(countryCode);

      return {
        code: countryCode,
        name: countryName,
        callingCode: `+${callingCode}`,
        searchText: `${countryName} +${callingCode}`.toLowerCase()
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
  };

  const countryOptions = getCountryOptions();

  // Filter countries based on search term
  const filteredCountries = countryOptions.filter(country =>
    country.searchText.includes(searchTerm.toLowerCase())
  );

  // Parse existing value on component mount
  useEffect(() => {
    if (value && value.startsWith('+')) {
      try {
        const parsed = parsePhoneNumber(value);
        if (parsed) {
          setSelectedCountry(parsed.country);
          setPhoneNumber(parsed.nationalNumber);
        }
      } catch (error) {
        console.warn('Could not parse phone number:', value);
      }
    }
  }, [value]);

  // Handle country selection
  const handleCountrySelect = (country) => {
    setSelectedCountry(country.code);
    setIsDropdownOpen(false);
    setSearchTerm('');
    
    // Focus on phone number input after country selection
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
    
    // Update the full phone number
    updateFullPhoneNumber(country.code, phoneNumber);
  };

  // Handle phone number input
  const handlePhoneNumberChange = (e) => {
    const inputValue = e.target.value;
    
    // Only allow numeric input
    const numericValue = inputValue.replace(/[^\d]/g, '');
    
    setPhoneNumber(numericValue);
    updateFullPhoneNumber(selectedCountry, numericValue);
  };

  // Update the full phone number and validate
  const updateFullPhoneNumber = (countryCode, localNumber) => {
    if (!localNumber) {
      onChange('');
      setValidationError('');
      return;
    }

    try {
      const callingCode = getCountryCallingCode(countryCode);
      const fullNumber = `+${callingCode}${localNumber}`;
      
      // Validate the phone number
      const isValid = isValidPhoneNumber(fullNumber, countryCode);
      
      if (isValid) {
        const parsed = parsePhoneNumber(fullNumber, countryCode);
        const formattedNumber = parsed.formatInternational();
        onChange(formattedNumber);
        setValidationError('');
      } else {
        onChange(fullNumber);
        setValidationError('Please enter a valid phone number');
      }
    } catch (error) {
      setValidationError('Invalid phone number format');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCountryData = countryOptions.find(c => c.code === selectedCountry);
  const displayError = error || validationError;

  return (
    <div className={`relative w-full phone-input-container ${className}`}>
      <div className="flex w-full items-stretch">
        {/* Country Code Dropdown - Mobile Responsive */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={disabled}
              className={`flex items-center justify-between px-2 sm:px-3 py-3 border border-r-0 rounded-l-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500 transition-all h-[48px] w-auto min-w-[120px] sm:min-w-[140px] ${
                disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'
              } ${displayError ? 'border-red-500' : `border-${themeColor}-300`}`}
            >
              <div className="flex items-center space-x-1 overflow-hidden">
                <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                  {selectedCountryData?.callingCode || '+353'}
                </span>
                <span className="hidden sm:inline text-xs text-gray-500 truncate">
                  {selectedCountryData?.name || 'Ireland'}
                </span>
              </div>
              <ChevronDown size={14} className="text-gray-400 flex-shrink-0 ml-1" />
            </button>

            {/* Dropdown Menu - Mobile Optimized */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-64 overflow-hidden w-[280px] sm:w-[320px] max-w-[90vw] phone-dropdown">
                {/* Search Input */}
                <div className="p-3 border-b border-gray-100">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search countries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500 text-sm`}
                    />
                  </div>
                </div>

                {/* Country List */}
                <div className="max-h-48 overflow-y-auto">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-${themeColor}-50 text-left transition-colors border-b border-gray-50 last:border-b-0`}
                      >
                        <span className="flex-1 text-sm text-gray-900 truncate pr-2">{country.name}</span>
                        <span className="text-sm text-gray-500 flex-shrink-0">{country.callingCode}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500 text-center">
                      No countries found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        {/* Phone Number Input - Mobile Responsive */}
        <input
          ref={inputRef}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`flex-1 w-full px-3 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500 transition-all text-sm sm:text-base h-[48px] ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : ''
          } ${displayError ? 'border-red-500 bg-red-50' : `border-${themeColor}-300`}`}
        />
      </div>

      {/* Error Message */}
      {displayError && (
        <p className="mt-1 text-red-600 text-xs sm:text-sm break-words flex items-center">
          <span className="mr-1">⚠️</span>
          {displayError}
        </p>
      )}
    </div>
  );
};

export default PhoneNumberInput;










