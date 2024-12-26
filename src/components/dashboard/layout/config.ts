import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'plugs-connected' },
  { key: 'createcampaign', title: 'CreateCampaign', href: paths.dashboard.createCampaign, icon: 'plugs-connected' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
] satisfies NavItemConfig[];
