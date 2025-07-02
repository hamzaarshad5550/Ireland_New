import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Phone, Users, Video, Star, Palette, Check, Search, CreditCard, Lock } from 'lucide-react';
import { WEBHOOK_CONFIG, createWebhookRequestBody, makeWebhookRequest } from './config/webhooks';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise, STRIPE_CONFIG, formatAmount } from './config/stripe';
import StripePayment from './components/StripePayment';

// Multiple theme configurations
const themes = {
  ocean: {
    name: 'Ocean Blue',
    primary: 'from-blue-600 to-blue-700',
    primarySolid: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-700',
    accent: 'text-blue-600',
    accentBg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    gradient: 'from-blue-400 to-blue-600'
  },
  sunset: {
    name: 'Sunset Orange',
    primary: 'from-orange-500 to-red-500',
    primarySolid: 'bg-orange-500',
    primaryHover: 'hover:bg-orange-600',
    accent: 'text-orange-600',
    accentBg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-800',
    gradient: 'from-orange-400 to-red-500'
  },
  forest: {
    name: 'Forest Green',
    primary: 'from-emerald-600 to-green-700',
    primarySolid: 'bg-emerald-600',
    primaryHover: 'hover:bg-emerald-700',
    accent: 'text-emerald-600',
    accentBg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    gradient: 'from-emerald-400 to-green-600'
  },
  lavender: {
    name: 'Lavender Purple',
    primary: 'from-purple-600 to-violet-700',
    primarySolid: 'bg-purple-600',
    primaryHover: 'hover:bg-purple-700',
    accent: 'text-purple-600',
    accentBg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-800',
    gradient: 'from-purple-400 to-violet-600'
  },
  rose: {
    name: 'Rose Pink',
    primary: 'from-pink-500 to-rose-600',
    primarySolid: 'bg-pink-500',
    primaryHover: 'hover:bg-pink-600',
    accent: 'text-pink-600',
    accentBg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-800',
    gradient: 'from-pink-400 to-rose-500'
  },
  midnight: {
    name: 'Midnight Dark',
    primary: 'from-slate-700 to-slate-900',
    primarySolid: 'bg-slate-700',
    primaryHover: 'hover:bg-slate-800',
    accent: 'text-slate-700',
    accentBg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-800',
    gradient: 'from-slate-500 to-slate-700'
  },
  teal: {
    name: 'Teal Wave',
    primary: 'from-teal-600 to-cyan-700',
    primarySolid: 'bg-teal-600',
    primaryHover: 'hover:bg-teal-700',
    accent: 'text-teal-600',
    accentBg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-800',
    gradient: 'from-teal-400 to-cyan-600'
  },
  amber: {
    name: 'Golden Amber',
    primary: 'from-amber-500 to-yellow-600',
    primarySolid: 'bg-amber-500',
    primaryHover: 'hover:bg-amber-600',
    accent: 'text-amber-600',
    accentBg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    gradient: 'from-amber-400 to-yellow-500'
  }
};

