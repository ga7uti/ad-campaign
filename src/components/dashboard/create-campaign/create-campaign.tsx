/* eslint-disable -- Disabling all Eslint rules for the file*/
"use client"
import { campaignClient } from '@/lib/campaign-client';
import { CommonSelectResponse, Location } from '@/types/campaign';
import { CampaignFormSchema, CampaignFormData } from '@/types/create-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import FileUpload from '../layout/file-upload';
import FormField from '../layout/form-field';
import { paths } from '@/paths';
import { useRouter } from 'next/navigation';


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
    const [formData, setFormData] = React.useState<CampaignFormData>();
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
      setFormData(data);
      createCampaign(data);
    };
  
    const fetchData = async () => {
      try {
        const [ageRes, deviceRes, envRes, locRes,exchangeRes,langRes,
          carrierRes,devicePriceRes] = await Promise.all([
          campaignClient.getAge(),
          campaignClient.getDevice(),
          campaignClient.getEnv(),
          campaignClient.getLocations(),
          campaignClient.getExchange(),
          campaignClient.getLanguage(),
          campaignClient.getCarrier(),
          campaignClient.getDevicePrice(),
        ]);
        setAge(ageRes);
        setDevices(deviceRes);
        setEnvironment(envRes);
        setLocation(locRes);
        setExchanges(exchangeRes);
        setLanguage(langRes);
        setCarrier(carrierRes);
        setDevicePrice(devicePriceRes);
      } catch (error) {
        console.error("Failed to load campaign data", error);
      }
    };
  
    const createCampaign = async(data:CampaignFormData) => {
      setIsPending(true);
      if(!data) 
        return;
      
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

    React.useEffect(() => {
      fetchData();
    }, []);
  
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
                        data={ages}
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
                        data={devices}
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
                        data={environment}
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
                        data={location}
                    />
                    </Box>
                </Grid>
            </Grid>
          </CardSection>
          
          {/* Campaign Details Section */}
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
                          data={exchange}
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
                          data={carrier}
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
                          data={language}
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
                          data={devicePrice}
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
                Submit
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
  