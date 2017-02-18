import { EsteticaFrontendPage } from './app.po';

describe('estetica-frontend App', () => {
  let page: EsteticaFrontendPage;

  beforeEach(() => {
    page = new EsteticaFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
