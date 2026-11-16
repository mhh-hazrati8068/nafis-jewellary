// Centralized contact, official links & trust configuration for Nafise Ebadi Jewellery.
// Phone, mobile, showroom address, and social channels are verified; keep WhatsApp & working hours empty until confirmed.

export interface ContactConfig {
  isVerified: boolean;
  hasVerifiedSocials: boolean;
  brandWebsite: string;
  emadWebsite: string;
  landlineDisplay: string;
  landlineHref: string;
  mobileDisplay: string;
  mobileHref: string;
  whatsappDisplay: string;
  whatsappHref: string;
  telegramHandle: string;
  telegramHref: string;
  eitaaHandle: string;
  eitaaHref: string;
  baleHandle: string;
  baleHref: string;
  rubikaHref: string;
  soroushHref: string;
  instagramHref: string;
  email: string;
  addressFa: string;
  addressEn: string;
  addressAr: string;
  workingHoursFa: string;
  workingHoursEn: string;
  workingHoursAr: string;
}

export const CONTACT_CONFIG: ContactConfig = {
  isVerified: true,
  hasVerifiedSocials: true,
  brandWebsite: "https://nafiseebadijewellery.com/",
  emadWebsite: "https://emadaseman.ir/",
  landlineDisplay: "۰۲۱-۴۶۰۲۰۲۵۴",
  landlineHref: "tel:+982146020254",
  mobileDisplay: "+98 999 323 1311",
  mobileHref: "tel:+989993231311",
  whatsappDisplay: "",
  whatsappHref: "",
  telegramHandle: "@nafisebadijewellery",
  telegramHref: "https://t.me/nafisebadijewellery",
  eitaaHandle: "@nafisebadijewellry",
  eitaaHref: "https://eitaa.com/nafisebadijewellry",
  baleHandle: "@nafisebadijewellry",
  baleHref: "https://ble.ir/nafisebadijewellry",
  rubikaHref: "https://rubika.ir/nafisebadijewellery",
  soroushHref: "https://splus.ir/nafisebadijewellry",
  instagramHref: "https://www.instagram.com/nafisebadi.jewelry/",
  email: "",
  addressFa: "تهران، شهرک راه‌آهن، بلوار شهیدان زینعلی، بلوار امیرکبیر، پاساژ مالمون ۱، همکف، پلاک ۴۶، واحد B8",
  addressEn: "Unit B8, No. 46, Ground Floor, Malmoon 1 Mall, Amir Kabir Blvd., Shahidan Zeinali Blvd., Shahrak-e Rahahan, Tehran",
  addressAr: "طهران، شهرك راه‌آهن، شارع شهيدان زينالي، شارع أمير كبير، مجمع مالمون ١ التجاري، الطابق الأرضي، محل ٤٦، وحدة B8",
  workingHoursFa: "",
  workingHoursEn: "",
  workingHoursAr: "",
};

export interface EnamadConfig {
  isVerified: boolean;
  id: string;
  code: string;
}

export const ENAMAD_CONFIG: EnamadConfig = {
  isVerified: false,
  id: "",
  code: "",
};

export interface PaymentConfig {
  snappPay: {
    enabled: boolean;
    verified: boolean;
  };
}

export const PAYMENT_CONFIG: PaymentConfig = {
  snappPay: {
    enabled: false,
    verified: false,
  },
};
