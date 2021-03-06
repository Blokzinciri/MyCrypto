import { t, Selector } from 'testcafe';
import { getAllByText } from '@testing-library/testcafe';

import { PAGES, FIXTURES_CONST } from './fixtures';
import BasePage from './base-page.po';

export default class DashboardPage extends BasePage {
  async navigateToPage() {
    this.navigateTo(PAGES.DASHBOARD);
  }

  async waitPageLoaded(timeout) {
    await this.waitForPage(PAGES.DASHBOARD, timeout);
  }

  async expectAddressToBePresent(address) {
    await t.expect(getAllByText(address.substring(0, 6), { exact: false })).ok();
  }

  async expectAccountTableToMatchCount(count) {
    await t
      .expect(Selector('section[data-testid="account-list"] > div > table tbody tr').count)
      .eql(count);
  }

  async expectBalanceInBalanceList(token) {
    await t.expect(Selector('div').withText(token)).ok({ timeout: FIXTURES_CONST.TIMEOUT });
  }
}
