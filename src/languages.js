// Language configurations and translations
export const languages = {
  en: { name: 'English', flag: '🇬🇧' },
  ur: { name: 'Urdu', flag: '🇵🇰' },
  hi: { name: 'Hindi', flag: '🇮🇳' },
  ga: { name: 'Irish', flag: '🇮🇪' }
};

// Translation system
export const translations = {
  en: {
    // Form labels
    firstName: 'First Name',
    lastName: 'Last Name',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    gp: 'General Practitioner',
    surgery: 'Surgery',
    reasonForContact: 'Reason for Consultation',
    appointmentType: 'Appointment Type',
    currentLocation: 'Current Location',
    building: 'Building',
    street: 'Street',
    area: 'Area',
    city: 'City',
    country: 'Country',
    eircode: 'Eircode',
    selectGeneralPractitioner: 'Search or select General Practitioner',
    selectSurgery: 'Search or select Surgery',
    unknown: 'Unknown',
    phoneNumber: 'Phone Number',
    email: 'Email Address',
    gmsNumber: 'GMS Number',
    gmsExpiry: 'GMS Expiry Date',
    homeLocation: 'Home Location',
    symptoms: 'Additional Comments',
    patientInformation: 'Patient Information',
    location: 'Location',
    setAsCurrentLocation: 'Set as Current Location',
    isCorrespondence: 'Is Correspondence',
    selectClinicTimeSlot: 'Select Clinic & Time Slot',
    choosePreferredClinicTime: 'Choose your preferred clinic and time',
    availableTimeSlotsFor: 'Available Time Slots for',
    noAppointmentSlots: 'No appointment slots available for',
    backToDetails: 'Back to Details',
    completeBookingPayFee: 'Complete Booking & Pay Fee',
    
    // Placeholders
    firstNamePlaceholder: 'Enter your first name',
    lastNamePlaceholder: 'Enter your last name',
    phoneNumberPlaceholder: 'Enter your phone number',
    emailPlaceholder: 'Enter your email address',
    buildingPlaceholder: 'Building number',
    streetPlaceholder: 'Street name',
    areaPlaceholder: 'Area/District',
    cityPlaceholder: 'City',
    countryPlaceholder: 'Country',
    eircodePlaceholder: 'Enter address or Eircode',
    gmsNumberPlaceholder: 'Enter GMS number',
    symptomsPlaceholder: 'Describe your symptoms or concerns',
    reasonPlaceholder: 'Enter reason for consultation',
    
    // Buttons
    continue: 'Continue',
    back: 'Back',
    submit: 'Submit Booking',
    clear: 'Clear',
    clearSection: 'Clear Section',
    clearSelection: 'Clear Selection',
    viewMore: 'View More',
    useCurrentLocation: 'Use Current Location',
    searchAddress: 'Search Address or Eircode',
    
    // Messages
    selectGender: 'Select your gender',
    selectAppointmentType: 'Select your appointment type',
    enterFirstName: 'Enter your first name',
    enterLastName: 'Enter your last name',
    loading: 'Loading...',
    or: 'OR',
    
    // Validation messages
    firstNameRequired: 'First name is required',
    lastNameRequired: 'Last name is required',
    dateOfBirthRequired: 'Date of birth is required',
    genderRequired: 'Gender is required',
    phoneNumberRequired: 'Phone number is required',
    gpRequired: 'General Practitioner is required',
    surgeryRequired: 'Surgery is required',
    reasonRequired: 'Reason for contact is required',
    buildingRequired: 'Building number is required',
    streetRequired: 'Street name is required',
    
    // Other
    appTitle: 'Appointment Booking'
  },
  
  ur: {
    // Form labels
    firstName: 'پہلا نام',
    lastName: 'آخری نام',
    dateOfBirth: 'تاریخ پیدائش',
    gender: 'جنس',
    gp: 'جنرل پریکٹیشنر',
    surgery: 'سرجری',
    reasonForContact: 'مشاورت کی وجہ',
    appointmentType: 'ملاقات کی قسم',
    currentLocation: 'موجودہ مقام',
    building: 'عمارت',
    street: 'گلی',
    area: 'علاقہ',
    city: 'شہر',
    country: 'ملک',
    eircode: 'ایئر کوڈ',
    selectGeneralPractitioner: 'جنرل پریکٹیشنر تلاش کریں یا منتخب کریں',
    selectSurgery: 'سرجری تلاش کریں یا منتخب کریں',
    unknown: 'نامعلوم',
    phoneNumber: 'فون نمبر',
    email: 'ای میل ایڈریس',
    gmsNumber: 'جی ایم ایس نمبر',
    gmsExpiry: 'جی ایم ایس کی میعاد',
    homeLocation: 'گھر کا پتہ',
    symptoms: 'اضافی تبصرے',
    patientInformation: 'مریض کی معلومات',
    location: 'مقام',
    setAsCurrentLocation: 'موجودہ مقام کے طور پر سیٹ کریں',
    isCorrespondence: 'خط و کتابت ہے',
    selectClinicTimeSlot: 'کلینک اور وقت کا انتخاب کریں',
    choosePreferredClinicTime: 'اپنا پسندیدہ کلینک اور وقت منتخب کریں',
    availableTimeSlotsFor: 'دستیاب وقت کے لیے',
    noAppointmentSlots: 'کے لیے کوئی ملاقات کا وقت دستیاب نہیں',
    backToDetails: 'تفصیلات پر واپس',
    completeBookingPayFee: 'بکنگ مکمل کریں اور فیس ادا کریں',
    
    // Placeholders
    firstNamePlaceholder: 'اپنا پہلا نام درج کریں',
    lastNamePlaceholder: 'اپنا آخری نام درج کریں',
    phoneNumberPlaceholder: 'اپنا فون نمبر درج کریں',
    emailPlaceholder: 'اپنا ای میل ایڈریس درج کریں',
    buildingPlaceholder: 'عمارت نمبر',
    streetPlaceholder: 'گلی کا نام',
    areaPlaceholder: 'علاقہ/ضلع',
    cityPlaceholder: 'شہر',
    countryPlaceholder: 'ملک',
    eircodePlaceholder: 'پتہ یا ایئر کوڈ درج کریں',
    gmsNumberPlaceholder: 'جی ایم ایس نمبر درج کریں',
    symptomsPlaceholder: 'اپنی علامات یا خدشات بیان کریں',
    reasonPlaceholder: 'مشاورت کی وجہ درج کریں',
    
    // Buttons
    continue: 'جاری رکھیں',
    back: 'واپس',
    submit: 'بکنگ جمع کریں',
    clear: 'صاف کریں',
    clearSection: 'سیکشن صاف کریں',
    clearSelection: 'انتخاب صاف کریں',
    viewMore: 'مزید دیکھیں',
    useCurrentLocation: 'موجودہ مقام استعمال کریں',
    searchAddress: 'پتہ یا ایئر کوڈ تلاش کریں',
    
    // Messages
    selectGender: 'اپنی جنس منتخب کریں',
    selectAppointmentType: 'اپنی ملاقات کی قسم منتخب کریں',
    enterFirstName: 'اپنا پہلا نام درج کریں',
    enterLastName: 'اپنا آخری نام درج کریں',
    loading: 'لوڈ ہو رہا ہے...',
    or: 'یا',
    
    // Validation messages
    firstNameRequired: 'پہلا نام ضروری ہے',
    lastNameRequired: 'آخری نام ضروری ہے',
    dateOfBirthRequired: 'تاریخ پیدائش ضروری ہے',
    genderRequired: 'جنس ضروری ہے',
    phoneNumberRequired: 'فون نمبر ضروری ہے',
    gpRequired: 'جنرل پریکٹیشنر ضروری ہے',
    surgeryRequired: 'سرجری ضروری ہے',
    reasonRequired: 'مشاورت کی وجہ ضروری ہے',
    buildingRequired: 'عمارت نمبر ضروری ہے',
    streetRequired: 'گلی کا نام ضروری ہے',
    
    // Other
    appTitle: 'ساؤتھ ڈاک بکنگ'
  },
  
  hi: {
    // Form labels
    firstName: 'पहला नाम',
    lastName: 'अंतिम नाम',
    dateOfBirth: 'जन्म तिथि',
    gender: 'लिंग',
    gp: 'सामान्य चिकित्सक',
    surgery: 'सर्जरी',
    reasonForContact: 'परामर्श का कारण',
    appointmentType: 'अपॉइंटमेंट प्रकार',
    currentLocation: 'वर्तमान स्थान',
    building: 'भवन',
    street: 'गली',
    area: 'क्षेत्र',
    city: 'शहर',
    country: 'देश',
    eircode: 'ईयर कोड',
    selectGeneralPractitioner: 'सामान्य चिकित्सक खोजें या चुनें',
    selectSurgery: 'सर्जरी खोजें या चुनें',
    unknown: 'अज्ञात',
    phoneNumber: 'फोन नंबर',
    email: 'ईमेल पता',
    gmsNumber: 'जीएमएस नंबर',
    gmsExpiry: 'जीएमएस समाप्ति तिथि',
    homeLocation: 'घर का पता',
    symptoms: 'अतिरिक्त टिप्पणियां',
    patientInformation: 'रोगी की जानकारी',
    location: 'स्थान',
    setAsCurrentLocation: 'वर्तमान स्थान के रूप में सेट करें',
    isCorrespondence: 'पत्राचार है',
    selectClinicTimeSlot: 'क्लिनिक और समय स्लॉट चुनें',
    choosePreferredClinicTime: 'अपना पसंदीदा क्लिनिक और समय चुनें',
    availableTimeSlotsFor: 'के लिए उपलब्ध समय स्लॉट',
    noAppointmentSlots: 'के लिए कोई अपॉइंटमेंट स्लॉट उपलब्ध नहीं',
    backToDetails: 'विवरण पर वापस',
    completeBookingPayFee: 'बुकिंग पूरी करें और शुल्क का भुगतान करें',
    
    // Placeholders
    firstNamePlaceholder: 'अपना पहला नाम दर्ज करें',
    lastNamePlaceholder: 'अपना अंतिम नाम दर्ज करें',
    phoneNumberPlaceholder: 'अपना फोन नंबर दर्ज करें',
    emailPlaceholder: 'अपना ईमेल पता दर्ज करें',
    buildingPlaceholder: 'भवन संख्या',
    streetPlaceholder: 'गली का नाम',
    areaPlaceholder: 'क्षेत्र/जिला',
    cityPlaceholder: 'शहर',
    countryPlaceholder: 'देश',
    eircodePlaceholder: 'पता या ईयर कोड दर्ज करें',
    gmsNumberPlaceholder: 'जीएमएस नंबर दर्ज करें',
    symptomsPlaceholder: 'अपने लक्षणों या चिंताओं का वर्णन करें',
    reasonPlaceholder: 'परामर्श का कारण दर्ज करें',
    
    // Buttons
    continue: 'जारी रखें',
    back: 'वापस',
    submit: 'बुकिंग जमा करें',
    clear: 'साफ़ करें',
    clearSection: 'अनुभाग साफ़ करें',
    clearSelection: 'चयन साफ़ करें',
    viewMore: 'और देखें',
    useCurrentLocation: 'वर्तमान स्थान का उपयोग करें',
    searchAddress: 'पता या ईयर कोड खोजें',
    
    // Messages
    selectGender: 'अपना लिंग चुनें',
    selectAppointmentType: 'अपना अपॉइंटमेंट प्रकार चुनें',
    enterFirstName: 'अपना पहला नाम दर्ज करें',
    enterLastName: 'अपना अंतिम नाम दर्ज करें',
    loading: 'लोड हो रहा है...',
    or: 'या',
    
    // Validation messages
    firstNameRequired: 'पहला नाम आवश्यक है',
    lastNameRequired: 'अंतिम नाम आवश्यक है',
    dateOfBirthRequired: 'जन्म तिथि आवश्यक है',
    genderRequired: 'लिंग आवश्यक है',
    phoneNumberRequired: 'फोन नंबर आवश्यक है',
    gpRequired: 'सामान्य चिकित्सक आवश्यक है',
    surgeryRequired: 'सर्जरी आवश्यक है',
    reasonRequired: 'परामर्श का कारण आवश्यक है',
    buildingRequired: 'भवन संख्या आवश्यक है',
    streetRequired: 'गली का नाम आवश्यक है',
    
    // Other
    appTitle: 'साउथडॉक बुकिंग'
  },
  
  ga: {
    // Form labels
    firstName: 'Céad Ainm',
    lastName: 'Sloinne',
    dateOfBirth: 'Dáta Breithe',
    gender: 'Inscne',
    gp: 'Dochtúir Ginearálta',
    surgery: 'Máinliacht',
    reasonForContact: 'Cúis Comhairliúcháin',
    appointmentType: 'Cineál Coinne',
    currentLocation: 'Suíomh Reatha',
    building: 'Foirgneamh',
    street: 'Sráid',
    area: 'Ceantar',
    city: 'Cathair',
    country: 'Tír',
    eircode: 'Eircode',
    selectGeneralPractitioner: 'Cuardaigh nó roghnaigh Dochtúir Ginearálta',
    selectSurgery: 'Cuardaigh nó roghnaigh Máinliacht',
    unknown: 'Anaithnid',
    phoneNumber: 'Uimhir Ghutháin',
    email: 'Seoladh Ríomhphoist',
    gmsNumber: 'Uimhir GMS',
    gmsExpiry: 'Dáta Éaga GMS',
    homeLocation: 'Seoladh Baile',
    symptoms: 'Tráchtanna Breise',
    patientInformation: 'Faisnéis Othar',
    location: 'Suíomh',
    setAsCurrentLocation: 'Socraigh mar Shuíomh Reatha',
    isCorrespondence: 'Is Comhfhreagras é',
    selectClinicTimeSlot: 'Roghnaigh Clinic & Sliotán Ama',
    choosePreferredClinicTime: 'Roghnaigh do chlinic agus am roghnach',
    availableTimeSlotsFor: 'Sliotáin Ama ar Fáil do',
    noAppointmentSlots: 'Níl aon sliotáin coinne ar fáil do',
    backToDetails: 'Ar Ais go Sonraí',
    completeBookingPayFee: 'Críochnaigh Áirithint & Íoc Táille',
    
    // Placeholders
    firstNamePlaceholder: 'Cuir isteach do chéad ainm',
    lastNamePlaceholder: 'Cuir isteach do shloinne',
    phoneNumberPlaceholder: 'Cuir isteach d\'uimhir ghutháin',
    emailPlaceholder: 'Cuir isteach do sheoladh ríomhphoist',
    buildingPlaceholder: 'Uimhir foirgnimh',
    streetPlaceholder: 'Ainm na sráide',
    areaPlaceholder: 'Ceantar/Dúiche',
    cityPlaceholder: 'Cathair',
    countryPlaceholder: 'Tír',
    eircodePlaceholder: 'Cuir isteach seoladh nó Eircode',
    gmsNumberPlaceholder: 'Cuir isteach uimhir GMS',
    symptomsPlaceholder: 'Déan cur síos ar do chuid comharthaí nó imní',
    reasonPlaceholder: 'Cuir isteach cúis comhairliúcháin',
    
    // Buttons
    continue: 'Lean Ar Aghaidh',
    back: 'Ar Ais',
    submit: 'Cuir Isteach Áirithint',
    clear: 'Glan',
    clearSection: 'Glan Rannóg',
    clearSelection: 'Glan Rogha',
    viewMore: 'Féach Níos Mó',
    useCurrentLocation: 'Úsáid Suíomh Reatha',
    searchAddress: 'Cuardaigh Seoladh nó Eircode',
    
    // Messages
    selectGender: 'Roghnaigh d\'inscne',
    selectAppointmentType: 'Roghnaigh do chineál coinne',
    enterFirstName: 'Cuir isteach do chéad ainm',
    enterLastName: 'Cuir isteach do shloinne',
    loading: 'Ag lódáil...',
    or: 'NÓ',
    
    // Validation messages
    firstNameRequired: 'Tá céad ainm riachtanach',
    lastNameRequired: 'Tá sloinne riachtanach',
    dateOfBirthRequired: 'Tá dáta breithe riachtanach',
    genderRequired: 'Tá inscne riachtanach',
    phoneNumberRequired: 'Tá uimhir ghutháin riachtanach',
    gpRequired: 'Tá Dochtúir Ginearálta riachtanach',
    surgeryRequired: 'Tá Máinliacht riachtanach',
    reasonRequired: 'Tá cúis comhairliúcháin riachtanach',
    buildingRequired: 'Tá uimhir foirgnimh riachtanach',
    streetRequired: 'Tá ainm na sráide riachtanach',
    
    // Other
    appTitle: 'Áirithint'
  }
};

// Enhanced translation helper function
export const getTranslation = (currentLanguage) => {
  return (key) => {
    // First try to get translation from current language
    const translation = translations[currentLanguage]?.[key];
    
    // If translation exists, return it
    if (translation) return translation;
    
    // Fallback to English if translation doesn't exist
    const fallbackTranslation = translations.en?.[key];
    
    // Return fallback or key itself as last resort
    return fallbackTranslation || key;
  };
};

// Language management functions
export const saveLanguageToStorage = (language) => {
  localStorage.setItem('southDocLanguage', language);
};

export const getLanguageFromStorage = () => {
  return localStorage.getItem('southDocLanguage') || 'en';
};


