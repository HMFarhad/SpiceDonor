import { Component } from '@angular/core';
import { I18nService } from '@core/services';

@Component({
  selector: 'app-about',
  template: `
    <div class="page">
      <div class="section">
        <div class="container">
          <div class="about-content">
            <h2>{{ i18n.translate('about_story_title') }}</h2>
            <p>{{ i18n.translate('about_story_p1') }}</p>
            
            <p>{{ i18n.translate('about_story_p2') }}</p>
            
            <h2>{{ i18n.translate('about_different_title') }}</h2>
            
            <h3>{{ i18n.translate('about_inclusivity_title') }}</h3>
            <p>{{ i18n.translate('about_inclusivity_text') }}</p>

            <h3>{{ i18n.translate('about_allergy_title') }}</h3>
            <p>{{ i18n.translate('about_allergy_text') }}</p>
            
            <h3>{{ i18n.translate('about_freshness_title') }}</h3>
            <p>{{ i18n.translate('about_freshness_text') }}</p>
            
            <h3>{{ i18n.translate('about_chef_title') }}</h3>
            <p>{{ i18n.translate('about_chef_text') }}</p>
            
            <h2>{{ i18n.translate('about_promise_title') }}</h2>
            <p>{{ i18n.translate('about_promise_text') }}</p>
            
            <div class="promise-statement">
              <p><strong>{{ i18n.translate('about_closing') }}</strong></p>
            </div>

            <div class="franchise-card">
              <h2>{{ i18n.translate('about_franchise_title') }}</h2>
              <p>{{ i18n.translate('about_franchise_text') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      background-image: url('/assets/images/orange_background.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      position: relative;
      color: var(--white);
      padding: 2rem 0;
      text-align: center;
    }
    .page-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 1;
    }
    .page-header .container {
      position: relative;
      z-index: 2;
    }
    .about-content {
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.7;
    }
    .about-content h2 {
      color: var(--text-special);
      margin: 2rem 0 1rem 0;
      font-size: 1.8rem;
    }
    .about-content h3 {
      color: var(--primary-color);
      margin: 1.5rem 0 0.75rem 0;
      font-size: 1.3rem;
    }
    .about-content p {
      margin: 0 0 1rem 0;
      color: var(--text-light);
    }
    .promise-statement {
      background-image: url('/assets/images/black_background.jpg');
      background-size: cover;
      background-position: center;
      position: relative;
      padding: 2rem;
      border-radius: var(--radius-large);
      text-align: center;
      margin: 2rem 0;
      border: 1px solid rgba(255, 107, 53, 0.2);
    }
    .promise-statement::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(45, 45, 45, 0.8);
      z-index: 1;
    }
    .promise-statement p {
      color: var(--text-special);
      font-size: 1.1rem;
      margin: 0;
      position: relative;
      z-index: 2;
    }
    .franchise-card {
      margin: 2rem 0;
      padding: 1.75rem 2rem;
      border: 1px solid rgba(247, 201, 72, 0.28);
      border-radius: var(--radius-large);
      background: rgba(247, 201, 72, 0.06);
    }
    .franchise-card h2 {
      margin-top: 0;
    }
    .franchise-card p {
      margin-bottom: 0;
    }
  `]
})
export class AboutComponent {
  constructor(public i18n: I18nService) {}
}
