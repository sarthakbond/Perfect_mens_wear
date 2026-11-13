(() => {
  "use strict";

  const config = window.PERFECT_MENS_CONFIG || {};
  let products = window.PERFECT_MENS_PRODUCTS || [];
  const storageKey = "perfect-mens-wear-order-v1";
  const languageStorageKey = "perfect-mens-wear-language-v1";
  const wishlistStorageKey = "perfect-mens-wear-wishlist-v1";
  const recentlyViewedStorageKey = "perfect-mens-wear-recent-v1";
  const productImageFallback = "assets/menswear-placeholder.svg";
  const originalTextNodes = new WeakMap();
  let categories = ["All", ...new Set(products.map((product) => product.category))];
  const translations = {
    "Skip intro": "परिचय वगळा",
    "SCROLL TO ENTER": "प्रवेशासाठी स्क्रोल करा",
    "PURANDAR, PUNE": "पुरंदर, पुणे",
    "EST. 1998 · PURANDAR": "१९९८ पासून · पुरंदर",
    "STYLE": "शैली",
    "QUALITY": "गुणवत्ता",
    "ELEGANCE": "अभिजातता",
    "Perfect Mens Wear storefront entrance": "परफेक्ट मेन्स वेअरच्या दुकानात प्रवेश",
    "The actual Perfect Mens Wear storefront in Purandar": "पुरंदरमधील परफेक्ट मेन्स वेअरचे खरे दुकान",
    "Home": "मुख्यपृष्ठ", "Collection": "कलेक्शन", "About & contact": "आमच्याबद्दल आणि संपर्क",
    "Your order": "तुमची ऑर्डर",
    "Skip to content": "मजकुराकडे जा",
    "Explore the collection": "कलेक्शन पाहा", "Visit our store": "आमच्या दुकानाला भेट द्या",
    "Dress the gentleman": "सभ्य व्यक्तिमत्त्वाला साजेसा", "in you.": "पोषाख",
    "Thoughtful menswear, trusted names, and a little help finding just the right fit.": "विचारपूर्वक निवडलेले पुरुषांचे कपडे, विश्वासार्ह ब्रँड आणि योग्य फिट निवडण्यासाठी वैयक्तिक मदत.",
    "Names you know.": "ओळखीची नावे.", "Quality you can feel.": "अनुभवता येणारी गुणवत्ता.",
    "A selection of the brands featured at our store. Availability may vary.": "आमच्या दुकानातील काही ब्रँड. उपलब्धता बदलू शकते.",
    "Made for every": "प्रत्येक प्रसंगासाठी", "kind of occasion.": "योग्य पोशाख.",
    "Browse all styles": "सर्व प्रकार पाहा", "Shirts": "शर्ट", "Trousers": "पँट",
    "Ethnic wear": "पारंपरिक पोशाख", "Ethnic Wear": "पारंपरिक पोशाख", "Fabrics": "कापड",
    "Suits & jackets": "सूट आणि जॅकेट", "Suits & Jackets": "सूट आणि जॅकेट", "Considered classics.": "निवडक अभिजात शैली.",
    "See the collection": "कलेक्शन पाहा",     "Illustrative sample prices only. Please confirm current prices and availability with us.": "किमती केवळ नमुना व प्रातिनिधिक आहेत. सध्याची किंमत आणि उपलब्धता आमच्याकडून निश्चित करा.",
    "Good style is personal.": "चांगली शैली वैयक्तिक असते.", "Good service should be too.": "चांगली सेवा देखील तशीच असावी.",
    "Since 1998, Perfect Mens Wear has been helping our community find clothing for workdays, celebrations, and everything in between.": "१९९८ पासून परफेक्ट मेन्स वेअर आमच्या परिसरातील ग्राहकांना कामाचे दिवस, समारंभ आणि इतर प्रसंगांसाठी योग्य कपडे निवडण्यात मदत करत आहे.",
    "A little about us": "आमच्याबद्दल", "Choose. Message. Confirm.": "निवडा. संदेश पाठवा. खात्री करा.",
    "Send on WhatsApp": "WhatsApp वर पाठवा", "Your selection is prepared as a message for the store.": "तुमची निवड दुकानासाठी संदेशात तयार केली जाईल.",
    "We’ll confirm": "आम्ही खात्री करू", "We’ll get back to you about availability and payment in store.": "उपलब्धता आणि दुकानातील पेमेंटबद्दल आम्ही तुम्हाला कळवू.",
    "Start browsing": "पाहायला सुरुवात करा", "Find your": "तुमची", "kind of classic.": "आवडती शैली शोधा.",
    "Easy everyday favourites to pieces for the moments that matter.": "दररोजच्या आवडीपासून खास क्षणांसाठीच्या पोशाखांपर्यंत.",
    "A sample catalogue.": "नमुना कॅटलॉग.",         "Prices shown are illustrative sample prices, not confirmed store prices. Product photos, colours, and availability are for demonstration; please message us to confirm current details.": "दाखवलेल्या किमती नमुना व प्रातिनिधिक आहेत; दुकानातील निश्चित किमती नाहीत. उत्पादनांचे फोटो, रंग व उपलब्धता देखील प्रातिनिधिक आहेत. सध्याची माहिती निश्चित करण्यासाठी कृपया संदेश पाठवा.",
    "Wear it your way.": "तुमच्या पद्धतीने परिधान करा.", "The collection": "कलेक्शन",
    "Find your kind of classic.": "तुमची आवडती शैली शोधा.", "All": "सर्व",
    "Rooted here.": "इथलीच ओळख.", "Since 1998.": "१९९८ पासून.",
    "Good clothing, familiar faces, and personal service in Purandar.": "पुरंदरमध्ये उत्तम कपडे, परिचित चेहरे आणि आपुलकीची सेवा.",
    "THE PERFECT MENS WEAR STORE": "परफेक्ट मेन्स वेअरचे दुकान",
    "A familiar place": "आपुलकीचे ठिकाण",
    "in Purandar.": "पुरंदरमध्ये.",
    "Visit Perfect Mens Wear for personal help with menswear and fabrics. Proudly serving Purandar, Pune since 1998.": "पुरुषांचे कपडे आणि कापड निवडण्यासाठी वैयक्तिक मदतीसाठी परफेक्ट मेन्स वेअरला भेट द्या. १९९८ पासून पुरंदर, पुणे येथे आपली सेवा.",
    "A photo of our actual storefront will appear here when supplied.": "दुकानाचा खरा फोटो मिळाल्यावर येथे दाखवला जाईल.",
    "Purandar, Pune, Maharashtra, India": "पुरंदर, पुणे, महाराष्ट्र, भारत",
    "JUST LANDED": "नवीन आगमन",
    "New arrivals.": "नवीन आगमन.",
    "Explore new styles": "नवीन शैली पाहा",
    "Chat on WhatsApp": "WhatsApp वर संपर्क",
    "CUSTOMER FAVOURITES": "ग्राहकांची आवड",
    "Bestsellers.": "लोकप्रिय उत्पादने.",
    "Shop favourites": "आवडती उत्पादने पाहा",
    "Demo products and prices are illustrative and subject to confirmation with the store.": "डेमोमधील उत्पादने व किमती प्रातिनिधिक आहेत; दुकानाकडून त्यांची खात्री करून घ्या.",
    "New arrivals will appear here soon.": "नवीन उत्पादने लवकरच येथे दिसतील.",
    "Bestsellers will appear here soon.": "लोकप्रिय उत्पादने लवकरच येथे दिसतील.",
    "More than what": "केवळ कपड्यांपेक्षा", "you wear.": "काहीतरी अधिक.",
    "Since 1998, Perfect Mens Wear has been part of the Purandar, Pune community. We bring together trusted names in menswear and fabrics, with a personal touch to help you find what feels right.": "१९९८ पासून परफेक्ट मेन्स वेअर पुरंदर, पुणे येथील समुदायाचा भाग आहे. पुरुषांचे कपडे आणि कापडातील विश्वासार्ह ब्रँडसोबत योग्य निवड करण्यासाठी आम्ही वैयक्तिक मदत देतो.",
    "From everyday essentials to festive and occasion wear, we're here to make choosing a little easier.": "दररोजच्या गरजेपासून सणासुदीच्या आणि समारंभाच्या पोशाखांपर्यंत, योग्य निवड सोपी करण्यासाठी आम्ही आहोत.",
    "We’d love to": "आम्हाला आनंद होईल", "help you find it.": "तुमची निवड करण्यात मदत करायला.",
    "Ta. Purandar, Dist. Pune,": "ता. पुरंदर, जि. पुणे,", "Ta. Purandar, Dist. Pune": "ता. पुरंदर, जि. पुणे",
    "Maharashtra, India": "महाराष्ट्र, भारत", "Purandar · Maharashtra": "पुरंदर · महाराष्ट्र",
    "Phone details to be added": "फोनची माहिती जोडायची आहे", "Message the store": "दुकानाला संदेश पाठवा",
    "Hours to be confirmed": "वेळ निश्चित करायची आहे", "Open our shop location on Google Maps": "Google Maps वर दुकानाचे ठिकाण उघडा",
    "CALL": "फोन", "WHATSAPP": "व्हॉट्सअॅप", "STORE HOURS": "दुकानाची वेळ",
    "Style that feels": "तुमच्यासारखी", "like you.": "शैली.",
    "Menswear & fabrics": "पुरुषांचे कपडे आणि कापड", "Looking for something": "काही खास", "in particular?": "शोधत आहात?",
    "Browse our sample collection, then message us to check what’s available at the store.": "नमुना कलेक्शन पाहा आणि दुकानातील उपलब्धता जाणून घेण्यासाठी संदेश पाठवा.",
    "Good style, personal service.": "चांगली शैली, आपुलकीची सेवा.", "Serving Purandar since 1998.": "१९९८ पासून पुरंदरमध्ये सेवा.",
    "Explore": "पाहणी", "Our story": "आमची कहाणी", "Get in touch": "संपर्क साधा", "Find us": "आमचे ठिकाण",
    "Message on WhatsApp ↗": "WhatsApp वर संदेश ↗", "Thanks for choosing local.": "स्थानिक दुकान निवडल्याबद्दल धन्यवाद.",
    "YOUR SELECTION": "तुमची निवड", "Indicative total": "अंदाजे एकूण", "We’ll confirm availability and final pricing with you. No online payment is taken.": "उपलब्धता व अंतिम किंमत आम्ही निश्चित करू. ऑनलाइन पेमेंट घेतले जात नाही.",
    "Your name": "तुमचे नाव", "Your phone number": "तुमचा फोन नंबर", "Note": "नोंद", "optional": "ऐच्छिक",
    "Place order on WhatsApp": "WhatsApp वर ऑर्डर पाठवा", "WhatsApp will open with your message ready. Tap Send there to share it with the store.": "तुमचा संदेश तयार होऊन WhatsApp उघडेल. दुकानाला पाठवण्यासाठी Send दाबा.",
    "Browse collection": "कलेक्शन पाहा", "Add to order": "ऑर्डरमध्ये जोडा",
    "No styles in this category just yet. Please check back soon.": "या प्रकारात सध्या उत्पादने नाहीत. कृपया पुन्हा पाहा.",
    "YOUR NEIGHBOURHOOD STORE": "तुमच्या परिसरातील दुकान", "OUR STORY": "आमची कहाणी", "COME SAY HELLO": "भेट द्या",
    "A GOOD PLACE TO START": "सुरुवात करण्यासाठी उत्तम जागा", "THE PERFECT EDIT": "परफेक्ट कलेक्शन",
    "PERFECT MENS WEAR": "परफेक्ट मेन्स वेअर", "THE COLLECTION": "कलेक्शन",
    "Size:": "आकार:", "Size": "आकार", "Size for": "यासाठी आकार", "Favourites": "आवडते", "Recently viewed": "अलीकडे पाहिलेले",
    "Search products": "उत्पादने शोधा", "Min price": "किमान किंमत", "Max price": "कमाल किंमत",
    "Sort products": "उत्पादने क्रमाने लावा", "Price: low to high": "किंमत: कमी ते जास्त",
    "Price: high to low": "किंमत: जास्त ते कमी", "Name: A to Z": "नाव: अ ते ज्ञ",
    "No products match your filters.": "तुमच्या फिल्टरशी जुळणारी उत्पादने नाहीत.",
    "View details": "तपशील पाहा", "Enquire on WhatsApp": "WhatsApp वर चौकशी करा",
    "Colour": "रंग", "Festival edit": "सणासुदीचे कलेक्शन", "New arrivals": "नवीन आगमन",
    "Bestsellers": "लोकप्रिय निवड", "Wishlist": "आवडते", "Instagram": "Instagram",
    "Contact us": "आमच्याशी संपर्क साधा", "Send enquiry": "चौकशी पाठवा",
    "Please add your message.": "कृपया तुमचा संदेश लिहा.",
    "The store’s WhatsApp number hasn’t been set up yet. Please contact the store directly.": "दुकानाचा WhatsApp क्रमांक उपलब्ध नाही. कृपया दुकानाशी थेट संपर्क साधा."
    , "Linen Shirt": "लिनेन शर्ट", "Classic Fit Trousers": "क्लासिक फिट ट्राउझर्स",
    "Textured Occasion Shirt": "टेक्स्चर्ड समारंभाचा शर्ट", "Festive Kurta": "सणासुदीचा कुर्ता",
    "Tailored Blazer": "टेलर्ड ब्लेझर", "Soft Cotton Shirt": "मऊ सुती शर्ट",
    "Premium Suiting Fabric": "प्रीमियम सूटिंग कापड", "Classic Waistcoat": "क्लासिक वेस्टकोट",
    "Everyday": "दररोज", "Occasion": "समारंभ", "Festive": "सणासुदीचे",
    "Tailoring": "टेलरिंग", "Fabric": "कापड", "Natural": "नैसर्गिक", "Olive": "ऑलिव्ह",
    "Navy": "नेव्ही", "Charcoal": "चारकोल", "Black": "काळा", "White": "पांढरा",
    "Blue": "निळा", "Ivory": "आयव्हरी", "Maroon": "मरून", "Assorted": "विविध",
    "By the metre": "प्रति मीटर",
    "Make room for": "खास क्षणांसाठी",
    "the moments that matter.": "सुंदर पोशाख निवडा.",
    "Explore occasion-ready styles and ask us about current availability.": "समारंभाचे पोशाख पाहा आणि सध्याच्या उपलब्धतेबद्दल विचारा.",
    "Explore festive styles": "सणासुदीचे पोशाख पाहा",
    "THE FESTIVE EDIT": "सणासुदीचे कलेक्शन", "01 / THE EVERYDAY": "०१ / रोजचे पोशाख",
    "02 / THE CELEBRATION": "०२ / समारंभाचे पोशाख", "03 / THE OCCASION": "०३ / खास प्रसंग",
    "A LOCAL STORE. A LONG STORY.": "स्थानिक दुकान. मोठी परंपरा.",
    "A SIMPLE WAY TO SHOP": "खरेदीचा सोपा मार्ग", "EVERYDAY ELEGANCE. OCCASION-READY STYLE.": "दररोजची शोभा. खास प्रसंगांसाठी खास शैली.",
    "GOOD COMPANY": "विश्वासार्ह ब्रँड", "FIND YOUR FIT": "तुमचा योग्य फिट शोधा",
    "A FEW FAVOURITES": "आमची काही आवडती उत्पादने", "A LONG STORY.": "मोठी परंपरा.",
    "Found something you like? Send us your selection and we’ll help with sizes, availability, and the next step.": "आवडलेला पोशाख दिसला? तुमची निवड पाठवा; आकार, उपलब्धता आणि पुढील प्रक्रियेसाठी आम्ही मदत करू.",
    "Find your style": "तुमची शैली निवडा", "Browse the collection and add a few favourites to your order.": "कलेक्शन पाहा आणि आवडते पोशाख ऑर्डरमध्ये जोडा.",
    "Recently viewed.": "अलीकडे पाहिलेले.", "YOUR HISTORY": "तुमची पाहणी",
    "Get directions": "मार्गदर्शन मिळवा", "GET IN TOUCH": "संपर्क साधा", "Send us a note.": "आम्हाला संदेश पाठवा.",
    "This form prepares an enquiry in WhatsApp. It does not submit your details to a website server.": "हा फॉर्म WhatsApp मध्ये चौकशीचा संदेश तयार करतो. तुमची माहिती वेबसाइट सर्व्हरवर पाठवली जात नाही.",
    "Phone or email": "फोन किंवा ईमेल", "Your message": "तुमचा संदेश",
    "Main navigation": "मुख्य नेव्हिगेशन", "Open menu": "मेनू उघडा", "Close menu": "मेनू बंद करा",
    "Open order": "ऑर्डर उघडा", "Close order": "ऑर्डर बंद करा", "Close product details": "उत्पादनाचे तपशील बंद करा",
    "Perfect Mens Wear | Menswear & Fabrics in Purandar": "परफेक्ट मेन्स वेअर | पुरंदरमधील पुरुषांचे कपडे आणि कापड",
    "The Collection | Perfect Mens Wear": "कलेक्शन | परफेक्ट मेन्स वेअर",
    "About & Contact | Perfect Mens Wear": "आमच्याबद्दल आणि संपर्क | परफेक्ट मेन्स वेअर",
    "Perfect Mens Wear | Purandar": "परफेक्ट मेन्स वेअर | पुरंदर",
    "A considered collection of menswear and fabrics. Visit us in Purandar or enquire on WhatsApp.": "पुरुषांचे कपडे आणि कापड यांचे निवडक कलेक्शन. पुरंदरमध्ये भेट द्या किंवा WhatsApp वर चौकशी करा.",
    "Browse shirts, ethnic wear, tailoring, trousers, and fabrics at Perfect Mens Wear.": "परफेक्ट मेन्स वेअरमध्ये शर्ट, पारंपरिक पोशाख, टेलरिंग, ट्राउझर्स आणि कापड पाहा.",
    "Get in touch with Perfect Mens Wear, your local menswear and fabric store serving Purandar since 1998.": "१९९८ पासून पुरंदरमध्ये सेवा देणाऱ्या परफेक्ट मेन्स वेअरशी संपर्क साधा.",
    "About & Contact": "आमच्याबद्दल आणि संपर्क", "The Perfect Edit": "परफेक्ट कलेक्शन",
    "Sold out": "साठा संपला", "This product is currently out of stock.": "या उत्पादनाचा सध्या साठा उपलब्ध नाही.",
    "Also save my enquiry in the store’s admin dashboard. My name, phone number, selected products, and any note I add will be shared with the store.": "माझी चौकशी दुकानाच्या अॅडमिन डॅशबोर्डमध्येही जतन करा. माझे नाव, फोन क्रमांक, निवडलेली उत्पादने आणि जोडलेली नोंद दुकानासोबत शेअर केली जाईल.",
    "PURANDAR": "पुरंदर", "Serving Purandar": "पुरंदरमध्ये सेवा",
    "Since 1998": "१९९८ पासून", "SINCE 1998": "१९९८ पासून",
    "Serving Purandar, Pune": "पुरंदर, पुणे येथे सेवा",
    "(optional)": "(ऐच्छिक)", "Perfect Mens Wear home": "परफेक्ट मेन्स वेअर मुख्यपृष्ठ",
    "Message Perfect Mens Wear on WhatsApp": "परफेक्ट मेन्स वेअरला WhatsApp वर संदेश पाठवा",
    "e.g. Rahul Pawar": "उदा. राहुल पवार", "10-digit mobile number": "१० अंकी मोबाइल क्रमांक",
    "Size, colour, or anything else we should know": "आकार, रंग किंवा इतर माहिती",
    "Your browser couldn't save this order. Keep this page open while you shop.": "तुमचा ब्राउझर ऑर्डर जतन करू शकला नाही. खरेदी करताना हे पृष्ठ उघडे ठेवा.",
    "We couldn't restore your saved order. You can start a new one from the collection.": "जतन केलेली ऑर्डर पुन्हा मिळवता आली नाही. कलेक्शनमधून नवीन ऑर्डर सुरू करा.",
    "Your wishlist could not be saved in this browser.": "या ब्राउझरमध्ये तुमची आवडती यादी जतन होऊ शकली नाही.",
    "That style could not be found. Please refresh and try again.": "हा पोशाख सापडला नाही. कृपया पृष्ठ पुन्हा लोड करून प्रयत्न करा.",
    "All available stock is already in your order.": "साठ्यातील सर्व उपलब्ध नग ऑर्डरमध्ये आहेत.",
    "added to your order.": "ऑर्डरमध्ये जोडले.",
    "Indicative sample-catalogue price. Please contact the store to confirm current price and availability.": "नमुना कॅटलॉगमधील अंदाजे किंमत. सध्याची किंमत व उपलब्धतेसाठी दुकानाशी संपर्क साधा.",
    "Please check your name and message.": "कृपया नाव आणि संदेश तपासा.",
    "WhatsApp message is ready. Tap Send in WhatsApp to share it.": "WhatsApp संदेश तयार आहे. पाठवण्यासाठी WhatsApp मध्ये Send दाबा.",
    "Your order is waiting.": "तुमची ऑर्डर तुमची वाट पाहत आहे.",
    "Browse the collection and add a style you like.": "कलेक्शन पाहा आणि आवडलेला पोशाख जोडा.",
    "Decrease quantity": "संख्या कमी करा", "Increase quantity": "संख्या वाढवा",
    "Remove from your order": "ऑर्डरमधून काढा", "No additional units are currently available.": "यापेक्षा अधिक नग सध्या उपलब्ध नाहीत.",
    "New order enquiry — Perfect Mens Wear": "नवीन ऑर्डर चौकशी — परफेक्ट मेन्स वेअर",
    "Name:": "नाव:", "Phone:": "फोन:", "Selected styles:": "निवडलेले पोशाख:",
    "Indicative total:": "अंदाजे एकूण:", "Please confirm current availability and final pricing.": "कृपया सध्याची उपलब्धता व अंतिम किंमत निश्चित करा.",
    "Note:": "नोंद:", "From the Perfect Mens Wear website": "परफेक्ट मेन्स वेअर वेबसाइटवरून",
    "Add at least one style to your order first.": "कृपया आधी ऑर्डरमध्ये किमान एक पोशाख जोडा.",
    "Please enter your name.": "कृपया तुमचे नाव लिहा.", "Please enter a valid 10-digit mobile number.": "कृपया १० अंकी वैध मोबाइल क्रमांक लिहा.",
    "Your message is ready. Tap Send in WhatsApp to share your enquiry.": "तुमचा संदेश तयार आहे. चौकशी पाठवण्यासाठी WhatsApp मध्ये Send दाबा.",
    "Hello, I’m contacting you from the Perfect Mens Wear website.": "नमस्कार, मी परफेक्ट मेन्स वेअरच्या वेबसाइटवरून संपर्क साधत आहे.",
    "I’m interested in the": "मला या उत्पादनाबद्दल माहिती हवी आहे:",
    "Please confirm current availability, sizes, and price.": "कृपया सध्याची उपलब्धता, आकार आणि किंमत कळवा.",
    "Website enquiry": "वेबसाइट चौकशी", "Contact:": "संपर्क:", "Not provided": "दिलेला नाही",
    "Message:": "संदेश:", "item": "वस्तू", "items": "वस्तू", "in your order": "तुमच्या ऑर्डरमध्ये",
    "This order message is too long. Please remove some items or shorten your note.": "ऑर्डरचा संदेश खूप मोठा आहे. कृपया काही उत्पादने काढा किंवा नोंद लहान करा.",
    "Could not load the live catalogue. Please try again later.": "लाइव्ह कॅटलॉग लोड होऊ शकला नाही. कृपया पुन्हा प्रयत्न करा.",
    "No recently viewed products yet.": "अलीकडे पाहिलेली उत्पादने नाहीत.",
    "Language preference could not be saved in this browser.": "या ब्राउझरमध्ये भाषेची पसंती जतन होऊ शकली नाही.",
    "Filter products by category": "प्रकारानुसार उत्पादने निवडा",
    "Editorial portrait of a man in classic menswear": "क्लासिक पुरुषांच्या पोशाखातील व्यक्तीचे संपादकीय छायाचित्र",
    "Selected brands": "निवडक ब्रँड", "Classic menswear detail": "क्लासिक पुरुषांच्या पोशाखाचा तपशील",
    "Menswear editorial image": "पुरुषांच्या पोशाखाचे संपादकीय छायाचित्र", "Store map": "दुकानाचा नकाशा",
    "Phone details have not been added yet": "फोनची माहिती अद्याप जोडलेली नाही",
    "Discover timeless menswear and fabrics at Perfect Mens Wear, serving Purandar since 1998.": "१९९८ पासून पुरंदरमध्ये सेवा देणाऱ्या परफेक्ट मेन्स वेअरमध्ये पुरुषांचे कपडे आणि कापड पाहा.",
    "Explore menswear and fabrics from Perfect Mens Wear in Purandar.": "पुरंदरमधील परफेक्ट मेन्स वेअरचे पुरुषांचे कपडे आणि कापड पाहा.",
    "Visit or get in touch with Perfect Mens Wear in Purandar, Maharashtra.": "पुरंदर, महाराष्ट्रातील परफेक्ट मेन्स वेअरला भेट द्या किंवा संपर्क साधा."
  };
  let language = "en";
  let wishlist = readList(wishlistStorageKey);
  let recentlyViewed = readList(recentlyViewedStorageKey);
  let searchQuery = "";
  let priceMin = "";
  let priceMax = "";
  let sortOrder = "featured";
  let cartReadFailed = false;
  let cart = readCart();
  let activeCategory = "All";
  let drawerTrigger = null;
  let productTrigger = null;
  let activeBannerData = null;

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);

  function t(value) {
    return language === "mr" ? translations[value] || value : value;
  }

  function productText(product, field) {
    const localized = language === "mr" ? product[`${field}_mr`] : "";
    return localized || t(product[field] || "");
  }

  function readList(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value.filter((id) => typeof id === "string") : [];
    } catch (error) {
      console.error(`Could not read ${key} from this browser.`, error);
      return [];
    }
  }

  function translateStaticContent() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      if (!node.parentElement?.closest("script, style, [data-no-translate]")) {
        if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue);
        const originalText = originalTextNodes.get(node) || "";
        const source = originalText.trim();
        if (source) {
          const translated = t(source);
          node.nodeValue = originalText.replace(source, translated);
        }
      }
      node = walker.nextNode();
    }
    document.querySelectorAll("[placeholder], [aria-label], [title], [alt]").forEach((element) => {
      ["placeholder", "aria-label", "title", "alt"].forEach((attribute) => {
        if (!element.hasAttribute(attribute)) return;
        const key = `original${attribute.replace(/(^|-)(\w)/g, (_, _separator, character) => character.toUpperCase())}`;
        if (element.dataset[key] === undefined) element.dataset[key] = element.getAttribute(attribute);
        element.setAttribute(attribute, t(element.dataset[key]));
      });
    });
    document.querySelectorAll('meta[name="description"], meta[property^="og:"]').forEach((element) => {
      if (element.dataset.originalContent === undefined) element.dataset.originalContent = element.content;
      element.content = t(element.dataset.originalContent);
    });
    document.documentElement.lang = language;
    if (document.title) {
      if (document.documentElement.dataset.originalTitle === undefined) document.documentElement.dataset.originalTitle = document.title;
      document.title = t(document.documentElement.dataset.originalTitle);
    }
    document.querySelectorAll("[data-language-toggle]").forEach((button) => {
      button.textContent = language === "en" ? "मराठी" : "English";
      button.setAttribute("aria-label", language === "en" ? "Switch language to Marathi" : "Switch language to English");
    });
  }

  function setLanguage(nextLanguage) {
    language = nextLanguage === "mr" ? "mr" : "en";
    const activeProductId = document.querySelector("[data-product-modal]")?.dataset.productId;
    try {
      localStorage.setItem(languageStorageKey, language);
    } catch (error) {
      console.error("Could not save your language preference.", error);
      showToast(t("Language preference could not be saved in this browser."));
    }
    translateStaticContent();
    applyActiveBanner();
    renderProducts();
    updateCart();
    if (activeProductId) openProductDetails(activeProductId);
  }

  function readCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(saved)) return [];
      return saved.filter((entry) => {
        const size = String(entry.size || "").split(" · ")[0];
        return typeof entry.id === "string" && size.length > 0 && Number.isInteger(entry.qty) && entry.qty > 0;
      });
    } catch (error) {
      console.error("Could not read the saved order.", error);
      cartReadFailed = true;
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch (error) {
      console.error("Could not save the order to this browser.", error);
      showToast(t("Your browser couldn't save this order. Keep this page open while you shop."));
    }
  }

  function renderShell() {
    const activePage = document.body.dataset.page;
    const header = document.querySelector("#site-header");
    const footer = document.querySelector("#site-footer");
    const overlays = document.querySelector("#site-overlays");
    if (!header || !footer || !overlays) return;

    header.innerHTML = `
      <a class="skip-link" href="#main-content">Skip to content</a>
      <header class="site-header">
        <div class="page-width nav-inner">
          <a class="wordmark" href="index.html" aria-label="Perfect Mens Wear home">
            <span class="wordmark-mark">PMW</span>
            <span class="wordmark-copy"><strong>PERFECT</strong><small>MENS WEAR · SINCE 1998</small></span>
          </a>
          <nav class="primary-nav" id="primary-navigation" aria-label="Main navigation">
            <a class="${activePage === "home" ? "is-active" : ""}" href="index.html">Home</a>
            <a class="${activePage === "collection" ? "is-active" : ""}" href="collection.html">Collection</a>
            <a class="${activePage === "contact" ? "is-active" : ""}" href="contact.html">About &amp; contact</a>
          </nav>
          <div class="nav-actions">
            <button class="language-pill" data-language-toggle type="button" aria-label="${language === "en" ? "Switch language to Marathi" : "Switch language to English"}">${language === "en" ? "मराठी" : "English"}</button>
            <button class="nav-order cart-open" type="button" aria-label="Open order"><span class="nav-order-label">Your order</span><span class="cart-count" data-cart-count>0</span></button>
            <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Open menu"><span></span><span></span></button>
          </div>
        </div>
      </header>`;

    footer.innerHTML = `
      <footer class="site-footer">
        <div class="page-width footer-main">
          <div class="footer-brand"><a class="wordmark wordmark-light" href="index.html"><span class="wordmark-mark">PMW</span><span class="wordmark-copy"><strong>PERFECT</strong><small>MENS WEAR · SINCE 1998</small></span></a><p>Good style, personal service.<br>Serving Purandar since 1998.</p></div>
          <div class="footer-column"><h3>Explore</h3><a href="collection.html">The collection</a><a href="contact.html">Our story</a><a href="contact.html">Get in touch</a></div>
          <div class="footer-column"><h3>Find us</h3><p data-store-address>Ta. Purandar, Dist. Pune<br>Maharashtra, India</p><a data-contact-phone href="contact.html">Phone details to be added</a><button class="footer-whatsapp whatsapp-action" type="button">Message on WhatsApp ↗</button><a data-instagram-link hidden target="_blank" rel="noopener noreferrer">Instagram ↗</a></div>
          <div class="footer-note"><span class="footer-since">EST. 1998</span><p>Thanks for choosing local.</p><span>परफेक्ट मेन्स वेअर</span></div>
        </div>
        <div class="footer-bottom"><div class="page-width"><span>© <span data-current-year></span> Perfect Mens Wear</span><span>Purandar · Maharashtra</span></div></div>
      </footer>`;

    overlays.innerHTML = `
      <div class="toast-region" aria-live="polite" aria-atomic="true"></div>
      <button class="floating-whatsapp whatsapp-action" type="button" aria-label="Message Perfect Mens Wear on WhatsApp">
        <span class="floating-whatsapp-pulse" aria-hidden="true"></span>
        <svg class="whatsapp-icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.57 20.15 9.12 19.75 7.85 19L7.55 18.82L4.43 19.64L5.26 16.6L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.05 20.15ZM16.57 14.34C16.32 14.21 15.1 13.61 14.88 13.53C14.65 13.45 14.49 13.41 14.32 13.66C14.16 13.9 13.69 14.46 13.54 14.62C13.4 14.79 13.26 14.81 13.01 14.68C12.76 14.56 11.97 14.3 11.03 13.46C10.3 12.81 9.8 12.01 9.66 11.76C9.52 11.51 9.64 11.38 9.77 11.25C9.88 11.14 10.02 10.96 10.14 10.82C10.27 10.68 10.31 10.57 10.39 10.41C10.47 10.24 10.43 10.1 10.37 9.98C10.31 9.85 9.81 8.63 9.61 8.13C9.41 7.65 9.2 7.71 9.05 7.71C8.91 7.7 8.74 7.7 8.58 7.7C8.41 7.7 8.14 7.76 7.91 8.01C7.68 8.26 7.03 8.87 7.03 10.12C7.03 11.37 7.94 12.57 8.07 12.74C8.2 12.91 9.85 15.46 12.38 16.55C12.98 16.81 13.45 16.97 13.82 17.08C14.42 17.27 14.97 17.25 15.4 17.18C15.89 17.11 16.9 16.57 17.11 15.99C17.32 15.41 17.32 14.92 17.25 14.81C17.19 14.7 17.02 14.64 16.77 14.51L16.57 14.34Z"/>
        </svg>
        <span class="floating-whatsapp-text">${t("Chat on WhatsApp")}</span>
      </button>
      <div class="drawer-backdrop" data-drawer-backdrop hidden></div>
      <aside class="order-drawer" data-order-drawer role="dialog" aria-modal="true" aria-labelledby="drawer-heading" aria-hidden="true">
        <div class="drawer-header"><div><p class="eyebrow">YOUR SELECTION</p><h2 id="drawer-heading">Your order</h2></div><button type="button" class="icon-button drawer-close" aria-label="Close order">×</button></div>
        <div class="drawer-body">
          <div class="cart-items" data-cart-items></div>
          <form class="order-form" data-order-form novalidate>
            <div class="cart-total"><span>Indicative total</span><strong data-cart-total>₹0</strong></div>
            <p class="small-note">We’ll confirm availability and final pricing with you. No online payment is taken.</p>
            <label for="customer-name">Your name</label><input id="customer-name" name="name" autocomplete="name" maxlength="80" required placeholder="e.g. Rahul Pawar">
            <label for="customer-phone">Your phone number</label><input id="customer-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="20" required placeholder="10-digit mobile number">
            <label for="customer-note">Note <span>(optional)</span></label><textarea id="customer-note" name="note" rows="3" maxlength="300" placeholder="Size, colour, or anything else we should know"></textarea>
            <label class="order-consent" data-enquiry-consent hidden><input type="checkbox" name="save-enquiry"><span>Also save my enquiry in the store’s admin dashboard. My name, phone number, selected products, and any note I add will be shared with the store.</span></label>
            <p class="form-error" data-form-error role="alert"></p>
            <button class="button button-whatsapp button-full" type="submit">Place order on WhatsApp <span aria-hidden="true">↗</span></button>
            <p class="drawer-disclaimer">WhatsApp will open with your message ready. Tap Send there to share it with the store.</p>
          </form>
        </div>
      </aside>
      <div class="product-modal-backdrop" data-product-modal hidden>
        <section class="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-heading">
          <button type="button" class="icon-button product-modal-close" aria-label="Close product details">×</button>
          <div data-product-detail></div>
        </section>
      </div>`;
    const main = document.querySelector("main");
    if (main) main.id = "main-content";
    document.querySelector("[data-current-year]").textContent = String(new Date().getFullYear());
    applyContactConfig();
  }

  function applyContactConfig() {
    const phone = String(config.phone || "").trim();
    document.querySelectorAll("[data-contact-phone]").forEach((link) => {
      if (/^[+\d\s().-]{7,25}$/.test(phone) && /\d/.test(phone)) {
        link.textContent = phone;
        link.href = `tel:${phone.replace(/[^\d+]/g, "")}`;
      } else {
        link.textContent = t("Phone details to be added");
        link.href = "contact.html";
        link.setAttribute("aria-label", t("Phone details have not been added yet"));
      }
    });
    const hours = String(config.hours || "").trim();
    document.querySelectorAll("[data-contact-hours]").forEach((element) => {
      element.textContent = hours || t("Hours to be confirmed");
    });
    const address = String(config.address || "").trim();
    if (address) {
      document.querySelectorAll("[data-store-address]").forEach((element) => { element.textContent = address; });
    }
    document.querySelectorAll("[data-map-link]").forEach((mapLink) => {
      if (/^https:\/\/(?:maps\.app\.goo\.gl\/|www\.google\.com\/maps)/i.test(String(config.mapUrl || ""))) mapLink.href = config.mapUrl;
    });
    const instagram = String(config.instagramUrl || "");
    document.querySelectorAll("[data-instagram-link]").forEach((link) => {
      if (/^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._/]+\/?$/.test(instagram)) {
        link.href = instagram;
        link.hidden = false;
      } else {
        link.hidden = true;
      }
    });
    const mapContainer = document.querySelector("[data-map-embed]");
    if (mapContainer) {
      let mapEmbedUrl = null;
      try {
        const candidate = new URL(String(config.mapEmbedUrl || ""));
        const googleEmbedHost = candidate.protocol === "https:"
          && ((candidate.hostname === "www.google.com" && candidate.pathname === "/maps/embed")
            || (candidate.hostname === "maps.google.com" && candidate.pathname === "/maps" && candidate.searchParams.get("output") === "embed"));
        if (googleEmbedHost) mapEmbedUrl = candidate.href;
      } catch (error) {
        console.error("The configured Google Maps embed URL is invalid.", error);
      }
      if (mapEmbedUrl) {
        mapContainer.innerHTML = `<iframe title="${t("Store map")}" src="${escapeHtml(mapEmbedUrl)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
      } else {
        mapContainer.replaceChildren();
      }
    }
    const storefrontImage = document.querySelector("[data-storefront-image]");
    const storefrontPlaceholder = document.querySelector("[data-storefront-placeholder]");
    const storefrontImageUrl = String(config.storefrontImageUrl || "").trim();
    if (storefrontImage && storefrontImageUrl) {
      try {
        const imageUrl = new URL(storefrontImageUrl, window.location.href);
        if (imageUrl.protocol === "https:" || imageUrl.origin === window.location.origin) {
          storefrontImage.src = imageUrl.href;
          storefrontImage.hidden = false;
          if (storefrontPlaceholder) storefrontPlaceholder.hidden = true;
        } else {
          console.error("The storefront photo must use HTTPS or a same-site URL.");
        }
      } catch (error) {
        console.error("The storefront photo URL is invalid.", error);
      }
    }
  }

  function hasSupabaseConfig() {
    return /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(String(config.supabaseUrl || ""))
      && /^[A-Za-z0-9._-]{20,}$/.test(String(config.supabaseAnonKey || ""));
  }

  async function loadRemoteStoreData() {
    if (!hasSupabaseConfig()) {
      sanitizeCart();
      updateCart();
      return;
    }
    const headers = { apikey: config.supabaseAnonKey, Authorization: `Bearer ${config.supabaseAnonKey}` };
    try {
      const [productResponse, settingsResponse, bannerResponse] = await Promise.all([
        fetch(`${config.supabaseUrl}/rest/v1/products?select=*&active=eq.true&order=created_at.desc`, { headers }),
        fetch(`${config.supabaseUrl}/rest/v1/store_settings?select=value&key=eq.store`, { headers }),
        fetch(`${config.supabaseUrl}/rest/v1/homepage_banners?select=*&active=eq.true&order=sort_order.asc&limit=1`, { headers })
      ]);
      if (!productResponse.ok) throw new Error(`Product catalogue request failed (${productResponse.status}).`);
      if (!settingsResponse.ok) throw new Error(`Store information request failed (${settingsResponse.status}).`);
      if (!bannerResponse.ok) throw new Error(`Homepage banner request failed (${bannerResponse.status}).`);
      const remoteProducts = await productResponse.json();
      const settings = await settingsResponse.json();
      const banners = await bannerResponse.json();
      if (!Array.isArray(remoteProducts)) throw new Error("The product catalogue response was invalid.");
      products = remoteProducts.map((product) => ({
        ...product,
        image: Array.isArray(product.images) ? product.images[0] || "" : product.image || "",
        sizes: Array.isArray(product.sizes) ? product.sizes : [],
        colors: Array.isArray(product.colors) ? product.colors : []
      }));
      categories = ["All", ...new Set(products.map((product) => product.category).filter(Boolean))];
      if (!categories.includes(activeCategory)) activeCategory = "All";
      sanitizeCart();
      if (settings[0] && settings[0].value && typeof settings[0].value === "object") {
        for (const key of ["phone", "hours", "address", "mapUrl", "mapEmbedUrl", "instagramUrl"]) {
          if (typeof settings[0].value[key] === "string") config[key] = settings[0].value[key];
        }
      }
      applyContactConfig();
      activeBannerData = banners[0] || null;
      applyActiveBanner();
      renderProducts();
      updateCart();
    } catch (error) {
      console.error("Could not load the live catalogue or store settings.", error);
      sanitizeCart();
      updateCart();
      showToast(t("Could not load the live catalogue. Please try again later."));
    }
  }

  function applyActiveBanner() {
    const heroImage = document.querySelector(".hero-image");
    const activeBanner = activeBannerData;
    if (!activeBanner || !heroImage || !/^https:\/\/[^\s"'<>]+$/.test(activeBanner.image_url)) return;
    heroImage.style.backgroundImage = `url("${activeBanner.image_url.replace(/["\\]/g, "")}")`;
    const bannerTitle = language === "mr" ? activeBanner.title_mr || t(activeBanner.title) : activeBanner.title;
    heroImage.setAttribute("aria-label", bannerTitle);
    const heroHeading = document.querySelector(".hero h1");
    if (heroHeading) heroHeading.textContent = bannerTitle;
    const heroLink = document.querySelector(".hero-actions a");
    if (heroLink && ["collection.html", "contact.html"].includes(activeBanner.link_url)) heroLink.href = activeBanner.link_url;
  }

  function sanitizeCart() {
    const stockRemaining = new Map();
    cart = cart.filter((entry) => {
      const product = products.find((item) => item.id === entry.id);
      const size = String(entry.size).split(" · ")[0];
      return product && product.sizes.includes(size);
    }).flatMap((entry) => {
      const product = products.find((item) => item.id === entry.id);
      if (!Number.isInteger(product.stock)) return [entry];
      const remaining = stockRemaining.has(product.id) ? stockRemaining.get(product.id) : product.stock;
      const quantity = Math.min(entry.qty, remaining);
      stockRemaining.set(product.id, remaining - quantity);
      return quantity ? [{ ...entry, qty: quantity }] : [];
    });
    saveCart();
  }

  function showOrderConsent() {
    const consent = document.querySelector("[data-enquiry-consent]");
    if (consent && hasSupabaseConfig()) consent.hidden = false;
  }

  function renderProductCard(product) {
    const sizes = (Array.isArray(product.sizes) ? product.sizes : []).map((size) => `<option value="${escapeHtml(size)}">${escapeHtml(t(size))}</option>`).join("");
    const tag = product.tag ? `<span class="product-tag">${escapeHtml(productText(product, "tag"))}</span>` : "";
    const mrp = product.mrp ? `<span class="product-mrp">${formatPrice(product.mrp)}</span>` : "";
    const colorOptions = (product.colors || []).map((color) => `<option value="${escapeHtml(color)}">${escapeHtml(t(color))}</option>`).join("");
    const isSaved = wishlist.includes(product.id);
    const outOfStock = Number.isInteger(product.stock) && product.stock < 1;
    const image = typeof product.image === "string" && /^(https:\/\/|\/|assets\/)/i.test(product.image)
      ? product.image
      : productImageFallback;
    return `
      <article class="product-card">
        <div class="product-image-wrap">
          <button type="button" class="product-image-button" data-product-details="${escapeHtml(product.id)}" aria-label="${t("View details")}: ${escapeHtml(productText(product, "name"))}"><img class="product-image" src="${escapeHtml(image)}" alt="${escapeHtml(product.brand)} ${escapeHtml(productText(product, "name"))}" loading="lazy" decoding="async"></button>
          ${tag}<button class="wishlist-button ${isSaved ? "is-saved" : ""}" type="button" data-wishlist="${escapeHtml(product.id)}" aria-pressed="${isSaved}" aria-label="${t("Wishlist")}: ${escapeHtml(productText(product, "name"))}">♡</button>
          <button class="product-add" type="button" data-add-product="${escapeHtml(product.id)}" aria-label="${t("Add to order")} ${escapeHtml(productText(product, "name"))}" ${outOfStock ? "disabled" : ""}>${outOfStock ? "×" : "+"}</button>
        </div>
        <div class="product-meta"><span>${escapeHtml(product.brand)}</span><span>${escapeHtml(productText(product, "category"))}</span></div>
        <h3>${escapeHtml(productText(product, "name"))}</h3>
        <div class="product-price"><strong>${formatPrice(product.price)}</strong>${mrp}</div>
        <button type="button" class="product-enquiry-button" data-product-enquiry="${escapeHtml(product.id)}"><svg class="btn-whatsapp-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.57 20.15 9.12 19.75 7.85 19L7.55 18.82L4.43 19.64L5.26 16.6L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.05 20.15ZM16.57 14.34C16.32 14.21 15.1 13.61 14.88 13.53C14.65 13.45 14.49 13.41 14.32 13.66C14.16 13.9 13.69 14.46 13.54 14.62C13.4 14.79 13.26 14.81 13.01 14.68C12.76 14.56 11.97 14.3 11.03 13.46C10.3 12.81 9.8 12.01 9.66 11.76C9.52 11.51 9.64 11.38 9.77 11.25C9.88 11.14 10.02 10.96 10.14 10.82C10.27 10.68 10.31 10.57 10.39 10.41C10.47 10.24 10.43 10.1 10.37 9.98C10.31 9.85 9.81 8.63 9.61 8.13C9.41 7.65 9.2 7.71 9.05 7.71C8.91 7.7 8.74 7.7 8.58 7.7C8.41 7.7 8.14 7.76 7.91 8.01C7.68 8.26 7.03 8.87 7.03 10.12C7.03 11.37 7.94 12.57 8.07 12.74C8.2 12.91 9.85 15.46 12.38 16.55C12.98 16.81 13.45 16.97 13.82 17.08C14.42 17.27 14.97 17.25 15.4 17.18C15.89 17.11 16.9 16.57 17.11 15.99C17.32 15.41 17.32 14.92 17.25 14.81C17.19 14.7 17.02 14.64 16.77 14.51L16.57 14.34Z"/></svg> <span>${t("Enquire on WhatsApp")} ↗</span></button>
        <div class="product-card-actions">
          <label class="sr-only" for="size-${escapeHtml(product.id)}">${t("Size for")} ${escapeHtml(productText(product, "name"))}</label>
          <select id="size-${escapeHtml(product.id)}" data-product-size="${escapeHtml(product.id)}" aria-label="${t("Size for")} ${escapeHtml(productText(product, "name"))}">${sizes}</select>
          ${colorOptions ? `<label class="sr-only" for="color-${escapeHtml(product.id)}">${t("Colour")} ${escapeHtml(productText(product, "name"))}</label><select id="color-${escapeHtml(product.id)}" data-product-color="${escapeHtml(product.id)}" aria-label="${t("Colour")} ${escapeHtml(productText(product, "name"))}">${colorOptions}</select>` : ""}
          <button class="add-button" type="button" data-add-product="${escapeHtml(product.id)}" ${outOfStock ? "disabled" : ""}>${outOfStock ? t("Sold out") : t("Add to order")} <span aria-hidden="true">${outOfStock ? "" : "+"}</span></button>
        </div>
        <button type="button" class="product-details-link" data-product-details="${escapeHtml(product.id)}">${t("View details")} ↗</button>
      </article>`;
  }

  function renderProducts() {
    const collection = document.querySelector("[data-category-filters]");
    if (collection && !document.querySelector("[data-catalog-controls]")) {
      collection.insertAdjacentHTML("beforebegin", `<div class="catalog-controls" data-catalog-controls>
        <label><span class="sr-only">${t("Search products")}</span><input type="search" data-product-search placeholder="${t("Search products")}" autocomplete="off"></label>
        <label><span class="sr-only">${t("Min price")}</span><input type="number" min="0" inputmode="numeric" data-price-min placeholder="${t("Min price")}"></label>
        <label><span class="sr-only">${t("Max price")}</span><input type="number" min="0" inputmode="numeric" data-price-max placeholder="${t("Max price")}"></label>
        <label><span class="sr-only">${t("Sort products")}</span><select data-product-sort aria-label="${t("Sort products")}"><option value="featured">${t("Bestsellers")}</option><option value="new">${t("New arrivals")}</option><option value="low">${t("Price: low to high")}</option><option value="high">${t("Price: high to low")}</option><option value="name">${t("Name: A to Z")}</option></select></label>
        <button type="button" class="filter-chip" data-show-wishlist>${t("Wishlist")} (<span data-wishlist-count>${wishlist.length}</span>)</button>
      </div>`);
      collection.insertAdjacentHTML("afterend", `<p class="catalog-result-count" data-result-count aria-live="polite"></p>`);
      document.querySelector("[data-product-search]")?.addEventListener("input", (event) => {
        searchQuery = event.target.value.trim().toLocaleLowerCase();
        renderProducts();
        const field = document.querySelector("[data-product-search]");
        field.focus();
        field.setSelectionRange(field.value.length, field.value.length);
      });
      document.querySelector("[data-price-min]")?.addEventListener("change", (event) => { priceMin = event.target.value; renderProducts(); });
      document.querySelector("[data-price-max]")?.addEventListener("change", (event) => { priceMax = event.target.value; renderProducts(); });
      document.querySelector("[data-product-sort]")?.addEventListener("change", (event) => { sortOrder = event.target.value; renderProducts(); });
    } else if (collection) {
      const controls = document.querySelector("[data-catalog-controls]");
      if (controls) controls.innerHTML = `
        <label><span class="sr-only">${t("Search products")}</span><input type="search" data-product-search placeholder="${t("Search products")}" value="${escapeHtml(searchQuery)}" autocomplete="off"></label>
        <label><span class="sr-only">${t("Min price")}</span><input type="number" min="0" inputmode="numeric" data-price-min placeholder="${t("Min price")}" value="${escapeHtml(priceMin)}"></label>
        <label><span class="sr-only">${t("Max price")}</span><input type="number" min="0" inputmode="numeric" data-price-max placeholder="${t("Max price")}" value="${escapeHtml(priceMax)}"></label>
        <label><span class="sr-only">${t("Sort products")}</span><select data-product-sort aria-label="${t("Sort products")}"><option value="featured">${t("Bestsellers")}</option><option value="new">${t("New arrivals")}</option><option value="low">${t("Price: low to high")}</option><option value="high">${t("Price: high to low")}</option><option value="name">${t("Name: A to Z")}</option></select></label>
        <button type="button" class="filter-chip" data-show-wishlist>${t("Wishlist")} (<span data-wishlist-count>${wishlist.length}</span>)</button>`;
      const sortSelect = document.querySelector("[data-product-sort]");
      if (sortSelect) sortSelect.value = sortOrder;
      document.querySelector("[data-product-search]")?.addEventListener("input", (event) => { searchQuery = event.target.value.trim().toLocaleLowerCase(); renderProducts(); const field = document.querySelector("[data-product-search]"); field.focus(); field.setSelectionRange(field.value.length, field.value.length); });
      document.querySelector("[data-price-min]")?.addEventListener("change", (event) => { priceMin = event.target.value; renderProducts(); });
      document.querySelector("[data-price-max]")?.addEventListener("change", (event) => { priceMax = event.target.value; renderProducts(); });
      document.querySelector("[data-product-sort]")?.addEventListener("change", (event) => { sortOrder = event.target.value; renderProducts(); });
    }

    document.querySelectorAll("[data-product-list]").forEach((list) => {
      const type = list.dataset.productList;
      const limit = Number(list.dataset.limit || 4);
      let visible = [...products];
      if (type === "featured" || type === "bestsellers") {
        visible.sort((a, b) => Number(Boolean(b.bestseller)) - Number(Boolean(a.bestseller)));
        if (type === "bestsellers") visible = visible.filter((item) => item.bestseller);
        visible = visible.slice(0, limit);
      } else if (type === "new-arrivals") {
        visible = visible.filter((item) => item.new_arrival);
        visible.sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
        visible = visible.slice(0, limit);
      }
      if (type === "all" && activeCategory !== "All") visible = visible.filter((item) => item.category === activeCategory);
      if (type === "all") {
        if (searchQuery) visible = visible.filter((item) => `${item.name} ${item.name_mr || ""} ${t(item.name)} ${item.brand} ${item.category} ${item.category_mr || ""} ${t(item.category)} ${item.tag || ""} ${item.tag_mr || ""}`.toLocaleLowerCase().includes(searchQuery));
        if (priceMin !== "") visible = visible.filter((item) => item.price >= Number(priceMin));
        if (priceMax !== "") visible = visible.filter((item) => item.price <= Number(priceMax));
        if (showingWishlist) visible = visible.filter((item) => wishlist.includes(item.id));
        if (sortOrder === "low") visible.sort((a, b) => a.price - b.price);
        if (sortOrder === "high") visible.sort((a, b) => b.price - a.price);
        if (sortOrder === "name") visible.sort((a, b) => a.name.localeCompare(b.name));
        if (sortOrder === "new") visible.sort((a, b) => Number(Boolean(b.new_arrival)) - Number(Boolean(a.new_arrival)) || String(b.created_at || "").localeCompare(String(a.created_at || "")));
      }
      list.innerHTML = visible.map(renderProductCard).join("");
      if (!visible.length) {
        const emptyMessage = {
          featured: "No styles in this category just yet. Please check back soon.",
          "new-arrivals": "New arrivals will appear here soon.",
          bestsellers: "Bestsellers will appear here soon."
        }[type] || "No products match your filters.";
        list.innerHTML = `<p class="empty-products">${t(emptyMessage)}</p>`;
      }
      const count = document.querySelector("[data-result-count]");
      if (count && type === "all") count.textContent = `${visible.length} / ${products.length}`;
    });

    const filterContainer = document.querySelector("[data-category-filters]");
    if (filterContainer) {
      filterContainer.innerHTML = categories.map((category) => `
        <button type="button" class="filter-chip ${category === activeCategory ? "is-active" : ""}" data-filter-category="${escapeHtml(category)}" aria-pressed="${category === activeCategory}">
          ${escapeHtml(t(category))}
        </button>`).join("");
    }
    const wishlistFilter = document.querySelector("[data-show-wishlist]");
    if (wishlistFilter) wishlistFilter.classList.toggle("is-active", showingWishlist);
    const recentContainer = document.querySelector("[data-recent-products]");
    if (recentContainer) {
      const recentProducts = recentlyViewed.map((id) => products.find((item) => item.id === id)).filter(Boolean);
      recentContainer.innerHTML = recentProducts.map(renderProductCard).join("") || `<p class="small-note">${t("No recently viewed products yet.")}</p>`;
    }
    document.querySelectorAll("[data-wishlist-count]").forEach((element) => { element.textContent = String(wishlist.length); });
  }

  let showingWishlist = false;

  function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
  }

  function addProduct(productId, source) {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      showToast(t("That style could not be found. Please refresh and try again."));
      return;
    }
    const sizeSelect = document.querySelector(`[data-product-size="${CSS.escape(productId)}"]`);
    const detailSize = source?.closest("[data-product-modal]")?.querySelector("#detail-size");
    if (Number.isInteger(product.stock) && product.stock < 1) {
      showToast(t("This product is currently out of stock."));
      return;
    }
    const size = detailSize ? detailSize.value : (sizeSelect ? sizeSelect.value : product.sizes[0]);
    const colorSelect = document.querySelector(`[data-product-color="${CSS.escape(productId)}"]`);
    const detailColor = source?.closest("[data-product-modal]")?.querySelector("#detail-color");
    const color = detailColor ? detailColor.value : (colorSelect ? colorSelect.value : (product.colors || [])[0] || "");
    const cartSize = color ? `${size} · ${color}` : size;
    const existing = cart.find((entry) => entry.id === productId && entry.size === cartSize);
    const productQuantity = cart.reduce((total, entry) => total + (entry.id === productId ? entry.qty : 0), 0);
    if (Number.isInteger(product.stock) && productQuantity >= product.stock) {
      showToast(t("All available stock is already in your order."));
      return;
    }
    if (existing) existing.qty += 1;
    else cart.push({ id: productId, size: cartSize, qty: 1 });
    saveCart();
    updateCart();
    showToast(`${productText(product, "name")} ${t("added to your order.")}`);
  }

  function productWhatsApp(product) {
    const number = String(config.ownerWhatsApp || "");
    if (!/^\d{10,15}$/.test(number)) {
      showToast(t("The store’s WhatsApp number hasn’t been set up yet. Please contact the store directly."));
      return;
    }
    const message = `${t("I’m interested in the")} ${product.brand} ${productText(product, "name")}. ${t("Please confirm current availability, sizes, and price.")}`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  function openProductDetails(productId) {
    const product = products.find((item) => item.id === productId);
    const modal = document.querySelector("[data-product-modal]");
    const content = document.querySelector("[data-product-detail]");
    if (!product || !modal || !content) return;
    recentlyViewed = [product.id, ...recentlyViewed.filter((id) => id !== product.id)].slice(0, 6);
    try {
      localStorage.setItem(recentlyViewedStorageKey, JSON.stringify(recentlyViewed));
    } catch (error) {
      console.error("Could not save recently viewed products.", error);
    }
    const photos = Array.isArray(product.images) && product.images.length ? product.images : [product.image];
    const colorOptions = (product.colors || []).map((color) => `<option value="${escapeHtml(color)}">${escapeHtml(t(color))}</option>`).join("");
    const sizeOptions = (Array.isArray(product.sizes) ? product.sizes : []).map((size) => `<option value="${escapeHtml(size)}">${escapeHtml(t(size))}</option>`).join("");
    content.innerHTML = `<div class="product-detail-layout">
      <div class="product-detail-gallery"><img data-gallery-image src="${escapeHtml(photos[0])}" alt="${escapeHtml(product.brand)} ${escapeHtml(productText(product, "name"))}" loading="lazy" decoding="async">
        ${photos.length > 1 ? `<button type="button" class="gallery-prev" data-gallery-step="-1" aria-label="Previous image">‹</button><button type="button" class="gallery-next" data-gallery-step="1" aria-label="Next image">›</button><span data-gallery-position>1 / ${photos.length}</span>` : ""}
      </div>
      <div class="product-detail-copy"><p class="eyebrow">${escapeHtml(product.brand)} · ${escapeHtml(productText(product, "category"))}</p><h2 id="product-modal-heading">${escapeHtml(productText(product, "name"))}</h2><p class="product-detail-price">${formatPrice(product.price)}${product.mrp ? ` <span class="product-mrp">${formatPrice(product.mrp)}</span>` : ""}</p>
        <p>${t("Indicative sample-catalogue price. Please contact the store to confirm current price and availability.")}</p>
        <label for="detail-size">${t("Size")}</label><select id="detail-size">${sizeOptions}</select>
        ${colorOptions ? `<label for="detail-color">${t("Colour")}</label><select id="detail-color">${colorOptions}</select>` : ""}
        <button type="button" class="button button-brown button-full" data-add-product="${escapeHtml(product.id)}" ${Number.isInteger(product.stock) && product.stock < 1 ? "disabled" : ""}>${Number.isInteger(product.stock) && product.stock < 1 ? t("Sold out") : `${t("Add to order")} +`}</button>
        <button type="button" class="button button-whatsapp button-full" data-product-enquiry="${escapeHtml(product.id)}">${t("Enquire on WhatsApp")} ↗</button>
      </div></div>`;
    modal.hidden = false;
    productTrigger = document.activeElement;
    modal.dataset.productId = product.id;
    modal.dataset.galleryIndex = "0";
    document.body.classList.add("modal-is-open");
    modal.querySelector(".product-modal-close").focus();
    renderProducts();
  }

  function closeProductDetails() {
    const modal = document.querySelector("[data-product-modal]");
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-is-open");
    if (productTrigger instanceof HTMLElement) productTrigger.focus();
    productTrigger = null;
  }

  function sendContactEnquiry(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const messageOutput = form.querySelector("[data-contact-form-error]");
    const name = String(new FormData(form).get("name") || "").trim();
    const contact = String(new FormData(form).get("contact") || "").trim();
    const message = String(new FormData(form).get("message") || "").trim();
    if (name.length < 2 || message.length < 5) {
      messageOutput.textContent = t("Please check your name and message.");
      return;
    }
    const number = String(config.ownerWhatsApp || "");
    if (!/^\d{10,15}$/.test(number)) {
      messageOutput.textContent = t("The store’s WhatsApp number hasn’t been set up yet. Please contact the store directly.");
      return;
    }
    const inquiry = `${t("Website enquiry")}\n${t("Name:")} ${name}\n${t("Contact:")} ${contact || t("Not provided")}\n${t("Message:")} ${message}`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(inquiry)}`, "_blank", "noopener,noreferrer");
    messageOutput.textContent = t("WhatsApp message is ready. Tap Send in WhatsApp to share it.");
    form.reset();
  }

  function updateCart() {
    const count = cart.reduce((total, entry) => total + entry.qty, 0);
    document.querySelectorAll("[data-cart-count]").forEach((element) => {
      element.textContent = String(count);
      element.setAttribute("aria-label", `${count} ${t(count === 1 ? "item" : "items")} ${t("in your order")}`);
    });
    const items = document.querySelector("[data-cart-items]");
    const total = document.querySelector("[data-cart-total]");
    if (!items || !total) return;

    const cartTotal = cart.reduce((sum, entry) => {
      const product = products.find((item) => item.id === entry.id);
      return sum + (product ? product.price * entry.qty : 0);
    }, 0);
    total.textContent = formatPrice(cartTotal);
    if (!cart.length) {
      items.innerHTML = `<div class="empty-cart"><span class="empty-cart-icon">＋</span><h3>${t("Your order is waiting.")}</h3><p>${t("Browse the collection and add a style you like.")}</p><button class="text-link cart-browse" type="button">${t("Browse collection")} <span aria-hidden="true">↗</span></button></div>`;
      return;
    }
    items.innerHTML = cart.map((entry) => {
      const product = products.find((item) => item.id === entry.id);
      if (!product) return "";
      return `<article class="cart-item">
        <img src="${escapeHtml(product.image)}" alt="" loading="lazy">
        <div class="cart-item-info"><span>${escapeHtml(product.brand)}</span><h3>${escapeHtml(productText(product, "name"))}</h3><p>${t("Size:")} ${escapeHtml(entry.size)} · ${formatPrice(product.price)}</p><div class="quantity-control"><button type="button" data-quantity-step="-1" data-id="${escapeHtml(entry.id)}" data-size="${escapeHtml(entry.size)}" aria-label="${t("Decrease quantity")} ${escapeHtml(productText(product, "name"))}">−</button><span>${entry.qty}</span><button type="button" data-quantity-step="1" data-id="${escapeHtml(entry.id)}" data-size="${escapeHtml(entry.size)}" aria-label="${t("Increase quantity")} ${escapeHtml(productText(product, "name"))}">+</button></div></div>
        <button type="button" class="remove-item" data-remove-item="${escapeHtml(entry.id)}" data-size="${escapeHtml(entry.size)}" aria-label="${t("Remove from your order")} ${escapeHtml(productText(product, "name"))}">×</button>
      </article>`;
    }).join("");
  }

  function updateQuantity(productId, size, step) {
    const entry = cart.find((item) => item.id === productId && item.size === size);
    if (!entry) return;
    const product = products.find((item) => item.id === productId);
    const productQuantity = cart.reduce((total, item) => total + (item.id === productId ? item.qty : 0), 0);
    if (step > 0 && Number.isInteger(product?.stock) && productQuantity >= product.stock) {
      showToast(t("No additional units are currently available."));
      return;
    }
    entry.qty += step;
    if (entry.qty <= 0) cart = cart.filter((item) => item !== entry);
    saveCart();
    updateCart();
  }

  function showToast(message) {
    const region = document.querySelector(".toast-region");
    if (!region) return;
    region.textContent = message;
    region.classList.add("is-visible");
    clearTimeout(showToast.timeoutId);
    showToast.timeoutId = setTimeout(() => region.classList.remove("is-visible"), 3600);
  }

  function setDrawerOpen(open) {
    const drawer = document.querySelector("[data-order-drawer]");
    const backdrop = document.querySelector("[data-drawer-backdrop]");
    if (!drawer || !backdrop) return;
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    backdrop.hidden = !open;
    document.body.classList.toggle("drawer-is-open", open);
    if (open) {
      drawerTrigger = document.activeElement;
      updateCart();
      drawer.querySelector(".drawer-close").focus();
    } else if (drawerTrigger instanceof HTMLElement) {
      drawerTrigger.focus();
      drawerTrigger = null;
    }
  }

  function buildOrderMessage(customer) {
    const total = cart.reduce((sum, entry) => {
      const product = products.find((item) => item.id === entry.id);
      return sum + product.price * entry.qty;
    }, 0);
    const message = [
      `*${t("New order enquiry — Perfect Mens Wear")}*`,
      "",
      `${t("Name:")} ${customer.name}`,
      `${t("Phone:")} ${customer.phone}`,
      "",
      `*${t("Selected styles:")}*`,
      ...cart.map((entry, index) => {
        const product = products.find((item) => item.id === entry.id);
        return `${index + 1}. ${productText(product, "name")} (${product.brand}), ${t("Size:")} ${entry.size} x ${entry.qty} = ${formatPrice(product.price * entry.qty)}`;
      }),
      "",
      `${t("Indicative total:")} ${formatPrice(total)}`,
      t("Please confirm current availability and final pricing."),
      customer.note ? `${t("Note:")} ${customer.note}` : "",
      "",
      t("From the Perfect Mens Wear website")
    ].filter(Boolean).join("\n");
    if (message.length > 1500) throw new Error(t("This order message is too long. Please remove some items or shorten your note."));
    return message;
  }

  async function saveOrderEnquiry(customer) {
    const total = cart.reduce((sum, entry) => {
      const product = products.find((item) => item.id === entry.id);
      return sum + product.price * entry.qty;
    }, 0);
    const selectedItems = cart.map((entry) => {
      const product = products.find((item) => item.id === entry.id);
      return { product_id: product.id, name: product.name, brand: product.brand, size: entry.size, quantity: entry.qty, unit_price: product.price };
    });
    const response = await fetch(`${config.supabaseUrl}/rest/v1/order_enquiries`, {
      method: "POST",
      headers: {
        apikey: config.supabaseAnonKey,
        Authorization: `Bearer ${config.supabaseAnonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        customer_name: customer.name,
        customer_contact: customer.phone,
        message: buildOrderMessage(customer),
        selected_items: selectedItems,
        expected_total: total,
        status: "new"
      })
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Could not save your enquiry to the store (${response.status}): ${errorText.slice(0, 250)}`);
    }
  }

  async function submitOrder(event) {
    event.preventDefault();
    const errorElement = document.querySelector("[data-form-error]");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const note = String(formData.get("note") || "").trim();
    const phoneDigits = phone.replace(/\D/g, "");
    let error = "";

    if (!cart.length) error = t("Add at least one style to your order first.");
    else if (name.length < 2) error = t("Please enter your name.");
    else if (phoneDigits.length !== 10) error = t("Please enter a valid 10-digit mobile number.");
    else if (!/^\d{10,15}$/.test(String(config.ownerWhatsApp || ""))) error = t("The store’s WhatsApp number hasn’t been set up yet. Please contact the store directly.");

    if (error) {
      errorElement.textContent = error;
      if (!cart.length) showToast(error);
      return;
    }

    let whatsappWindow = null;
    try {
      const message = encodeURIComponent(buildOrderMessage({ name, phone, note }));
      const url = `https://wa.me/${config.ownerWhatsApp}?text=${message}`;
      if (formData.get("save-enquiry")) {
        whatsappWindow = window.open("about:blank", "_blank");
        await saveOrderEnquiry({ name, phone, note });
      }
      if (whatsappWindow && !whatsappWindow.closed) {
        whatsappWindow.location.href = url;
      } else {
        const opened = window.open(url, "_blank", "noopener,noreferrer");
        if (!opened) window.location.href = url;
      }
      errorElement.textContent = "";
      showToast(t("Your message is ready. Tap Send in WhatsApp to share your enquiry."));
    } catch (exception) {
      if (whatsappWindow && !whatsappWindow.closed) whatsappWindow.close();
      console.error("Could not complete the order enquiry.", exception);
      errorElement.textContent = exception.message;
    }
  }

  function handleClick(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const addButton = target.closest("[data-add-product]");
    if (addButton) {
      addProduct(addButton.dataset.addProduct, addButton);
      return;
    }
    const details = target.closest("[data-product-details]");
    if (details) {
      openProductDetails(details.dataset.productDetails);
      return;
    }
    const productEnquiry = target.closest("[data-product-enquiry]");
    if (productEnquiry) {
      const product = products.find((item) => item.id === productEnquiry.dataset.productEnquiry);
      if (product) productWhatsApp(product);
      return;
    }
    const wishlistButton = target.closest("[data-wishlist]");
    if (wishlistButton) {
      const id = wishlistButton.dataset.wishlist;
      wishlist = wishlist.includes(id) ? wishlist.filter((item) => item !== id) : [id, ...wishlist];
      try {
        localStorage.setItem(wishlistStorageKey, JSON.stringify(wishlist));
      } catch (error) {
        console.error("Could not save your wishlist.", error);
        showToast(t("Your wishlist could not be saved in this browser."));
      }
      renderProducts();
      return;
    }
    if (target.closest("[data-show-wishlist]")) {
      showingWishlist = !showingWishlist;
      const button = document.querySelector("[data-show-wishlist]");
      if (button) button.classList.toggle("is-active", showingWishlist);
      renderProducts();
      return;
    }
    if (target.closest(".product-modal-close") || (target.matches("[data-product-modal]"))) {
      closeProductDetails();
      return;
    }
    const galleryStep = target.closest("[data-gallery-step]");
    if (galleryStep) {
      const modal = document.querySelector("[data-product-modal]");
      const product = products.find((item) => item.id === modal?.dataset.productId);
      const images = product && Array.isArray(product.images) && product.images.length ? product.images : product ? [product.image] : [];
      if (modal && images.length > 1) {
        const index = (Number(modal.dataset.galleryIndex) + Number(galleryStep.dataset.galleryStep) + images.length) % images.length;
        modal.dataset.galleryIndex = String(index);
        modal.querySelector("[data-gallery-image]").src = images[index];
        modal.querySelector("[data-gallery-position]").textContent = `${index + 1} / ${images.length}`;
      }
      return;
    }
    if (target.closest("[data-language-toggle]")) {
      setLanguage(language === "en" ? "mr" : "en");
      return;
    }
    const filter = target.closest("[data-filter-category]");
    if (filter) {
      activeCategory = filter.dataset.filterCategory;
      renderProducts();
      return;
    }
    const quantity = target.closest("[data-quantity-step]");
    if (quantity) {
      updateQuantity(quantity.dataset.id, quantity.dataset.size, Number(quantity.dataset.quantityStep));
      return;
    }
    const remove = target.closest("[data-remove-item]");
    if (remove) {
      cart = cart.filter((entry) => entry.id !== remove.dataset.removeItem || entry.size !== remove.dataset.size);
      saveCart();
      updateCart();
      return;
    }
    if (target.closest(".cart-open")) {
      setDrawerOpen(true);
      return;
    }
    if (target.closest(".drawer-close") || target.matches("[data-drawer-backdrop]")) {
      setDrawerOpen(false);
      return;
    }
    if (target.closest(".cart-browse")) {
      setDrawerOpen(false);
      window.location.href = "collection.html";
      return;
    }
    if (target.closest(".whatsapp-action")) {
      const number = String(config.ownerWhatsApp || "");
      if (!/^\d{10,15}$/.test(number)) {
        showToast(t("The store’s WhatsApp number hasn’t been set up yet. Please contact the store directly."));
        return;
      }
      const text = encodeURIComponent(t("Hello, I’m contacting you from the Perfect Mens Wear website."));
      window.open(`https://wa.me/${number}?text=${text}`, "_blank", "noopener,noreferrer");
    }
  }

  function setupNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const navigation = document.querySelector(".primary-nav");
    if (!toggle || !navigation) return;

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      toggle.setAttribute("aria-label", expanded ? "Open menu" : "Close menu");
      navigation.classList.toggle("is-open", !expanded);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement || event.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        navigation.classList.remove("is-open");
      }
    });

    document.addEventListener("click", (event) => {
      if (!navigation.contains(event.target) && !toggle.contains(event.target)) {
        if (navigation.classList.contains("is-open")) {
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Open menu");
          navigation.classList.remove("is-open");
        }
      }
    });
  }

  function init() {
    try {
      language = localStorage.getItem(languageStorageKey) === "mr" ? "mr" : "en";
    } catch (error) {
      console.error("Could not restore the language preference.", error);
    }
    renderShell();
    showOrderConsent();
    renderProducts();
    updateCart();
    setupNavigation();
    translateStaticContent();
    if (cartReadFailed) showToast(t("We couldn't restore your saved order. You can start a new one from the collection."));
    document.addEventListener("click", handleClick);
    document.querySelector("[data-order-form]")?.addEventListener("submit", submitOrder);
    document.querySelector("[data-contact-form]")?.addEventListener("submit", sendContactEnquiry);
    document.addEventListener("keydown", (event) => {
      const drawer = document.querySelector("[data-order-drawer]");
      if (!drawer?.classList.contains("is-open")) return;
      if (event.key === "Escape") {
        setDrawerOpen(false);
        return;
      }
      if (event.key === "Tab") {
        const focusable = [...drawer.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]')];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    });
    const initialCategory = new URLSearchParams(window.location.search).get("category");
    const initialSort = new URLSearchParams(window.location.search).get("sort");
    if (["featured", "new", "low", "high", "name"].includes(initialSort)) {
      sortOrder = initialSort;
      const sortSelect = document.querySelector("[data-product-sort]");
      if (sortSelect) sortSelect.value = initialSort;
    }
    if (initialCategory && categories.includes(initialCategory)) {
      activeCategory = initialCategory;
      renderProducts();
    } else if (initialSort) {
      renderProducts();
    }
    document.addEventListener("error", (event) => {
      if (!(event.target instanceof HTMLImageElement)) return;
      const image = event.target;
      if (image.hasAttribute("data-storefront-image")) {
        console.error("Could not load the configured storefront photo.");
        image.hidden = true;
        const placeholder = document.querySelector("[data-storefront-placeholder]");
        if (placeholder) placeholder.hidden = false;
        return;
      }
      if (!image.classList.contains("product-image") && !image.hasAttribute("data-gallery-image")) return;
      if (image.dataset.fallbackApplied === "true") {
        image.classList.add("image-unavailable");
        return;
      }
      image.dataset.fallbackApplied = "true";
      image.src = productImageFallback;
    }, true);
    document.addEventListener("keydown", (event) => {
      const modal = document.querySelector("[data-product-modal]");
      if (!modal || modal.hidden) return;
      if (event.key === "Escape") {
        closeProductDetails();
        return;
      }
      if (event.key === "Tab") {
        const focusable = [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]')];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    });
    loadRemoteStoreData();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
