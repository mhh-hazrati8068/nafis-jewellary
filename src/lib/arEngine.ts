// AR Try-On & Automated Image Generation Engine for Nafis Jewellery
// 100% compliant with Iranian regulations (Enamad, FATA) - No unveiled women or faces,
// pure master silversmith atelier still life, velvet cushions, and hand-only macro shots.

export interface ArGemstoneConfig {
  id: string;
  nameFa: string;
  nameEn: string;
  color: string;
  roughness: number;
  metalness: number;
  transmission: number;
  ior: number;
  descFa: string;
  badge: string;
  arOnHandImage: string;
}

export const AR_GEMSTONE_CONFIGS: ArGemstoneConfig[] = [
  {
    id: "yemeni-red",
    nameFa: "عقیق سرخ یمنی",
    nameEn: "Yemeni Red Agate",
    color: "#8B1818",
    roughness: 0.15,
    metalness: 0.05,
    transmission: 0.45,
    ior: 1.54,
    descFa: "عقیق سرخ اصیل و درخشان با طبع گرم و صیقل زرگری سنتی",
    badge: "محبوب‌ترین",
    arOnHandImage: "/images/ar_hand_red_agate.jpg"
  },
  {
    id: "kabadi",
    nameFa: "عقیق کبدی فاخر",
    nameEn: "Liver Agate (Kabadi)",
    color: "#4A121A",
    roughness: 0.18,
    metalness: 0.08,
    transmission: 0.35,
    ior: 1.55,
    descFa: "عقیق کبدی تیره، باوقار و اصیل با سایه‌روشن‌های عمیق عقیق یمن",
    badge: "اصالت کهن",
    arOnHandImage: "/images/ar_hand_kabadi_agate.jpg"
  },
  {
    id: "black-onyx",
    nameFa: "عقیق مشکی (انیکس)",
    nameEn: "Black Agate / Onyx",
    color: "#121214",
    roughness: 0.12,
    metalness: 0.15,
    transmission: 0.05,
    ior: 1.6,
    descFa: "انیکس صیقلی مشکی با تضاد خیره‌کننده در کنار نقره استرلینگ ۹۲۵",
    badge: "مدرن و کلاسیک",
    arOnHandImage: "/images/ar_hand_black_onyx.jpg"
  },
  {
    id: "dur-najaf",
    nameFa: "دُرّ نجف اصل (شیشه‌ای)",
    nameEn: "Durr-e-Najaf Clear Quartz",
    color: "#E2F0F7",
    roughness: 0.05,
    metalness: 0.02,
    transmission: 0.92,
    ior: 1.544,
    descFa: "بلور خالص و زلال دُرّ نجف با شکست نوری شفاف و جلای الماسی",
    badge: "شفاف و قدسی",
    arOnHandImage: "/images/ar_hand_dur_najaf.jpg"
  },
  {
    id: "soosani-lapis",
    nameFa: "عقیق سوسنی / لاجوردی",
    nameEn: "Azure Lapis / Soosani",
    color: "#1E3A8A",
    roughness: 0.22,
    metalness: 0.1,
    transmission: 0.25,
    ior: 1.52,
    descFa: "رنگ لاجوردی ملوکانه با بافت معدنی و جلوه اشرافی در کنار نقره دست‌ساز",
    badge: "خاص و سلطنتی",
    arOnHandImage: "/images/ar_hand_soosani_lapis.jpg"
  }
];

export interface ArProductContext {
  id: number;
  nameFa: string;
  price: number;
  image: string;
  categoryFa?: string;
  weightGram?: number;
}

// Detect default AR preset for a product
export function detectArPresetForProduct(product?: ArProductContext | null): {
  gemstone: ArGemstoneConfig;
  isBracelet: boolean;
  defaultOnHandImage: string;
} {
  if (!product) {
    return {
      gemstone: AR_GEMSTONE_CONFIGS[0],
      isBracelet: false,
      defaultOnHandImage: AR_GEMSTONE_CONFIGS[0].arOnHandImage
    };
  }

  const name = product.nameFa || "";
  const isBracelet = name.includes("دستبند") || (product.categoryFa && product.categoryFa.includes("دستبند"));

  if (isBracelet) {
    return {
      gemstone: AR_GEMSTONE_CONFIGS[0],
      isBracelet: true,
      defaultOnHandImage: "/images/ar_hand_silver_bracelet.jpg"
    };
  }

  if (name.includes("دُرّ") || name.includes("در نجف")) {
    return {
      gemstone: AR_GEMSTONE_CONFIGS[3],
      isBracelet: false,
      defaultOnHandImage: AR_GEMSTONE_CONFIGS[3].arOnHandImage
    };
  }

  if (name.includes("کبدی")) {
    return {
      gemstone: AR_GEMSTONE_CONFIGS[1],
      isBracelet: false,
      defaultOnHandImage: AR_GEMSTONE_CONFIGS[1].arOnHandImage
    };
  }

  if (name.includes("مشکی") || name.includes("سیاه") || name.includes("انیکس")) {
    return {
      gemstone: AR_GEMSTONE_CONFIGS[2],
      isBracelet: false,
      defaultOnHandImage: AR_GEMSTONE_CONFIGS[2].arOnHandImage
    };
  }

  if (name.includes("سوسنی") || name.includes("لاجوردی") || name.includes("آبی")) {
    return {
      gemstone: AR_GEMSTONE_CONFIGS[4],
      isBracelet: false,
      defaultOnHandImage: AR_GEMSTONE_CONFIGS[4].arOnHandImage
    };
  }

  return {
    gemstone: AR_GEMSTONE_CONFIGS[0],
    isBracelet: false,
    defaultOnHandImage: AR_GEMSTONE_CONFIGS[0].arOnHandImage
  };
}

