# Ireland Healthcare Booking System

A comprehensive React-based healthcare appointment booking system for Ireland, featuring modern UI components, theme customization, and integrated SMS functionality.

## 🚀 Features

### Core Functionality
- **Multi-step Booking Process**: Streamlined appointment booking with validation
- **GMS Number Validation**: Real-time validation with 5-10 character requirement
- **Location Services**: EIRCode lookup and address validation
- **Phone Number Input**: International format with country selection
- **SMS Integration**: Professional SMS form component with theme integration
- **Payment Processing**: Stripe integration for secure payments
- **Theme System**: Multiple color themes with dynamic styling

### UI/UX Features
- **Responsive Design**: Mobile-first approach with modern UI components
- **Theme Colors**: Blue, Orange, Emerald, Purple, Teal, and more
- **Form Validation**: Comprehensive client-side validation with error handling
- **Loading States**: Professional loading indicators and disabled states
- **Success/Error Feedback**: Clear user feedback for all operations

### Technical Features
- **Modern React**: Hooks, functional components, and modern patterns
- **TypeScript Support**: Type-safe components and utilities
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Webhook Integration**: N8N webhook system for backend communication
- **Environment Detection**: Automatic local/production configuration

## 📱 Components

### SMS Form Component
Professional SMS sending interface with:
- International phone number validation
- Character counter (160 char limit)
- Theme color integration
- Success/error handling
- Loading states

### SearchableDropdown
Enhanced dropdown component with:
- Search functionality
- Multi-select support
- Theme color focus states
- Loading indicators

### PhoneNumberInput
International phone number input with:
- Country selection (flags removed for clean UI)
- Format validation
- Auto-formatting

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/hamzaarshad5550/Ireland_New.git

# Navigate to project directory
cd Ireland_New

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_key
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Webhook Configuration
Update `src/config/webhooks.js` for your environment:

```javascript
const ENVIRONMENT_CONFIG = {
  local: {
    N8N_BASE_URL: 'https://your-local-n8n.domain.com',
    WEBHOOK_PATH: '/webhook/your-webhook-id'
  },
  production: {
    N8N_BASE_URL: 'https://your-production-n8n.domain.com',
    WEBHOOK_PATH: '/webhook/your-webhook-id'
  }
};
```

## 🎨 Theme System

The application supports multiple themes with dynamic color switching:

- **Blue Theme**: Professional blue color scheme
- **Orange Theme**: Vibrant orange color scheme
- **Emerald Theme**: Fresh green color scheme
- **Purple Theme**: Modern purple color scheme
- **Teal Theme**: Calming teal color scheme

Themes automatically apply to:
- Form focus states
- Button colors
- Dropdown components
- SMS form styling

## 📋 Usage

### Basic Booking Flow
1. **Personal Information**: Name, DOB, gender, contact details
2. **Location Details**: Current and home address with EIRCode
3. **Medical Information**: GMS number, GP selection, reason for consultation
4. **Appointment Selection**: Choose clinic, date, and time slot
5. **Payment**: Secure Stripe payment processing
6. **Confirmation**: Booking confirmation with reference number

### SMS Integration
```javascript
import SendSms from './components/SendSms';

<SendSms
  currentTheme="emerald"
  apiEndpoint="https://your-api.com/sms"
  onSuccess={(data) => console.log('SMS sent:', data)}
  onError={(error) => console.error('SMS failed:', error)}
/>
```

## 🔒 Security Features

- Input validation and sanitization
- CSRF protection
- Secure payment processing
- Environment-based configuration
- Error handling and logging

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly interface
- Mobile-optimized forms
- Progressive Web App features

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Build and test production build
npm run build
npm install -g serve
serve -s build
```

## 📦 Build and Deployment

```bash
# Create production build
npm run build

# Deploy to static hosting
# Upload the 'build' folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🔄 Recent Updates

- ✅ Added professional SMS form component
- ✅ Updated location fields with dynamic theme colors
- ✅ Removed flags from phone number dropdown for cleaner UI
- ✅ Enhanced GMS number validation (5-10 characters)
- ✅ Fixed form reset functionality
- ✅ Integrated modern UI components
- ✅ Added comprehensive validation and error handling

---

**Built with ❤️ for Ireland's healthcare system**
