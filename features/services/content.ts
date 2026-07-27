import type { Service } from "./types";

const ENGLISH_NAMES: Record<string, string> = {
  "massage-01": "Relax Massage",
  "massage-02": "Shiatsu Massage",
  "massage-03": "Swedish Massage",
  "massage-04": "Thai Massage",
  "massage-05": "Aroma Massage",
  "massage-06": "Reflexology Massage",
  "massage-07": "Balinese Massage",
  "massage-08": "Lomi Lomi Massage",
  "massage-09": "Therapeutic Massage",
  "massage-10": "Sports Massage",
  "massage-11": "Deep Tissue Massage",
  "massage-12": "Hot Stone Massage",
  "massage-13": "Bamboo Massage",
  "massage-14": "Fire Massage",
  "massage-15": "Special Oils Massage",
  "massage-16": "Herbal Pressure Massage",
  "massage-17": "Swedish & Shiatsu Massage",
  "massage-18": "Sports & Shiatsu Massage",
  "massage-19": "Hot Stone & Swedish Massage",
  "massage-20": "Four Hands Massage",
  "massage-21": "Deep Tissue & Sports Massage",
  "massage-22": "Fire & Swedish Massage",
  "massage-23": "Arabic Heritage Massage",
  "massage-24": "Shiatsu Massage",
  "massage-25": "Slimming Massage",
  "massage-26": "Lymphatic Drainage Massage",
  "massage-27": "Lymphatic Drainage & Fire Massage",
  "head-face-01": "Japanese Herbal Head Treatment",
  "head-face-02": "Hair Treatment",
  "head-face-03": "Head & Face Massage",
  "head-face-04": "Ear Candle Treatment",
  "feet-care-01": "Foot Massage",
  "feet-care-02": "Hot Stone Foot Treatment",
  "cupping-therapy-01": "Air Cupping",
  "cupping-therapy-02": "Fire Cupping",
  "cupping-therapy-03": "Bamboo Cupping",
  "baths-01": "Moroccan Nile Bath & Fassi Scrub",
  "baths-02": "Oud & Sandalwood Bath",
  "baths-03": "Tunisian Bath",
  "baths-04": "VIP Gold Bath",
  "facial-01": "Face Mask",
  "facial-02": "Deep Skin Cleansing",
  "facial-03": "Collagen Cleansing",
  "facial-04": "Gold Facial",
  "facial-05": "Diamond Facial",
  "feet-care-03": "Pedicure",
  "feet-care-04": "Manicure",
  "feet-care-05": "Pedicure & Manicure",
};

const ENGLISH_DESCRIPTION =
  "A carefully tailored treatment designed to ease tension, restore balance, and leave you feeling deeply refreshed.";

function isTodo(value: string | undefined) {
  return !value || value.includes("[TODO:");
}

export function getServiceName(service: Service, locale: string) {
  if (locale === "ar" || !isTodo(service.name.en)) return locale === "ar" ? service.name.ar : service.name.en;
  return ENGLISH_NAMES[service.slug] ?? "Wellness Treatment";
}

export function getServiceDescription(service: Service, locale: string) {
  if (locale === "ar" || !isTodo(service.description.en)) {
    return locale === "ar" ? service.description.ar : service.description.en;
  }
  return ENGLISH_DESCRIPTION;
}
