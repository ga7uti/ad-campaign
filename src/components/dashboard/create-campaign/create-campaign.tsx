/* eslint-disable -- Disabling all Eslint rules for the file*/
"use client"
import { campaignClient } from '@/lib/campaign-client';
import { utils } from '@/lib/common';
import { paths } from '@/paths';
import { CampaignFormData, CommonSelectResponse, Interest, Location } from '@/types/campaign';
import { CampaignFormSchema } from '@/types/form-data';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Grid, SelectChangeEvent, Typography } from '@mui/material';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import FileUpload from '../layout/file-upload';
import FormField from '../layout/form-field';


export default function CreateCampaign(): React.JSX.Element {

    const router = useRouter();
    const [ages, setAge] = React.useState<CommonSelectResponse[]>([]);
    const [devices, setDevices] = React.useState<CommonSelectResponse[]>([]);
    const [environment, setEnvironment] = React.useState<CommonSelectResponse[]>([]);
    const [location, setLocation] = React.useState<Location[]>([]);
    const [exchange, setExchanges] = React.useState<CommonSelectResponse[]>([]);
    const [language, setLanguage] = React.useState<CommonSelectResponse[]>([]);
    const [carrier, setCarrier] = React.useState<CommonSelectResponse[]>([]);
    const [devicePrice, setDevicePrice] = React.useState<CommonSelectResponse[]>([]);
    const [distinctInterest, setDistinctInterest] = React.useState<CommonSelectResponse[]>([]);
    const [selectedInterest, setSelectedInterest] = React.useState<Interest[]>([]);
    const [isPending, setIsPending] = React.useState<boolean>(false);
    const [isCampaignCreated,setIsCampaignCreated] = React.useState<boolean>(false);

    const {
      register,
      setValue,
      setError,
      clearErrors,
      handleSubmit,
      formState: { errors },
    } = useForm<CampaignFormData>({ resolver: zodResolver(CampaignFormSchema) });
  
    const onSubmit = async (data: CampaignFormData) => {
      if (!data.images || data.images.length === 0) {
        setError('images',{message:"Image is required"});
        return;
      }

      if (!data.keywords || data.keywords.length === 0) {
        setError('keywords',{message:"Keyword is required"});
        return;
      }
      clearErrors();
      createCampaign(data);
    };
  
    const fetchData = async () => {
      try {
        const [ageRes, deviceRes, envRes, locRes,exchangeRes,langRes,
          carrierRes,devicePriceRes, interestRes] = await Promise.all([
          campaignClient.getAge(),
          campaignClient.getDevice(),
          campaignClient.getEnv(),
          campaignClient.getLocations(),
          campaignClient.getExchange(),
          campaignClient.getLanguage(),
          campaignClient.getCarrier(),
          campaignClient.getDevicePrice(),
          campaignClient.getDistinctInterest(),
        ]);
        setAge(ageRes);
        setDevices(deviceRes);
        setEnvironment(envRes);
        setLocation(locRes);
        setExchanges(exchangeRes);
        setLanguage(langRes);
        setCarrier(carrierRes);
        setDevicePrice(devicePriceRes);
        setDistinctInterest(interestRes)
      } catch (error) {
        setError('root', { type: 'server', message: "Failed to load campaign data. Error: " + error});
      }
    };
  
    const fetchSelectedInterest = async (interest: string) => {
      try {
        const result = await campaignClient.getSelectedInterest(interest);
        setSelectedInterest(result);
      } catch (error) {
        setError('root', { type: 'server', message: "Failed to fetch selected category. Error: " + error});
      }
    };

    const createCampaign = async(data:CampaignFormData) => {
      if(!data) 
        return;

      const errors = utils.validateMandatoryFields(data);
      if(errors && Object.keys(errors).length > 0){
        setError('root',{message:Object.values(errors)[0]});
        return
      }
      
      setIsPending(true);
      try {
        const result = await campaignClient.postCampaign(data);
        if (result) {
          setIsCampaignCreated(true);
          setTimeout(()=>{
            router.push(paths.dashboard.overview);
          },1000)
        }
      } catch (error:any) {
        setError('root', { type: 'server', message: error.message});
      } finally {
        setIsPending(false);
      }
    }

    const handleSelectChange = async (
      event: SelectChangeEvent<unknown>, // Use SelectChangeEvent here
      name: string
    ) => {
      const selectedValue = event.target.value;
      if (name === "distinct_interest") {
        try {
          await fetchSelectedInterest((selectedValue as string[]).join(","));
        } catch (error) {
          setError('root', { type: 'server', message: "Error fetching categories. Error: "+ error});
        }
      }
    };

    React.useEffect(() => {
      console.log(selectedInterest)
      fetchData();
    }, [selectedInterest]);
  
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 ,marginBottom: "1rem"}}>
          {/* Campaign Details Section */}
          <CardSection title="Campaign Details">
            <Grid container spacing={2} mt={2}>
                {/* Name */}
                <Grid item xs={12} md={6} mb={1}>
                    <Box sx={{ minWidth: 120 }}>
                    <FormField
                        type="text"
                        placeholder="Name"
                        name="name"
                        register={register}
                        error={errors.name}
                        data={undefined}
                    />
                    </Box>
                </Grid>

                {/* Age */}
                <Grid item xs={12} md={6} mb={1}>
                    <Box sx={{ minWidth: 120 }}>
                    <FormField
                        type="text"
                        placeholder="Age Range"
                        name="age"
                        register={register}
                        error={Array.isArray(errors.age)?errors.age[0]:errors.age}
                        data={ages.length > 0 ? ages : [{ id: 0, value: 'No data available. Please try again later' }]}
                    />
                    </Box>
                </Grid>


                {/* Device */}
                <Grid item xs={12} md={6} mb={1}>
                    <Box sx={{ minWidth: 120 }}>
                    <FormField
                        type="text"
                        placeholder="Devices"
                        name="device"
                        register={register}
                        error={Array.isArray(errors.device)?errors.device[0]:errors.device}
                        data={devices.length > 0 ? devices : [{ id: 0, value: 'No data available. Please try again later' }]}
                    />
                    </Box>
                </Grid>

                {/* Environment */}
                <Grid item xs={12} md={6} mb={1}>
                    <Box sx={{ minWidth: 120 }}>
                    <FormField
                        type="text"
                        placeholder="Environments"
                        name="environment"
                        register={register}
                        error={Array.isArray(errors.environment)?errors.environment[0]:errors.environment}
                        data={environment.length > 0 ? environment : [{ id: 0, value: 'No data available. Please try again later' }]}
                    />
                    </Box>
                </Grid>

                {/* Location */}
                <Grid item xs={12} md={6} mb={1}>
                    <Box sx={{ minWidth: 120 }}>
                    <FormField
                        type="text"
                        placeholder="Locations"
                        name="location"
                        register={register}
                        error={Array.isArray(errors.location)?errors.location[0]:errors.location}
                        data={location.length > 0 ? location : [{ id: 0, city: 'No data available. Please try again later' }]}
                    />
                    </Box>
                </Grid>
            </Grid>
          </CardSection>
          
          {/* Targeting Type Section */}
          <CardSection title="Targeting Type">
            <Grid container spacing={2} mt={2}>
                  {/* Exchange */}
                  <Grid item xs={12} md={6} mb={1}>
                    <Box sx={{ minWidth: 120 }}>
                      <FormField
                          type="text"
                          placeholder="Exchange"
                          name="exchange"
                          register={register}
                          error={Array.isArray(errors.exchange)?errors.exchange[0]:errors.exchange}
                          data={exchange.length > 0 ? exchange : [{ id: 0, value: 'No data available. Please try again later' }]}
                      />
                    </Box>
                  </Grid>

                  {/* Carrier */}
                  <Grid item xs={12} md={6} mb={1}>
                    <Box sx={{ minWidth: 120 }}>
                      <FormField
                          type="text"
                          placeholder="Carrier"
                          name="carrier"
                          register={register}
                          error={Array.isArray(errors.carrier)?errors.carrier[0]:errors.carrier}
                          data={carrier.length > 0 ? carrier : [{ id: 0, value: 'No data available. Please try again later' }]}
                      />
                    </Box>
                  </Grid>

                  {/* Langugage */}
                  <Grid item xs={12} md={6} mb={1}>
                    <Box sx={{ minWidth: 120 }}>
                      <FormField
                          type="text"
                          placeholder="Language"
                          name="language"
                          register={register}
                          error={Array.isArray(errors.language)?errors.language[0]:errors.language}
                          data={language.length > 0 ? language : [{ id: 0, value: 'No data available. Please try again later' }]}
                      />
                    </Box>
                  </Grid>

                  {/* DevicePrice */}
                  <Grid item xs={12} md={6} mb={1}>
                    <Box sx={{ minWidth: 120 }}>
                      <FormField
                          type="text"
                          placeholder="DevicePrice"
                          name="device_price"
                          register={register}
                          error={Array.isArray(errors.device_price)?errors.device_price[0]:errors.device_price}
                          data={devicePrice.length > 0 ? devicePrice : [{ id: 0, value: 'No data available. Please try again later' }]}
                      />
                    </Box>
                  </Grid>
              </Grid>
          </CardSection>
          
           {/* Targeting Interest Section */}
           <CardSection title="Interest">
            <Grid container spacing={2} mt={2}>
                  {/* Exchange */}
                  <Grid item xs={12} md={6} mb={1}>
                    <Box sx={{ minWidth: 120 }}>
                      <FormField
                          type="text"
                          placeholder="Interest"
                          name="distinct_interest"
                          register={register}
                          onChange={handleSelectChange}
                          data={distinctInterest.length > 0 ? distinctInterest : [{ id: 0, value: 'No data available. Please try again later' }]}
                          error={Array.isArray(errors.distinct_interest)?errors.distinct_interest[0]:errors.distinct_interest}
                      />
                    </Box>
                  </Grid>

                  {/* Carrier */}
                  <Grid item xs={12} md={6} mb={1}>
                    <Box sx={{ minWidth: 120 }}>
                      <FormField
                          type="text"
                          placeholder="SubCategory"
                          name="interest"
                          register={register}
                          error={Array.isArray(errors.interest)?errors.interest[0]:errors.carrier}
                          data={selectedInterest.length > 0 ? selectedInterest : [{ id: 0, category: 'No data available. Please select Interest' }]}
                          />
                    </Box>
                  </Grid>
              </Grid>
          </CardSection>

          {/* Campaign File Upload Section */}
          <CardSection title="File Upload">
              <Grid container spacing={2} mt={2}>
                  {/* Image Upload */}
                  <Grid item xs={12} md={6} lg={4} mb={1}>
                    <FileUpload
                      name="images"
                      register={register}
                      setValue={setValue} // Pass setValue here
                      placeholder="Select Campaign Image"
                    />
                    {errors.images && 
                      <Typography sx={{ color: 'gray', fontSize: '0.75rem' }}>
                        {errors.images?.message}
                      </Typography>
                    }
                  </Grid>

                  <Grid item xs={12} md={6} lg={4} mb={1}>
                    <FileUpload
                      name="keywords"
                      register={register}
                      setValue={setValue}
                      placeholder="Select Keywords"
                    />
                    {errors.keywords && 
                      <Typography sx={{ color: 'gray', fontSize: '0.75rem' }}>
                        {errors.keywords?.message}
                      </Typography>
                    }
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} mb={1}>
                    <FileUpload
                      name="proximity_store"
                      register={register}
                      setValue={setValue}
                      placeholder="Select Proximity Store Visit"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} mb={1}>
                    <FileUpload
                      name="proximity"
                      register={register}
                      setValue={setValue} 
                      placeholder="Select Proximity"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} mb={1}>
                    <FileUpload
                      name="weather"
                      register={register}
                      setValue={setValue}
                      placeholder="Select Weather"
                    />
                  </Grid>
              </Grid>
          </CardSection>
  
          {/* Submit Button */}
          {!isPending && (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Button variant="contained" color="primary" type="submit">
                Create Campaign
              </Button>
            </Box>
          )}
          
          {isPending && (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Box sx={{ marginLeft: 2 }}>
                  <CircularProgress />
                </Box>
              </Box>
          )}
        </Box>
        {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
        {isCampaignCreated ? <Alert color="success">Campaign created successfully</Alert> : null}
      </form>
    );
  }
  
  // CardSection Component
  function CardSection({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }): React.JSX.Element {
    const [expanded, setExpanded] = React.useState<boolean>(true);
  
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">{title}</Typography>
            <Button
              variant="text"
              onClick={() => setExpanded((prev) => !prev)}
              startIcon={expanded ? <CaretUp /> : <CaretDown />}
            />
          </Box>
          {expanded && <Box sx={{ mt: 2 }}>{children}</Box>}
        </CardContent>
      </Card>
    );
  }
  