import React from 'react';
import { ClipBDRepository } from '../lib/db/repository';
import { HomeClient } from '../components/home/HomeClient';

export default async function HomePage() {
  const activeCampaigns = await ClipBDRepository.getActiveCampaigns();

  return <HomeClient activeCampaigns={activeCampaigns} />;
}
