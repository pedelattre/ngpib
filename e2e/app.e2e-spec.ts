import { NgpibPage } from './app.po';

describe('ngpib App', () => {
  let page: NgpibPage;

  beforeEach(() => {
    page = new NgpibPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