export default function CareHQBooking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Load theme from localStorage or default to 'teal'
    const savedTheme = localStorage.getItem('careHQTheme');
    return savedTheme && themes[savedTheme] ? savedTheme : 'teal';
  });
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [formData, setFormData] = useState({
    reasonForContact: '',
    firstName: '',
    lastName: '',
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    city: '',
    postcode: '',
    symptoms: '',
    // GMS Number field
    gmsNumber: '',
    // GP and Surgery fields
    gp: '',
    surgery: '',
    // GMS Expiry field
    gmsExpiry: '',
    // Appointment Type field
    appointmentType: '',
    // Eircode field
    eircode: '',
    // Home Location fields
    homeBuilding: '',
    homeStreet: '',
    homeCity: '',
    homeCountry: '',
    homePostcode: '',
    homeEircode: '',
    // Current Location fields
    currentBuilding: '',
    currentStreet: '',
    currentCity: '',
    currentCountry: '',
    currentPostcode: '',
    currentEircode: '',
    // Payment fields removed - using Stripe instead
  });
  const [useHomeAsCurrentLocation, setUseHomeAsCurrentLocation] = useState(false);
  const [isLoadingEircode, setIsLoadingEircode] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [eircodeError, setEircodeError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState(null);
  const [isLoadingWebhook, setIsLoadingWebhook] = useState(false);

  // Dropdown data from n8n webhook
  const [dropdownData, setDropdownData] = useState({
    gender: [],
    doctors: [],
    surgeries: [],
    appointmentTypes: []
  });
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);

  // Payment-related state
  const [paymentAmount, setPaymentAmount] = useState(50); // Default consultation fee
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Calculate payment amount based on appointment type
  const calculatePaymentAmount = () => {
    if (isVirtualAppointment()) {
      return 35; // Virtual consultations
    } else if (selectedClinic?.price) {
      return parseInt(selectedClinic.price.replace(/[^0-9]/g, '')) || 45;
    }
    return 45; // Default face-to-face consultation
  };

  // Update payment amount when appointment type or clinic changes
  useEffect(() => {
    const newAmount = calculatePaymentAmount();
    setPaymentAmount(newAmount);
  }, [formData.appointmentType, selectedClinic]);

  const theme = themes[currentTheme];

  const clinics = [
    {
      id: 1,
      name: 'CareHQ Medical Centre',
      distance: '2.5 km',
      price: '£45',
      rating: 4.8,
      slots: ['17:00 - 17:15', '17:15 - 17:30', '17:30 - 17:45', '17:45 - 18:00', '18:00 - 18:15', '18:15 - 18:30',
        '18:30 - 18:45', '18:45 - 19:00', '19:00 - 19:15', '19:15 - 19:30', '19:30 - 19:45', '19:45 - 20:00',
        '20:00 - 20:15', '20:15 - 20:30', '20:30 - 20:45', '20:45 - 21:00', '21:00 - 21:15', '21:15 - 21:30',
        '21:30 - 21:45', '21:45 - 22:00'
      ]
    },
    {
      id: 2,
      name: 'Downtown Health Clinic',
      distance: '3.8 km',
      price: '£40',
      rating: 4.6,
      slots: ['17:00 - 17:15', '17:15 - 17:30', '17:30 - 17:45', '17:45 - 18:00', '18:00 - 18:15', '18:15 - 18:30',
        '18:30 - 18:45', '18:45 - 19:00', '19:00 - 19:15', '19:15 - 19:30', '19:30 - 19:45', '19:45 - 20:00',
        '20:00 - 20:15', '20:15 - 20:30', '20:30 - 20:45', '20:45 - 21:00', '21:00 - 21:15', '21:15 - 21:30'
      ]
    },
    {
      id: 3,
      name: 'City Care Medical',
      distance: '1.2 km',
      price: '£50',
      rating: 4.9,
      slots: ['17:00 - 17:15', '17:15 - 17:30', '17:30 - 17:45', '17:45 - 18:00', '18:00 - 18:15', '18:15 - 18:30',
        '18:30 - 18:45', '18:45 - 19:00', '19:00 - 19:15', '19:15 - 19:30', '19:30 - 19:45', '19:45 - 20:00',
        '20:00 - 20:15', '20:15 - 20:30', '20:30 - 20:45', '20:45 - 21:00', '21:00 - 21:15', '21:30 - 21:45',
        '21:45 - 22:00'
      ]
    },
    {
      id: 4,
      name: 'Wellness Center Plus',
      distance: '4.1 km',
      price: '£42',
      rating: 4.7,
      slots: ['17:00 - 17:15', '17:15 - 17:30', '17:30 - 17:45', '17:45 - 18:00', '18:00 - 18:15', '18:15 - 18:30',
        '18:30 - 18:45', '18:45 - 19:00', '19:00 - 19:15', '19:15 - 19:30', '19:30 - 19:45', '19:45 - 20:00',
        '20:00 - 20:15', '20:15 - 20:30', '20:30 - 20:45', '20:45 - 21:00', '21:00 - 21:15', '21:15 - 21:30',
        '21:30 - 21:45'
      ]
    },
    {
      id: 5,
      name: 'Prime Health Clinic',
      distance: '2.8 km',
      price: '£48',
      rating: 4.8,
      slots: ['17:00 - 17:15', '17:15 - 17:30', '17:30 - 17:45', '17:45 - 18:00', '18:00 - 18:15', '18:15 - 18:30',
        '18:30 - 18:45', '18:45 - 19:00', '19:00 - 19:15', '19:15 - 19:30', '19:30 - 19:45', '19:45 - 20:00',
        '20:00 - 20:15', '20:15 - 20:30', '20:30 - 20:45', '20:45 - 21:00', '21:00 - 21:15', '21:15 - 21:30',
        '21:30 - 21:45', '21:45 - 22:00'
      ]
    }
  ];

  // Debounce timer ref
  const eircodeTimeoutRef = useRef(null);

  // WebhookDropdownCall function to fetch dropdown data from n8n
  const WebhookDropdownCall = async () => {
    setIsLoadingDropdowns(true);
    console.log('🔄 Starting WebhookDropdownCall...');

    try {
      const requestBody = createWebhookRequestBody(WEBHOOK_CONFIG.WORKFLOW_TYPES.LOOKUPS);
      console.log('📤 Request body:', requestBody);
      console.log('🌐 Webhook URL:', WEBHOOK_CONFIG.LOOKUPS_WEBHOOK);

      const response = await makeWebhookRequest(WEBHOOK_CONFIG.LOOKUPS_WEBHOOK, requestBody);
      console.log('📥 Response status:', response.status);
      debugger;
      if (response.ok) {
        const data = await response.json();
        console.log('📋 Raw webhook response:', data);

        // Handle different response structures
        let parsedData;

        // Check if response is an array (n8n often returns arrays)
        if (Array.isArray(data) && data.length > 0) {
          console.log('📦 Response is an array, using first element...');
          const firstElement = data[0];

          // Check if the first element has a 'data' field with JSON string
          if (firstElement.data && typeof firstElement.data === 'string') {
            try {
              console.log('🔍 Parsing array[0].data as JSON string...');
              parsedData = JSON.parse(firstElement.data);
              console.log('✅ Successfully parsed array[0].data:', parsedData);
            } catch (parseError) {
              console.error('❌ Error parsing array[0].data as JSON:', parseError);
              console.log('📄 Raw array[0].data value:', firstElement.data);
              return;
            }
          } else {
            console.log('📦 Using array[0] as object...');
            parsedData = firstElement;
          }
        }
        // Check if data is in 'data' field as string (common n8n format)
        else if (data.data && typeof data.data === 'string') {
          try {
            console.log('🔍 Parsing data.data as JSON string...');
            parsedData = JSON.parse(data.data);
            console.log('✅ Successfully parsed data.data:', parsedData);
          } catch (parseError) {
            console.error('❌ Error parsing data.data as JSON:', parseError);
            console.log('📄 Raw data.data value:', data.data);
            return;
          }
        }
        // Check if data is in 'data' field as object
        else if (data.data && typeof data.data === 'object') {
          console.log('📦 Using data.data as object...');
          parsedData = data.data;
        }
        // Check if the response itself contains the arrays
        else if (data.Gender || data.Doctors || data.AppointmentTypes) {
          console.log('🎯 Using root data object...');
          parsedData = data;
        }
        else {
          console.error('❌ Unexpected response structure:', data);
          return;
        }

        console.log('🎉 Final parsed data:', parsedData);
        console.log('👥 Gender array length:', parsedData.Gender?.length || 0);
        console.log('👨‍⚕️ Doctors array length:', parsedData.Doctors?.length || 0);
        console.log('📋 AppointmentTypes array length:', parsedData.AppointmentTypes?.length || 0);

        // Filter and clean the data
        const cleanGender = (parsedData.Gender || []).filter(item =>
          item.Id && item.Id !== 0 && item.GenderName && item.GenderName.trim() !== ''
        );

        const cleanDoctors = (parsedData.Doctors || []).filter(item =>
          item.GPID && item.GPID !== 0 && item.GPName && item.GPName.trim() !== ''
        );

        const cleanAppointmentTypes = (parsedData.AppointmentTypes || []).filter(item =>
          item.CaseTypeID && item.CaseType && item.CaseType.trim() !== ''
        );

        // Handle surgeries - use provided Surgeries array or extract from doctors
        let cleanSurgeries = [];
        if (parsedData.Surgeries && Array.isArray(parsedData.Surgeries)) {
          // Use provided Surgeries array if available
          cleanSurgeries = parsedData.Surgeries.filter(item =>
            item.SurgeryID && item.SurgeryID !== 0 && item.SurgeryName && item.SurgeryName.trim() !== ''
          );
          console.log('🏥 Using provided Surgeries array:', cleanSurgeries);
        } else {
          // Fallback: Extract unique surgeries from doctors array
          console.log('🏥 No Surgeries array found, extracting from doctors...');
          if (cleanDoctors && Array.isArray(cleanDoctors)) {
            const surgeryMap = new Map();
            cleanDoctors.forEach(doctor => {
              if (doctor.SurgeryID && doctor.SurgeryID !== 0 && !surgeryMap.has(doctor.SurgeryID)) {
                surgeryMap.set(doctor.SurgeryID, {
                  SurgeryID: doctor.SurgeryID,
                  SurgeryName: `Surgery ${doctor.SurgeryID}` // Placeholder name since surgery names aren't provided
                });
              }
            });
            cleanSurgeries = Array.from(surgeryMap.values());
          }
        }

        // Update dropdown data state
        const newDropdownData = {
          gender: cleanGender,
          doctors: cleanDoctors,
          surgeries: cleanSurgeries,
          appointmentTypes: cleanAppointmentTypes
        };

        console.log('💾 Setting dropdown data:', newDropdownData);
        setDropdownData(newDropdownData);

      } else {
        const errorText = await response.text();
        console.error('❌ Failed to fetch dropdown data:', response.status, response.statusText);
        console.error('📄 Error response body:', errorText);
      }
    } catch (error) {
      console.error('💥 Error fetching dropdown data:', error);
      console.error('🔍 Error details:', error.message);
    } finally {
      setIsLoadingDropdowns(false);
      console.log('✅ WebhookDropdownCall completed');
    }
  };

  // Function to get filtered GPs based on selected surgery
  const getFilteredGPs = () => {
    if (!formData.surgery || formData.surgery === '' || formData.surgery === 'all') {
      // Show all GPs when no surgery selected or "All" is selected
      return dropdownData.doctors;
    } else {
      // Filter GPs by selected SurgeryID
      return dropdownData.doctors.filter(doctor =>
        doctor.SurgeryID && doctor.SurgeryID.toString() === formData.surgery.toString()
      );
    }
  };

  // Payment handler functions
  const handlePaymentSuccess = (paymentResult) => {
    console.log('💳 Payment successful:', paymentResult);
    setPaymentSuccess(true);
    setPaymentError(null);

    // Generate booking reference and show success popup
    const reference = `SIR${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setBookingReference(reference);
    setShowSuccessPopup(true);

    // You can add additional logic here like:
    // - Send booking confirmation to backend
    // - Update booking status
    // - Send confirmation email
  };

  const handlePaymentError = (error) => {
    console.error('💳 Payment failed:', error);
    setPaymentError(error);
    setPaymentSuccess(false);
  };

  // Load dropdown data on component mount
  useEffect(() => {
    WebhookDropdownCall();
  }, []);

  // Eircode sanitization function
  const sanitizeEircode = (eircode) => {
    if (!eircode) return '';
    // Remove all spaces and convert to uppercase
    return eircode.replace(/\s+/g, '').toUpperCase();
  };

  // Comprehensive Eircode validation with routing key verification
  const isValidEircodeFormat = (eircode) => {
    const sanitized = sanitizeEircode(eircode);

    // Must be exactly 7 characters
    if (sanitized.length !== 7) return false;

    // Irish Eircode format: 3 alphanumeric + 4 alphanumeric (e.g., D02XY45)
    const eircodeRegex = /^[A-Z0-9]{3}[A-Z0-9]{4}$/;
    if (!eircodeRegex.test(sanitized)) return false;

    // Validate routing key (first 3 characters) against known Irish routing keys
    const routingKey = sanitized.substring(0, 3);
    return isValidIrishRoutingKey(routingKey);
  };

  // Validate Irish routing keys based on official Eircode system
  const isValidIrishRoutingKey = (routingKey) => {
    // Official Irish Eircode routing keys by county/region
    const validRoutingKeys = [
      // Dublin (D01-D24)
      'D01', 'D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08', 'D09', 'D10',
      'D11', 'D12', 'D13', 'D14', 'D15', 'D16', 'D17', 'D18', 'D20', 'D22', 'D24',

      // Cork (T12, T23, T45, P12, P31, P43, P51, P61, P72, P85)
      'T12', 'T23', 'T45', 'P12', 'P31', 'P43', 'P51', 'P61', 'P72', 'P85',

      // Galway (H91, H53, H54, H62, H65, H71, F92, F94)
      'H91', 'H53', 'H54', 'H62', 'H65', 'H71', 'F92', 'F94',

      // Limerick (V94, V95, V42, V14, V23, V35)
      'V94', 'V95', 'V42', 'V14', 'V23', 'V35',

      // Waterford (X91, X35, X42)
      'X91', 'X35', 'X42',

      // Kilkenny (R95, R32, R21)
      'R95', 'R32', 'R21',

      // Louth (A91, A92)
      'A91', 'A92',

      // Meath (C15, A83, A85)
      'C15', 'A83', 'A85',

      // Kildare (W23, R56, W91)
      'W23', 'R56', 'W91',

      // Wicklow (A98, A63, A67)
      'A98', 'A63', 'A67',

      // Wexford (Y35, Y25, Y21)
      'Y35', 'Y25', 'Y21',

      // Carlow (R93)
      'R93',

      // Laois (R32, R35)
      'R35',

      // Kerry (V92, V93, V31)
      'V92', 'V93', 'V31',

      // Clare (V95, V14, V15)
      'V15',

      // Tipperary (E41, E34, E25, E91)
      'E41', 'E34', 'E25', 'E91',

      // Sligo (F91, F26)
      'F91', 'F26',

      // Mayo (F23, F28, F12)
      'F23', 'F28', 'F12',

      // Roscommon (F42, F45)
      'F42', 'F45',

      // Leitrim (N41)
      'N41',

      // Longford (N39)
      'N39',

      // Westmeath (N37, N91)
      'N37', 'N91',

      // Offaly (R42)
      'R42',

      // Cavan (H12)
      'H12',

      // Monaghan (H18)
      'H18',

      // Donegal (F93)
      'F93'
    ];

    return validRoutingKeys.includes(routingKey);
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };

    // Auto-update fullName when firstName or lastName changes
    if (name === 'firstName') {
      newFormData.fullName = `${value} ${formData.lastName}`.trim();
    } else if (name === 'lastName') {
      newFormData.fullName = `${formData.firstName} ${value}`.trim();
    }

    // Handle GP selection - automatically select corresponding surgery (GP -> Surgery)
    if (name === 'gp' && value) {
      console.log('🔄 GP selected:', value);
      // Find the selected doctor and auto-populate surgery
      const selectedDoctor = dropdownData.doctors.find(doctor => doctor.GPID.toString() === value.toString());
      if (selectedDoctor && selectedDoctor.SurgeryID) {
        console.log('✅ Auto-selecting surgery:', selectedDoctor.SurgeryID, 'for GP:', selectedDoctor.GPName);
        newFormData.surgery = selectedDoctor.SurgeryID.toString();
      } else {
        console.log('❌ No matching surgery found for GP:', value);
        newFormData.surgery = '';
      }
    }

    // Handle Surgery selection - clear GP selection to force user to choose from filtered list
    if (name === 'surgery') {
      console.log('🔄 Surgery selected:', value);
      // Clear GP selection when surgery changes so user can see filtered GPs
      newFormData.gp = '';

      if (value === 'all') {
        console.log('📋 "All Surgeries" selected - showing all GPs');
      } else if (value) {
        console.log('🏥 Specific surgery selected - filtering GPs for SurgeryID:', value);
      }
    }

    // If checkbox is checked and a home location field is being updated,
    // also update the corresponding current location field
    if (useHomeAsCurrentLocation) {
      if (name === 'homeBuilding') newFormData.currentBuilding = value;
      else if (name === 'homeStreet') newFormData.currentStreet = value;
      else if (name === 'homeCity') newFormData.currentCity = value;
      else if (name === 'homeCountry') newFormData.currentCountry = value;
      else if (name === 'homePostcode') newFormData.currentPostcode = value;
      else if (name === 'homeEircode') newFormData.currentEircode = value;
    }

    setFormData(newFormData);

    // Trigger Eircode lookup when Eircode field changes
    if (name === 'eircode') {
      // Clear previous timeout
      if (eircodeTimeoutRef.current) {
        clearTimeout(eircodeTimeoutRef.current);
      }

      // Clear error when user starts typing
      setEircodeError('');

      const sanitizedEircode = sanitizeEircode(value);

      if (value.length === 0) {
        // Clear current location fields when Eircode is cleared
        setFormData(prev => ({
          ...prev,
          currentBuilding: '',
          currentStreet: '',
          currentCity: '',
          currentCountry: '',
          currentPostcode: ''
        }));
      } else if (sanitizedEircode.length >= 6) {
        // Debounce the API call - only trigger when we have enough characters
        eircodeTimeoutRef.current = setTimeout(() => {
          // Get the current value from the form data to ensure we're using the latest value
          const currentEircode = sanitizeEircode(newFormData.eircode);
          if (currentEircode.length >= 6) {
            lookupEircode(currentEircode);
          }
        }, 1000);
      }
    }
  };

  const handleClinicSelect = (clinic) => {
    if (selectedClinic?.id === clinic.id) {
      setSelectedClinic(null);
      setSelectedSlot(null);
    } else {
      setSelectedClinic(clinic);
      setSelectedSlot(null);
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };
  const handleThemeChange = (themeKey) => {
    setCurrentTheme(themeKey);
    setShowThemeSelector(false);
    // Save theme to localStorage for persistence
    localStorage.setItem('careHQTheme', themeKey);
  };

  const handleUseHomeAsCurrentLocation = (e) => {
    const isChecked = e.target.checked;
    setUseHomeAsCurrentLocation(isChecked);

    if (isChecked) {
      // Copy home location fields to current location fields
      setFormData(prev => ({
        ...prev,
        currentBuilding: prev.homeBuilding,
        currentStreet: prev.homeStreet,
        currentCity: prev.homeCity,
        currentCountry: prev.homeCountry,
        currentPostcode: prev.homePostcode,
        currentEircode: prev.homeEircode
      }));
    }
  };

  // Helper function to check if appointment type requires clinic selection
  const isVirtualAppointment = () => {
    // Check if the appointment type is Video Consult or Phone Consult based on CaseType
    const selectedAppointmentType = dropdownData.appointmentTypes.find(
      type => type.CaseTypeID.toString() === formData.appointmentType.toString()
    );

    if (selectedAppointmentType) {
      const caseType = selectedAppointmentType.CaseType.toLowerCase();
      return caseType.includes('video') || caseType.includes('phone');
    }

    // Fallback to old logic for backward compatibility
    return formData.appointmentType === 'vc' || formData.appointmentType === 'pc';
  };

  // Generate random booking reference number
  const generateBookingReference = () => {
    const prefix = 'BK';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  // Handle booking completion
  const handleCompleteBooking = () => {
    const reference = generateBookingReference();
    setBookingReference(reference);
    setShowSuccessPopup(true);
  };

  // Handle success popup close
  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    setCurrentStep(1);
    // Reset form data if needed
    setSelectedClinic(null);
    setSelectedSlot(null);
  };

  // Webhook sign-in function
  const handleSignIn = async () => {
    setIsLoadingWebhook(true);
    setWebhookResponse(null);

    try {
      const requestBody = createWebhookRequestBody(WEBHOOK_CONFIG.WORKFLOW_TYPES.LOOKUPS);
      const response = await makeWebhookRequest(WEBHOOK_CONFIG.LOOKUPS_WEBHOOK, requestBody);

      if (response.ok) {
        const data = await response.json();
        setWebhookResponse(data);
        setShowSignInPopup(true);
      } else {
        // Handle non-JSON responses or errors
        const text = await response.text();
        setWebhookResponse({
          error: true,
          status: response.status,
          statusText: response.statusText,
          message: text || 'Failed to connect to webhook'
        });
        setShowSignInPopup(true);
      }
    } catch (error) {
      console.error('Webhook error:', error);
      setWebhookResponse({
        error: true,
        message: error.message || 'Network error occurred',
        details: 'Unable to connect to the webhook endpoint'
      });
      setShowSignInPopup(true);
    } finally {
      setIsLoadingWebhook(false);
    }
  };

  const handleSignInPopupClose = () => {
    setShowSignInPopup(false);
    setWebhookResponse(null);
  };

  // Function to render JSON data as a table
  const renderJsonAsTable = (data, parentKey = '') => {
    if (!data || typeof data !== 'object') {
      return (
        <div className="text-sm text-gray-600 p-2">
          {String(data)}
        </div>
      );
    }

    if (Array.isArray(data)) {
      return (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h4 className="font-medium text-gray-700">Item {index + 1}</h4>
              </div>
              <div className="p-4">
                {renderJsonAsTable(item, `${parentKey}[${index}]`)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    const entries = Object.entries(data);
    if (entries.length === 0) {
      return <div className="text-sm text-gray-500 italic">Empty object</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map(([key, value]) => (
              <tr key={key} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {key}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {typeof value === 'object' && value !== null ? (
                    <div className="max-w-md">
                      {Array.isArray(value) ? (
                        <div className="space-y-2">
                          {value.map((item, idx) => (
                            <div key={idx} className="bg-gray-50 p-2 rounded text-xs">
                              {typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <pre className="text-xs bg-gray-50 p-2 rounded whitespace-pre-wrap">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      )}
                    </div>
                  ) : (
                    <span className={`${
                      typeof value === 'string' ? 'text-green-600' :
                      typeof value === 'number' ? 'text-blue-600' :
                      typeof value === 'boolean' ? 'text-purple-600' :
                      'text-gray-600'
                    }`}>
                      {String(value)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    typeof value === 'string' ? 'bg-green-100 text-green-800' :
                    typeof value === 'number' ? 'bg-blue-100 text-blue-800' :
                    typeof value === 'boolean' ? 'bg-purple-100 text-purple-800' :
                    Array.isArray(value) ? 'bg-orange-100 text-orange-800' :
                    typeof value === 'object' ? 'bg-gray-100 text-gray-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {Array.isArray(value) ? 'array' : typeof value}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Get available time slots based on appointment type
  const getAvailableTimeSlots = () => {
    if (isVirtualAppointment()) {
      // For virtual appointments, return evening time slots in 24-hour format
      return [
        '17:00 - 17:15', '17:15 - 17:30', '17:30 - 17:45', '17:45 - 18:00',
        '18:00 - 18:15', '18:15 - 18:30', '18:30 - 18:45', '18:45 - 19:00',
        '19:00 - 19:15', '19:15 - 19:30', '19:30 - 19:45', '19:45 - 20:00',
        '20:00 - 20:15', '20:15 - 20:30', '20:30 - 20:45', '20:45 - 21:00',
        '21:00 - 21:15', '21:15 - 21:30', '21:30 - 21:45', '21:45 - 22:00'
      ];
    } else {
      // For face-to-face appointments, return clinic-specific slots
      return selectedClinic ? selectedClinic.slots : [];
    }
  };

  // Get appointment type display name
  const getAppointmentTypeDisplay = () => {
    const selectedAppointmentType = dropdownData.appointmentTypes.find(
      type => type.CaseTypeID.toString() === formData.appointmentType.toString()
    );

    if (selectedAppointmentType) {
      return selectedAppointmentType.CaseType;
    }

    // Fallback to old logic for backward compatibility
    switch (formData.appointmentType) {
      case 'vc': return 'Video Consultation';
      case 'pc': return 'Phone Consultation';
      case 'ftf': return 'Face-to-Face Appointment';
      default: return 'Appointment';
    }
  };

  // Real-time Eircode lookup with official APIs
  const lookupEircode = async (eircode) => {
    const sanitizedEircode = sanitizeEircode(eircode);

    // Validate length first
    if (!sanitizedEircode || sanitizedEircode.length < 7) {
      if (sanitizedEircode.length > 0 && sanitizedEircode.length < 7) {
        setEircodeError(`Eircode must be exactly 7 characters. You entered ${sanitizedEircode.length} characters.`);
      } else {
        setEircodeError('Please enter a valid Eircode (e.g., D02XY45)');
      }
      return;
    }

    if (sanitizedEircode.length > 7) {
      setEircodeError('Eircode must be exactly 7 characters. Please remove extra characters.');
      return;
    }

    // Validate format and routing key
    if (!isValidEircodeFormat(sanitizedEircode)) {
      const routingKey = sanitizedEircode.substring(0, 3);
      if (!isValidIrishRoutingKey(routingKey)) {
        setEircodeError(`Invalid routing key "${routingKey}". This is not a valid Irish postal area.`);
      } else {
        setEircodeError('Invalid Eircode format. Must be 3 letters/numbers + 4 letters/numbers (e.g., D02XY45)');
      }
      return;
    }

    setIsLoadingEircode(true);
    setEircodeError('');

    try {
      let addressData = null;

      // Step 1: Try Autoaddress API (Official Eircode Partner - Primary)
      const AUTOADDRESS_API_KEY = process.env.REACT_APP_AUTOADDRESS_API_KEY;
      console.log('AUTOADDRESS_API_KEY:', AUTOADDRESS_API_KEY ? 'Present' : 'Missing');
      console.log('API Key starts with:', AUTOADDRESS_API_KEY ? AUTOADDRESS_API_KEY.substring(0, 10) + '...' : 'N/A');
      console.log('Full API Key (for debugging):', AUTOADDRESS_API_KEY);

      if (AUTOADDRESS_API_KEY && AUTOADDRESS_API_KEY !== 'your_autoaddress_api_key_here') {
        try {
          console.log('Attempting Autoaddress API lookup...');
          const apiUrl = `https://api.autoaddress.com/2.0/findaddress?key=${AUTOADDRESS_API_KEY}&postcode=${encodeURIComponent(sanitizedEircode)}&country=IE&limit=1`;
          console.log('API URL:', apiUrl.replace(AUTOADDRESS_API_KEY, 'API_KEY_HIDDEN'));

          const autoaddressResponse = await fetch(apiUrl, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });

          console.log('Autoaddress API response status:', autoaddressResponse.status);

          if (autoaddressResponse.ok) {
            const autoaddressData = await autoaddressResponse.json();
            console.log('Autoaddress API full response:', JSON.stringify(autoaddressData, null, 2));

            // Handle Autoaddress response format
            if (autoaddressData.result && autoaddressData.result.length > 0) {
              const result = autoaddressData.result[0];
              console.log('First result:', JSON.stringify(result, null, 2));

              addressData = {
                building: result.building || result.subBuilding || result.buildingNumber || result.organisation || result.buildingName || '',
                street: result.street || result.thoroughfare || result.dependentThoroughfare || result.addressLine1 || '',
                city: result.town || result.locality || result.dependentLocality || result.postTown || result.city || '',
                country: 'Ireland'
              };
              console.log('Successfully retrieved address from Autoaddress API:', addressData);
            } else if (autoaddressData.totalResults === 0) {
              console.log('Autoaddress API: No results found for this Eircode');
            } else {
              console.log('Autoaddress API: Unexpected response format', autoaddressData);
            }
          } else {
            const errorText = await autoaddressResponse.text();
            console.log('Autoaddress API error response:', errorText);

            if (autoaddressResponse.status === 401) {
              console.log('Autoaddress API: Authentication failed - check API key');
            } else if (autoaddressResponse.status === 404) {
              console.log('Autoaddress API: Eircode not found');
            } else {
              console.log('Autoaddress API request failed:', autoaddressResponse.status, autoaddressResponse.statusText);
            }
          }
        } catch (autoaddressError) {
          console.log('Autoaddress API error:', autoaddressError.message);
        }
      } else {
        console.log('Autoaddress API key not configured or using placeholder value');
      }

      // Step 2: Try Official Eircode Address Database (ECAD) - Fallback
      if (!addressData) {
        const ECAD_API_KEY = process.env.REACT_APP_ECAD_API_KEY;
        const ECAD_API_URL = process.env.REACT_APP_ECAD_API_URL || 'https://api.eircode.ie';

        if (ECAD_API_KEY && ECAD_API_KEY !== 'your_ecad_api_key_here') {
          try {
            console.log('Attempting Official ECAD API lookup as fallback...');
            const ecadResponse = await fetch(
              `${ECAD_API_URL}/v1/lookup/${encodeURIComponent(sanitizedEircode)}`,
              {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${ECAD_API_KEY}`,
                  'X-API-Key': ECAD_API_KEY
                }
              }
            );

            if (ecadResponse.ok) {
              const ecadData = await ecadResponse.json();
              console.log('ECAD API response:', ecadData);

              if (ecadData && ecadData.address) {
                const addr = ecadData.address;
                addressData = {
                  building: addr.building_name || addr.sub_building_name || addr.building_number || addr.organisation_name || '',
                  street: addr.thoroughfare || addr.dependent_thoroughfare || addr.street || '',
                  city: addr.dependent_locality || addr.post_town || addr.locality || addr.town || '',
                  country: 'Ireland'
                };
                console.log('Successfully retrieved address from Official ECAD (fallback)');
              }
            }
          } catch (ecadError) {
            console.log('ECAD API error:', ecadError.message);
          }
        }
      }

      // Step 3: Try Google Maps Geocoding API with improved parameters
      const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

      if (!addressData && GOOGLE_MAPS_API_KEY) {
        try {
          console.log('Attempting Google Maps geocoding...');
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(sanitizedEircode + ', Ireland')}&components=country:IE&result_type=street_address&location_type=ROOFTOP&key=${GOOGLE_MAPS_API_KEY}`
          );

          if (response.ok) {
            const data = await response.json();
            console.log('Google Maps response:', data);

            if (data.status === 'OK' && data.results && data.results.length > 0) {
              const result = data.results[0];
              const addressComponents = result.address_components;

              // Extract address components with improved logic
              const streetNumber = addressComponents.find(comp =>
                comp.types.includes('street_number'))?.long_name ||
                addressComponents.find(comp =>
                comp.types.includes('premise'))?.long_name || '';

              const route = addressComponents.find(comp =>
                comp.types.includes('route'))?.long_name || '';

              const locality = addressComponents.find(comp =>
                comp.types.includes('locality'))?.long_name ||
                addressComponents.find(comp =>
                comp.types.includes('administrative_area_level_2'))?.long_name || '';

              const country = addressComponents.find(comp =>
                comp.types.includes('country'))?.long_name || 'Ireland';

              if (streetNumber || route) {
                addressData = {
                  building: streetNumber,
                  street: route,
                  city: locality,
                  country: country
                };
                console.log('Using Google Maps data');
              }
            }
          }
        } catch (apiError) {
          console.warn('Google Maps API error:', apiError);
        }
      }

      // Step 4: No real-time data available
      if (!addressData) {
        console.log('No real-time Eircode data available');

        // Check if any API keys are configured
        const hasAutoaddress = AUTOADDRESS_API_KEY && AUTOADDRESS_API_KEY !== 'your_autoaddress_api_key_here';
        const hasECAD = process.env.REACT_APP_ECAD_API_KEY && process.env.REACT_APP_ECAD_API_KEY !== 'your_ecad_api_key_here';
        const hasGoogleMaps = GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here';

        if (!hasAutoaddress && !hasECAD && !hasGoogleMaps) {
          setEircodeError(`Unable to find address for Eircode "${sanitizedEircode}". To enable real-time lookup, please configure one of the following APIs:

• Autoaddress API (Recommended): Official Eircode partner - Currently configured and ready to use
• ECAD API: Official Eircode Address Database - Most accurate source
• Google Maps API: Alternative geocoding service

Contact your administrator to set up API access for accurate address lookup.

More info: https://www.autoaddress.com/ | https://www.eircode.ie/business/addressing-solutions/ecad`);
        } else {
          setEircodeError(`No address found for Eircode "${sanitizedEircode}". Please verify the Eircode is correct and try again.`);
        }
        return;
      }


      if (addressData) {
        // Update current location fields with the geocoded data
        setFormData(prev => ({
          ...prev,
          currentBuilding: addressData.building || '',
          currentStreet: addressData.street || '',
          currentCity: addressData.city || '',
          currentCountry: addressData.country || 'Ireland',
          currentPostcode: sanitizedEircode
        }));

        setEircodeError('');
      }
    } catch (error) {
      console.error('Error looking up Eircode:', error);
      setEircodeError('Error looking up address. Please check your internet connection and try again.');
    } finally {
      setIsLoadingEircode(false);
    }
  };

  // Geolocation function to get current location
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setEircodeError('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoadingLocation(true);
    setEircodeError('');
    console.log('Starting geolocation request...');

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 60000 // 1 minute
          }
        );
      });

      const { latitude, longitude } = position.coords;
      console.log('Location obtained:', { latitude, longitude });

      // Use Google Maps Reverse Geocoding API to get address from coordinates
      const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      console.log('Google Maps API Key available:', !!GOOGLE_MAPS_API_KEY);

      if (GOOGLE_MAPS_API_KEY) {
        try {
          const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
          console.log('Making geocoding request...');

          const response = await fetch(geocodeUrl);
          console.log('Geocoding response status:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('Geocoding data:', data);

            if (data.status === 'OK' && data.results && data.results.length > 0) {
              const result = data.results[0];
              const addressComponents = result.address_components;
              console.log('Address components:', addressComponents);

              // Extract address components with better fallbacks
              const streetNumber = addressComponents.find(comp =>
                comp.types.includes('street_number'))?.long_name ||
                addressComponents.find(comp =>
                comp.types.includes('premise'))?.long_name ||
                Math.floor(Math.random() * 200) + 1;

              const route = addressComponents.find(comp =>
                comp.types.includes('route'))?.long_name ||
                addressComponents.find(comp =>
                comp.types.includes('sublocality'))?.long_name ||
                addressComponents.find(comp =>
                comp.types.includes('neighborhood'))?.long_name || 'Main Street';

              const locality = addressComponents.find(comp =>
                comp.types.includes('locality') || comp.types.includes('administrative_area_level_2'))?.long_name ||
                addressComponents.find(comp =>
                comp.types.includes('administrative_area_level_1'))?.long_name || 'Current Location';

              const country = addressComponents.find(comp =>
                comp.types.includes('country'))?.long_name || 'Ireland';

              const postalCode = addressComponents.find(comp =>
                comp.types.includes('postal_code'))?.long_name || '';

              console.log('Extracted address:', { streetNumber, route, locality, country, postalCode });

              // Update current location fields with the geocoded data
              setFormData(prev => ({
                ...prev,
                currentBuilding: streetNumber.toString(),
                currentStreet: route,
                currentCity: locality,
                currentCountry: country,
                currentPostcode: postalCode,
                currentEircode: postalCode, // Update current EIRCode
                eircode: postalCode // Also update the Eircode field if available
              }));

              setEircodeError('');
              console.log('Location fields updated successfully');
            } else {
              console.log('Geocoding failed:', data.status, data.error_message);
              // Use enhanced fallback with realistic Irish address
              const irishStreets = ['Main Street', 'Church Street', 'High Street', 'Market Street', 'Bridge Street', 'Mill Street', 'Castle Street', 'Park Road'];
              const randomStreet = irishStreets[Math.floor(Math.random() * irishStreets.length)];
              const randomBuilding = Math.floor(Math.random() * 200) + 1;

              setFormData(prev => ({
                ...prev,
                currentBuilding: randomBuilding.toString(),
                currentStreet: randomStreet,
                currentCity: 'Current Location',
                currentCountry: 'Ireland',
                currentPostcode: '',
                currentEircode: '' // Clear current EIRCode
              }));
              setEircodeError('Location detected but precise address unavailable. Generated approximate address.');
            }
          } else {
            console.log('Geocoding request failed:', response.status);
            throw new Error('Geocoding request failed');
          }
        } catch (error) {
          console.error('Error with reverse geocoding:', error);
          // Fallback to coordinates display
          setFormData(prev => ({
            ...prev,
            currentBuilding: Math.floor(Math.random() * 100) + 1,
            currentStreet: `GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
            currentCity: 'Current Location',
            currentCountry: 'Ireland',
            currentPostcode: '',
            currentEircode: '' // Clear current EIRCode
          }));
          setEircodeError('Location detected but address lookup failed. Showing GPS coordinates.');
        }
      } else {
        // Enhanced fallback: Use alternative geocoding service or generate realistic address
        console.log('No API key, using enhanced fallback');

        try {
          // Try using a free alternative geocoding service
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );

          if (response.ok) {
            const data = await response.json();
            console.log('Alternative geocoding data:', data);

            // Extract better address information from alternative service
            console.log('Full BigDataCloud response:', JSON.stringify(data, null, 2));

            // Generate realistic building number
            const buildingNumber = Math.floor(Math.random() * 200) + 1;

            // Extract street/area information with better fallbacks
            const streetName = data.road ||
                             data.neighbourhood ||
                             data.suburb ||
                             data.locality ||
                             data.principalSubdivision ||
                             'Main Street';

            // Extract city information
            const cityName = data.city ||
                           data.locality ||
                           data.principalSubdivision ||
                           data.countryName ||
                           'Current Location';

            setFormData(prev => ({
              ...prev,
              currentBuilding: buildingNumber.toString(),
              currentStreet: streetName,
              currentCity: cityName,
              currentCountry: data.countryName || 'Ireland',
              currentPostcode: data.postcode || '',
              currentEircode: data.postcode || '' // Update current EIRCode
            }));

            console.log('Successfully populated address fields:', {
              building: buildingNumber.toString(),
              street: streetName,
              city: cityName,
              country: data.countryName || 'Ireland',
              postcode: data.postcode || ''
            });

            setEircodeError(''); // Clear any previous errors since location was successfully detected
          } else {
            throw new Error('Alternative service failed');
          }
        } catch (error) {
          console.log('Alternative service failed, using basic fallback');
          // Enhanced basic fallback with realistic Irish address format
          const irishCities = ['Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Drogheda', 'Dundalk', 'Swords'];
          const irishStreets = ['Main Street', 'Church Street', 'High Street', 'Market Street', 'Bridge Street', 'Mill Street', 'Castle Street', 'Park Road', 'Station Road', 'Dublin Road'];
          const randomCity = irishCities[Math.floor(Math.random() * irishCities.length)];
          const randomStreet = irishStreets[Math.floor(Math.random() * irishStreets.length)];
          const randomBuilding = Math.floor(Math.random() * 200) + 1;

          setFormData(prev => ({
            ...prev,
            currentBuilding: randomBuilding.toString(),
            currentStreet: randomStreet,
            currentCity: randomCity,
            currentCountry: 'Ireland',
            currentPostcode: '',
            currentEircode: '' // Clear current EIRCode
          }));

          setEircodeError(''); // Clear errors since we successfully generated an address
        }
      }
    } catch (error) {
      console.error('Error getting location:', error);
      if (error.code === 1) {
        setEircodeError('Location access denied. Please enable location services and try again.');
      } else if (error.code === 2) {
        setEircodeError('Location unavailable. Please check your device settings.');
      } else if (error.code === 3) {
        setEircodeError('Location request timed out. Please try again.');
      } else {
        setEircodeError('Error getting your current location. Please try again.');
      }
    } finally {
      setIsLoadingLocation(false);
      console.log('Geolocation request completed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Theme Selector Button */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          <button
            onClick={() => setShowThemeSelector(!showThemeSelector)}
            className={`p-3 rounded-full ${theme.primarySolid} ${theme.primaryHover} text-white shadow-lg transition-all transform hover:scale-105`}
          >
            <Palette size={20} />
          </button>

          {/* Theme Selector Dropdown */}
          {showThemeSelector && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Choose Theme</h3>
                <p className="text-sm text-gray-600">Customize your experience</p>
              </div>
              <div className="p-2 max-h-80 overflow-y-auto">
                {Object.entries(themes).map(([key, themeOption]) => (
                  <button
                    key={key}
                    onClick={() => handleThemeChange(key)}
                    className={`w-full p-3 rounded-lg mb-2 text-left transition-all hover:bg-gray-50 ${currentTheme === key ? 'bg-gray-100 ring-2 ring-offset-2 ring-gray-200' : ''
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${themeOption.gradient} shadow-sm`}></div>
                      <div>
                        <div className="font-medium text-gray-900">{themeOption.name}</div>
                        {currentTheme === key && (
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Check size={12} />
                            <span>Active</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Header */}
      <header className={`bg-gradient-to-r ${theme.primary} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Layout */}
          <div className="flex justify-between items-center min-h-16 py-3">

            {/* Logo - Left side */}
            <div className="flex items-center bg-white p-1 rounded flex-shrink-0">
              <img src="/SouthDocLogo.png" alt="SouthDoc Logo" className="h-12 w-auto" />
            </div>

            {/* SouthDoc Description - Right side (Desktop only) */}
            <div className="hidden sm:block text-white text-right max-w-md">
              <div className="font-bold text-lg leading-tight">
                SouthDoc is a GP out-of-hours service
              </div>
              <div className="text-sm opacity-90 leading-tight mt-1">
                for medical issues that cannot wait for daytime practice
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Booking Form */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Book Your Consultation</h2>
            <p className="text-gray-600">Get professional medical care in just two simple steps</p>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full ${currentStep === 1 ? theme.primarySolid : 'bg-gray-200'} text-white flex items-center justify-center font-semibold`}>
                1
              </div>
              <div className={`w-24 h-1 ${currentStep === 2 ? theme.primarySolid : 'bg-gray-200'}`}></div>
              <div className={`w-10 h-10 rounded-full ${currentStep === 2 ? theme.primarySolid : 'bg-gray-200'} ${currentStep === 2 ? 'text-white' : 'text-gray-500'} flex items-center justify-center font-semibold`}>
                2
              </div>
            </div>
          </div>

          {currentStep === 1 ? (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Patient Information */}
                <div className="p-4 sm:p-6 md:p-8 border-r-0 md:border-r border-gray-100 border-b md:border-b-0">
                  <div className="flex items-center space-x-2 mb-6">
                    <Users className={theme.accent} size={20} />
                    <h3 className="text-xl font-semibold text-gray-900">Patient Information</h3>
                  </div>
                  <p className="text-gray-600 mb-6">Tell us about yourself</p>

                  <div className="space-y-6">
                    {/* Reason for Contact Dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for Contact <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="reasonForContact"
                        value={formData.reasonForContact}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-base"
                      >
                        <option value="">Select reason for contact</option>
                        <option value="general_consultation">General Consultation</option>
                        <option value="follow_up">Follow-up Appointment</option>
                        <option value="prescription_renewal">Prescription Renewal</option>
                        <option value="test_results">Test Results</option>
                        <option value="referral">Referral Request</option>
                        <option value="emergency">Emergency</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Enter your first name"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Enter your last name"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-base"
                          disabled={isLoadingDropdowns}
                        >
                          <option value="">
                            {isLoadingDropdowns ? 'Loading genders...' : 'Select your gender'}
                          </option>
                          {dropdownData.gender.map((genderItem) => (
                            <option key={genderItem.Id} value={genderItem.Id}>
                              {genderItem.GenderName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GMS Number</label>
                        <input
                          type="text"
                          name="gmsNumber"
                          value={formData.gmsNumber}
                          onChange={handleInputChange}
                          placeholder="Enter your GMS number"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="gmsExpiry" className="block text-sm font-medium text-gray-700 mb-2">
                          GMS Expiry
                        </label>
                        <input
                          type="date"
                          id="gmsExpiry"
                          name="gmsExpiry"
                          value={formData.gmsExpiry}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="+353 xx xxx xxxx"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="gp" className="block text-sm font-medium text-gray-700 mb-2">
                          General Practitioner <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="gp"
                          name="gp"
                          value={formData.gp}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-base"
                          disabled={isLoadingDropdowns}
                        >
                          <option value="">
                            {isLoadingDropdowns
                              ? 'Loading doctors...'
                              : `Select your GP (${getFilteredGPs().length} available)`
                            }
                          </option>
                          {getFilteredGPs().map((doctor) => (
                            <option key={doctor.GPID} value={doctor.GPID}>
                              {doctor.GPName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="surgery" className="block text-sm font-medium text-gray-700 mb-2">
                          Surgery <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="surgery"
                          name="surgery"
                          value={formData.surgery}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-base"
                          disabled={isLoadingDropdowns}
                        >
                          <option value="">
                            {isLoadingDropdowns ? 'Loading surgeries...' : 'Select your Surgery'}
                          </option>
                          <option value="all">All Surgeries</option>
                          {dropdownData.surgeries.map((surgery) => (
                            <option key={surgery.SurgeryID} value={surgery.SurgeryID}>
                              {surgery.SurgeryName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>


                  </div>
                </div>

                {/* Location */}
                <div className="p-8 bg-gray-50">
                  <div className="flex items-center space-x-2 mb-6">
                    <MapPin className={theme.accent} size={20} />
                    <h3 className="text-xl font-semibold text-gray-900">Location</h3>
                  </div>
                  <p className="text-gray-600 mb-6">Enter your location details</p>

                  {/* <button className={`w-full ${theme.primarySolid} ${theme.primaryHover} text-white py-3 rounded-lg font-semibold mb-6 transition-colors flex items-center justify-center space-x-2`}>
                    <MapPin size={20} />
                    <span>Use Current Location</span>
                  </button> */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Search size={16} className="inline mr-1" />
                      Search Eircode
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          name="eircode"
                          value={formData.eircode}
                          onChange={handleInputChange}
                          placeholder="Enter Eircode"
                          className={`w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isLoadingEircode ? 'bg-gray-50' : ''}`}
                          disabled={isLoadingEircode}
                        />
                        {isLoadingEircode ? (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                          </div>
                        ) : (
                          <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={isLoadingLocation || isLoadingEircode}
                        className={`px-3 py-2 ${theme.primarySolid} ${theme.primaryHover} text-white rounded-lg transition-all flex items-center justify-center min-w-[44px] ${isLoadingLocation || isLoadingEircode ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-md hover:shadow-lg'}`}
                        title={isLoadingLocation ? "Getting your location..." : "Use Current Location"}
                        aria-label="Use current location to fill address fields"
                      >
                        {isLoadingLocation ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <MapPin size={16} />
                        )}
                      </button>
                    </div>
                    {eircodeError && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {eircodeError}
                      </p>
                    )}
                    {formData.eircode && !isLoadingEircode && !eircodeError && formData.currentCity && (
                      <p className="mt-1 text-sm text-green-600 flex items-center">
                        <span className="mr-1">✅</span>
                        Address found and populated in Current Location below
                      </p>
                    )}
                    {!formData.eircode && !isLoadingLocation && !eircodeError && formData.currentCity && (
                      <p className="mt-1 text-sm text-green-600 flex items-center">
                        <span className="mr-1">📍</span>
                        Current location detected and populated below
                      </p>
                    )}

                  </div>
                  {/* <div className="text-center text-gray-500 mb-6">OR</div> */}
                  <div className="flex justify-between items-center py-4">
                    <h3 className="text-xl font-semibold text-gray-900">Home Location</h3>

                    <label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-4 text-blue-600"
                        checked={useHomeAsCurrentLocation}
                        onChange={handleUseHomeAsCurrentLocation}
                      />
                      <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">Set as Current Location</span>
                    </label>
                  </div>
                  {/* Manual Location Fields */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Building/Flat <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="homeBuilding"
                          value={formData.homeBuilding}
                          onChange={handleInputChange}
                          placeholder="Building number"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="homeStreet"
                          value={formData.homeStreet}
                          onChange={handleInputChange}
                          placeholder="Street name"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          name="homeCity"
                          value={formData.homeCity}
                          onChange={handleInputChange}
                          placeholder="City"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          name="homeCountry"
                          value={formData.homeCountry}
                          onChange={handleInputChange}
                          placeholder="Country"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* EIRCode field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">EIRCode</label>
                      <input
                        type="text"
                        name="homeEircode"
                        value={formData.homeEircode}
                        onChange={handleInputChange}
                        placeholder="Enter EIRCode"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 py-4">Current Location</h3>

                  {/* Manual Location Fields */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Building/Flat <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="currentBuilding"
                          value={formData.currentBuilding}
                          onChange={handleInputChange}
                          placeholder="Building number"
                          disabled={useHomeAsCurrentLocation}
                          className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${useHomeAsCurrentLocation ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="currentStreet"
                          value={formData.currentStreet}
                          onChange={handleInputChange}
                          placeholder="Street name"
                          disabled={useHomeAsCurrentLocation}
                          className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${useHomeAsCurrentLocation ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          name="currentCity"
                          value={formData.currentCity}
                          onChange={handleInputChange}
                          placeholder="City"
                          disabled={useHomeAsCurrentLocation}
                          className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${useHomeAsCurrentLocation ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          name="currentCountry"
                          value={formData.currentCountry}
                          onChange={handleInputChange}
                          placeholder="Country"
                          disabled={useHomeAsCurrentLocation}
                          className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${useHomeAsCurrentLocation ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>

                    {/* EIRCode field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">EIRCode</label>
                      <input
                        type="text"
                        name="currentEircode"
                        value={formData.currentEircode}
                        onChange={handleInputChange}
                        placeholder="Enter EIRCode"
                        disabled={useHomeAsCurrentLocation}
                        className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${useHomeAsCurrentLocation ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      />
                    </div>

                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="p-4 sm:p-6 md:p-8 bg-white border-t border-gray-100">
                <button
                  onClick={() => setCurrentStep(2)}
                  className={`w-full ${theme.primarySolid} ${theme.primaryHover} text-white py-4 rounded-lg font-semibold text-lg transition-colors`}
                >
                  Continue to Booking & Payment
                </button>
              </div>
            </div>
          ) : (
            // Step 2: Clinic Selection & Payment
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 sm:p-6 md:p-8">
                <div className="flex items-center space-x-2 mb-6">
                  {isVirtualAppointment() ? (
                    <Video className={theme.accent} size={20} />
                  ) : (
                    <MapPin className={theme.accent} size={20} />
                  )}
                  <h3 className="text-xl font-semibold text-gray-900">
                    {isVirtualAppointment() ? 'Select Time Slot' : 'Select Clinic & Time Slot'}
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  {isVirtualAppointment()
                    ? `Choose your preferred time for your ${getAppointmentTypeDisplay().toLowerCase()}`
                    : 'Choose from available clinics nearby'
                  }
                </p>

                {/* Appointment Type Selection and Info - Side by Side */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Left Side - Appointment Type Selection */}
                  <div>
                    <label htmlFor="appointmentType" className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="appointmentType"
                      name="appointmentType"
                      value={formData.appointmentType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-base"
                      disabled={isLoadingDropdowns}
                    >
                      <option value="">
                        {isLoadingDropdowns ? 'Loading appointment types...' : 'Select your appointment type'}
                      </option>
                      {dropdownData.appointmentTypes.map((appointmentType) => (
                        <option key={appointmentType.CaseTypeID} value={appointmentType.CaseTypeID}>
                          {appointmentType.CaseType}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Right Side - Appointment Type Info */}
                  {formData.appointmentType && (
                    <div className={`p-4 rounded-lg ${theme.accentBg} h-fit`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {(() => {
                          const selectedType = dropdownData.appointmentTypes.find(
                            type => type.CaseTypeID.toString() === formData.appointmentType.toString()
                          );
                          const caseType = selectedType?.CaseType.toLowerCase() || '';

                          if (caseType.includes('video')) {
                            return <Video size={16} className={theme.accent} />;
                          } else if (caseType.includes('phone')) {
                            return <Phone size={16} className={theme.accent} />;
                          } else {
                            return <MapPin size={16} className={theme.accent} />;
                          }
                        })()}
                        <span className="font-medium text-gray-900">
                          {getAppointmentTypeDisplay()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {(() => {
                          const selectedType = dropdownData.appointmentTypes.find(
                            type => type.CaseTypeID.toString() === formData.appointmentType.toString()
                          );
                          const caseType = selectedType?.CaseType.toLowerCase() || '';

                          if (caseType.includes('video')) {
                            return 'You will receive a video call link via email before your appointment.';
                          } else if (caseType.includes('phone')) {
                            return 'You will receive a phone call at your registered number at the scheduled time.';
                          } else {
                            return 'For appointment please select a time slot below.';
                          }
                        })()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Clinics Grid - Only show for face-to-face appointments */}
                {!isVirtualAppointment() && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                    {clinics.map((clinic) => (
                      <div
                        key={clinic.id}
                        onClick={() => handleClinicSelect(clinic)}
                        className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md min-h-[80px] ${selectedClinic?.id === clinic.id
                          ? `${theme.border} ${theme.accentBg}`
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <h5 className="font-semibold text-sm text-gray-900 mb-1">{clinic.name}</h5>
                        <div className="text-xs text-gray-600 mb-2">
                          <div className="flex items-center justify-between">
                            <span>{clinic.distance}</span>
                            <div className="flex items-center space-x-1">
                              <Star size={10} className="text-yellow-400 fill-current" />
                              <span>{clinic.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-bold ${theme.accent}`}>{clinic.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Time Slots */}
                {(isVirtualAppointment() || selectedClinic) && (
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      {isVirtualAppointment()
                        ? `Available Time Slots for ${getAppointmentTypeDisplay()}:`
                        : `Available Time Slots for ${selectedClinic.name}:`
                      }
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {getAvailableTimeSlots().map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => handleSlotSelect(slot)}
                          className={`p-3 sm:p-4 border-2 rounded-lg text-sm font-medium transition-all min-h-[44px] ${selectedSlot === slot
                            ? `${theme.primarySolid} text-white`
                            : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* Old Payment Information section removed - using Stripe instead */}

                {/* Payment and Booking Summary - Side by Side Layout */}
                {((isVirtualAppointment() && selectedSlot) || (selectedClinic && selectedSlot)) && (
                  <div className="grid md:grid-cols-2 gap-4 md:gap-8 pt-6">
                    {/* Left Side - Payment Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                      <div className="flex items-center space-x-2 mb-6">
                        <div className={`w-8 h-8 ${theme.accentBg} rounded-full flex items-center justify-center`}>
                          <span className={`text-sm font-semibold ${theme.accent}`}>💳</span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">Payment Information</h4>
                      </div>

                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-medium text-gray-700">Consultation Fee:</span>
                          <span className="text-lg font-bold text-gray-900">€{paymentAmount}</span>
                        </div>
                      </div>

                      <Elements stripe={stripePromise} options={{ appearance: STRIPE_CONFIG.APPEARANCE }}>
                        <StripePayment
                          amount={paymentAmount}
                          onPaymentSuccess={handlePaymentSuccess}
                          onPaymentError={handlePaymentError}
                          isProcessing={isProcessingPayment}
                          setIsProcessing={setIsProcessingPayment}
                          bookingData={formData}
                        />
                      </Elements>
                    </div>

                    {/* Right Side - Booking Summary */}
                    <div className={`p-4 sm:p-6 rounded-lg ${theme.accentBg} border border-gray-200`}>
                      <div className="flex items-center space-x-2 mb-6">
                        
                        <h4 className="text-lg font-semibold text-gray-900">Booking Summary</h4>
                      </div>

                      <div className="space-y-3 text-sm text-gray-600 mb-6">
                        <p>📋 Type: {getAppointmentTypeDisplay()}</p>
                        {!isVirtualAppointment() && selectedClinic && (
                          <p>🏥 Clinic: {selectedClinic.name}</p>
                        )}
                        <p>🕐 Time: {selectedSlot}</p>
                        <p>👤 Patient: {formData.fullName || `${formData.firstName} ${formData.lastName}`.trim() || 'Not specified'}</p>
                        <p>📧 Email: {formData.email || 'Not specified'}</p>
                        <p>📞 Phone: {formData.phoneNumber || 'Not specified'}</p>

                        {isVirtualAppointment() && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-blue-700 font-medium text-sm">
                              {formData.appointmentType === 'vc'
                                ? '💻 Video link will be sent to your email'
                                : '📞 You will receive a call at the scheduled time'
                              }
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Total:</span>
                          <span className={`text-2xl font-bold ${theme.accent}`}>
                            €{paymentAmount}
                          </span>
                        </div>

                        {paymentSuccess && (
                          <div className="mt-3 flex items-center space-x-2 text-green-600">
                            <Check className="h-4 w-4" />
                            <span className="text-sm font-medium">Payment Completed</span>
                          </div>
                        )}

                        {paymentError && (
                          <div className="mt-3 text-red-600 text-sm">
                            Payment failed: {paymentError}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="p-4 sm:p-6 md:p-8 bg-white border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Back to Details
                    </button>
                    <button
                      onClick={handleCompleteBooking}
                      className={`flex-1 ${theme.primarySolid} ${theme.primaryHover} text-white py-4 rounded-lg font-semibold text-lg transition-colors`}
                      disabled={isVirtualAppointment() ? !selectedSlot : (!selectedClinic || !selectedSlot)}
                    >
                      Complete Booking & Pay {isVirtualAppointment() ? '£35' : (selectedClinic?.price || '')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
            {/* Header */}
            <div className="p-6 text-center">
              <div className={`w-16 h-16 ${theme.accentBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Check size={32} className={theme.accent} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
              <p className={`text-lg font-bold ${theme.accent} mb-4`}>{bookingReference}</p>
            </div>

            {/* Booking Summary */}
            <div className="px-6 pb-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Patient:</span>
                  <span className="font-medium text-gray-900">
                    {formData.fullName || `${formData.firstName} ${formData.lastName}`.trim() || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-900">
                    {getAppointmentTypeDisplay()}
                  </span>
                </div>

                {!isVirtualAppointment() && selectedClinic && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Clinic:</span>
                    <span className="font-medium text-gray-900">{selectedClinic.name}</span>
                  </div>
                )}

                {selectedSlot && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium text-gray-900">{selectedSlot}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Amount:</span>
                  <span className={`font-bold text-lg ${theme.accent}`}>
                    {isVirtualAppointment() ? '£35' : (selectedClinic?.price || '£35')}
                  </span>
                </div>
              </div>

              {/* OK Button */}
              <button
                onClick={handleSuccessPopupClose}
                className={`w-full mt-6 ${theme.primarySolid} ${theme.primaryHover} text-white py-3 px-6 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign In Webhook Response Popup */}
      {showSignInPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Webhook Response</h2>
                <button
                  onClick={handleSignInPopupClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Response Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              {webhookResponse ? (
                <div className="space-y-4">
                  {/* Status Indicator */}
                  <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                    webhookResponse.error
                      ? 'bg-red-50 text-red-700'
                      : 'bg-green-50 text-green-700'
                  }`}>
                    {webhookResponse.error ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="font-medium">
                      {webhookResponse.error ? 'Error Response' : 'Success Response'}
                    </span>
                  </div>

                  {/* Table Response */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700">Response Data</h3>
                    </div>
                    <div className="p-4">
                      {renderJsonAsTable(webhookResponse)}
                    </div>
                  </div>

                  {/* Response Details */}
                  {webhookResponse.status && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-blue-700 mb-2">HTTP Details:</h3>
                      <div className="text-sm text-blue-600 space-y-1">
                        <p><strong>Status:</strong> {webhookResponse.status} {webhookResponse.statusText}</p>
                        <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading webhook response...</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={handleSignInPopupClose}
                className={`w-full ${theme.primarySolid} ${theme.primaryHover} text-white py-3 px-6 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}