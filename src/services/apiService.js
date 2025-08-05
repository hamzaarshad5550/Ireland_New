// Centralized API service for HTTP requests
export const API_CONFIG = {
  // Base API endpoint
  PATIENT_INFO_PREREQS: 'https://ooh_web.vitonta.com/AppBooking/GetPatientInfoPreReqs',
  
  // Default headers for API requests
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Request timeout in milliseconds
  REQUEST_TIMEOUT: 10000
};

// Helper function to make HTTP GET requests
export const makeApiRequest = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...options.headers
      },
      signal: controller.signal,
      ...options
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Function to fetch patient info prerequisites from centralized API
export const fetchPatientInfoPreReqs = async () => {
  console.log('🔄 Starting fetchPatientInfoPreReqs...');
  console.log('🌐 API URL:', API_CONFIG.PATIENT_INFO_PREREQS);

  try {
    const response = await makeApiRequest(API_CONFIG.PATIENT_INFO_PREREQS);
    console.log('📥 Response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('📋 Raw API response:', data);
      return data;
    } else {
      const errorText = await response.text();
      console.error('❌ Failed to fetch patient info prereqs:', response.status, response.statusText);
      console.error('📄 Error response body:', errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('💥 Error fetching patient info prereqs:', error);
    console.error('🔍 Error details:', error.message);
    throw error;
  }
};

// Function to parse and structure the API response for dropdown population
export const parsePatientInfoResponse = (data) => {
  console.log('🔄 Parsing patient info response...');
  
  try {
    // Initialize clean arrays
    let cleanGender = [];
    let cleanDoctors = [];
    let cleanSurgeries = [];
    let cleanAppointmentTypes = [];

    // Parse Gender data
    if (data.Gender && Array.isArray(data.Gender)) {
      cleanGender = data.Gender.map(item => ({
        Id: item.Id,
        GenderName: item.GenderName
      })).filter(item => item.Id && item.GenderName);
      console.log('👥 Parsed Gender data:', cleanGender);
    }

    // Parse Doctors data
    if (data.Doctors && Array.isArray(data.Doctors)) {
      cleanDoctors = data.Doctors.map(item => ({
        DoctorID: item.DoctorID,
        DoctorName: item.DoctorName,
        SurgeryID: item.SurgeryID,
        SurgeryName: item.SurgeryName,
        RegisterationType: item.RegisterationType
      })).filter(item => item.GPID && item.GPName);
      console.log('👨‍⚕️ Parsed Doctors data with RegisterationType:', cleanDoctors);

      // Extract unique surgeries from doctors data
      const surgeryMap = new Map();
      cleanDoctors.forEach(doctor => {
        if (doctor.SurgeryID && doctor.SurgeryName) {
          surgeryMap.set(doctor.SurgeryID, {
            SurgeryID: doctor.SurgeryID,
            SurgeryName: doctor.SurgeryName
          });
        }
      });
      
      // Add "All" option at the beginning
      cleanSurgeries = [
        { SurgeryID: 'all', SurgeryName: 'All' },
        ...Array.from(surgeryMap.values())
      ];
      console.log('🏥 Parsed Surgery data:', cleanSurgeries);
    }

    // Parse AppointmentTypes data
    if (data.AppointmentTypes && Array.isArray(data.AppointmentTypes)) {
      cleanAppointmentTypes = data.AppointmentTypes.map(item => ({
        CaseTypeID: item.CaseTypeID,
        CaseType: item.CaseType
      })).filter(item => item.CaseTypeID && item.CaseType);
      console.log('📅 Parsed AppointmentTypes data:', cleanAppointmentTypes);
    }

    const parsedData = {
      gender: cleanGender,
      doctors: cleanDoctors,
      surgeries: cleanSurgeries,
      appointmentTypes: cleanAppointmentTypes
    };

    console.log('✅ Successfully parsed patient info response:', parsedData);
    return parsedData;

  } catch (error) {
    console.error('💥 Error parsing patient info response:', error);
    throw error;
  }
};


