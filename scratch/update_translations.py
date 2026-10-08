# -*- coding: utf-8 -*-
import sys

with open('src/lib/translations.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. English features
old_en_features = '''    features: {
      guaranteeTitle: "Lifetime Guarantee",
      guaranteeDesc: "Each piece comes with official certificate of authenticity and 925 sterling silver warranty.",
      craftedTitle: "Handcrafted 925 Silver",
      craftedDesc: "Designed with modern minimalism and hand-finished by master silversmiths.",
      shippingTitle: "Insured Express Delivery",
      shippingDesc: "Tamper-proof, fully insured express delivery right to your doorstep."
    },'''

new_en_features = '''    features: {
      guaranteeTitle: "Silver Authenticity Guarantee",
      guaranteeDesc: "Each piece comes with an official certificate of authenticity and 925 sterling silver warranty.",
      returnTitle: "Unconditional Return Guarantee",
      returnDesc: "Hassle-free replacement or full refund if you are not completely enchanted.",
      shippingTitle: "Insured Express Delivery",
      shippingDesc: "Tamper-proof, fully insured express delivery right to your doorstep.",
      craftedTitle: "Exquisite & Timeless Design",
      craftedDesc: "Artisanal master silversmithing and certified natural gemstone setting."
    },'''

# 2. English categories
old_en_cat = '''    categories: {
      tag: "Visual Identity Collections",
      title: "Signature Silver Jewelry",
      rings: "925 Silver Rings & Bands",
      ringsSub: "Handcrafted 925 Sterling Silver",
      necklaces: "Turquoise & Agate Silver Necklaces",
      necklacesSub: "Natural Neyshabur Gems & 925 Silver",
      bracelets: "Silver Bracelets & Chains",
      braceletsSub: "Artisan Hand-braided Designs",
      discover: "Discover Pieces"
    },'''

new_en_cat = '''    categories: {
      tag: "Signature Atelier Collections",
      title: "Exclusive Silver Collections",
      rings: "925 Silver Rings & Bands",
      ringsSub: "Handcrafted 925 Sterling Silver",
      necklaces: "Natural Agate & Durr Silver Necklaces",
      necklacesSub: "Natural Agate & Clear Quartz Gems",
      bracelets: "Silver Bracelets & Chains",
      braceletsSub: "Artisan Hand-braided Designs",
      womenSet: "Women's High Jewellery",
      womenSetSub: "Delicate Rings, Pendants & Bangles",
      menSet: "Men's Heritage Silver",
      menSetSub: "Engraved Agate & Durr-e Najaf Rings",
      pendants: "Artisan Silver Pendants",
      pendantsSub: "Natural Carved Gemstone Medallions",
      discover: "Discover Pieces"
    },'''

# 3. Persian search placeholder
old_fa_search = 'searchPlaceholder: "جستجوی انگشتر نقره، فیروزه نیشابور، عقیق..."'
new_fa_search = 'searchPlaceholder: "جستجوی انگشتر نقره، عقیق یمنی، دُرّ نجف..."'

# 4. Persian hero subtitle
old_fa_hero_sub = 'subtitle: "پیوند هنر تمام‌عیار با نقره خالص استرلینگ ۹۲۵، فیروزه اصل نیشابور و سنگ‌های معدنی عقیق برای درخشش ماندگار شما.",'
new_fa_hero_sub = 'subtitle: "پیوند هنر تمام‌عیار با نقره خالص استرلینگ ۹۲۵، سنگ‌های اصیل عقیق طبیعی و دُرّ نجف زلال برای درخشش ماندگار شما.",'

# 5. Persian features
old_fa_features = '''    features: {
      guaranteeTitle: "گارانتی اصالت نقره ۹۲۵",
      guaranteeDesc: "تمامی محصولات دارای فاکتور رسمی، شناسنامه اصالت نقره ۹۲۵ و سنگ‌های طبیعی می‌باشند.",
      craftedTitle: "نقره دست‌ساز مینیمال",
      craftedDesc: "طراحی جسورانه و ساخت ظریف توسط استادکاران برجسته نقره‌سازی و گوهرشناسی.",
      shippingTitle: "ارسال بیمه‌شده به سراسر کشور",
      shippingDesc: "بسته‌بندی ایمن و اختصاصی همراه با ارسال اکسپرس و بیمه کامل مرسوله."
    },'''

new_fa_features = '''    features: {
      guaranteeTitle: "گارانتی اصالت نقره",
      guaranteeDesc: "تمامی محصولات دارای فاکتور رسمی، شناسنامه اصالت نقره ۹۲۵ و سنگ‌های اصیل معدنی می‌باشند.",
      returnTitle: "گارانتی مرجوعی بی‌قید و شرط",
      returnDesc: "تضمین عودت وجه یا تعویض آسان بدون قید و شرط در صورت عدم رضایت کامل شما.",
      shippingTitle: "ارسال بیمه‌شده",
      shippingDesc: "بسته‌بندی ایمن و تشریفاتی همراه با ارسال اکسپرس و بیمه کامل مرسوله به سراسر کشور.",
      craftedTitle: "طراحی نفیس و ماندگار",
      craftedDesc: "طراحی تخصصی، مینیمال و ساخت ظریف توسط استادکاران برجسته نقره‌سازی و گوهرشناسی."
    },'''

# 6. Persian categories
old_fa_cat = '''    categories: {
      tag: "دسته‌بندی محصولات",
      title: "کالکشن‌های اختصاصی نقره",
      rings: "انگشتر و حلقه نقره ۹۲۵",
      ringsSub: "نقره استرلینگ دست‌ساز",
      necklaces: "گردنبند نقره، فیروزه و عقیق",
      necklacesSub: "سنگ‌های اصیل نیشابور و نقره ۹۲۵",
      bracelets: "دستبند و زنجیر نقره",
      braceletsSub: "طراحی مدرن و دست‌بافت",
      discover: "مشاهده محصولات"
    },'''

new_fa_cat = '''    categories: {
      tag: "دسته‌بندی محصولات",
      title: "کالکشن‌های اختصاصی نقره",
      rings: "انگشتر نقره ۹۲۵ و عقیق",
      ringsSub: "نقره استرلینگ دست‌ساز و گوهرنشانی",
      necklaces: "گردنبند نقره، عقیق و دُرّ نجف",
      necklacesSub: "سنگ‌های اصیل معدنی و نقره ۹۲۵",
      bracelets: "دستبند و زنجیر نقره",
      braceletsSub: "طراحی مدرن و دست‌بافت زرگری",
      womenSet: "مجموعه اختصاصی بانوان",
      womenSetSub: "ظرافت، نگین‌های اصیل و خطوط مدرن",
      menSet: "مجموعه فاخر آقایان",
      menSetSub: "انگشترهای اصیل عقیق و قلم‌زنی فاخر",
      pendants: "گردن‌آویز و مدال‌های نقره",
      pendantsSub: "آویزهای دست‌ساز مرصع به سنگ‌های طبیعی",
      discover: "مشاهده محصولات"
    },'''

# 7. Persian story
old_fa_story = '''      p1: "در گالری زیورآلات نفیسه عبادی، هر قطعه تجسمی از تلفیق نقره استرلینگ ۹۲۵ با سنگ‌های اصیل معدنی نظیر فیروزه فاخر نیشابور و عقیق طبیعی است. ما بر آنیم تا با تکیه بر ذوق استادکاران و استانداردهای کهن زرگری، آثاری ماندگار و پرمعنا بیافرینیم.",'''
new_fa_story = '''      p1: "در گالری زیورآلات نفیسه عبادی، هر قطعه تجسمی از تلفیق نقره استرلینگ ۹۲۵ با سنگ‌های اصیل معدنی نظیر عقیق‌های کمیاب یمنی، عقیق کبدی، یشمی، سوسنی و دُرّ نجف شیشه‌ای است. ما بر آنیم تا با تکیه بر ذوق استادکاران و استانداردهای کهن زرگری، آثاری ماندگار و پرمعنا بیافرینیم.",'''

old_fa_fn = 'necklaces: "گردنبند نقره و فیروزه",'
new_fa_fn = 'necklaces: "گردنبند نقره، عقیق و دُرّ نجف",'

# 8. Arabic
old_ar_sub = 'subtitle: "حيث يلتقي الفن الخالص بالفضة الاسترليني 925 والفيروز النيسابوري الأصيل والعقيق الطبيعي لإشراقة أبدية.",'
new_ar_sub = 'subtitle: "حيث يلتقي الفن الخالص بالفضة الاسترليني 925 وأحجار العقيق الطبيعية ودر النجف الكريستالي لإشراقة أبدية.",'

old_ar_features = '''    features: {
      guaranteeTitle: "ضمان أصالة الفضة 925",
      guaranteeDesc: "تأتي جميع القطع مع شهادة أصالة معتمدة للفضة الاسترليني 925 وضمان استبدال دائم.",
      craftedTitle: "فضة استرليني صياغة يدوية",
      craftedDesc: "تصاميم عصرية مينيمال منفذة بأيدي أمهر صائغي الفضة والأحجار الكريمة.",
      shippingTitle: "شحن آمن ومؤمّن بالكامل",
      shippingDesc: "تغليف حصري محكم وشحن سريع مع تأمين شامل حتى باب منزلك."
    },'''

new_ar_features = '''    features: {
      guaranteeTitle: "ضمان أصالة الفضة",
      guaranteeDesc: "تأتي جميع القطع مع شهادة أصالة معتمدة للفضة الاسترليني 925 والأحجار المعدنية الطبيعية.",
      returnTitle: "ضمان إرجاع غير مشروط",
      returnDesc: "استرجاع كامل للمبلغ أو استبدال ميسر دون قيد أو شرط في حال عدم الرضا التام.",
      shippingTitle: "شحن آمن ومؤمّن بالكامل",
      shippingDesc: "تغليف تشريفي حصري وشحن سريع مع تأمين شامل حتى باب منزلك.",
      craftedTitle: "تصميم فاخر وخالد",
      craftedDesc: "صياغة فنية راقية وتصميم متفرد يجمع الأصالة التراثية مع اللمسات المينيمال العصرية."
    },'''

old_ar_cat = '''    categories: {
      tag: "مجموعات الهوية البصرية",
      title: "مجوهرات الفضة المميزة",
      rings: "خواتم ودبلات فضة 925",
      ringsSub: "فضة استرليني 925 صياغة يدوية",
      necklaces: "قلائد فضة وفيروز وعقيق",
      necklacesSub: "أحجار نيسابورية طبيعية وفضة 925",
      bracelets: "أساور وسلاسل فضة",
      braceletsSub: "تصاميم مينيمال حديثة",
      discover: "استكشف القطع"
    },'''

new_ar_cat = '''    categories: {
      tag: "مجموعات الهوية البصرية",
      title: "مجوهرات الفضة المميزة",
      rings: "خواتم ودبلات فضة 925",
      ringsSub: "فضة استرليني 925 صياغة يدوية",
      necklaces: "قلائد فضة وعقيق ودر النجف",
      necklacesSub: "أحجار العقيق الطبيعي ودر النجف الصافي",
      bracelets: "أساور وسلاسل فضة",
      braceletsSub: "تصاميم مينيمال حديثة",
      womenSet: "مجموعة السيدات الراقية",
      womenSetSub: "خواتم وقلائد فضة مرصعة بالعقيق",
      menSet: "مجموعة الرجال الفاخرة",
      menSetSub: "خواتم فضة منقوشة بالعقيق اليماني",
      pendants: "قلائد ومداليات فضية فاخرة",
      pendantsSub: "مداليات صياغة يدوية بأحجار طبيعية",
      discover: "استكشف القطع"
    },'''

old_ar_p1 = 'p1: "في بوتيك مجوهرات نفيسة عبادي، تجسد كل قطعة حكاية فنية تلتقي فيها الفضة عيار 925 مع أرقى الأحجار الكريمة الطبيعية كالفيروز النيسابوري الأصيل والعقيق اليمني الفاخر.",'
new_ar_p1 = 'p1: "في بوتيك مجوهرات نفيسة عبادي، تجسد كل قطعة حكاية فنية تلتقي فيها الفضة عيار 925 مع أرقى الأحجار الكريمة الطبيعية كالعقيق اليماني والعقيق الكبدي واليشفي ودر النجف الكريستالي الصافي.",'

old_ar_fn = 'necklaces: "قلائد فضة وفيروز وعقيق",'
new_ar_fn = 'necklaces: "قلائد فضة وعقيق ودر النجف",'

targets = [
    (old_en_features, new_en_features),
    (old_en_cat, new_en_cat),
    (old_fa_search, new_fa_search),
    (old_fa_hero_sub, new_fa_hero_sub),
    (old_fa_features, new_fa_features),
    (old_fa_cat, new_fa_cat),
    (old_fa_story, new_fa_story),
    (old_fa_fn, new_fa_fn),
    (old_ar_sub, new_ar_sub),
    (old_ar_features, new_ar_features),
    (old_ar_cat, new_ar_cat),
    (old_ar_p1, new_ar_p1),
    (old_ar_fn, new_ar_fn)
]

for idx, (old_s, new_s) in enumerate(targets):
    if old_s not in content:
        print(f"Error: Target {idx} not found in content!")
        sys.exit(1)
    content = content.replace(old_s, new_s, 1)

with open('src/lib/translations.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Successfully replaced all targets in src/lib/translations.ts!")
