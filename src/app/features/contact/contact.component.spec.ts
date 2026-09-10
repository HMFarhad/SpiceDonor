import emailjs from '@emailjs/browser';
import { I18nService } from '@core/services';
import { ContactComponent } from './contact.component';

describe('Contact submission', () => {
  let component: ContactComponent;
  let form: HTMLFormElement;
  let event: Event;
  beforeEach(() => {
    spyOn(emailjs, 'init');
    component = new ContactComponent({ translate: (key: string) => key } as I18nService);
    form = document.createElement('form');
    form.innerHTML = '<input name="first_name" value="Test"><input name="last_name" value="Guest">'
      + '<input name="email" value="test@example.com"><input id="phone" name="phone" value="040 123 4567">'
      + '<textarea name="contact_type">A reservation question</textarea>';
    event = { target: form, preventDefault: () => {} } as unknown as Event;
  });
  it('keeps the original message intact after failure and retry', async () => {
    spyOn(console, 'error');
    const send = spyOn(emailjs, 'send').and.returnValue(Promise.reject(new Error('Offline')));
    await component.onSubmit(event);
    expect(component.showErrorMessage).toBeTrue();
    expect(component.isSubmitting).toBeFalse();
    expect(form.querySelector('textarea')!.value).toBe('A reservation question');
    await component.onSubmit(event);
    expect(send.calls.mostRecent().args[2]!['contact_type']).toBe('A reservation question\n\nPhone Number: 040 123 4567');
  });
  it('blocks invalid phone numbers before sending', async () => {
    const send = spyOn(emailjs, 'send');
    form.querySelector<HTMLInputElement>('[name="phone"]')!.value = 'invalid';
    await component.onSubmit(event);
    expect(send).not.toHaveBeenCalled();
  });
  it('prevents duplicate submissions and reports success', async () => {
    let finish!: (response: {status: number; text: string}) => void;
    const send = spyOn(emailjs, 'send').and.returnValue(new Promise(resolve => finish = resolve));
    const pending = component.onSubmit(event);
    await component.onSubmit(event);
    expect(send).toHaveBeenCalledTimes(1);
    expect(component.isSubmitting).toBeTrue();
    finish({ status: 200, text: 'OK' });
    await pending;
    expect(component.showSuccessMessage).toBeTrue();
    expect(component.isSubmitting).toBeFalse();
  });
});
