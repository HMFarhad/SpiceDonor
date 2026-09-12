import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BUSINESS_DETAILS } from '@core/business-details';
import { I18nService, SeoService } from '@core/services';

@Component({
  selector: 'app-legal',
  template: `
    <div class="page">
      <div class="section">
        <article class="container legal-page" *ngIf="isPrivacy; else terms">
          <ng-container *ngIf="isFinnish; else privacyEnglish">
            <h1>Tietosuojaseloste</h1>
            <p class="updated">Päivitetty 12.9.2026</p>
            <h2>Rekisterinpitäjä</h2>
            <p>{{ business.legalName }} (Y-tunnus {{ business.businessId }})<br>
              {{ business.addressLine1 }}, {{ business.addressLine2 }}, {{ business.postalCode }} {{ business.city }}<br>
              <a [href]="'mailto:' + business.email">{{ business.email }}</a></p>
            <h2>Mitä tietoja käsittelemme</h2>
            <p>Yhteydenottolomake kerää etu- ja sukunimen, sähköpostiosoitteen, vapaaehtoisen puhelinnumeron sekä viestin sisällön. Palvelin- ja tietoturvalokeihin voi tallentua teknisiä tietoja, kuten IP-osoite, selain ja tapahtuma-aika.</p>
            <h2>Miksi käsittelemme tietoja</h2>
            <p>Käytämme tietoja yhteydenottoihin vastaamiseen, asiakkaan pyytämien palvelujen käsittelyyn sekä palvelun turvallisuuden ja toimintavarmuuden ylläpitämiseen. Käsittely perustuu pyynnön käsittelyyn ennen mahdollista sopimusta ja rekisterinpitäjän oikeutettuun etuun hoitaa asiakaspalvelua ja suojata palvelua.</p>
            <h2>Palveluntarjoajat ja siirrot</h2>
            <p>Sivusto käyttää Cloudflarea verkkosivuston toimittamiseen ja suojaamiseen sekä EmailJS:ää lomakeviestien välittämiseen yrityksen sähköpostiin. Palveluntarjoajat voivat käsitellä tietoja EU-/ETA-alueen ulkopuolella omien tietosuojaselosteidensä ja sovellettavien siirtomekanismien mukaisesti. Sivulla on myös Google Maps -kartta ja linkkejä ulkopuolisiin tilaus- ja somepalveluihin.</p>
            <h2>Säilytys ja suojaus</h2>
            <p>Säilytämme yhteydenottotietoja vain niin kauan kuin asian käsittely ja mahdolliset lakisääteiset velvoitteet edellyttävät. Pääsy tietoihin rajataan henkilöihin, jotka tarvitsevat niitä työtehtävissään.</p>
            <h2>Oikeutesi</h2>
            <p>Voit pyytää pääsyä tietoihisi, niiden oikaisua tai poistamista sekä käsittelyn rajoittamista tai vastustaa käsittelyä soveltuvan lain mukaisesti. Ota yhteyttä osoitteeseen <a [href]="'mailto:' + business.email">{{ business.email }}</a>. Voit myös tehdä valituksen <a href="https://tietosuoja.fi/" target="_blank" rel="noopener noreferrer">Tietosuojavaltuutetun toimistolle</a>.</p>
            <h2>Evästeet ja analytiikka</h2>
            <p>Sivustolla ei ole tällä hetkellä käytössä vapaaehtoista kävijäanalytiikkaa. Jos analytiikka otetaan myöhemmin käyttöön, se aktivoidaan vasta käyttäjän suostumuksella ja tämä seloste päivitetään.</p>
          </ng-container>
          <ng-template #privacyEnglish>
            <h1>Privacy notice</h1>
            <p class="updated">Updated 12 September 2026</p>
            <h2>Data controller</h2>
            <p>{{ business.legalName }} (Business ID {{ business.businessId }})<br>
              {{ business.addressLine1 }}, {{ business.addressLine2 }}, {{ business.postalCode }} {{ business.city }}, {{ business.country }}<br>
              <a [href]="'mailto:' + business.email">{{ business.email }}</a></p>
            <h2>Information we process</h2>
            <p>The contact form collects your first and last name, email address, optional telephone number and message. Server and security logs may contain technical information such as an IP address, browser and event time.</p>
            <h2>Why we process information</h2>
            <p>We use this information to answer enquiries, handle services requested by customers, and maintain the security and reliability of the website. Processing is based on taking steps at your request before a possible contract and our legitimate interest in providing customer service and protecting the service.</p>
            <h2>Service providers and transfers</h2>
            <p>The website uses Cloudflare to deliver and protect the site and EmailJS to send form messages to the company's email service. These providers may process information outside the EU/EEA under their privacy terms and applicable transfer safeguards. The site also embeds Google Maps and links to external ordering and social-media services.</p>
            <h2>Retention and security</h2>
            <p>We keep enquiry data only as long as needed to handle the matter and meet applicable legal obligations. Access is restricted to people who need the information for their work.</p>
            <h2>Your rights</h2>
            <p>Subject to applicable law, you may request access, correction or deletion, restrict processing, or object to processing. Contact <a [href]="'mailto:' + business.email">{{ business.email }}</a>. You may also complain to the <a href="https://tietosuoja.fi/en/home" target="_blank" rel="noopener noreferrer">Office of the Data Protection Ombudsman</a>.</p>
            <h2>Cookies and analytics</h2>
            <p>Optional visitor analytics is not currently enabled. If analytics is introduced later, it will be activated only after consent and this notice will be updated.</p>
          </ng-template>
        </article>

        <ng-template #terms>
          <article class="container legal-page">
            <ng-container *ngIf="isFinnish; else termsEnglish">
              <h1>Verkkosivuston käyttöehdot</h1>
              <p class="updated">Päivitetty 12.9.2026</p>
              <h2>Palveluntarjoaja</h2>
              <p>{{ business.legalName }} (Y-tunnus {{ business.businessId }}), {{ business.addressLine1 }}, {{ business.addressLine2 }}, {{ business.postalCode }} {{ business.city }}. Yhteys: <a [href]="'mailto:' + business.email">{{ business.email }}</a>.</p>
              <h2>Sivuston tiedot</h2>
              <p>Pyrimme pitämään ruokalistan, hinnat, aukioloajat ja muut tiedot oikeina. Tiedot voivat kuitenkin muuttua, ja ravintolassa tai tilauspalvelussa näkyvä ajantasainen tieto on ratkaiseva.</p>
              <h2>Tilaukset ja ulkopuoliset palvelut</h2>
              <p>Sivusto ohjaa tilaukset ulkopuolisiin palveluihin, kuten Woltiin. Tilaus, maksu, toimitus ja mahdollinen hyvitys määräytyvät kyseisen palvelun ja ravintolan ehtojen mukaan.</p>
              <h2>Allergiat ja ruokavaliot</h2>
              <p>Ruokalistan merkinnät ovat yleistä tietoa. Ilmoita allergioista aina henkilökunnalle tai tilauspalvelussa ennen tilaamista. Keittiössä käsitellään useita allergeeneja, joten täydellistä ristikontaminaation poissulkemista ei voida taata.</p>
              <h2>Yhteydenotot</h2>
              <p>Lomakkeen lähettäminen ei yksin vahvista varausta, tilausta tai muuta sopimusta. Saat vahvistuksen erikseen, jos asia sitä edellyttää.</p>
              <h2>Immateriaalioikeudet ja vastuu</h2>
              <p>Sivuston tekstit, kuvat, tunnukset ja muu sisältö kuuluvat {{ business.legalName }}:lle tai niiden oikeudenhaltijoille. Sivustoa tarjotaan sellaisena kuin se on. Pakottavan lain sallimissa rajoissa emme vastaa ulkopuolisten palvelujen toiminnasta tai tilapäisestä käyttökatkosta.</p>
              <h2>Sovellettava laki</h2>
              <p>Ehtoihin sovelletaan Suomen lakia. Kuluttajalla on lisäksi pakottavan kuluttajansuojalainsäädännön mukaiset oikeudet.</p>
            </ng-container>
            <ng-template #termsEnglish>
              <h1>Website terms of use</h1>
              <p class="updated">Updated 12 September 2026</p>
              <h2>Service provider</h2>
              <p>{{ business.legalName }} (Business ID {{ business.businessId }}), {{ business.addressLine1 }}, {{ business.addressLine2 }}, {{ business.postalCode }} {{ business.city }}, {{ business.country }}. Contact: <a [href]="'mailto:' + business.email">{{ business.email }}</a>.</p>
              <h2>Website information</h2>
              <p>We aim to keep menu items, prices, opening hours and other information accurate. Information can change, and the current information shown at the restaurant or ordering service takes precedence.</p>
              <h2>Orders and external services</h2>
              <p>The website sends orders to external services such as Wolt. Ordering, payment, delivery and refunds are governed by the applicable service's and restaurant's terms.</p>
              <h2>Allergies and dietary information</h2>
              <p>Menu labels provide general information. Always inform restaurant staff or the ordering service of allergies before ordering. The kitchen handles multiple allergens, so complete absence of cross-contact cannot be guaranteed.</p>
              <h2>Enquiries</h2>
              <p>Sending a form does not by itself confirm a reservation, order or other agreement. A separate confirmation will be provided when required.</p>
              <h2>Intellectual property and liability</h2>
              <p>Website text, images, marks and other content belong to {{ business.legalName }} or their respective rights holders. The website is provided as available. To the extent permitted by mandatory law, we are not responsible for external services or temporary interruptions.</p>
              <h2>Applicable law</h2>
              <p>Finnish law applies. Consumers also retain all rights granted by mandatory consumer-protection law.</p>
            </ng-template>
          </article>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .legal-page { max-width: 860px; }
    h1 { margin-bottom: .35rem; }
    h2 { color: var(--text-special); margin: 2rem 0 .6rem; font-size: 1.35rem; }
    p { color: var(--text-light); }
    .updated { color: var(--text-muted); font-size: .9rem; }
    a { color: var(--text-special); }
  `]
})
export class LegalComponent implements OnInit {
  readonly business = BUSINESS_DETAILS;

  constructor(
    private router: Router,
    public i18n: I18nService,
    private seo: SeoService
  ) {}

  get isPrivacy(): boolean {
    return !this.router.url.startsWith('/terms');
  }

  get isFinnish(): boolean {
    return this.i18n.getCurrentLanguage() === 'fi';
  }

  ngOnInit(): void {
    const title = this.isPrivacy ? 'Privacy notice' : 'Website terms of use';
    this.seo.updateSeoData({
      title: `${title} - Spice Döner`,
      description: `${title} for Spice Döners Suomi Oy.`,
      type: 'website'
    });
  }
}
