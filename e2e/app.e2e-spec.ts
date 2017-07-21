import { SteamNewsPage } from './app.po';

describe('steam-news App', () => {
  let page: SteamNewsPage;

  beforeEach(() => {
    page = new SteamNewsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
