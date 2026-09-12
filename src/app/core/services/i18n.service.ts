import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type SupportedLanguage = 'en' | 'fi';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLanguageSubject = new BehaviorSubject<SupportedLanguage>('fi');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();
  
  private readonly LANGUAGE_STORAGE_KEY = 'restaurant_language';
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedLanguage = localStorage.getItem(this.LANGUAGE_STORAGE_KEY) as SupportedLanguage;
      if (savedLanguage && this.isSupportedLanguage(savedLanguage)) {
        this.setLanguage(savedLanguage);
      } else {
        // Try to detect from browser
        const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
        this.setLanguage(this.isSupportedLanguage(browserLang) ? browserLang : 'fi');
      }
    }
  }

  public setLanguage(language: SupportedLanguage): void {
    if (this.isSupportedLanguage(language)) {
      this.currentLanguageSubject.next(language);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.LANGUAGE_STORAGE_KEY, language);
      }
    }
  }

  public getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguageSubject.value;
  }

  public toggleLanguage(): void {
    const current = this.getCurrentLanguage();
    this.setLanguage(current === 'en' ? 'fi' : 'en');
  }

  public getLocalizedContent(content: { en: string; fi: string } | string | undefined): string {
    if (!content) return '';
    if (typeof content === 'string') return content;
    
    const currentLang = this.getCurrentLanguage();
    return content[currentLang] || content.fi || content.en || '';
  }

  public formatPrice(amount: number, currency: string = 'EUR'): string {
    const locale = this.getCurrentLanguage() === 'fi' ? 'fi-FI' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  public formatDate(date: Date): string {
    const locale = this.getCurrentLanguage() === 'fi' ? 'fi-FI' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  public formatTime(time: string): string {
    // time is in HH:mm format
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    const locale = this.getCurrentLanguage() === 'fi' ? 'fi-FI' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  }

  private isSupportedLanguage(language: string): language is SupportedLanguage {
    return ['en', 'fi'].includes(language);
  }

  // Translations for common UI elements
  public translate(key: string): string {
    const translations: Record<SupportedLanguage, Record<string, string>> = {
      en: {
        'serving_options': 'Serving & meal options',
        "ingredients": "Ingredients & options",
        "all_dishes": "All dishes",
        "allergy_short": "Allergies or special requests? Tell us before ordering.",
        "next_photo": "Next photo",
        "photo_unavailable": "Photo unavailable",
        "choose_delivery": "Choose your delivery partner",
        "delivery_note": "Continue on the delivery partner’s website to choose options and place your order.",
        "close": "Close",
        "directions": "Directions",
        "call": "Call",
        "today": "Today",
        "hours_details": "Opening hours",
        "photo_details": "More photos",
        "phone_invalid": "Enter a local or international phone number, e.g. 040 123 4567 or +358 40 123 4567.",
        "cookie_description": "We use optional analytics cookies to understand visits and improve the site. You can accept or decline.",
        "Why Choose Spice Döner?": "Why Choose Spice Döner?",
        "pita_meat_short": "Meat pitas & wraps",
        "pita_veg_short": "Veggie pitas & wraps",
        "mezze_bowls_short": "Mezze bowls",
        "doner_bowls_short": "Döner bowls",
        "children_short": "Kids",
        "sides_short": "Sides",
        "beverages_short": "Drinks",
        "dips_short": "Dips",
        "dish": "Dish",
        "open_menu": "Open navigation",
        "close_menu": "Close navigation",
        "rights_reserved": "All rights reserved.",
        "view_dish": "View dish",
        "monday": "Monday",
        "tuesday": "Tuesday",
        "wednesday": "Wednesday",
        "thursday": "Thursday",
        "friday": "Friday",
        "saturday_day": "Saturday",
        "sunday_day": "Sunday",
        "meal_upgrade": "Meal includes fries and Coke.",
        'menu': 'Menu',
        'about': 'About',
        'contact': 'Contact',
        'order_now': 'Order Now',
        'order_on_wolt': 'Order on Wolt',
        'order_on_bolt': 'Order on Bolt Food',
        'order_on_uber_eats': 'Order on Uber Eats',
        'view_menu': 'View Menu',
        'home': 'Home',
        'categories': 'Categories',
        'all_categories': 'All Categories',
        'search_menu': 'Search menu...',
        'dietary_filters': 'Dietary Filters',
        'allergen_filters': 'Allergen Filters',
        'vegan': 'Vegan',
        'vegetarian': 'Vegetarian',
        'halal': 'Halal',
        'gluten_free': 'Gluten Free',
        'dairy_free': 'Dairy Free',
        'lactose_free': 'Lactose Free',
        'keto': 'Keto',
        'spicy': 'Spicy',
        'Fresh Daily': 'Fresh Daily',
        'Vegan': 'Vegan',
        'Vegetarian': 'Vegetarian',
        'Gluten Free': 'Gluten Free',
        'Lactose Free': 'Lactose Free',
        'Halal': 'Halal',
        'All ingredients are sourced fresh and prepared daily in our kitchen.': 'All ingredients are sourced fresh and prepared daily in our kitchen.',
        'Delicious plant-based options perfect for vegan diets.': 'Delicious plant-based options perfect for vegan diets.',
        'Wide selection of vegetarian dishes for every taste.': 'Wide selection of vegetarian dishes for every taste.',
        'Many gluten-free options available for dietary restrictions.': 'Many gluten-free options available for dietary restrictions.',
        '(G) = Available gluten-free on request. Pitas, mezze plates and bowls can be made gluten-free, except wraps.': '(G) = Available gluten-free on request. Pitas, mezze plates and bowls can be made gluten-free, except wraps.',
        'allergy_care_note': 'We take every customer\'s allergies and custom requests very seriously. Please tell our team before ordering so we can handle your request with care.',
        'Dairy-free alternatives for lactose intolerant guests.': 'Dairy-free alternatives for lactose intolerant guests.',
        'All our meat is halal-certified following Islamic dietary laws.': 'All our meat is halal-certified following Islamic dietary laws.',
        'Current Specials': 'Current Specials',
        'Limited time offers': 'Limited time offers',
        'Ready to order?': 'Ready to order?',
        'Choose from our delivery partners': 'Choose from our delivery partners',
        'Find Us': 'Find Us',
        'Visit our restaurant in Helsinki': 'Visit our restaurant in Helsinki',
        'Location': 'Location',
        'Opening Hours': 'Opening Hours',
        'Monday - Friday': 'Monday - Friday',
        'Saturday': 'Saturday',
        'Sunday': 'Sunday',
        'Contact': 'Contact',
        'Phone': 'Phone',
        'Email': 'Email',
        'L = Lactose Free | G = Gluten Free | K = Vegetarian | V = Vegan | H = Halal': 'L = Lactose Free | G = Gluten Free | K = Vegetarian | V = Vegan | H = Halal',
        'Why Choose Bengal Ruokopaikka?': 'Why Choose Spice Döner?',
        'Fresh ingredients, authentic flavors, healthy options': 'Fresh ingredients, authentic flavors, healthy options',
        'opening_hours': 'Opening Hours',
        'closed': 'Closed',
        'open': 'Open',
        'opens_at': 'Opens at',
        'closes_at': 'Closes at',
        'phone': 'Phone',
        'email': 'Email',
        'address': 'Address',
        'last_updated': 'Last updated',
        'meal': 'Meal',
        'loading': 'Loading',
        'error_loading_menu': 'Error loading menu',
        'retry': 'Retry',
        'from': 'from',
        'unavailable': 'Unavailable',
        'add_to_order': 'Add to Order',
        'options': 'Options',
        'select_options': 'Select Options',
        'required': 'Required',
        'optional': 'Optional',
        'privacy_policy': 'Privacy Policy',
        'contact_privacy_notice': 'We use the information you submit to respond to your enquiry. See our',
        'terms_of_service': 'Terms of Service',
        'cookie_consent': 'This website uses cookies to improve your experience.',
        'accept_cookies': 'Accept',
        'decline_cookies': 'Decline',
        'catering': 'Catering',
        'faq': 'FAQ',
        'locations': 'Locations',
        'dietary_guide': 'Dietary Guide',
        'from_our_kitchen': 'From our kitchen',
        'made_for_first_bite': 'Made for the first bite',
        'signature_intro': 'A few of the dishes our regulars come back for.',
        'explore_full_menu': 'Explore the full menu',
        'about_story_title': 'Our Story: Tradition Meets Modern Flavor',
        'about_story_p1': 'At Spice Döner, we believe that fast food doesn\'t have to be "junk" food. We started with a simple mission: to elevate the traditional Döner experience into a vibrant, fresh, and gourmet meal that everyone—regardless of dietary needs—can enjoy.',
        'about_story_p2': 'From our signature Hand-Carved Döner to our colorful Mezze Bowls, every plate we serve is a balance of Mediterranean tradition and modern culinary flair.',
        'about_different_title': 'Why Spice Döner is Different',
        'about_inclusivity_title': 'True Dietary Inclusivity',
        'about_inclusivity_text': 'We take pride in being one of the most dietary-friendly spots in the city. Whether you choose Vegan (V), Gluten-Free (G), Lactose-Free (L), or Halal (H), our menu is designed with your needs in mind. Our dishes can be customized to fit your lifestyle—without sacrificing flavor.',
        'about_allergy_title': 'Allergies & Custom Requests',
        'about_allergy_text': 'We take every customer\'s allergies and custom requests very seriously. Tell our team about your needs before ordering, and we will carefully consider them while preparing your meal.',
        'about_freshness_title': 'Freshness First',
        'about_freshness_text': 'Our kitchens are filled with the scent of fresh parsley, sumac-marinated onions, and house-made hummus. We don\'t just "assemble" food; we craft it using fresh pomegranate seeds, crisp red cabbage, and authentic Halloumi.',
        'about_chef_title': 'The "Be The Chef" Experience',
        'about_chef_text': 'We believe in food that fits your mood. That\'s why we offer "Oma valinta" (Your Choice) options, allowing you to build a bowl or pita that is as unique as your palate.',
        'about_promise_title': 'Our Promise',
        'about_promise_text': 'Whether you\'re grabbing a Kana Döner Pita on the go, sitting down for a family Mezze Feast, or treating the kids to our specialized Lasten Menu, you are getting high-quality ingredients, bold spices, and a meal made with passion.',
        'about_closing': 'Experience the spice. Taste the freshness. Welcome to Spice Döner.',
        'about_franchise_title': 'Become a Franchise Partner',
        'about_franchise_text': 'Franchise fees and terms are assessed individually. They depend on factors such as the area, expected sales, rent, premises, and other operating conditions. Contact us to discuss the right setup for your location.',
        
        // Contact form translations
        'contact_page_title': 'Contact & Reservations',
        'contact_page_subtitle': 'Get in touch with Spice Döner or make a reservation',
        'visit_us': 'Visit Us',
        'contact_type': 'Contact Type',
        'contact_type_placeholder': 'Select contact type',
        'contact_type_reservation': 'Table Reservation',
        'contact_type_event': 'Private Event / Catering',
        'contact_type_feedback': 'Feedback / Complaint',
        'contact_type_general': 'General Inquiry',
        'contact_type_other': 'Other',
        'first_name': 'First Name',
        'first_name_placeholder': 'Your first name',
        'last_name': 'Last Name',
        'last_name_placeholder': 'Your last name',
        'email_address': 'Email Address',
        'email_placeholder': 'your.email@example.com',
        'phone_number': 'Phone Number',
        'phone_placeholder': '+358 XX XXX XXXX',
        'preferred_date': 'Preferred Date',
        'preferred_time': 'Preferred Time',
        'select_time': 'Select time',
        'party_size': 'Party Size',
        'select_size': 'Select size',
        'party_size_1': '1 Person',
        'party_size_2': '2 People',
        'party_size_3': '3 People',
        'party_size_4': '4 People',
        'party_size_5': '5 People',
        'party_size_6': '6 People',
        'party_size_7': '7 People',
        'party_size_8': '8 People',
        'party_size_9_15': '9-15 People',
        'party_size_16_plus': '16+ People (Private Event)',
        'subject': 'Subject',
        'subject_placeholder': 'Brief subject of your message',
        'message': 'Message',
        'message_placeholder': 'Please provide details about your inquiry, reservation requirements, or feedback...',
        'copy_email': 'Send me a copy of this message',
        'send_message': 'Send Message',
        'sending': 'Sending...',
        'success_message': 'Your message has been sent successfully! We\'ll get back to you soon.',
        'error_message': 'There was an error sending your message. Please try again or contact us directly.',
        'contact_type_required': 'Please select a contact type.',
        'first_name_required': 'First name is required.',
        'last_name_required': 'Last name is required.',
        'email_required': 'Email is required.',
        'email_invalid': 'Please enter a valid email address.',
        'message_required': 'Please enter your message.',
        'opening_hours_title': 'Opening Hours',
        'monday_friday': 'Monday - Friday: 11:00 - 21:00',
        'saturday': 'Saturday: 12:00 - 22:00',
        'sunday': 'Sunday: 12:00 - 20:00',
        'contact_us_or_make_reservation': 'Contact Us or Make a Reservation'
      },
      fi: {
        'serving_options': 'Tarjoilu- ja ateriavaihtoehdot',
        "ingredients": "Ainekset ja vaihtoehdot",
        "all_dishes": "Kaikki annokset",
        "allergy_short": "Allergioita tai erityistoiveita? Kerro meille ennen tilaamista.",
        "next_photo": "Seuraava kuva",
        "photo_unavailable": "Kuva ei saatavilla",
        "choose_delivery": "Valitse kuljetuskumppani",
        "delivery_note": "Jatka kuljetuskumppanin sivustolle valitsemaan vaihtoehdot ja tekemään tilaus.",
        "close": "Sulje",
        "directions": "Reittiohjeet",
        "call": "Soita",
        "today": "Tänään",
        "hours_details": "Aukioloajat",
        "photo_details": "Lisää kuvia",
        "phone_invalid": "Syötä suomalainen tai kansainvälinen numero, esim. 040 123 4567 tai +358 40 123 4567.",
        "cookie_description": "Käytämme valinnaisia analytiikkaevästeitä käyntien ymmärtämiseen ja sivuston kehittämiseen. Voit hyväksyä tai hylätä ne.",
        "Why Choose Spice Döner?": "Miksi valita Spice Döner?",
        "pita_meat_short": "Liha: pitat ja wrapit",
        "pita_veg_short": "Kasvis: pitat ja wrapit",
        "mezze_bowls_short": "Mezze-bowlit",
        "doner_bowls_short": "Döner-bowlit",
        "children_short": "Lapsille",
        "sides_short": "Lisukkeet",
        "beverages_short": "Juomat",
        "dips_short": "Dipit",
        "dish": "Annos",
        "open_menu": "Avaa navigointi",
        "close_menu": "Sulje navigointi",
        "rights_reserved": "Kaikki oikeudet pidätetään.",
        "view_dish": "Katso annos",
        "monday": "Maanantai",
        "tuesday": "Tiistai",
        "wednesday": "Keskiviikko",
        "thursday": "Torstai",
        "friday": "Perjantai",
        "saturday_day": "Lauantai",
        "sunday_day": "Sunnuntai",
        "meal_upgrade": "Ateriaan sisältyvät ranskalaiset ja Coca-Cola.",
        'menu': 'Menu',
        'about': 'Tietoa',
        'contact': 'Yhteystiedot',
        'order_now': 'Tilaa nyt',
        'order_on_wolt': 'Tilaa Woltista',
        'order_on_bolt': 'Tilaa Bolt Foodista',
        'order_on_uber_eats': 'Tilaa Uber Eatsista',
        'view_menu': 'Katso menu',
        'home': 'Etusivu',
        'categories': 'Kategoriat',
        'all_categories': 'Kaikki kategoriat',
        'search_menu': 'Hae menusta...',
        'dietary_filters': 'Ruokavalio',
        'allergen_filters': 'Allergeenit',
        'vegan': 'Vegaaninen',
        'vegetarian': 'Vegetaarinen',
        'halal': 'Halal',
        'gluten_free': 'Gluteeniton',
        'dairy_free': 'Maidoton',
        '(G) = Available gluten-free on request. Pitas, mezze plates and bowls can be made gluten-free, except wraps.': '(G) = Saatavana pyydettäessä gluteenittomana. Pitat, mezze-lautaset ja bowlit voidaan tehdä gluteenittomina, wrappeja lukuun ottamatta.',
        'allergy_care_note': 'Suhtaudumme jokaisen asiakkaan allergioihin ja erityistoiveisiin erittäin vakavasti. Kerro niistä henkilökunnalle ennen tilaamista, jotta voimme huomioida ne huolellisesti.',
        'lactose_free': 'Laktoositon',
        'keto': 'Keto',
        'spicy': 'Tulinen',
        'Fresh Daily': 'Tuoreena päivittäin',
        'Vegan': 'Vegaani',
        'Vegetarian': 'Vegetaarinen',
        'Gluten Free': 'Gluteeniton',
        'Lactose Free': 'Laktoositon',
        'Halal': 'Halal',
        'All ingredients are sourced fresh and prepared daily in our kitchen.': 'Kaikki ainesosat ovat tuoreita ja valmistetaan päivittäin keittiössämme.',
        'Delicious plant-based options perfect for vegan diets.': 'Herkullisia kasvisruokavaihtoehtoja, jotka sopivat täydellisesti vegaaniruokavalioon.',
        'Wide selection of vegetarian dishes for every taste.': 'Laaja valikoima vegetaarisia annoksia jokaiselle makulle.',
        'Many gluten-free options available for dietary restrictions.': 'Monia gluteenittomia vaihtoehtoja saatavilla ruokavaliorajoituksiin.',
        'Dairy-free alternatives for lactose intolerant guests.': 'Maidottomia vaihtoehtoja laktoosi-intoleranteille asiakkaille.',
        'All our meat is halal-certified following Islamic dietary laws.': 'Kaikki lihämme on halal-sertifioitua islamilaisten ruokavaliosääntöjen mukaisesti.',
        'Current Specials': 'Tämänhetkiset Tarjoukset',
        'Limited time offers': 'Rajoitetun ajan tarjouksia',
        'Ready to order?': 'Valmis tilaamaan?',
        'Choose from our delivery partners': 'Valitse kotiinkuljetuskumppaneistamme',
        'Find Us': 'Löydä Meidät',
        'Visit our restaurant in Helsinki': 'Vieraile ravintolassamme Helsingissä',
        'Location': 'Sijainti',
        'Opening Hours': 'Aukioloajat',
        'Monday - Friday': 'Maanantai - Perjantai',
        'Saturday': 'Lauantai',
        'Sunday': 'Sunnuntai',
        'Contact': 'Yhteystiedot',
        'Phone': 'Puhelin',
        'Email': 'Sähköposti',
        'L = Lactose Free | G = Gluten Free | K = Vegetarian | V = Vegan | H = Halal': 'L = Laktoositon | G = Gluteeniton | K = Vegetaarinen | V = Vegaani | H = Halal',
        'Why Choose Bengal Ruokopaikka?': 'Miksi valita Spice Döner?',
        'Fresh ingredients, authentic flavors, healthy options': 'Tuoreita ainesosia, aitoja makuja, terveellisiä vaihtoehtoja',
        'opening_hours': 'Aukioloajat',
        'closed': 'Suljettu',
        'open': 'Auki',
        'opens_at': 'Aukeaa klo',
        'closes_at': 'Sulkeutuu klo',
        'phone': 'Puhelin',
        'email': 'Sähköposti',
        'address': 'Osoite',
        'last_updated': 'Päivitetty',
        'meal': 'Ateria',
        'loading': 'Ladataan',
        'error_loading_menu': 'Virhe ladattaessa menua',
        'retry': 'Yritä uudelleen',
        'from': 'alkaen',
        'unavailable': 'Ei saatavilla',
        'add_to_order': 'Lisää tilaukseen',
        'options': 'Lisävalinnat',
        'select_options': 'Valitse lisävalinnat',
        'required': 'Pakollinen',
        'optional': 'Valinnainen',
        'privacy_policy': 'Tietosuojakäytäntö',
        'contact_privacy_notice': 'Käytämme lähettämiäsi tietoja yhteydenottoosi vastaamiseen. Katso',
        'terms_of_service': 'Käyttöehdot',
        'cookie_consent': 'Tämä sivusto käyttää evästeitä parantaakseen käyttökokemustasi.',
        'accept_cookies': 'Hyväksy',
        'decline_cookies': 'Kieltäydy',
        'catering': 'Pitopalvelu',
        'faq': 'UKK',
        'locations': 'Toimipaikat',
        'dietary_guide': 'Ruokavalio-opas',
        'from_our_kitchen': 'Keittiöstämme',
        'made_for_first_bite': 'Ensimmäisestä suupalasta alkaen',
        'signature_intro': 'Muutama annos, joiden vuoksi vakioasiakkaamme palaavat.',
        'explore_full_menu': 'Tutustu koko menuun',
        'about_story_title': 'Tarinaamme: Perinne Kohtaa Modernin Maun',
        'about_story_p1': 'Spice Dönerissa uskomme, että pikaruoan ei tarvitse olla "roskaruokaa". Aloitimme yksinkertaisella tehtävällä: nostaa perinteinen döner-kokemus eläväksi, tuoreeksi ja gourmet-ateriaksi, josta kaikki—ruokavalioista riippumatta—voivat nauttia.',
        'about_story_p2': 'Tunnusomaisesta käsin leikatusta döneristämme värikkäisiin mezze-kulhoihimme, jokainen tarjoamamme lautanen on tasapainoa Välimeren perinteen ja modernin kulinaarisen taiteen välillä.',
        'about_different_title': 'Miksi Spice Döner on Erilainen',
        'about_inclusivity_title': 'Todellinen Ruokavaliomyönteisyys',
        'about_inclusivity_text': 'Olemme ylpeitä siitä, että olemme yksi kaupungin ruokavaliomyönteisimmistä paikoista. Valitsetpa vegaanisen (V), gluteenittoman (G), laktoosittoman (L) tai halal-vaihtoehdon (H), menumme huomioi tarpeesi. Annoksiamme voidaan räätälöidä elämäntapaasi sopiviksi—makua uhraamatta.',
        'about_allergy_title': 'Allergiat & Erityistoiveet',
        'about_allergy_text': 'Suhtaudumme jokaisen asiakkaan allergioihin ja erityistoiveisiin erittäin vakavasti. Kerro tarpeistasi henkilökunnalle ennen tilaamista, niin huomioimme ne huolellisesti annoksesi valmistuksessa.',
        'about_freshness_title': 'Tuoreus Ensin',
        'about_freshness_text': 'Keittiömme ovat täynnä tuoreen persiljan, sumakilla marinoitujen sipulien ja kotitekoisen hummuksen tuoksua. Emme vain "kokoa" ruokaa; valmistamme sitä käyttäen tuoreita granaattiomensiemeniä, rapeaa punakaalia ja aitoa halloumia.',
        'about_chef_title': '"Ole Kokki" -Kokemus',
        'about_chef_text': 'Uskomme ruokaan, joka sopii mielialaasi. Siksi tarjoamme "Oma valinta" -vaihtoehtoja, joiden avulla voit rakentaa kulhon tai pitan, joka on yhtä ainutlaatuinen kuin makuaistisi.',
        'about_promise_title': 'Lupauksemme',
        'about_promise_text': 'Oletpa nappamassakana döner pitaa matkalla, istumassa perheen mezze-juhlissa tai hemmottelemassa lapsia erikoisella lasten menullämme, saat laadukkaita ainesosia, rohkeita mausteita ja intohimolla valmistettua ruokaa.',
        'about_closing': 'Koe mauste. Maista tuoreus. Tervetuloa Spice Döneriin.',
        'about_franchise_title': 'Ryhdy Franchise-kumppaniksi',
        'about_franchise_text': 'Franchise-maksut ja ehdot arvioidaan tapauskohtaisesti. Niihin vaikuttavat muun muassa alue, arvioitu myynti, vuokra, toimitila ja muut toimintaolosuhteet. Ota yhteyttä, niin keskustellaan toimipaikallesi sopivasta kokonaisuudesta.',
        
        // Contact form translations (Finnish)
        'contact_page_title': 'Yhteystiedot & Varaukset',
        'contact_page_subtitle': 'Ota yhteyttä Spice Döneriin tai tee varaus',
        'visit_us': 'Tule Käymään',
        'contact_type': 'Yhteydenoton Tyyppi',
        'contact_type_placeholder': 'Valitse yhteydenoton tyyppi',
        'contact_type_reservation': 'Pöytävaraus',
        'contact_type_event': 'Yksityistilaisuus / Pitopalvelu',
        'contact_type_feedback': 'Palaute / Valitus',
        'contact_type_general': 'Yleinen Kysely',
        'contact_type_other': 'Muu',
        'first_name': 'Etunimi',
        'first_name_placeholder': 'Sinun etunimesi',
        'last_name': 'Sukunimi',
        'last_name_placeholder': 'Sinun sukunimesi',
        'email_address': 'Sähköpostiosoite',
        'email_placeholder': 'sinun.sahkoposti@example.com',
        'phone_number': 'Puhelinnumero',
        'phone_placeholder': '+358 XX XXX XXXX',
        'preferred_date': 'Toivottu Päivämäärä',
        'preferred_time': 'Toivottu Aika',
        'select_time': 'Valitse aika',
        'party_size': 'Seurueen Koko',
        'select_size': 'Valitse koko',
        'party_size_1': '1 Henkilö',
        'party_size_2': '2 Henkilöä',
        'party_size_3': '3 Henkilöä',
        'party_size_4': '4 Henkilöä',
        'party_size_5': '5 Henkilöä',
        'party_size_6': '6 Henkilöä',
        'party_size_7': '7 Henkilöä',
        'party_size_8': '8 Henkilöä',
        'party_size_9_15': '9-15 Henkilöä',
        'party_size_16_plus': '16+ Henkilöä (Yksityistilaisuus)',
        'subject': 'Aihe',
        'subject_placeholder': 'Lyhyt kuvaus viestistäsi',
        'message': 'Viesti',
        'message_placeholder': 'Kerro tarkemmin kyselystäsi, varaustoiveistasi tai palautteestasi...',
        'copy_email': 'Lähetä minulle kopio tästä viestistä',
        'send_message': 'Lähetä Viesti',
        'sending': 'Lähetetään...',
        'success_message': 'Viestisi on lähetetty onnistuneesti! Otamme sinuun yhteyttä pian.',
        'error_message': 'Viestin lähettämisessä tapahtui virhe. Yritä uudelleen tai ota meihin yhteyttä suoraan.',
        'contact_type_required': 'Valitse yhteydenoton tyyppi.',
        'first_name_required': 'Etunimi on pakollinen.',
        'last_name_required': 'Sukunimi on pakollinen.',
        'email_required': 'Sähköposti on pakollinen.',
        'email_invalid': 'Anna kelvollinen sähköpostiosoite.',
        'message_required': 'Kirjoita viestisi.',
        'opening_hours_title': 'Aukioloajat',
        'monday_friday': 'Maanantai - Perjantai: 11:00 - 21:00',
        'saturday': 'Lauantai: 12:00 - 22:00',
        'sunday': 'Sunnuntai: 12:00 - 20:00',
        'contact_us_or_make_reservation': 'Ota Yhteyttä tai Tee Varaus'
      }
    };

    const currentLang = this.getCurrentLanguage();
    return translations[currentLang][key] || key;
  }
}
