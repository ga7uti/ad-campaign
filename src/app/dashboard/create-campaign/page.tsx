"use client"
import React from 'react';

import BackBtn from '@/components/dashboard/layout/back-btn';
import { Alert, Typography } from '@mui/material';
import { Box } from '@mui/system';
import CreateCampaign from '@/components/dashboard/campaign/create-campaign';
import { campaignClient } from '@/lib/campaign-client';
import { CommonSelectResponse, ImpressionData, Interest, Location } from '@/types/campaign';


export default function CreateCampaignPage(): React.JSX.Element {

  const [dataSources, setDataSources] = React.useState({
    ages: [],
    devices: [],
    environment: [],
    location: [],
    exchange: [],
    language: [],
    carrier: [],
    device_price: [],
    interest_category: [],
    interest: [],
    selectedInterest: [],
    buy_type: [],
    brand_safety: [],
    viewability: [],
  } as Record<string, CommonSelectResponse[] | Location[] | Interest[]>);
  const [impressionData,setImpressionData] = React.useState<ImpressionData>();
  const [totalPopulation,setTotalPopulation] = React.useState<number>(0);
  const [error, setError] = React.useState<string>();
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const fetchData = async () => {
      try {
        const [ageRes, deviceRes, envRes, locRes,exchangeRes,langRes,
          carrierRes,devicePriceRes, categoryInterestRes,interestRes, impressionRes,buyTypeRes,
          viewabilityRes,brandSafetyRes] = await Promise.all([
          campaignClient.getAge(),
          campaignClient.getDevice(),
          campaignClient.getEnv(),
          campaignClient.getLocations(),
          campaignClient.getExchange(),
          campaignClient.getLanguage(),
          campaignClient.getCarrier(),
          campaignClient.getDevicePrice(),
          campaignClient.getDistinctInterest(),
          campaignClient.getInterest(""),
          campaignClient.getImpressionData(),
          campaignClient.getBuyType(),
          campaignClient.getViewability(),
          campaignClient.getBrandSafety(),
        ]);
        setDataSources({
          ages: ageRes,
          devices: deviceRes,
          environment: envRes,
          location: locRes,
          exchange: exchangeRes,
          language: langRes,
          carrier: carrierRes,
          device_price: devicePriceRes,
          interest_category: categoryInterestRes,
          interest: interestRes,
          selectedInterest: [],
          buy_type:buyTypeRes,
          viewability:viewabilityRes,
          brand_safety:brandSafetyRes,
        });
        setImpressionData(impressionRes)
        setTotalPopulation(impressionRes.totalPopulation)
      } catch (error) {
        setError("Failed to load campaign data. Error: " + error);
      }
    };

    React.useEffect(() => {
      fetchData();
    }, []);
  return (
    <Box>
      <BackBtn/>
      <Box mb={2}>
        <Typography mb={5} variant="h4">Create Campaign</Typography>
        {dataSources && impressionData 
          ? 
            <CreateCampaign 
              dataSources={dataSources} 
              impressionData={impressionData} 
              totalPopulation={totalPopulation}
              setDataSources={setDataSources}
            />
          : 
            <>
              {error ? <Alert color="error">{error}</Alert> : null}
            </>
        }
      </Box>
    </Box>
  );
}