// Automatically synthesize a certified high-definition AR Try-on card snapshot
export async function generateCertifiedArTryOnImage({
  baseImageUrl,
  productName,
  gemstoneName,
  priceToman,
  fingerName = "انگشت حلقه",
  metalFinish = "نقره ۹۲۵ صیقل رادیوم"
}: {
  baseImageUrl: string;
  productName: string;
  gemstoneName: string;
  priceToman: number;
  fingerName?: string;
  metalFinish?: string;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350; // Instagram 4:5 luxury portrait ratio
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas context unavailable"));
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = baseImageUrl;

    img.onload = () => {
      // 1. Draw base photo
      ctx.drawImage(img, 0, 0, 1080, 1350);

      // 2. Chiaroscuro vignette & luxury gradient overlay
      const gradient = ctx.createLinearGradient(0, 800, 0, 1350);
      gradient.addColorStop(0, "rgba(10, 9, 8, 0)");
      gradient.addColorStop(0.3, "rgba(10, 9, 8, 0.65)");
      gradient.addColorStop(1, "rgba(8, 7, 6, 0.96)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 800, 1080, 550);

      // Top subtle vignette
      const topGrad = ctx.createLinearGradient(0, 0, 0, 250);
      topGrad.addColorStop(0, "rgba(10, 9, 8, 0.75)");
      topGrad.addColorStop(1, "rgba(10, 9, 8, 0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, 1080, 250);

      // 3. Header Badge: Official 925 Atelier Watermark
      ctx.fillStyle = "#C4852B";
      ctx.font = "bold 24px 'Vazirmatn', sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("پرو مجازی هوشمند — زیورآلات نفیسه عبادی", 1020, 60);

      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.font = "18px 'Vazirmatn', sans-serif";
      ctx.fillText("کارگاه تخصصی نقره استرلینگ ۹۲۵ و سنگ‌های اصیل", 1020, 95);

      // Left top cert badge
      ctx.fillStyle = "rgba(102, 0, 0, 0.85)";
      ctx.beginPath();
      ctx.roundRect(50, 40, 200, 48, 12);
      ctx.fill();
      ctx.strokeStyle = "#C4852B";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 16px 'Vazirmatn', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("شناسنامه اصالت ۹۲۵", 150, 70);

      // 4. Bottom Info Card
      // Card Frame
      ctx.fillStyle = "rgba(25, 23, 21, 0.88)";
      ctx.beginPath();
      ctx.roundRect(50, 1040, 980, 260, 24);
      ctx.fill();
      ctx.strokeStyle = "rgba(196, 133, 43, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Product Title
      ctx.textAlign = "right";
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 34px 'Vazirmatn', sans-serif";
      ctx.fillText(productName, 990, 1105);

      // Stone & Finger Spec Pills
      ctx.font = "20px 'Vazirmatn', sans-serif";
      ctx.fillStyle = "#E5A84B";
      ctx.fillText(`نگین: ${gemstoneName} • پرداخت: ${metalFinish} • موقعیت: ${fingerName}`, 990, 1150);

      // Separator line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.beginPath();
      ctx.moveTo(90, 1180);
      ctx.lineTo(990, 1180);
      ctx.stroke();

      // Price Tag (Right)
      ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
      ctx.font = "18px 'Vazirmatn', sans-serif";
      ctx.fillText("ارزش روز اثر:", 990, 1230);

      ctx.fillStyle = "#E5A84B";
      ctx.font = "bold 38px 'Vazirmatn', sans-serif";
      ctx.fillText(`${priceToman.toLocaleString("fa-IR")} تومان`, 990, 1275);

      // Security / Contact (Left)
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.font = "bold 20px 'Vazirmatn', sans-serif";
      ctx.fillText("سفارش مستقیم و مشاوره: ۰۹۱۲۳۴۵۶۷۸۹", 90, 1235);

      ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
      ctx.font = "16px 'Vazirmatn', sans-serif";
      ctx.fillText("nafiseebadijewellery.com | اصالت گارانتی‌شده", 90, 1270);

      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };

    img.onerror = (e) => reject(e);
  });
}
